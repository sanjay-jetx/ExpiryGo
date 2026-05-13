"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, Mic, Calendar, DollarSign, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AddProduct() {
  const [productName, setProductName] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl mx-auto pb-24">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/shop" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition lg:hidden">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Deal</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">List a near-expiry product to save it from waste.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm p-5 sm:p-8">
        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* Images Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Product Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="aspect-video sm:aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer relative group">
                <ImageIcon size={32} className="mb-2 text-gray-400 group-hover:text-emerald-500 transition" />
                <span className="text-sm font-medium text-center px-2">Upload Front Image</span>
                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
              </div>
              <div className="aspect-video sm:aspect-square bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer relative overflow-hidden group">
                <ImageIcon size={32} className="mb-2 text-gray-400 group-hover:text-emerald-500 transition" />
                <span className="text-sm font-medium text-center px-2">Upload Expiry Date</span>
                <span className="text-xs text-gray-400 mt-1">Clear photo of the date</span>
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-gray-100 dark:bg-gray-700"></div>

          {/* Details Section */}
          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Product Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Product Name</label>
              <input 
                type="text" 
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Organic Bananas Bunch" 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Original Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="number" 
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition line-through text-gray-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1.5">Discount Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign size={16} className="text-red-500" />
                  </div>
                  <input 
                    type="number" 
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="0.00" 
                    className="w-full bg-red-50 border border-red-200 dark:bg-red-500/10 dark:border-red-500/30 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition font-bold text-red-600 dark:text-red-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Quantity Available</label>
                <input 
                  type="number" 
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Exact Expiry Date & Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Voice Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Add Voice Note Description (Optional)</label>
              <button type="button" className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 rounded-xl px-4 py-4 font-medium transition hover:bg-emerald-100 dark:hover:bg-emerald-500/20 active:scale-[0.98]">
                <Mic size={20} />
                Hold to Record Details
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">Customers love hearing about the product condition!</p>
            </div>
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 mt-4"
          >
            <Plus size={20} />
            Publish Deal
          </motion.button>
        </form>
      </div>
    </div>
  );
}
