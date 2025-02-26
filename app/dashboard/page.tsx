import Link from 'next/link';
import { PlusCircle, Package, DollarSign, FileText } from 'lucide-react';
import Header from '../components/Header';




const DashboardCard = ({ title, icon: Icon, href, description }: any) => (
  <Link 
    href={href}
    className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 group"
  >
    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
        <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="text-center sm:text-left">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  </Link>
);

export default function Page() {
    const dashboardItems = [
        {
          title: 'Add Product',
          icon: PlusCircle,
          href: '/dashboard/products/new',
          description: 'Add new products to your inventory',
        },
        {
          title: 'View Inventory',
          icon: Package,
          href: '/dashboard/inventory',
          description: 'Check current stock levels and product details',
        },
        {
          title: 'View Sales',
          icon: DollarSign,
          href: '/dashboard/sales',
          description: 'Track your sales and revenue',
        },
        {
          title: 'Create Report',
          icon: FileText,
          href: '/dashboard/reports',
          description: 'Generate detailed inventory reports',
        },
      ];

  return (
    <div className="min-h-screen  dark:bg-gray-900 flex flex-col">
    <Header />
    <main className="flex-1 pt-16"> 
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {dashboardItems.map((item) => (
            <DashboardCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </main>
  </div>
  );
}


