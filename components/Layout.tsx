
import React from 'react';
import { 
  Bell, 
  HelpCircle, 
  Menu, 
  User as UserIcon,
  ChevronDown
} from 'lucide-react';
import { SIDEBAR_ITEMS } from '../constants';
import { ViewType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, hideSidebar = false, currentView, onNavigate }) => {
  // Use the raw version of the user-provided GitHub URL to ensure it can be loaded
  const bgImageUrl = "https://raw.githubusercontent.com/imwuzhouzhou-ship-it/firewokrs/b4816ba13536d6f33792ff582f6f0ba460d83408/%E7%B2%BE%E9%80%89%E6%B4%9E%E5%AF%9F.png";

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Sidebar - Conditionally rendered */}
      {!hideSidebar && (
        <aside className="w-64 border-r border-gray-200 flex flex-col bg-gray-50 flex-shrink-0 transition-all duration-300">
          <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm rotate-45"></div>
            </div>
            <span className="text-lg font-bold text-gray-800">生财 <span className="text-sm font-normal px-1 bg-gray-200 rounded">数据管家</span></span>
          </div>

          <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {SIDEBAR_ITEMS.map((group, idx) => (
              <div key={idx} className="mb-6">
                <h3 className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {group.group}
                </h3>
                <ul className="space-y-1 mt-1">
                  {group.items.map((item) => {
                    const isActive = (item.id === 'smart_interpret' && currentView === 'LIST') || 
                                   (item.id === 'metric_binding' && currentView === 'BINDING');
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (item.id === 'smart_interpret') onNavigate('LIST');
                            if (item.id === 'metric_binding') onNavigate('BINDING');
                          }}
                          className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isActive 
                              ? 'bg-blue-50 text-blue-600' 
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span className={isActive ? 'text-blue-600' : 'text-gray-400'}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
              <Menu size={18} />
            </button>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* Top Navbar */}
        <header className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white z-10 flex-shrink-0">
          <div className="flex items-center space-x-8">
            <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-blue-600">生数据资产平台</a>
              <a href="#" className="hover:text-blue-600">资产检索</a>
              <div className="flex items-center text-blue-600 border-b-2 border-blue-600 py-5">
                <span>指标管家</span>
                <ChevronDown size={14} className="ml-1" />
              </div>
              <a href="#" className="hover:text-blue-600">数据学堂</a>
              <a href="#" className="hover:text-blue-600">找数助手</a>
              <a href="#" className="hover:text-blue-600">常用工具</a>
              <a href="#" className="hover:text-blue-600">管理中心</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-md px-3 py-1 text-sm border border-gray-200 cursor-pointer">
              <span className="text-gray-600">生活服务</span>
              <ChevronDown size={14} className="ml-1 text-gray-400" />
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>生财有效</span>
            </div>

            <button className="text-gray-400 hover:text-gray-600"><HelpCircle size={20} /></button>
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-2 border-l pl-4 ml-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon size={16} className="text-blue-600" />
              </div>
              <img src="https://picsum.photos/32/32" className="w-8 h-8 rounded-full border border-gray-200" alt="Avatar" />
            </div>
          </div>
        </header>

        {/* Dynamic Content with Custom Background Image */}
        <div 
          className="flex-1 overflow-auto bg-[#f5f7fa] bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImageUrl})` }}
        >
          {/* Transparent overlay to maintain contrast and UI clarity */}
          <div className="min-h-full bg-[#f5f7fa]/85 backdrop-blur-[1px]">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
