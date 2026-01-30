
import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ExternalLink, 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronRight,
  Plus,
  X,
  Check,
  ArrowRight,
  Layers,
  Save
} from 'lucide-react';
import { Requirement } from '../types';

interface MetricBindingViewProps {
  requirement: Requirement;
  onBack: () => void;
}

interface PageModule {
  id: string;
  title: string;
  path: string;
  metricCount: number;
}

interface HistoricalEntry {
  id: string;
  product: string;
  definition: string;
}

interface BindingMetric {
  id: string;
  name: string;
  historicalDefinitions: HistoricalEntry[];
  interpretationFull: string;
  interpretationSum: string;
  adoptedId: string | null;
}

const CASCADE_DATA = [
  {
    name: '生意经',
    pages: [
      { name: '投放', modules: ['投放分析', '效果监控', '达人明细'] },
      { name: '销售', modules: ['销售看板', '商品热卖', '支付趋势'] },
      { name: '洞察', modules: ['竞品对比', '行业趋势', '用户画像'] }
    ]
  },
  {
    name: '生服',
    pages: [
      { name: '经营', modules: ['经营概览', '服务质量'] },
      { name: '活动', modules: ['大促看板', '流量转化'] }
    ]
  },
  {
    name: '驾驶舱',
    pages: [
      { name: '销售经营', modules: ['生服经营日报', '实时战报'] }
    ]
  }
];

const MetricBindingView: React.FC<MetricBindingViewProps> = ({ requirement, onBack }) => {
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [selectedMetricIds, setSelectedMetricIds] = useState<Set<string>>(new Set());
  const [modules, setModules] = useState<PageModule[]>([
    { id: '1', title: '产品页面模块1', path: '生意经/投放/投放分析', metricCount: 10 }
  ]);

  const [showCascade, setShowCascade] = useState(false);
  const [selProduct, setSelProduct] = useState<string | null>(null);
  const [selPage, setSelPage] = useState<string | null>(null);
  const [selModule, setSelModule] = useState<string | null>(null);
  const cascadeRef = useRef<HTMLDivElement>(null);

  const [bindingMetrics, setBindingMetrics] = useState<BindingMetric[]>([
    { 
      id: 'bm1',
      name: '直播体裁支付GMV', 
      historicalDefinitions: [
        { id: 'h1_1', product: '产品A', definition: '指在直播间内产生的各类订单支付成功的成交总额' },
        { id: 'h1_2', product: '产品B', definition: '统计周期内直播间产生的实付GMV，剔除退款' }
      ],
      interpretationFull: '指标解释自动生成的口径描述', 
      interpretationSum: '指标解释自动生成的口径描述',
      adoptedId: 'full'
    },
    { 
      id: 'bm2',
      name: '直播引流支付GMV', 
      historicalDefinitions: [
        { id: 'h2_1', product: '产品A', definition: '通过直播间跳转至详情页或直播间直接下单的支付总金额' }
      ],
      interpretationFull: '指标解释自动生成的口径描述', 
      interpretationSum: '指标解释自动生成的口径描述',
      adoptedId: null
    },
    { 
      id: 'bm3',
      name: '视频体裁支付用户数', 
      historicalDefinitions: [
        { id: 'h3_1', product: '产品C', definition: '统计周期内通过短视频内容引导成交的去重支付用户数量' },
        { id: 'h3_2', product: '产品D', definition: '短视频带货场景下的成交流量转化人数' }
      ],
      interpretationFull: '指标解释自动生成的口径描述', 
      interpretationSum: '指标解释自动生成的口径描述',
      adoptedId: null
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cascadeRef.current && !cascadeRef.current.contains(event.target as Node)) {
        setShowCascade(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAdopt = (metricId: string, adoptId: string) => {
    setBindingMetrics(prev => prev.map(m => {
      if (m.id === metricId) {
        return { ...m, adoptedId: m.adoptedId === adoptId ? null : adoptId };
      }
      return m;
    }));
  };

  const toggleMetricSelection = (id: string) => {
    const newSelection = new Set(selectedMetricIds);
    if (newSelection.has(id)) newSelection.delete(id);
    else newSelection.add(id);
    setSelectedMetricIds(newSelection);
  };

  const isAllSelected = selectedMetricIds.size === bindingMetrics.length && bindingMetrics.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMetricIds(new Set());
    } else {
      setSelectedMetricIds(new Set(bindingMetrics.map(m => m.id)));
    }
  };

  const handleAddToModule = () => {
    if (selectedMetricIds.size === 0) return;
    const newModules = [...modules];
    newModules[0].metricCount += selectedMetricIds.size;
    setModules(newModules);
    setSelectedMetricIds(new Set());
    alert('已成功将指标绑定到页面模块');
  };

  const currentProductData = CASCADE_DATA.find(p => p.name === selProduct);
  const currentPageData = currentProductData?.pages.find(p => p.name === selPage);

  const handleConfirmNewModule = () => {
    if (selProduct && selPage && selModule) {
      const newPath = `${selProduct}/${selPage}/${selModule}`;
      setModules(prev => [{
        id: Date.now().toString(),
        title: `产品页面模块${prev.length + 1}`,
        path: newPath,
        metricCount: 0
      }, ...prev]);
      setIsAddingModule(false);
      setSelProduct(null);
      setSelPage(null);
      setSelModule(null);
    }
  };

  const steps = [
    { label: '生成指标解释', status: 'completed' },
    { label: '指标绑定页面', status: 'active' },
    { label: '应用登记确认', status: 'pending' }
  ];

  return (
    <div className="flex flex-col h-full bg-[#f5f7fa]">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 p-1">
            <ChevronLeft size={24} />
          </button>
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">{requirement.name}</h1>
            <a href="#" className="flex items-center text-xs text-blue-600 hover:underline">
              <ExternalLink size={12} className="mr-1" /> 查看PRD
            </a>
            <div className="flex items-center space-x-6 ml-6 pl-6 border-l border-gray-100">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">技术负责人:</span>
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[9px] font-bold">
                    {requirement.techOwner[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{requirement.techOwner}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-400">提需人:</span>
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[9px] font-bold">
                    {requirement.businessOwner[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">{requirement.businessOwner}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="text-sm text-gray-500 hover:text-gray-700 font-medium">操作记录</button>
      </div>

      <div className="flex-1 overflow-auto flex flex-col">
        <div className="bg-white px-20 py-8 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center w-full max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center relative flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                    step.status !== 'pending' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`mt-2 text-xs font-medium transition-colors ${
                    step.status !== 'pending' ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`h-[1px] flex-1 mb-6 ${step.status === 'completed' ? 'bg-blue-600' : 'bg-gray-100'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex-1 px-6 pb-6 overflow-hidden flex gap-6 mt-4 relative">
          {/* Left Sidebar: Module Structure */}
          <div className={`w-[340px] flex flex-col space-y-4 pr-2 ${showCascade ? '' : 'overflow-y-auto custom-scrollbar'}`}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-gray-700 flex items-center">
                <Layers size={14} className="mr-2 text-blue-600" />
                页面模块结构
              </h3>
            </div>
            
            {modules.map((module) => (
              <div key={module.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group relative flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 font-medium">{module.title}</p>
                    <p className="text-base font-bold text-gray-800 line-clamp-2 leading-tight">{module.path}</p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md border border-blue-100 font-bold">
                    {module.metricCount}个指标
                  </div>
                </div>
              </div>
            ))}

            {isAddingModule ? (
              <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg animate-in fade-in slide-in-from-top-2 relative flex-shrink-0" style={{ zIndex: 100 }}>
                <div className="space-y-6">
                  <div className="relative" ref={cascadeRef}>
                    <label className="text-sm font-bold text-gray-700 block mb-2">
                      <span className="text-red-500 mr-1">*</span>产品页面模块
                    </label>
                    <div 
                      onClick={() => setShowCascade(!showCascade)}
                      className={`w-full flex items-center justify-between border rounded-lg px-3 py-2 bg-white cursor-pointer transition-all ${
                        showCascade ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      <span className={`text-sm truncate ${selModule ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
                        {selModule ? `${selProduct}/${selPage}/${selModule}` : '请选择'}
                      </span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${showCascade ? 'rotate-180' : ''}`} />
                    </div>

                    {showCascade && (
                      <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-xl shadow-2xl z-[150] overflow-hidden animate-in zoom-in-95 fade-in duration-200">
                        <div className="flex divide-x divide-gray-100 h-[320px]">
                          {/* Column 1: Product */}
                          <div className="w-1/3 flex flex-col">
                            <div className="px-4 py-3 text-xs font-bold text-blue-600 bg-blue-50 border-b border-blue-100">产品</div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                              {CASCADE_DATA.map(p => (
                                <button 
                                  key={p.name}
                                  onClick={() => { setSelProduct(p.name); setSelPage(null); setSelModule(null); }}
                                  className={`w-full px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${selProduct === p.name ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-gray-700'}`}
                                >
                                  <span>{p.name}</span>
                                  <ChevronRight size={14} className={selProduct === p.name ? 'text-blue-500' : 'text-gray-300'} />
                                </button>
                              ))}
                            </div>
                          </div>
                          {/* Column 2: Page */}
                          <div className="w-1/3 flex flex-col bg-gray-50/20">
                            <div className="px-4 py-3 text-xs font-bold text-blue-600 bg-blue-50 border-b border-blue-100">页面</div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                              {selProduct ? currentProductData?.pages.map(p => (
                                <button 
                                  key={p.name}
                                  onClick={() => { setSelPage(p.name); setSelModule(null); }}
                                  className={`w-full px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${selPage === p.name ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-gray-700'}`}
                                >
                                  <span>{p.name}</span>
                                  <ChevronRight size={14} className={selPage === p.name ? 'text-blue-500' : 'text-gray-300'} />
                                </button>
                              )) : (
                                <div className="flex flex-col items-center justify-center h-full text-xs text-gray-400 space-y-2">
                                  <span>请先选择产品</span>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Column 3: Module */}
                          <div className="w-1/3 flex flex-col">
                            <div className="px-4 py-3 text-xs font-bold text-blue-600 bg-blue-50 border-b border-blue-100">模块?</div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                              {selPage ? currentPageData?.modules.map(m => (
                                <button 
                                  key={m}
                                  onClick={() => { setSelModule(m); setShowCascade(false); }}
                                  className={`w-full px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${selModule === m ? 'text-blue-600 font-bold bg-blue-50/30' : 'text-gray-700'}`}
                                >
                                  <span>{m}</span>
                                  {selModule === m && <Check size={14} className="text-blue-600" />}
                                </button>
                              )) : (
                                <div className="flex flex-col items-center justify-center h-full text-xs text-gray-400 space-y-2">
                                  <span>请先选择页面</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={() => setIsAddingModule(false)}
                      className="px-6 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleConfirmNewModule}
                      disabled={!selModule}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                        selModule 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 active:scale-95' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      确定
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingModule(true)}
                className="w-full py-3 bg-white border-2 border-dashed border-gray-200 text-gray-500 rounded-lg text-sm font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center space-x-2 flex-shrink-0"
              >
                <Plus size={16} />
                <span>新建页面模块</span>
              </button>
            )}
          </div>

          {/* Right Sidebar: Metric Table */}
          <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-gray-50/30">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="请输入相关指标"
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-md text-sm outline-none shadow-sm"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium italic">
                提示: 页面展示名称默认和字段名称一致，选择所需指标可以在下一步修改
              </p>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
              <table className="w-full border-collapse table-fixed">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="w-10 px-4 py-3">
                      <input 
                        type="checkbox" 
                        checked={isAllSelected}
                        onChange={toggleSelectAll}
                        className="rounded text-blue-600 border-gray-300 cursor-pointer" 
                      />
                    </th>
                    <th className="w-32 px-4 py-3 text-xs font-semibold text-gray-500 text-center border-r border-gray-200">字段名称</th>
                    <th className="w-32 px-4 py-3 text-xs font-semibold text-gray-500 text-center border-r border-gray-200">页面展示名称</th>
                    <th className="w-[40%] px-4 py-3 text-xs font-semibold text-gray-500 text-center border-r border-gray-200">历史业务定义</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center border-r border-gray-200">指标解释(完整版)</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-center">指标解释(总结版)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bindingMetrics.map((m) => (
                    <tr key={m.id} className={`transition-colors group ${selectedMetricIds.has(m.id) ? 'bg-blue-50/40' : 'hover:bg-gray-50/80'}`}>
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={selectedMetricIds.has(m.id)}
                          onChange={() => toggleMetricSelection(m.id)}
                          className="rounded text-blue-600 border-gray-300 cursor-pointer" 
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-800 text-center border-r border-gray-100 font-medium truncate">{m.name}</td>
                      <td className="px-4 py-4 text-sm font-bold text-gray-800 text-center border-r border-gray-100 truncate">{m.name}</td>
                      
                      <td className="px-4 py-4 text-xs border-r border-gray-100">
                        <div className="space-y-4">
                          {m.historicalDefinitions.map((hist) => {
                            const isAdopted = m.adoptedId === hist.id;
                            return (
                              <div key={hist.id} className={`p-3 rounded-lg border transition-all relative group/item ${isAdopted ? 'bg-emerald-50 border-emerald-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300'}`}>
                                <div className="flex flex-col space-y-1">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isAdopted ? 'text-emerald-600' : 'text-gray-400'}`}>{hist.product}</span>
                                  <span className={`leading-relaxed ${isAdopted ? 'text-emerald-700 font-medium' : 'text-gray-500 italic'}`}>
                                    {hist.definition}
                                  </span>
                                </div>
                                <div className="mt-2 flex justify-center">
                                  <button 
                                    onClick={() => handleAdopt(m.id, hist.id)}
                                    className={`flex items-center space-x-1 px-3 py-1 rounded-md text-[10px] font-bold transition-all shadow-sm ${
                                      isAdopted 
                                        ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                                        : 'bg-white text-gray-400 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 opacity-0 group-hover/item:opacity-100'
                                    }`}
                                  >
                                    {isAdopted && <Check size={10} />}
                                    <span>采纳</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </td>

                      <td className={`px-4 py-4 text-xs text-center border-r border-gray-100 relative group/cell ${m.adoptedId === 'full' ? 'bg-emerald-50/50' : ''}`}>
                        <div className="flex flex-col items-center space-y-3">
                          <span className={`transition-colors leading-relaxed ${m.adoptedId === 'full' ? 'text-emerald-700 font-medium' : 'text-blue-500 hover:underline cursor-pointer'}`}>
                            {m.interpretationFull}
                          </span>
                          <button 
                            onClick={() => handleAdopt(m.id, 'full')}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-[10px] font-bold transition-all shadow-sm ${
                              m.adoptedId === 'full' 
                                ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                                : 'bg-white text-gray-400 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 opacity-0 group-hover/cell:opacity-100'
                            }`}
                          >
                            {m.adoptedId === 'full' && <Check size={10} />}
                            <span>采纳</span>
                          </button>
                        </div>
                      </td>

                      <td className={`px-4 py-4 text-xs text-center relative group/cell ${m.adoptedId === 'summary' ? 'bg-emerald-50/50' : ''}`}>
                        <div className="flex flex-col items-center space-y-3">
                          <span className={`transition-colors leading-relaxed ${m.adoptedId === 'summary' ? 'text-emerald-700 font-medium' : 'text-blue-500 hover:underline cursor-pointer'}`}>
                            {m.interpretationSum}
                          </span>
                          <button 
                            onClick={() => handleAdopt(m.id, 'summary')}
                            className={`flex items-center space-x-1 px-3 py-1 rounded-md text-[10px] font-bold transition-all shadow-sm ${
                              m.adoptedId === 'summary' 
                                ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                                : 'bg-white text-gray-400 border border-gray-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 opacity-0 group-hover/cell:opacity-100'
                            }`}
                          >
                            {m.adoptedId === 'summary' && <Check size={10} />}
                            <span>采纳</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white border-t border-gray-200 p-6 space-y-6">
              <div className="grid grid-cols-2 gap-10">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-bold text-gray-600 whitespace-nowrap min-w-[80px]">
                    <span className="text-red-500 mr-1">*</span>技术负责人
                  </label>
                  <div className="flex-1 relative">
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm cursor-pointer shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold">W</div>
                        <span className="text-gray-700 font-medium">王涛</span>
                      </div>
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-bold text-gray-600 whitespace-nowrap min-w-[80px]">
                    <span className="text-red-500 mr-1">*</span>业务负责人
                  </label>
                  <div className="flex-1 relative">
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-2 bg-white text-sm cursor-pointer shadow-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold">S</div>
                        <span className="text-gray-700 font-medium">张龙祥</span>
                      </div>
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500 font-medium">
                    已选 <span className="text-blue-600 font-extrabold">{selectedMetricIds.size}</span> 个指标项
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleAddToModule}
                    disabled={selectedMetricIds.size === 0}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm ${
                      selectedMetricIds.size > 0 
                        ? 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100 active:scale-95' 
                        : 'bg-gray-50 text-gray-400 border border-gray-100 cursor-not-allowed'
                    }`}
                  >
                    <Layers size={16} />
                    <span>添加至页面模块</span>
                  </button>
                  <button className="flex items-center space-x-2 px-10 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-extrabold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95">
                    <Save size={16} />
                    <span>保存并进入下一步</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricBindingView;
