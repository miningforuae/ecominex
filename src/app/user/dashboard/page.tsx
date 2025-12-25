"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchUserWithdrawals } from "@/lib/feature/withdraw/withdrawalSlice";
import { DollarSign, Server, TrendingUp, Users, ArrowUpFromLine, ArrowDownToLine } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { fetchUserMachines } from "@/lib/feature/userMachine/usermachineApi";
import { getUserBalance } from "@/lib/feature/userMachine/balanceSlice";
import { getReferralById, Referral as ReferralType } from '@/lib/feature/userMachine/profitSlice';
import { AppDispatch, RootState } from '@/lib/store/store';
import { useSelector, useDispatch } from "react-redux";
import { requestWithdrawal } from "@/lib/feature/withdraw/withdrawalSlice";
import "react-toastify/dist/ReactToastify.css";

interface UserBalance {
  balances: {
    adminAdd: number;
    mining: number;
    total: number;
  };
  lastUpdated: string;
  machines: {
    count: number;
    details: any[];
  };
}
interface Referral {
  id: string;
  discount: number;
  referralStatus: "active" | "inactive"; 
}



export default function Dashboard() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [withdrawNetwork, setWithdrawNetwork] = useState("");
  type NetworkType = "TRC20" | "ERC20";

  const [depositNetwork, setDepositNetwork] = useState<NetworkType | "">("");
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const { userBalance, loading: balanceLoading } = useSelector(
    (state: RootState) => state.balance
  );



  const { userMachines } = useSelector((state: RootState) => state.userMachine);
  const { withdrawals, isLoading: withdrawalsLoading, error: withdrawalsError } = useSelector(
    (state: RootState) => state.withdrawal
  );

  const { referralData, loading, error } = useSelector(
    (state: RootState) => state.profit.referrals
  );

  const { userProfit, isLoading: profitLoading } = useSelector(
    (state: RootState) => state.userMachine
  );



  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserMachines(user.id));
      dispatch(getUserBalance(user.id));
      dispatch(getReferralById(user.id));
      if (user.email) dispatch(fetchUserWithdrawals({ email: user.email }));
    }
  }, [dispatch, user?.id]);

  const handleWithdrawrequest = async () => {
    // Basic validation
    if (!withdrawAmount || parseFloat(withdrawAmount) < 59.2) {
      toast.error("Minimun Amount is 50$")
      console.log("testing")
      return;
    }
    if (!withdrawAddress || !withdrawNetwork) {
      toast.error("Please fill all fields");
      return;
    }
    if (!user?.id || !user?.email) {
      toast.error("User not authenticated");
      return;
    }

    const payload = {
      userId: user.id,
      email: user.email,
      amount: parseFloat(withdrawAmount),
      walletAddress: withdrawAddress,
      network: withdrawNetwork,
    };

    try {
      // Dispatch the thunk and unwrap the result
      const result = await dispatch(requestWithdrawal(payload)).unwrap();

      // Success message from API if available
      toast.success(result?.message || "Withdrawal request submitted successfully");

      // Clear the form and close modal
      setIsWithdrawOpen(false);
      setWithdrawAmount("");
      setWithdrawAddress("");
      setWithdrawNetwork("");
    } catch (error: any) {
      // Frontend-friendly error handling
      let errorMessage = "Failed to submit withdrawal request";

      // If API returned a structured error (string or object)
      if (typeof error === "string") {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      console.error("Withdrawal API Error:", error); // For debugging
      toast.error(errorMessage);
    }
  };


  const depositAddresses = {
    ERC20: {
      address: "0xE997EA28dA5Bcf59bED6e36245DF080DE8DA2358",
      qr: "/erc20.jpg",
    },
    TRC20: {
      address: "TV7d8mrM6MpCecbDQ2tifG19YNDJmcvRHc",
      qr: "/trc20.jpg",
    },
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (!withdrawAmount || amount < 59.20) {
      toast.error("Minimum withdrawal amount is $50.00");
      return;
    }
    if (!withdrawAddress || !withdrawNetwork) {
      toast.error("Please fill all fields");
      return;
    }
    toast.success("Withdrawal request submitted for admin review");
    setIsWithdrawOpen(false);
    setWithdrawAmount("");
    setWithdrawAddress("");
    setWithdrawNetwork("");
  };

  console.log("userBalance:", userBalance);
  console.log("userMachines:", userMachines);
  console.log(referralData)
  console.log("userProfit:", userProfit);

  function hasBalances(obj: any): obj is { balances: { total: number } } {
  return obj && obj.balances !== undefined;
}

// Usage
const totalBalance = hasBalances(userBalance) ? userBalance.balances.total : 0;

  const stats = [
    {
      title: "Total Balance",
      value: balanceLoading || !userBalance
        ? "Loading..."
        : `$${Number(totalBalance ).toLocaleString()}`,
      icon: DollarSign,
      gradient: "bg-green-600",
    },
    {
      title: "Active Machines",
      value: balanceLoading || !userMachines
        ? "Loading..."
        : `${userMachines.filter((m) => m.status?.toLowerCase() === "active").length}`,
      icon: Server,
      gradient: "bg-green-600",
    },
    {
      title: "Profit Earned",
      value: profitLoading
        ? "Loading..."
        : `$${(referralData?.reduce((sum, r) => sum + Number(r.discount || 0), 0) ?? 0).toFixed(2)}`,
      icon: TrendingUp,
      gradient: "bg-green-600",
    },
    {
      title: "Referrals",
      value: loading
        ? "Loading..."
        : `${referralData?.filter((ref) => ref.referralStatus === "active").length ?? 0}`,
      icon: Users,
      gradient: "bg-green-600",
    },
  ];



  return (
    <div className="space-y-6  min-h-screen p-4 md:p-6" style={{ backgroundColor: "#000000" }}>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
        {/* Title & Subtitle */}
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#22c55e]">
            Welcome Back {user ? `${user.firstName} ${user.lastName}` : " Dashboard"}
          </h2>
          <p className="text-sm md:text-base text-slate-400 mt-1">
            Your Mining Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
            <DialogTrigger asChild>
              <Button className="text-white" style={{ backgroundColor: "#22c55e" }}>
                <ArrowDownToLine className="mr-2 h-4 w-4" />
                Deposit
              </Button>
            </DialogTrigger>

            <DialogContent className=" border-slate-700 max-w-md" style={{ backgroundColor: "#000000" }}>
              <DialogHeader>
                <DialogTitle className="text-white text-xl font-semibold">
                  Deposit Funds
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Select network and send USDT
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">

                {/* Select Network Title */}
                <Label className="text-white font-medium">Select Network</Label>

                {/* Network Cards */}
                <div className="grid grid-cols-2 gap-3">

                  {/* ERC20 */}
                  <div
                    onClick={() => setDepositNetwork("ERC20")}
                    className={`cursor-pointer rounded-lg border p-4  hover:bg-slate-800 transition text-center
          ${depositNetwork === "ERC20" ? "border-green-500" : "border-slate-700"}`}
                    style={{ backgroundColor: "#1b1b1b" }}>
                    <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" className="w-12 h-12 mx-auto" />
                    <p className="text-white font-semibold mt-2">Ethereum</p>
                    <p className="text-slate-400 text-xs">ERC 20</p>
                  </div>

                  {/* TRC20 */}
                  <div
                    onClick={() => setDepositNetwork("TRC20")}
                    className={`cursor-pointer rounded-lg border p-4 bg-slate-800/40 hover:bg-slate-800 transition text-center
          ${depositNetwork === "TRC20" ? "border-green-500" : "border-slate-700"}`}
                    style={{ backgroundColor: "#1b1b1b" }}
                  >
                    <img src="https://cryptologos.cc/logos/tron-trx-logo.png" className="w-12 h-12 mx-auto" />
                    <p className="text-white font-semibold mt-2">TRON</p>
                    <p className="text-slate-400 text-xs">TRC 20</p>
                  </div>
                </div>

                {/* QR + Address + Buttons */}
                {depositNetwork && (
                  <div className="space-y-3 pt-2">

                    {/* QR Code */}
                    <div className="flex justify-center">
                      <img
                        src={depositAddresses[depositNetwork].qr}
                        alt="QR Code"
                        className="w-36 h-36 rounded-lg border border-slate-700"
                      />
                    </div>

                    {/* Address */}
                    <div className="p-3 bg-slate-800 rounded border border-slate-700 text-white text-center text-sm break-all">
                      {depositAddresses[depositNetwork].address}
                    </div>

                    {/* Copy Address */}
                    <Button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          depositAddresses[depositNetwork].address
                        )
                      }
                      variant="outline"
                      className="w-full"
                    >
                      Copy Address
                    </Button>

                    {/* WhatsApp Share */}
                    <Button
                      onClick={() => {
                        const msg = `Send USDT to this address:\n\n${depositAddresses[depositNetwork].address}`;
                        const url = `https://wa.me/18079074455?text=${encodeURIComponent(msg)}`;
                        window.open(url, "_blank");
                      }}
                      className="w-full bg-green-600 text-white"
                    >
                      Share on WhatsApp
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 text-white" style={{ backgroundColor: "red" }}>
                <ArrowUpFromLine className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </DialogTrigger>

            <DialogContent className="border-slate-700" style={{ backgroundColor: "#000000" }}>
              <DialogHeader>
                <DialogTitle className="text-white text-2xl font-semibold">
                  Withdraw Funds
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Minimum withdrawal: $50.00
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Amount */}
                <Label className="text-slate-300">Amount</Label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="text-white"
                  style={{ backgroundColor: "#1b1b1b" }}
                  placeholder="50.00"
                />

                {/* Network */}
                <div className="space-y-3">
                  <Label className="text-white text-lg font-semibold">
                    Select Network
                  </Label>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Ethereum Card */}
                    <div
                      onClick={() => setWithdrawNetwork("ERC20")}
                      className={`cursor-pointer rounded-xl border p-5  hover:bg-slate-800 transition 
            ${withdrawNetwork === "ERC20" ? "border-green-500" : "border-slate-700"}`}
                      style={{ backgroundColor: "#1b1b1b" }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                          className="w-12 h-12"
                        />
                        <span className="text-white font-semibold text-lg">Ethereum</span>
                        <span className="text-slate-400 text-sm">ERC 20</span>
                      </div>
                    </div>

                    {/* Tron Card */}
                    <div
                      onClick={() => setWithdrawNetwork("TRC20")}
                      className={`cursor-pointer rounded-xl border p-5  hover:bg-slate-800 transition 
            ${withdrawNetwork === "TRC20" ? "border-green-500" : "border-slate-700"}`}
                      style={{ backgroundColor: "#1b1b1b" }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src="https://cryptologos.cc/logos/tron-trx-logo.png"
                          className="w-12 h-12"
                        />
                        <span className="text-white font-semibold text-lg">TRON</span>
                        <span className="text-slate-400 text-sm">TRC 20</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Wallet Address */}
                <Label className="text-slate-300">Wallet Address</Label>
                <Input
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                  className="bg-slate-800 text-white"
                  placeholder="Enter address"
                  style={{ backgroundColor: "#1b1b1b" }}
                />

                <Button
                  onClick={handleWithdrawrequest}
                  className="w-full bg-red-600 text-white text-lg py-3" style={{ backgroundColor: "#22c55e" }}
                >
                  Submit Withdrawal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-slate-700/50 shadow-lg" style={{ backgroundColor: "#1b1b1b" }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">{stat.title}</CardTitle>
              <div className={`${stat.gradient} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>

            </CardContent>
          </Card>
        ))}
      </div>

      <Card className=" border-slate-700/50 shadow-lg" style={{ backgroundColor: "#1b1b1b" }}>
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {withdrawalsLoading ? (
              <p className="text-white">Loading...</p>
            ) : withdrawalsError ? (
              <p className="text-red-500">Failed to load withdrawals</p>
            ) : (
              withdrawals?.slice(0, 3).map((w, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-slate-700/30 pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-white">Withdrawal Request</p>
                    <p className="text-sm text-slate-400">
                      ${w.amount} —
                    </p>
                  </div>

                  <p className="text-xs text-slate-500">
                    {new Date(w.transactionDate).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}