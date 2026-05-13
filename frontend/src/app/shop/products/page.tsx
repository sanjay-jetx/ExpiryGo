"use client";

import { useState } from "react";
import { Edit2, Trash2, Clock, CheckCircle2, XCircle, Search, Filter, Package } from "lucide-react";

export default function ProductList() {
  const [activeTab, setActiveTab] = useState<"active" | "expired">("active");

  const products = [
    { id: 1, name: "Organic Bananas Bunch", price: 1.99, original: 4.99, qty: 5, status: "active", expires: "12 hours", image: "https://images.unsplash.com/photo-1571501711181-e23112a9eb72?w=100&q=80" },
    { id: 2, name: "Sourdough Bread Loaf", price: 3.25, original: 6.50, qty: 2, status: "active", expires: "8 hours", image: "https://images.unsplash.com/photo-1589367920969-abce79c58b50?w=100&q=80" },
    { id: 3, name: "Fresh Milk 1 Gallon", price: 2.00, original: 5.20, qty: 10, status: "active", expires: "24 hours", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&q=80" },
    { id: 4, name: "Strawberries 1lb", price: 1.50, original: 7.99, qty: 0, status: "expired", expires: "Expired 2 days ago", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=100&q=80" },
    { id: 5, name: "Greek Yogurt Vanilla", price: 2.50, original: 5.99, qty: 0, status: "expired", expires: "Expired 5 days ago", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=100&q=80" },
  ];

  const filteredProducts = products.filter(p => p.status === activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage your deals, update inventory, and view expired items.</p>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <button className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-max mb-6">
        <button
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "active" 
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <CheckCircle2 size={16} className={activeTab === "active" ? "text-emerald-500" : ""} />
          Active Deals
        </button>
        <button
          onClick={() => setActiveTab("expired")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "expired" 
            ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" 
            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
        >
          <XCircle size={16} className={activeTab === "expired" ? "text-red-500" : ""} />
          Expired Deals
        </button>
      </div>

      {/* Product List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold">Expiry Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 dark:border-gray-700" />
                      <span className="font-medium text-gray-900 dark:text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 dark:text-white">₹{product.price.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 line-through">₹{product.original.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{product.qty} units</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      activeTab === "active" 
                      ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" 
                      : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}>
                      <Clock size={14} />
                      {product.expires}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      {activeTab === "active" && (
                        <button className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition">
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredProducts.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p>No products found in this section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
