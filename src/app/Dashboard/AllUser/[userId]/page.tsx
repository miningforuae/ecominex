// @ts-nocheck

"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Cpu,
  DollarSign,
  History,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  Loader2,
  ArrowUpRight,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  fetchUserMachines,
  fetchUserTotalProfit,
} from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch } from "@/lib/store/store";
import { useUsers } from "@/hooks/Userdetail";
import { getUserBalance } from "@/lib/feature/userMachine/balanceSlice"; // Added import for balance fetching
import { fetchUserWithdrawals } from "@/lib/feature/withdraw/withdrawalSlice";
import DashboardLayout from "@/components/Dashboard/DasboardLayout/DasboardLayout";
import DashboardHeader from "@/components/Dashboard/DashboardHeader/DashboardHeader";
import Image from "next/image";
import { ToastContainer } from "react-toastify";
import Link from "next/link";
import ProtectedRoutes from "@/components/config/protectedRoute/ProtectedRoutes";

interface RootState {
  userMachine: {
    userMachines: any[];
    userProfit: {
      totalProfit: number;
    };
    isLoading: boolean;
  };
  transactions: {
    transactions: any[];
    totalTransactions: number;
    isLoading: boolean;
  };
  balance: {
    userBalance: {
      balances: {
        total: number;
      };
    };
    isLoading: boolean;
  };
  withdrawal: {
    withdrawals: any[];
    pendingWithdrawals: any[];
    allWithdrawals: any[];
    stats: any;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalWithdrawals: number;
    };
    isLoading: boolean;
    error: string | null;
  };
}
const UserDetailsPage = () => {
  const { userId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [activeTab, setActiveTab] = useState("overview");
  const [dataFetched, setDataFetched] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);

  // Get the user machine state from Redux
  const userMachineState = useSelector((state: RootState) => state.userMachine);
  const transactionsState = useSelector(
    (state: RootState) => state.transactions,
  );

  const balanceState = useSelector((state: RootState) => state.balance);
  const withdrawalState = useSelector((state: RootState) => state.withdrawal);
  const withdrawals = withdrawalState?.withdrawals || [];
  // Destructure with fallback values to prevent errors
  const userMachines = userMachineState?.userMachines || [];
  const userProfit = userMachineState?.userProfit || { totalProfit: 0 };
  const transactions = transactionsState || {
    transactions: [],
    totalTransactions: 0,
  };
  const isLoading =
    userMachineState?.isLoading ||
    transactionsState?.isLoading ||
    balanceState?.isLoading ||
    false;
  const userBalance = balanceState?.userBalance?.balances?.total || 0;

  const { users } = useUsers();
  const currentUser = users?.find((user) => user._id === userId) || null;

  useEffect(() => {
    if (userId && currentUser?.email) {
      setLocalLoading(true);

      // Create an array of promises for all data fetching
      const fetchPromises = [
        dispatch(fetchUserMachines(userId)),
        dispatch(fetchUserTotalProfit(userId)),
        dispatch(
          fetchUserWithdrawals({
            email: currentUser.email,
            page: 1,
            limit: 10,
          }),
        ),
        dispatch(getUserBalance(userId)),
      ];

      // Wait for all promises to resolve
      Promise.all(fetchPromises)
        .then(() => {
          setDataFetched(true);
          setLocalLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLocalLoading(false);
        });
    }
  }, [dispatch, userId, currentUser]);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };


  function formatAmount(amount?: number) {
    if (!amount && amount !== 0) return "0";
    if (amount >= 1_000_000_000) return (amount / 1_000_000_000).toFixed(1) + "B";
    if (amount >= 1_000_000) return (amount / 1_000_000).toFixed(1) + "M";
    if (amount >= 1_000) return (amount / 1_000).toFixed(1) + "K";
    return amount.toLocaleString("en-US");
  }




  const stats = [
    {
      title: "Total Machines",
      value: userMachines?.length || 0,
      note: "Registered Machine on this User",
      gradient: true,
      navigate: ""
    },
    {
      title: "Total Balance",
      value: formatAmount(userBalance || userProfit?.totalProfit || 0),
      note: "Count of all Balance ",
      gradient: false,
      navigate: ""
    },
    {
      title: "Total Transaction",
      value: transactions?.totalTransactions || 0,
      note: " Count of all Transaction ",
      gradient: false,
      navigate: ""
    }
  ];

  if (localLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500"></div>
      </div>
    );
  }



  return (
    <ProtectedRoutes>
      <DashboardLayout>
        <DashboardHeader title="User Management" desc="Manage and track all user activity with real-time updates and organized details." />
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="mb-4 -mt-3 border-b-[1px] rounded-none px-2 ml-2 border-green-500 text-green-500 hover:bg-transparent  hover:text-green-400"
        >
          <ArrowLeft className="mr-0 h-4 w-4" />
          Back to Users
        </Button>
        <section className="bg-[#1b1b1b] px-5 mx-2 pb-8 pt-3 rounded-[10px]">

          {/* TOP USER SECTION */}
          <div className="flex gap-6 items-center border-b-[1px] pb-7 border-[#969696a0]">
            <Image
              src={"/userdash.jpg"}
              width={110}
              height={110}
              alt="User"
              className="rounded-full"
            />

            <div>
              <h1 className="text-white text-3xl font-bold">
                {currentUser?.firstName} {currentUser?.lastName || ""}
              </h1>
              <p className="text-gray-300 mt-1 font-[500]">{currentUser?.email || "N/A"}</p>
            </div>
          </div>

          {/* Detail START */}
          <div className="px-1 mt-8">
            <h2 className="text-[21px] font-[500] text-white">Profile Details</h2>

            <div className="space-y-5 pt-6">

              {/* NAME ROW */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-100 font-[500] tracking-[0.3px] text-[15px]">
                    Full Name
                  </label>
                  <div className="border-zinc-400 border rounded-[5px] px-4 h-[50px] font-[500] bg-transparent text-[#f9f9f9] text-[14px] placeholder:text-gray-300 flex items-center">
                    {currentUser?.firstName + currentUser?.lastName}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-100 font-[500] tracking-[0.3px] text-[15px]">
                    Created At
                  </label>
                  <div className="border-zinc-400 border rounded-[5px] px-4 h-[50px] font-[500] bg-transparent text-[#f9f9f9] text-[14px] placeholder:text-gray-300 flex items-center">
                    {formatDate(currentUser?.createdAt)}
                  </div>
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-gray-100 font-[500] tracking-[0.3px] text-[15px]">
                  Email
                </label>
                <div className="border-zinc-400 border rounded-[5px] px-4 h-[50px] font-[500] bg-transparent text-[#f9f9f9] text-[14px] placeholder:text-gray-300 flex items-center">
                  {currentUser?.email}
                </div>
              </div>


              {/* COUNTRY + PHONE */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-gray-100 font-[500] tracking-[0.3px] text-[15px]">
                    Country
                  </label>
                  <div className="border-zinc-400 border rounded-[5px] px-4 h-[50px] font-[500] bg-transparent text-[#f9f9f9] text-[14px] placeholder:text-gray-300 flex items-center">
                    {currentUser?.country || "N/A"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-gray-100 font-[500] tracking-[0.3px] text-[15px]">
                    Phone Number
                  </label>
                  <div className="border-zinc-400 border rounded-[5px] px-4 h-[50px] font-[500] bg-transparent text-[#f9f9f9] text-[14px] placeholder:text-gray-300 flex items-center">
                    {currentUser?.phoneNumber}
                  </div>
                </div>
              </div>


              <ToastContainer />
            </div>
          </div>

        </section>

        <div>
          <Tabs defaultValue="assign" className="w-full mt-5">
            <TabsList className="grid grid-cols-3 mb-8 gap-10 w-[400px] bg-transparent text-white text-[15.5px]">
              <TabsTrigger value="assign">Overview</TabsTrigger>
              <TabsTrigger value="assigned">Machines</TabsTrigger>
              <TabsTrigger value="addmachine">Transactions</TabsTrigger>
            </TabsList>

            {/* TAB 1 — Machines */}
            <TabsContent value="assign">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.map((item, index) => (
                  <div
                    key={index}
                    className={`relative px-5 py-[26px] rounded-[25px] shadow-sm 
                        flex flex-col gap-4.5 justify-between
                        ${item.gradient
                        ? "bg-gradient-to-b from-[#1dae52] to-[#08381a] border-none"
                        : "bg-[#1b1b1b] "
                      }`}
                  >
                    {/* Top right arrow icon */}
                    <Link className="absolute right-0 top-0" href={item.navigate}>
                      <div className={`absolute top-3 p-1.5 right-3 text-lg opacity-100 border-[1.5px] rounded-full ${item.gradient ? "!bg-[#fff] " : "bg-transparent"} border-gray-200`}>
                        <ArrowUpRight className={`size-5.5 ${item.gradient ? "text-[#000]" : "text-gray-200"}`} />
                      </div>
                    </Link>

                    <h3 className="text-[15px] font-medium text-gray-100">{item.title}</h3>
                    <p className="text-[52px] leading-[55px] font-medium text-gray-200">{item.value}</p>
                    <span className={`text-[12.5px] ${item.gradient ? "text-gray-200" : "text-gray-300"}`}>
                      {item.note}
                    </span>
                  </div>
                ))}
              </div>

            </TabsContent>

            {/* TAB 2 — Assigned Machines */}
            <TabsContent value="assigned">

              <div className="bg-[#1b1b1b] px-6 py-6 rounded-md">
                <div>
                  <h1 className="text-white text-[25px] font-semibold mb-5">Assigned Machines</h1>
                </div>

                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-200 border-b border-[#ffffff65] text-[16px]">
                        <th className="py-3 text-left font-medium">Machine Name</th>
                        <th className="py-3 text-left font-medium">Assigned Date</th>
                        <th className="py-3 text-center font-medium">Current Profit </th>
                        <th className="py-3 text-center font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-300">
                            Loading...
                          </td>
                        </tr>
                      ) : userMachines.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-300">
                            No machines found.
                          </td>
                        </tr>
                      ) : (
                        userMachines.map((item) => (
                          <tr key={item._id} className="border-b border-[#ffffff65] hover:bg-[#0f0f0f78] duration-300">


                            {/* MACHINE */}
                            <td className="py-4 flex items-center gap-3 text-white">


                              <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-md text-green-400">
                                {(item.machine?.machineName || "U").charAt(0).toUpperCase()}
                              </div>

                              <div>
                                <span className="font-medium text-[15px] block">{item.machine?.machineName || "N/A"}</span>
                              </div>
                            </td>

                            {/* DATE */}
                            <td className="py-4 text-gray-200 text-start">{formatDate(item.assignedDate)}</td>

                            {/* PROFIT */}
                            <td className="py-4 text-center text-[16px] font-[600] text-white">${formatAmount(item.monthlyProfitAccumulated)}</td>

                            {/* STATUS */}
                            <td className="py-4 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-[13px] ${(item.status ?? "").toLowerCase() === "active" ? "bg-green-800/40 text-green-400" : "bg-[#66000095] text-red"
                                  }`}
                              >
                                {item.status ?? "-"}
                              </span>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </TabsContent>

            {/* TAB 3 — Add Machine */}
            <TabsContent value="addmachine">
              <div className="bg-[#1b1b1b] px-6 py-6 rounded-md">
                <div>
                  <h1 className="text-white text-[25px] font-semibold mb-5"> Transaction History</h1>
                </div>

                <div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-200 border-b border-[#ffffff65] text-[16px]">
                        <th className="py-3 text-left font-medium">Date</th>
                        <th className="py-3 text-left font-medium">Type</th>
                        <th className="py-3 text-center font-medium">Amount</th>
                        <th className="py-3 text-center font-medium">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {isLoading ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-300">
                            Loading...
                          </td>
                        </tr>
                      ) : withdrawals.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-gray-300">
                            No machines found.
                          </td>
                        </tr>
                      ) : (
                        withdrawals.map((item) => (
                          <tr key={item._id} className="border-b border-[#ffffff65] hover:bg-[#0f0f0f78] duration-300">


                            {/* MACHINE */}
                            <td className="py-4 flex items-center gap-3 text-white">


                              <div>
                                <span className="font-medium text-[15px] block">{formatDate(item.transactionDate)}</span>
                              </div>
                            </td>

                            {/* DATE */}
                            <td className="py-4 text-gray-200 text-start">Withdrawals</td>

                            {/* PROFIT */}
                            <td className="py-4 text-center text-[16px] font-[600] text-white">${formatAmount(item.amount)}</td>

                            {/* STATUS */}
                            <td className="py-4 text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-[13px] ${(item.status ?? "").toLowerCase() === "approved" ? "bg-green-800/40 text-green-400" : "bg-[#66000095] text-red"
                                  }`}
                              >
                                {item.status ?? "-"}
                              </span>
                            </td>

                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DashboardLayout>
    </ProtectedRoutes>

  );
};

export default UserDetailsPage;
