import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from 'next/link'


export default function Home() {
  return (
    <div className="min-h-screen bg-[#f1f1f1] dark:bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col items-center space-y-12">
          {/* Logo and Title Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Inventory
              <span className="text-blue-600 dark:text-blue-500 ml-2">
                Pro
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
              Streamline your inventory management with our powerful and intuitive solution
            </p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-blue-100 dark:bg-blue-900/30 rounded-full blur-xl opacity-30"></div>
            <Image 
              src="/undraw_stock.svg"
              
              alt="Inventory Management"
              width={240}
              height={240}
              className="relative transform hover:scale-105 transition duration-300"
            />
          </div>
          <Link href="/dashboard"> 
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-300 flex items-center gap-2 group"
        
          >
         
              Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {[
              { title: 'Real-time Tracking', icon: '📊' },
              { title: 'Smart Analytics', icon: '📈' },
            ].map((feature) => (
              <div 
                key={feature.title}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-300 border border-gray-100 dark:border-gray-600"
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">{feature.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}