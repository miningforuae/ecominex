// @ts-nocheck

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DollarSign, AlertCircle, Wallet, PieChart } from "lucide-react";

const PurchaseConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  product,
  quantity,
  balances,
  isProcessing,
  isShareMachine = false,
  sharePrice,
  profitPerShare
}) => {
  // Calculate total cost based on machine type
  const totalCost = isShareMachine 
    ? sharePrice * quantity 
    : product.priceRange * quantity;
    
  const hasEnoughBalance = balances?.total >= totalCost;
  console.log("Modal Balance Data:", balances);

  const handleConfirmClick = () => {
    console.log("Confirm button clicked"); // Debug log
    if (onConfirm) {
      onConfirm();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border border-gray-800 bg-gray-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isShareMachine ? "Confirm Share Purchase" : "Confirm Purchase"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Balance Display Section - Matching main page style */}
          <div className="rounded-xl border border-gray-700/30 bg-gray-800/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="text-green-400" />
                <span className="text-gray-300">Your Balance:</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-green-400">
                  ${(balances?.total || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Purchase Details */}
          <div className={`space-y-3 rounded-lg ${isShareMachine ? 'bg-purple-900/20' : 'bg-gray-800/60'} p-4`}>
            {isShareMachine ? (
              <>
                {/* Share Machine Display */}
                <div className="flex items-center mb-2">
                  <PieChart className="mr-2 h-5 w-5 text-purple-400" />
                  <span className="font-medium text-purple-300">Share-Based Mining</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Share Machine:</span>
                  <span className="font-medium">{product.machineName}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Share Price:</span>
                  <span className="font-medium">${sharePrice.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Number of Shares:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Profit Per Share:</span>
                  <span className="font-medium text-purple-400">${profitPerShare}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Expected Monthly Profit:</span>
                  <span className="font-medium text-purple-400">${(profitPerShare * quantity).toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-700 pt-2 text-lg">
                  <span className="text-gray-300">Total Cost:</span>
                  <span className="font-bold text-purple-400">
                    ${totalCost.toLocaleString()}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Normal Machine Display */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Machine:</span>
                  <span className="font-medium">{product.machineName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Quantity:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="flex items-center justify-between border-t border-gray-700 pt-2 text-lg">
                  <span className="text-gray-300">Total Cost:</span>
                  <span className="font-bold text-green-400">
                    ${totalCost.toLocaleString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {!hasEnoughBalance && (
            <div className="bg-red-900/50 border-red-700 flex items-start gap-3 rounded-lg border p-4">
              <AlertCircle className="text-red-400 mt-0.5 h-5 w-5" />
              <div className="space-y-1">
                <p className="text-red-400 font-medium">Insufficient Balance</p>
                <p className="text-red-300 text-sm">
                  You need $
                  {(totalCost - (balances?.total || 0)).toLocaleString()} more
                  to complete this {isShareMachine ? "share purchase" : "purchase"}.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmClick}
            disabled={!hasEnoughBalance || isProcessing}
            className={`${isShareMachine ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
          >
            {isProcessing ? 'Processing...' : isShareMachine ? 'Confirm Share Purchase' : 'Confirm Purchase'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseConfirmationModal;