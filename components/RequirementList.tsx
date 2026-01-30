
import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import { Requirement } from '../types';

interface RequirementListProps {
  requirements: Requirement[];
  onEnterDetail: (req: Requirement) => void;
  onOpenCreate: () => void;
}

const RequirementList: React.FC<RequirementListProps> = ({ requirements, onEnterDetail, onOpenCreate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Implement filtering logic based on the requirements passed from props
  const filteredRequirements = requirements.filter(req => 
    req.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      <h1 className="text-xl font-bold text-gray-800">指标解释</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="w-[480px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="请输入需求名称"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm cursor-pointer hover:border-gray-300">
            <span className="text-sm text-gray-500 mr-2">技术负责人</span>
            <span className="text-sm font-medium">宋明杰</span>
            <ChevronDown size={14} className="ml-2 text-gray-400" />
          </div>
          <div className="flex items-center border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm cursor-pointer hover:border-gray-300">
            <span className="text-sm text-gray-500 mr-2">业务负责人</span>
            <span className="text-sm font-medium">宋明杰</span>
            <ChevronDown size={14} className="ml-2 text-gray-400" />
          </div>
          <label className="flex items-center space-x-2 cursor-pointer ml-4">
            <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300" />
            <span className="text-sm text-gray-600">我负责的</span>
          </label>
        </div>

        <button 
          onClick={onOpenCreate}
          className="ml-auto flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span className="font-medium">新建需求</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">需求名称</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center w-24">引用表数</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-32">业务负责人</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-32">技术负责人</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase w-32">创建时间</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-center w-32">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequirements.map((req) => (
                <tr key={req.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div 
                      className="flex items-center space-x-2 text-sm text-blue-600 font-medium hover:underline cursor-pointer transition-all truncate max-w-xl"
                      onClick={() => onEnterDetail(req)}
                    >
                      <FileText size={16} className="text-blue-500 flex-shrink-0" />
                      <span className="truncate">{req.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-1.5 bg-[#f0f2f5] text-gray-700 rounded-md border border-gray-200 text-sm font-medium min-w-[50px]">
                      {req.tableCount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {req.businessOwner ? req.businessOwner[0].toUpperCase() : '?'}
                      </div>
                      <span className="text-sm text-gray-700">{req.businessOwner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {req.techOwner ? req.techOwner[0].toUpperCase() : '?'}
                      </div>
                      <span className="text-sm text-gray-700">{req.techOwner}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500">{req.createdAt.split('T')[0]}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onEnterDetail(req)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      指标解释
                    </button>
                  </td>
                </tr>
              ))}
              {filteredRequirements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    未找到匹配的需求
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <span>共 {filteredRequirements.length} 项</span>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
              <ChevronLeft size={16} />
            </button>
            <button className="px-2 py-1 bg-blue-600 text-white border border-blue-600 rounded">1</button>
            <button className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700">2</button>
            <button className="p-1 hover:bg-gray-200 rounded">
              <ChevronRight size={16} />
            </button>
            <div className="flex items-center border border-gray-300 rounded px-2 py-1 bg-white ml-2 cursor-pointer">
              <span>20 条/页</span>
              <ChevronDown size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementList;
