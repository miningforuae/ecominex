"use client";

import { useMemo, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { useDispatch } from "react-redux";
import { processWithdrawalRequest, fetchPendingWithdrawals, fetchWithdrawalStats } from "@/lib/feature/withdraw/withdrawalSlice";
import { AppDispatch } from "@/lib/store/store";
import { Withdrawal } from "@/types/withdrawals";

interface PendingWithdrawal {
  _id: string;
  amount: number;
  details: string;
  status: "pending" | "approved" | "rejected";
  transactionDate: string;
  type: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

interface PendingRequestProps {
  pendingWithdrawals?: Withdrawal[];
  isLoading?: boolean;
  currentPage?: number;
  ITEMS_PER_PAGE?: number;
}


export default function PendingRequest({
  pendingWithdrawals = [],
  isLoading = false,
  currentPage = 1,
  ITEMS_PER_PAGE = 10,
}: PendingRequestProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [amountFilter, setAmountFilter] = useState<"all" | "min" | "max">("all");

  const [isProcessing, setIsProcessing] = useState(false);

  const filteredData = useMemo(() => {
    const base = pendingWithdrawals.filter(
      (item) =>
        `${item.user.firstName} ${item.user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        item.user.email.toLowerCase().includes(search.toLowerCase())
    );

    return base.slice().sort((a, b) => {
      if (amountFilter === "min") return a.amount - b.amount;
      if (amountFilter === "max") return b.amount - a.amount;

      const dateA = new Date(a.transactionDate).getTime();
      const dateB = new Date(b.transactionDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [pendingWithdrawals, search, sortOrder, amountFilter]);

  const handleProcessRequest = (item: Withdrawal) => {
    Swal.fire({
      html: `
        <div class="px-2 pt-5">
        <h1 class=" text-start text-[33px] font-semibold leading-[37px] mb-5">Process Withdrawal Request</h1>
        <div class="flex justify-start flex-col items-start gap-1 text-[16px]">
        <p><strong>User:</strong> ${item.user.firstName} ${item.user.lastName}</p>
        <p><strong>Email:</strong> ${item.user.email}</p>
        <p><strong>Request Date:</strong> ${new Date(item.transactionDate).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })}</p>
        <p><strong>Amount:</strong> $${item.amount.toLocaleString()}</p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Reject",
      background: "#121212",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      color: "#fff",
      preConfirm: (comment) => comment || "",
    }).then(async (result) => {
      if (!result.isConfirmed && result.dismiss !== Swal.DismissReason.cancel) return;


      console.log(result);


      const action = result.isConfirmed ? "approved" : "rejected";
      const adminComment = result.value ?? "test";

      setIsProcessing(true);
      try {
        await dispatch(
          processWithdrawalRequest({
            transactionId: item._id,
            action,
            adminComment,
          })
        ).unwrap();

        // Refresh data after processing
        dispatch(fetchPendingWithdrawals({ page: currentPage, limit: ITEMS_PER_PAGE }));
        dispatch(fetchWithdrawalStats());

        Swal.fire(
          action === "approved" ? "Approved!" : "Rejected!",
          `Withdrawal request has been ${action}.`,
          action === "approved" ? "success" : "error"
        );
      } catch (error) {
        console.error("Error processing withdrawal:", error);
        Swal.fire("Error", "Failed to process withdrawal request.", "error");
      } finally {
        setIsProcessing(false);
      }
    });
  };

  return (
    <div className="w-full bg-[#1a1a1a] rounded-xl shadow-sm py-6 px-6">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center w-full md:w-[40%] border border-[#989898] px-3 py-2.5 rounded-md text-white">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="bg-transparent w-full outline-none text-white placeholder:text-white text-[14px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading || !pendingWithdrawals.length || isProcessing}
          />
          <Search className="size-5.5 text-green-500 " />
        </div>

        <div className="flex items-center gap-3">

          <div className="flex pr-3 border border-[#989898] rounded-md">
            <select
              value={amountFilter}
              onChange={(e) => setAmountFilter(e.target.value as any)}
              className="px-4 py-2 bg-transparent  text-white  outline-none"
              disabled={isLoading || !pendingWithdrawals.length || isProcessing}
            >
              <option value="all" className="bg-[#111]">Filter</option>
              <option value="min" className="bg-[#111]">Lowest</option>
              <option value="max" className="bg-[#111]">Highest</option>
            </select>
          </div>
          <button
            onClick={() => setSortOrder((s) => (s === "asc" ? "desc" : "asc"))}
            className="px-4 py-2 flex pr-5 items-center border border-[#989898] text-white rounded-md gap-2"
            disabled={isLoading || !pendingWithdrawals.length || isProcessing}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="#000" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide text-green-500 lucide-funnel-icon lucide-funnel"><path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" /></svg>
            {sortOrder === "asc" ? "Filter" : "Filter"}
          </button>
        </div>
      </div>

      {/* TABLE */}
      {isLoading ? (
        <p className="text-center text-gray-400 py-10">Loading pending withdrawals...</p>
      ) : !pendingWithdrawals.length ? (
        <p className="text-center text-gray-400 py-10">No pending withdrawals available.</p>
      ) : !filteredData.length ? (
        <p className="text-center text-gray-400 py-10">No results found for {search}</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-200 border-b border-[#ffffff40] text-[16px]">
              <th className="py-3 text-left">User</th>
              <th className="py-3 text-left">Email</th>
              <th className="py-3 text-center">Date</th>
              <th className="py-3 text-center">Amount</th>
              <th className="py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((item) => (
              <tr
                key={item._id}
                className="border-b border-[#ffffff20] hover:bg-[#0f0f0f80] transition"
              >
                <td className="py-4 flex items-center gap-3 text-white">
                  <div className="w-10 h-10 rounded-full bg-[#2a2a2a] flex items-center justify-center text-md text-green-400">
                    {(item.user.firstName || "U").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">
                      {([item.user.firstName, item.user.lastName].filter(Boolean).join(" ")).slice(0, 25)}
                    </p>
                  </div>
                </td>

                <td className="py-4 text-gray-300">{(item.user.email ?? "N/A").slice(0, 30)}</td>

                <td className="py-4 text-center text-gray-300">
                  {new Date(item.transactionDate).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>

                <td className="py-4 text-center font-semibold text-white">
                  ${item.amount.toLocaleString()}
                </td>

                <td className="py-4 text-center">
                  <button
                    className={`px-3.5 py-2 text-[13px] bg-green-600/20 text-green-400 rounded-full hover:bg-green-600/30 ${isProcessing ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    onClick={() => handleProcessRequest(item)}
                    disabled={isProcessing}
                  >
                    Process Request
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
