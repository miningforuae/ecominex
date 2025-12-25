"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Cpu, Loader2, PieChart } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserMachines } from "@/lib/feature/userMachine/usermachineApi";
import { getUserShareDetails } from "@/lib/feature/shareMachine/shareMachineSlice";
import { useGetAllMiningMachinesQuery } from "@/lib/feature/Machines/miningMachinesApiSlice";
import { purchaseAndAssignMachine, sellUserMachine } from "@/lib/feature/userMachine/transactionSlice";
import { AppDispatch, RootState } from '@/lib/store/store';
import { getSpecialShareMachine, purchaseSpecialShares, sellSharePurchase } from "@/lib/feature/shareMachine/shareMachineSlice";


export default function Machines() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { userMachines } = useSelector((state: RootState) => state.userMachine);
  const { userShares } = useSelector((state: RootState) => state.shareMachine); // Update with your actual slice

  const [isLoading, setIsLoading] = useState(false);
  const [hasMachines, setHasMachines] = useState(false);
  const [hasShares, setHasShares] = useState(false);
  const [purchasingMachineId, setPurchasingMachineId] = useState<string | null>(null);

  // Fetch all mining machines for marketplace
  const { data: allMachines, isLoading: machinesLoading, error: machinesError } = useGetAllMiningMachinesQuery();

  const { specialMachine, loading: specialLoading, error: specialError } =
    useSelector((state: RootState) => state.shareMachine);

  console.log(userMachines)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !isAuthenticated) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const fetchPromises = [];

        // Use email for machines and id for shares based on your existing implementation
        if (user.email) {
          fetchPromises.push(dispatch(fetchUserMachines(user.email)).unwrap());
        }

        if (user.id) {
          fetchPromises.push(dispatch(getUserShareDetails(user.id)).unwrap());
        }
        dispatch(getSpecialShareMachine());

        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load your machines data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, user, isAuthenticated]);

  // Update state whenever the data changes
  useEffect(() => {
    // Check if user has active machines
    setHasMachines(
      userMachines &&
      Array.isArray(userMachines) &&
      userMachines.filter((machine) => machine.status === "active").length > 0
    );

    // Check if user has shares
    setHasShares(
      userShares &&
      userShares.shares &&
      Array.isArray(userShares.shares) &&
      userShares.shares.length > 0
    );
  }, [userMachines, userShares]);


  // BUY SHARE HANDLER
  const handleBuyShares = async (numberOfShares: number) => {
    if (!user || !isAuthenticated) {
      toast.error("Please login to buy shares");
      return;
    }

    if (!user.id) {
      toast.error("User ID not found");
      return;
    }

    try {
      setIsLoading(true);

      const result = await dispatch(
        purchaseSpecialShares({
          userId: user.id,
          numberOfShares,
        })
      ).unwrap();

      toast.success(result?.message || "Shares purchased successfully!");

      // Refresh user’s share details
      await dispatch(getUserShareDetails(user.id));
    } catch (error: any) {
      toast.error(error || "Failed to purchase shares");
      console.error("BUY SHARES ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  };




  // Handle machine purchase
  const handlePurchaseMachine = async (machineId: string, machineName: string, price: number) => {
    if (!user || !isAuthenticated) {
      toast.error("Please login to purchase a machine");
      return;
    }

    try {
      setPurchasingMachineId(machineId);

      await dispatch(
        purchaseAndAssignMachine({
          userId: user.id,
          machineId,
          quantity: 1,    // REQUIRED
        })
      ).unwrap();

      toast.success(`Successfully purchased!`);

      if (user.email) {
        await dispatch(fetchUserMachines(user.email)).unwrap();
      }
    } catch (error: any) {
      console.error("Error purchasing machine:", error);
      toast.error(error?.message || "Failed to purchase machine. Please try again.");
    } finally {
      setPurchasingMachineId(null);
    }
  };


  // Use fetched user machines data or fallback to empty array
  const myMachines = userMachines && Array.isArray(userMachines) ? userMachines : [];
  const sharedMachines = Array.isArray(specialMachine) ? specialMachine : [];

  // Get marketplace machines from API
  // Normalize API data shape to always return an array
  console.log("RAW MACHINES FROM API:", allMachines);
  const rawMachines: any = allMachines;

  const marketplaceMachines = Array.isArray(rawMachines)
    ? rawMachines
    : Array.isArray(rawMachines?.machines)
      ? rawMachines.machines
      : Array.isArray(rawMachines?.data)
        ? rawMachines.data
        : [];

  const activeMachines = myMachines.filter(
    (m: any) => m.status?.toLowerCase() === "active"
  );



  return (
    <div className="space-y-6 p-6 min-h-screen" style={{ backgroundColor: "#000000" }}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Mining Machines</h2>
        <p className="text-slate-400">Purchase machines or manage your investments (10% fee on sales)</p>
      </div>

      <Tabs defaultValue="my-machines" className="space-y-4">
        <TabsList
          className="
    mb-4
    inline-flex items-center gap-2
    rounded-full border border-slate-800 bg-slate-900/80
    p-1 shadow-inner shadow-black/40
  "
        >
          <TabsTrigger
            value="my-machines"
            className="
      rounded-full data-[state=active]:rounded-full
      inline-flex items-center justify-center gap-2
      px-4 py-2 text-xs sm:text-sm font-medium
      text-slate-400 transition-all duration-200
      hover:text-slate-100 hover:bg-slate-800/60
      data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600
      data-[state=active]:text-black
      data-[state=active]:shadow-[0_6px_20px_rgba(34,197,94,0.5)]
    "
          >
            <Cpu className="h-4 w-4" />
            <span>My Machines</span>
          </TabsTrigger>

          {/* <TabsTrigger
    value="shared-machines"
    className="
      rounded-full data-[state=active]:rounded-full
      inline-flex items-center justify-center gap-2
      px-4 py-2 text-xs sm:text-sm font-medium
      text-slate-400 transition-all duration-200
      hover:text-slate-100 hover:bg-slate-800/60
      data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600
      data-[state=active]:text-black
      data-[state=active]:shadow-[0_6px_20px_rgba(34,197,94,0.5)]
    "
  >
    <PieChart className="h-4 w-4" />
    <span>Shared Machines</span>
  </TabsTrigger> */}
        </TabsList>



        <TabsContent value="shared-machines" className="space-y-4">
          <Card className="border border-slate-800 bg-[#050810] shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl">
                    Shared Machine
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Invest in shared mining machines by buying available shares.
                  </CardDescription>
                </div>

                {/* Summary chip when machine exists */}
                {specialMachine && (
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    <span className="rounded-full bg-yellow-500/10 border border-yellow-500/40 px-3 py-1 text-[11px] font-medium text-yellow-200">
                      Total Shares: {specialMachine.totalShares}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 text-[11px] font-medium text-emerald-200">
                      Available: {specialMachine.availableShares}
                    </span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-5">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                </div>
              ) : !specialMachine ? (
                <div className="text-center py-10">
                  <p className="text-slate-200 text-sm sm:text-base">
                    No shared machine available.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Check back soon to see new shared mining opportunities.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-stretch">
                  {/* LEFT — IMAGE PANEL */}
                  <div className="relative h-full">
                    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-emerald-500/15 h-56 sm:h-64 lg:h-full">
                      <img
                        src={
                          specialMachine.images?.[0] ||
                          "https://via.placeholder.com/400x300"
                        }
                        alt={specialMachine.machineName}
                        className="h-full w-full object-cover"
                      />
                      {/* Top-left label */}
                      <div className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-slate-200 border border-slate-700/60">
                        Shared Mining
                      </div>

                      {/* Bottom gradient info strip */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-4 py-3">
                        <p className="text-sm font-semibold text-white">
                          {specialMachine.machineName}
                        </p>
                        <p className="mt-1 text-xs text-slate-300">
                          Own a share of this machine and earn passive mining rewards
                          based on your stake.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT — MACHINE INFO PANEL */}
                  <div className="relative h-full rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/85 to-emerald-900/40 p-5 shadow-lg shadow-emerald-500/20 flex flex-col justify-between space-y-4">
                    {/* Glow accent */}
                    <div className="pointer-events-none absolute -top-12 -right-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl" />

                    {/* Title + main numbers */}
                    <div className="relative space-y-3">
                      <p className="text-lg sm:text-xl font-semibold text-white">
                        {specialMachine.machineName}
                      </p>

                      <div className="flex flex-wrap gap-3 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Share Price
                          </p>
                          <p className="text-lg font-bold text-emerald-400">
                            ${specialMachine.sharePrice}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                            Profit Per Share
                          </p>
                          <p className="text-sm font-semibold text-emerald-300">
                            ${specialMachine.profitPerShare}
                          </p>
                        </div>
                      </div>

                      {/* Stats grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm text-slate-200">
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[11px] uppercase tracking-[0.15em]">
                            Total Shares
                          </p>
                          <p className="font-medium">
                            {specialMachine.totalShares?.toLocaleString?.() ??
                              specialMachine.totalShares}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[11px] uppercase tracking-[0.15em]">
                            Available
                          </p>
                          <p className="font-medium text-emerald-300">
                            {specialMachine.availableShares?.toLocaleString?.() ??
                              specialMachine.availableShares}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[11px] uppercase tracking-[0.15em]">
                            Sold
                          </p>
                          <p className="font-medium text-yellow-300">
                            {specialMachine.soldShares?.toLocaleString?.() ??
                              specialMachine.soldShares}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-400 text-[11px] uppercase tracking-[0.15em]">
                            Fill Progress
                          </p>
                          <p className="font-medium">
                            {Math.round(
                              (specialMachine.soldShares /
                                specialMachine.totalShares) *
                              100
                            ) || 0}
                            %
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-1">
                        <div className="h-2 w-full rounded-full bg-slate-800">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600"
                            style={{
                              width: `${Math.min(
                                100,
                                (specialMachine.soldShares /
                                  specialMachine.totalShares) *
                                100 || 0
                              )
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="relative pt-1">
                      <Button
                        className="mt-2 w-full rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-500 shadow-lg shadow-emerald-500/30"
                        onClick={() => handleBuyShares(1)} // logic unchanged
                      >
                        Buy Share
                      </Button>
                      <p className="mt-2 text-[11px] text-slate-400 text-center">
                        You can increase your position later by purchasing more shares,
                        subject to availability.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>




        <TabsContent value="my-machines" className="space-y-4">
          <Card className="border border-slate-800 bg-[#050810] shadow-[0_18px_45px_rgba(0,0,0,0.7)]">
            <CardHeader className="border-b border-slate-800 pb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-white text-lg sm:text-xl">
                    Your Mining & Shared Machines
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-sm">
                    Manage your invested machines (10% deduction fee when sold)
                  </CardDescription>
                </div>

                {/* Summary chips */}
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <span className="rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1 text-[11px] font-medium text-slate-300">
                    Total Machines: {activeMachines.length + sharedMachines.length}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 text-[11px] font-medium text-emerald-300">
                    Active Mining: {activeMachines.length}
                  </span>
                  <span className="rounded-full bg-yellow-500/10 border border-yellow-500/40 px-3 py-1 text-[11px] font-medium text-yellow-300">
                    Shared: {sharedMachines.length}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-5 space-y-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                </div>
              ) : activeMachines.length === 0 && sharedMachines.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-slate-200 text-sm sm:text-base">
                    You do not have any machines yet.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2">
                    Purchase machines or invest in shared machines to get started.
                  </p>
                </div>
              ) : (
                <>
                  {/* ACTIVE MINING MACHINES */}
                  {activeMachines.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                          Active Mining Machines
                        </h3>
                        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-emerald-500/60 via-emerald-500/10 to-transparent" />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {activeMachines.map((machine: any, i: number) => (
                          <div
                            key={`mining-${i}`}
                            className="group relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-slate-900 via-slate-900/80 to-emerald-900/40 px-4 py-4 sm:px-5 sm:py-5 shadow-lg shadow-emerald-500/15"
                          >
                            {/* Glow overlay */}
                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.35),transparent_55%)]" />

                            <div className="relative flex h-full flex-col justify-between gap-4">
                              {/* Top row */}
                              <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-400/60 shadow-sm shadow-emerald-500/40">
                                  <Cpu className="h-6 w-6 text-emerald-300" />
                                </div>

                                <div className="space-y-1">
                                  <p className="text-sm sm:text-base font-semibold text-white">
                                    {machine?.machineName || "Mining Machine"}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    Purchased:{" "}
                                    {new Date(machine.assignedDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>

                              {/* Bottom row */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-slate-200 border border-slate-700/60">
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Active Machine
                                  </span>

                                  {/* Price pill */}
                                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 border border-emerald-500/40">
                                    Price: ${machine.priceRange}
                                  </span>

                                  {/* NEW: Profit accumulated pill */}
                                  <span className="inline-flex items-center rounded-full bg-emerald-500/5 px-2.5 py-1 text-[11px] text-emerald-200 border border-emerald-500/30">
                                    Profit: $
                                    {Number(machine.monthlyProfitAccumulated || 0).toFixed(2)}
                                  </span>
                                </div>

                                <div className="text-right space-y-1">
                                  <Button
                                    style={{ backgroundColor: "#0b0e13" }}
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const salePrice =
                                          parseFloat(
                                            machine.priceRange.toString().replace("$", "")
                                          ) * 0.9;

                                        const result = await dispatch(
                                          sellUserMachine(machine._id)
                                        ).unwrap();

                                        toast.success(
                                          result?.message ||
                                          `Machine sold for $${salePrice.toFixed(
                                            2
                                          )} (10% fee deducted)`
                                        );
                                      } catch (err: any) {
                                        toast.error(
                                          err?.message || "Failed to sell machine"
                                        );
                                        console.error("SELL ERROR:", err);
                                      }
                                    }}
                                    className="border-slate-600 bg-black/60 text-slate-100 hover:bg-slate-900/80"
                                  >
                                    Sell (10% fee)
                                  </Button>
                                  <p className="text-[11px] text-slate-400">
                                    Status:{" "}
                                    <span className="text-emerald-300">
                                      {machine.status}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {/* SHARED MACHINES */}
                  {sharedMachines.length > 0 && (
                    <section className="space-y-3 pt-2 border-t border-slate-800/70">
                      <div className="flex items-center justify-between pt-2">
                        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-slate-300">
                          Shared Machines
                        </h3>
                        <div className="h-px flex-1 ml-4 bg-gradient-to-r from-yellow-500/60 via-yellow-500/10 to-transparent" />
                      </div>

                      <div className="grid gap-3 md:grid-cols-2">
                        {sharedMachines.map((share: any, i: number) => (
                          <div
                            key={`share-${i}`}
                            className="group relative overflow-hidden rounded-2xl border border-yellow-500/25 bg-gradient-to-br from-slate-900 via-slate-900/80 to-amber-900/40 px-4 py-4 sm:px-5 sm:py-5 shadow-lg shadow-yellow-500/15"
                          >
                            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.35),transparent_55%)]" />

                            <div className="relative flex h-full flex-col justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/15 border border-yellow-300/60 shadow-sm shadow-yellow-500/40">
                                  <Cpu className="h-6 w-6 text-yellow-200" />
                                </div>

                                <div className="space-y-1">
                                  <p className="text-sm sm:text-base font-semibold text-white">
                                    {share.machineName || "Shared Machine"}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    Purchased:{" "}
                                    {new Date(
                                      share.purchaseDate
                                    ).toLocaleDateString()}
                                  </p>
                                  <p className="text-xs text-slate-400">
                                    Shares Owned:{" "}
                                    <span className="font-semibold text-slate-100">
                                      {share.numberOfShares}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex flex-wrap gap-2 text-xs">
                                  <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-1 text-[11px] text-slate-200 border border-slate-700/60">
                                    <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-300" />
                                    Shared Position
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-emerald-500/5 px-2.5 py-1 text-[11px] text-emerald-200 border border-emerald-500/30">
                                    Earned: ${Number(share.totalProfitEarned || 0).toFixed(2)}
                                  </span>
                                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] text-emerald-200 border border-emerald-500/40">
                                    Value: $
                                    {(
                                      share.numberOfShares * share.pricePerShare
                                    ).toFixed(2)}
                                  </span>
                                </div>

                                <div className="text-right space-y-1">
                                  <Button
                                    style={{ backgroundColor: "#0b0e13" }}
                                    variant="outline"
                                    size="sm"
                                    onClick={async () => {
                                      try {
                                        const result = await dispatch(
                                          sellSharePurchase({
                                            sharePurchaseId: share.id,
                                            payload: {
                                              numberOfSharesToSell:
                                                share.numberOfShares,
                                            },
                                          })
                                        ).unwrap();

                                        toast.success(
                                          result?.message ||
                                          "Shared machine sold successfully!"
                                        );
                                      } catch (err: any) {
                                        toast.error(
                                          err?.message ||
                                          "Failed to sell shared machine"
                                        );
                                        console.error(
                                          "SELL SHARE ERROR:",
                                          err
                                        );
                                      }
                                    }}
                                    className="border-slate-600 bg-black/60 text-slate-100 hover:bg-slate-900/80"
                                  >
                                    Sell Shares
                                  </Button>
                                  <p className="text-[11px] text-slate-400">
                                    Type:{" "}
                                    <span className="text-yellow-200">
                                      Shared Machine
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>



    </div>
  );
}