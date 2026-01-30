
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Search, 
  ChevronDown, 
  Plus, 
  Edit3, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  MoreVertical,
  Loader2,
  CheckCircle2,
  Trash2,
  Check
} from 'lucide-react';
import { MOCK_TABLES, MOCK_HIVE_TABLES } from '../constants';
import { MetricField, TableGroup, Requirement } from '../types';
import { generateMetricInterpretation } from '../services/geminiService';

interface IntelligentInterpretationViewProps {
  requirement: Requirement;
  onBack: () => void;
  onOpenNotifyModal: (tableName: string, metricCount: number) => void;
  isNotified?: boolean;
}

const IntelligentInterpretationView: React.FC<IntelligentInterpretationViewProps> = ({ 
  requirement, 
  onBack,
  onOpenNotifyModal,
  isNotified = false
}) => {
  // If notified, we are effectively "beyond" step 0, so line 0->1 should be blue.
  const activeStep = isNotified ? 1 : 0;
  
  const [tables, setTables] = useState<TableGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [expandedTables, setExpandedTables] = useState<Set<string>>(new Set());
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter States
  const [metricSearch, setMetricSearch] = useState('');
  const [filterDevMethod, setFilterDevMethod] = useState<'All' | 'Warehouse' | 'Server'>('All');
  const [filterFieldType, setFilterFieldType] = useState('All');
  const [filterUninterpreted, setFilterUninterpreted] = useState(false);

  useEffect(() => {
    // Determine which table names to use
    let tableNames: string[] = [];
    if (requirement.selectedTables && requirement.selectedTables.length > 0) {
      tableNames = [...requirement.selectedTables];
    }
    
    // If we need more tables to match tableCount, pad from MOCK_HIVE_TABLES
    if (tableNames.length < requirement.tableCount) {
      const remainingCount = requirement.tableCount - tableNames.length;
      const additionalTables = MOCK_HIVE_TABLES
        .filter(t => !tableNames.includes(t))
        .slice(0, remainingCount);
      tableNames = [...tableNames, ...additionalTables];
    }
    
    // In case MOCK_HIVE_TABLES is too small, generate generic names
    while (tableNames.length < requirement.tableCount) {
      tableNames.push(`ies_life.dim_custom_table_${tableNames.length + 1}`);
    }

    // Slice to exactly match tableCount
    tableNames = tableNames.slice(0, requirement.tableCount);

    const generatedTables: TableGroup[] = tableNames.map((tableName, tIdx): TableGroup => {
      const existingMock = MOCK_TABLES.find(t => t.tableName === tableName);
      if (existingMock && tIdx === 0) return existingMock;

      return {
        tableName,
        description: '生活服务-商品域-商品维表',
        metrics: [
          { 
            id: `m-${tableName}-1`, 
            fieldName: '直播间成交转化率', 
            devMethod: 'Warehouse' as const, 
            fieldType: 'bigint', 
            referencedPageCount: 10, 
            intelligentInterpretationDetailed: '该指标属于生活服务业务线商家维度表 (ies_life.dim_life_merchant_info)，反映商家在直播场景下的流量变现效率。', 
            intelligentInterpretationBrief: '生活服务商家基础维度表中定义的关键经营属性标识，用于用户...', 
            isAiGenerated: true, 
            status: 'finished' as const 
          },
          { 
            id: `m-${tableName}-2`, 
            fieldName: '直播间退款金额', 
            devMethod: 'Warehouse' as const, 
            fieldType: 'bigint', 
            referencedPageCount: 2, 
            intelligentInterpretationDetailed: '反映生活服务商家综合经营质量或业务分级状况的量化评估指标...', 
            intelligentInterpretationBrief: '商家uid (抖音来客)；企业号老商家只有迁移成功后才会有', 
            isAiGenerated: false, 
            status: 'pending' as const 
          },
          { 
            id: `m-${tableName}-3`, 
            fieldName: '指标A', 
            devMethod: 'Warehouse' as const, 
            fieldType: 'bigint', 
            referencedPageCount: 0, 
            intelligentInterpretationDetailed: '', 
            intelligentInterpretationBrief: '', 
            isAiGenerated: false, 
            status: 'pending' as const 
          },
          { 
            id: `m-${tableName}-4`, 
            fieldName: '指标B', 
            devMethod: 'Warehouse' as const, 
            fieldType: 'bigint', 
            referencedPageCount: 0, 
            intelligentInterpretationDetailed: '', 
            intelligentInterpretationBrief: '', 
            isAiGenerated: false, 
            status: 'pending' as const 
          },
        ]
      };
    });

    setTables(generatedTables);
    setExpandedTables(new Set(tableNames.slice(0, 3)));
  }, [requirement]);

  // Derived filtered data
  const filteredTables = useMemo(() => {
    return tables.map(table => {
      const filteredMetrics = table.metrics.filter(metric => {
        const matchesSearch = metric.fieldName.toLowerCase().includes(metricSearch.toLowerCase());
        const matchesDev = filterDevMethod === 'All' || metric.devMethod === filterDevMethod;
        const matchesType = filterFieldType === 'All' || metric.fieldType === filterFieldType;
        const matchesUninterpreted = !filterUninterpreted || (metric.status !== 'finished' && !metric.isAiGenerated);
        
        return matchesSearch && matchesDev && matchesType && matchesUninterpreted;
      });
      return { ...table, metrics: filteredMetrics };
    }).filter(table => table.metrics.length > 0 || metricSearch === ''); // Keep tables visible if no search is active or if they have matching metrics
  }, [tables, metricSearch, filterDevMethod, filterFieldType, filterUninterpreted]);

  // Global Selection Logic for Footer
  const allVisibleMetricIds = useMemo(() => {
    return filteredTables.flatMap(t => t.metrics.map(m => m.id));
  }, [filteredTables]);

  const isAllSelectedGlobal = allVisibleMetricIds.length > 0 && allVisibleMetricIds.every(id => selectedIds.has(id));
  const isSomeSelectedGlobal = allVisibleMetricIds.some(id => selectedIds.has(id));

  const handleToggleSelectAll = () => {
    if (isGenerating) return;
    const newSet = new Set(selectedIds);
    if (isAllSelectedGlobal) {
      allVisibleMetricIds.forEach(id => newSet.delete(id));
    } else {
      allVisibleMetricIds.forEach(id => newSet.add(id));
    }
    setSelectedIds(newSet);
  };

  const toggleTableExpand = (tableName: string) => {
    const newSet = new Set(expandedTables);
    if (newSet.has(tableName)) {
      newSet.delete(tableName);
    } else {
      newSet.add(tableName);
    }
    setExpandedTables(newSet);
  };

  const steps = [
    { label: '生成指标解释' },
    { label: '指标绑定页面' },
    { label: '应用登记确认' }
  ];

  const handleToggleSelect = (id: string) => {
    if (isGenerating) return;
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleToggleAllInTable = (table: TableGroup) => {
    if (isGenerating) return;
    const tableMetricIds = table.metrics.map(m => m.id);
    const allSelected = tableMetricIds.length > 0 && tableMetricIds.every(id => selectedIds.has(id));
    
    const newSet = new Set(selectedIds);
    if (allSelected) {
      tableMetricIds.forEach(id => newSet.delete(id));
    } else {
      tableMetricIds.forEach(id => newSet.add(id));
    }
    setSelectedIds(newSet);
  };

  const handleBulkGenerate = async () => {
    if (selectedIds.size === 0 || isGenerating) return;
    setIsGenerating(true);
    
    setTables(prev => prev.map(table => ({
      ...table,
      metrics: table.metrics.map(m => 
        selectedIds.has(m.id) && m.status !== 'finished' ? { ...m, status: 'editing' as const } : m
      )
    })));

    const tablePromises = tables.map(async (table, tIdx) => {
      const metricPromises = table.metrics.map(async (metric, mIdx) => {
        if (selectedIds.has(metric.id) && metric.status !== 'finished') {
          const result = await generateMetricInterpretation(metric.fieldName, table.tableName);
          
          setTables(prev => {
            const next = [...prev];
            const updatedMetric = {
              ...next[tIdx].metrics[mIdx],
              intelligentInterpretationDetailed: result.detailed,
              intelligentInterpretationBrief: result.brief,
              isAiGenerated: true,
              status: 'finished' as const
            };
            next[tIdx].metrics[mIdx] = updatedMetric;
            return next;
          });
        }
      });
      await Promise.all(metricPromises);
    });

    await Promise.all(tablePromises);
    setIsGenerating(false);
  };

  const handleSingleGenerate = async (table: TableGroup, metric: MetricField) => {
    if (metric.isAiGenerated || metric.status === 'editing' || isGenerating) return;
    
    setTables(prev => prev.map(t => t.tableName === table.tableName ? {
      ...t, metrics: t.metrics.map(m => m.id === metric.id ? { ...m, status: 'editing' as const } : m)
    } : t));

    const result = await generateMetricInterpretation(metric.fieldName, table.tableName);
    
    setTables(prev => prev.map(t => t.tableName === table.tableName ? {
      ...t, metrics: t.metrics.map(m => m.id === metric.id ? {
        ...m,
        intelligentInterpretationDetailed: result.detailed,
        intelligentInterpretationBrief: result.brief,
        isAiGenerated: true,
        status: 'finished' as const
      } : m)
    } : t));
  };

  const handleDeleteMetric = (tableIdx: number, metricId: string) => {
    if (isGenerating) return;
    const newTables = [...tables];
    newTables[tableIdx].metrics = newTables[tableIdx].metrics.filter(m => m.id !== metricId);
    setTables(newTables);
    setOpenMenuId(null);
  };

  const totalSelectedInView = selectedIds.size;

  return (
    <div className="flex flex-col h-full bg-[#f5f7fa] relative">
      {/* 1. STICKY HEADER */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} disabled={isGenerating} className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50">
            <ChevronLeft size={24} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center space-x-3">
              <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap">{requirement.name}</h1>
              <a href="#" className="flex items-center text-xs text-blue-600 hover:underline whitespace-nowrap">
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
        </div>
        <button className="flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 font-medium">
          <span>操作记录</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar flex flex-col pb-24">
        {/* 2. PROGRESS STEPS */}
        <div className="bg-white px-20 py-8 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center w-full max-w-4xl mx-auto">
            {steps.map((step, idx) => {
              // Current or completed circle
              const isCircleFilled = idx <= activeStep;
              // Is this specific step label blue?
              const isLabelActive = idx === (isNotified ? 0 : activeStep);
              // Outgoing line should be blue if we've passed this step OR if it's currently "completed"
              const isLineFilled = idx < activeStep;

              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center relative flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                      isCircleFilled ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`mt-2 text-xs font-medium transition-colors ${
                      isLabelActive ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-[1px] flex-1 mb-6 transition-all ${
                      isLineFilled ? 'bg-blue-600' : 'bg-gray-100'
                    }`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {isNotified ? (
          /* SUCCESS VIEW */
          <div className="flex-1 flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-300">
            <div className="relative mb-8">
              {/* Decorative shapes matching screenshot */}
              <div className="absolute -top-4 -left-6 w-3 h-6 border-l-4 border-t-4 border-blue-400 rounded-tl-lg rotate-[-15deg]"></div>
              <div className="absolute -top-4 -right-2 w-2 h-4 bg-yellow-400 rotate-[30deg] rounded-sm"></div>
              <div className="absolute bottom-0 -right-8 w-4 h-4 border-r-4 border-b-4 border-purple-300 rounded-br-lg rotate-[45deg]"></div>
              
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-xl shadow-green-500/20">
                <Check size={48} className="text-white stroke-[4px]" />
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-500 font-medium">
              <span>已通知提需人，</span>
              <button 
                onClick={onBack}
                className="text-blue-600 hover:text-blue-700 hover:underline transition-all"
              >
                返回列表
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 3. STICKY FILTER AREA */}
            <div className="sticky top-0 z-30 bg-white px-6 py-4 flex items-center space-x-4 border-b border-gray-100 shadow-sm">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="请输入指标名称"
                  disabled={isGenerating}
                  value={metricSearch}
                  onChange={(e) => setMetricSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:ring-1 focus:ring-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
              
              <div className="relative group">
                <div className={`flex items-center border border-gray-200 rounded-md px-3 py-1.5 bg-white text-sm cursor-pointer hover:bg-gray-50 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span className="text-gray-500">开发方式</span>
                  <span className="ml-2 font-medium">{filterDevMethod === 'All' ? '全部' : filterDevMethod === 'Warehouse' ? '数仓开发' : 'Server加工'}</span>
                  <ChevronDown size={14} className="ml-2 text-gray-400" />
                </div>
                {!isGenerating && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50 overflow-hidden">
                    <button onClick={() => setFilterDevMethod('All')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">全部</button>
                    <button onClick={() => setFilterDevMethod('Warehouse')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">数仓开发</button>
                    <button onClick={() => setFilterDevMethod('Server')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">Server加工</button>
                  </div>
                )}
              </div>

              <div className="relative group">
                <div className={`flex items-center border border-gray-200 rounded-md px-3 py-1.5 bg-white text-sm cursor-pointer hover:bg-gray-50 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <span className="text-gray-500">字段类型</span>
                  <span className="ml-2 font-medium">{filterFieldType === 'All' ? '全部' : filterFieldType}</span>
                  <ChevronDown size={14} className="ml-2 text-gray-400" />
                </div>
                {!isGenerating && (
                  <div className="absolute top-full left-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg hidden group-hover:block z-50 overflow-hidden">
                    <button onClick={() => setFilterFieldType('All')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">全部</button>
                    <button onClick={() => setFilterFieldType('bigint')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">bigint</button>
                    <button onClick={() => setFilterFieldType('string')} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50">string</button>
                  </div>
                )}
              </div>

              <label className={`flex items-center space-x-2 cursor-pointer ml-4 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input 
                  type="checkbox" 
                  disabled={isGenerating} 
                  checked={filterUninterpreted}
                  onChange={(e) => setFilterUninterpreted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 disabled:cursor-not-allowed" 
                />
                <span className="text-sm text-gray-600">未指标生成</span>
              </label>
            </div>

            {/* 4. MAIN TABLES CONTENT */}
            <div className="p-6 space-y-6">
              {filteredTables.map((table, tIdx) => {
                const isExpanded = expandedTables.has(table.tableName);
                const tableMetricIds = table.metrics.map(m => m.id);
                const isAllSelectedInTable = tableMetricIds.length > 0 && tableMetricIds.every(id => selectedIds.has(id));
                const isSomeSelectedInTable = tableMetricIds.some(id => selectedIds.has(id));

                return (
                  <div key={table.tableName} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all duration-200">
                    <div 
                      className="px-6 py-4 bg-[#f8fafc] border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors group/header"
                      onClick={() => !isGenerating && toggleTableExpand(table.tableName)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-gray-400 group-hover/header:text-blue-600 transition-colors">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </div>
                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm rotate-45 flex-shrink-0"></div>
                        <span className="text-sm font-bold text-gray-800">{table.tableName}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500">{table.description}</span>
                        <button 
                          className={`p-1 hover:bg-gray-200 rounded transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`} 
                          onClick={(e) => { e.stopPropagation(); }}
                        >
                          <Edit3 size={14} className="text-gray-400" />
                        </button>
                      </div>
                      <button 
                        disabled={isGenerating}
                        className={`flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 font-bold transition-colors ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={(e) => { e.stopPropagation(); }}
                      >
                        <Plus size={18} />
                        <span>新增指标</span>
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="overflow-x-auto animate-in fade-in slide-in-from-top-1 duration-200">
                        <table className="w-full text-left border-collapse table-fixed">
                          <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-200">
                              <th className="px-4 py-3 w-10">
                                <input 
                                  type="checkbox" 
                                  disabled={isGenerating}
                                  className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
                                  checked={isAllSelectedInTable}
                                  ref={el => { if (el) el.indeterminate = isSomeSelectedInTable && !isAllSelectedInTable; }}
                                  onChange={(e) => { e.stopPropagation(); handleToggleAllInTable(table); }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[12%]">字段名称</th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[8%]">开发方式</th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[8%]">字段类型</th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[8%]">已绑页面数</th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[10%]">解释状态</th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%]">指标解释 (详细版)</th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[18%]">指标解释 (简要版)</th>
                              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right w-[16%]">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {table.metrics.length > 0 ? table.metrics.map((metric) => (
                              <tr key={metric.id} className={`transition-colors group relative ${selectedIds.has(metric.id) ? 'bg-blue-50/10' : 'hover:bg-blue-50/20'}`}>
                                <td className="px-4 py-4">
                                  <input 
                                    type="checkbox" 
                                    disabled={isGenerating}
                                    className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50" 
                                    checked={selectedIds.has(metric.id)}
                                    onChange={() => handleToggleSelect(metric.id)}
                                  />
                                </td>
                                <td className="px-4 py-4"><span className="text-sm font-medium text-gray-700 break-words">{metric.fieldName}</span></td>
                                <td className="px-4 py-4 text-center">
                                  <span className="inline-block text-[11px] text-gray-600 px-1.5 py-0.5 bg-[#f0f2f5] rounded border border-gray-200 font-medium whitespace-nowrap">
                                    {metric.devMethod === 'Warehouse' ? '数仓开发' : 'Server加工'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-xs text-gray-500 font-mono">{metric.fieldType}</td>
                                <td className="px-4 py-4 text-center">
                                  <span className="text-sm text-blue-600 font-medium hover:underline cursor-pointer">{metric.referencedPageCount || 0}</span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  {metric.status === 'finished' || metric.isAiGenerated ? (
                                    <div className="flex items-center justify-center text-green-500 text-xs font-medium">
                                      <CheckCircle2 size={12} className="mr-1" /><span>已解释</span>
                                    </div>
                                  ) : metric.status === 'editing' ? (
                                    <div className="flex items-center justify-center text-blue-500 text-xs font-medium">
                                      <Loader2 size={12} className="animate-spin mr-1" /><span>生成中</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center text-gray-400 text-xs font-medium"><span>未生成</span></div>
                                  )}
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-start space-x-2">
                                    {metric.status === 'editing' ? (
                                      <div className="flex items-center space-x-2 text-blue-400">
                                        <Sparkles size={14} className="animate-spin flex-shrink-0" />
                                        <span className="text-xs italic">生成中...</span>
                                      </div>
                                    ) : (
                                      <>
                                        {metric.isAiGenerated && <Sparkles size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />}
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{metric.intelligentInterpretationDetailed || '-'}</p>
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-start space-x-2">
                                    {metric.status === 'editing' ? (
                                      <div className="flex items-center space-x-2 text-blue-400">
                                        <Sparkles size={14} className="animate-spin flex-shrink-0" />
                                        <span className="text-xs italic">生成中...</span>
                                      </div>
                                    ) : (
                                      <>
                                        {metric.isAiGenerated && <Sparkles size={14} className="text-purple-500 mt-0.5 flex-shrink-0" />}
                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{metric.intelligentInterpretationBrief || '-'}</p>
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <div className="flex flex-col items-end space-y-1">
                                    <div className="flex items-center justify-end space-x-3 transition-opacity">
                                      <button 
                                        onClick={() => handleSingleGenerate(table, metric)}
                                        disabled={metric.isAiGenerated || metric.status === 'editing' || isGenerating}
                                        className={`text-xs font-medium transition-colors ${metric.isAiGenerated || metric.status === 'editing' || isGenerating ? 'text-gray-300 cursor-not-allowed' : 'text-blue-600 hover:text-blue-800'}`}
                                      >
                                        指标解释
                                      </button>
                                      <button disabled={isGenerating} className={`text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed`}>编辑</button>
                                      <div className="relative">
                                        <button 
                                          disabled={isGenerating}
                                          className="text-gray-400 hover:text-gray-600 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                          onClick={() => setOpenMenuId(openMenuId === metric.id ? null : metric.id)}
                                        >
                                          <MoreVertical size={14} />
                                        </button>
                                        {openMenuId === metric.id && (
                                          <div className="absolute right-0 top-full mt-1 w-24 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                            <button className="w-full text-left px-3 py-2 text-xs text-gray-600 hover:bg-gray-50 flex items-center">详情</button>
                                            {metric.devMethod === 'Server' && (
                                              <button 
                                                onClick={() => handleDeleteMetric(tIdx, metric.id)}
                                                className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center"
                                              >
                                                删除
                                              </button>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                                  该表下没有匹配当前筛选条件的指标
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredTables.length === 0 && (
                <div className="py-20 text-center bg-white border border-gray-200 rounded-xl">
                  <p className="text-gray-400">没有找到匹配条件的表或指标</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {!isNotified && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 pr-2">
              <input 
                type="checkbox" 
                disabled={isGenerating || allVisibleMetricIds.length === 0}
                checked={isAllSelectedGlobal}
                ref={el => { if (el) el.indeterminate = isSomeSelectedGlobal && !isAllSelectedGlobal; }}
                onChange={handleToggleSelectAll}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="text-sm text-gray-500 font-medium">已选 <span className="text-blue-600 font-bold">{totalSelectedInView}</span> 条</span>
            </div>
            <button 
              onClick={handleBulkGenerate}
              disabled={totalSelectedInView === 0 || isGenerating}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${totalSelectedInView > 0 && !isGenerating ? 'bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100' : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'}`}
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              <span>{isGenerating ? '批量生成中...' : '批量指标解释'}</span>
            </button>
          </div>

          <button 
            onClick={() => onOpenNotifyModal(tables[0]?.tableName || '', totalSelectedInView)}
            disabled={totalSelectedInView === 0 || isGenerating}
            className={`flex items-center space-x-2 px-8 py-2 rounded-lg text-sm font-bold shadow-lg transition-all ${totalSelectedInView > 0 && !isGenerating ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30' : 'bg-blue-300 text-white cursor-not-allowed shadow-none'}`}
          >
            通知提需人
          </button>
        </div>
      )}
    </div>
  );
};

export default IntelligentInterpretationView;
