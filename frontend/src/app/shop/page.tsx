"use client";

import { DollarSign, Package, AlertTriangle, TrendingUp } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useMemo } from "react";
import { formatExpiry } from "@/lib/products/formatters";

export default function ShopDashboardOverview() {
  const { products } = useProducts({ limit: 100 });

  const stats = useMemo(() => {
    const activeDeals = products.length;
    const revenueSaved = products.reduce((acc, p) => acc + (p.original - p.price), 0);
    const expiringSoon = products.filter(p => new Date(p.expiry_date).getTime() - Date.now() < 24 * 3600 * 1000 && new Date(p.expiry_date).getTime() > Date.now()).length;

    return [
      { name: "Active Deals", value: activeDeals.toString(), icon: Package, change: "+0", changeType: "positive" },
      { name: "Revenue Saved", value: `₹${revenueSaved.toFixed(2)}`, icon: DollarSign, change: "+0%", changeType: "positive" },
      { name: "Expiring Soon", value: expiringSoon.toString(), icon: AlertTriangle, change: "-0", changeType: "positive" },
      { name: "Total Views", value: "0", icon: TrendingUp, change: "0%", changeType: "positive" },
    ];
  }, [products]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Welcome back! Here&apos;s what&apos;s happening with your deals today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-gray-500 dark:text-gray-400">
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Deals Expiring Soon</h2>
          <a href="/shop/products" className="text-sm font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400">View all</a>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {products.slice(0, 3).map((product) => {
            const expiry = formatExpiry(product.expiry_date);
            return (
              <div key={product.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</p>
                    <p className={`text-xs font-medium mt-0.5 ${expiry.isExpired ? 'text-gray-500' : 'text-red-500'}`}>
                      {expiry.isExpired ? "Expired" : `Expires in ${expiry.compact}`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">₹{product.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-400 line-through">₹{product.original.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              No products found. Add some deals to see them here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
