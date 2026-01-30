
import React, { useState, useRef, useEffect } from 'react';
import { X, Search, ChevronDown, Check, AlertCircle } from 'lucide-react';
import { MOCK_HIVE_TABLES } from '../constants';

interface CreateRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

const CreateRequirementModal: React.FC<CreateRequirementModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [formData, setFormData] = useState({
    name: '',
    prd: '',
    techOwner: '王涛',
    requester: 'chunhua',
  });
  
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const filteredTables = MOCK_HIVE_TABLES.filter(table => 
    table.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const toggleTableSelection = (table: string) => {
    setSelectedTables(prev => {
      const newSelection = prev.includes(table) 
        ? prev.filter(t => t !== table) 
        : [...prev, table];
      
      if (newSelection.length > 0 && errors.tables) {
        setErrors(prevErr => ({ ...prevErr, tables: '' }));
      }
      return newSelection;
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (value && errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = '请输入需求名称';
    if (!formData.prd.trim()) newErrors.prd = '请输入PRD链接或名称';
    if (selectedTables.length === 0) newErrors.tables = '请至少选择一个Hive表';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onCreate({ ...formData, tables: selectedTables });
  };

  const inputClass = (field: string) => `w-full px-3 py-2 bg-white border rounded-lg focus:ring-2 outline-none transition-all ${
    errors[field] 
      ? 'border-red-500 focus:ring-red-500/20' 
      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
  }`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl animate-in fade-in zoom-in duration-200 relative">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">新建需求</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Requirement Name */}
            <div>
              <div className="flex items-center mb-1">
                <label className="w-24 text-sm font-medium text-gray-700">
                  <span className="text-red-500 mr-1">*</span>需求名称
                </label>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="请输入"
                    className={inputClass('name')}
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                  />
                </div>
              </div>
              {errors.name && (
                <div className="flex items-center ml-24 mt-1 text-xs text-red-500">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.name}
                </div>
              )}
            </div>

            {/* PRD */}
            <div>
              <div className="flex items-center mb-1">
                <label className="w-24 text-sm font-medium text-gray-700">
                  <span className="text-red-500 mr-1">*</span>PRD
                </label>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="请输入"
                    className={inputClass('prd')}
                    value={formData.prd}
                    onChange={e => handleInputChange('prd', e.target.value)}
                  />
                </div>
              </div>
              {errors.prd && (
                <div className="flex items-center ml-24 mt-1 text-xs text-red-500">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.prd}
                </div>
              )}
            </div>

            {/* Tech Owner */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>技术负责人
              </label>
              <div className="flex-1 relative">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-blue-500 transition-all">
                  <div className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold mr-2">W</div>
                  <span className="flex-1 text-sm">{formData.techOwner}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Requester */}
            <div className="flex items-center">
              <label className="w-24 text-sm font-medium text-gray-700">
                <span className="text-red-500 mr-1">*</span>提需人
              </label>
              <div className="flex-1 relative">
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white cursor-pointer hover:border-blue-500 transition-all">
                  <div className="w-5 h-5 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold mr-2">C</div>
                  <span className="flex-1 text-sm">{formData.requester}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Select Table (Enhanced) */}
            <div>
              <div className="flex items-start pt-2 mb-1">
                <label className="w-24 text-sm font-medium text-gray-700 pt-2">
                  <span className="text-red-500 mr-1">*</span>选择表
                </label>
                <div className="flex-1 relative" ref={dropdownRef}>
                  <div 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`min-h-[40px] flex flex-wrap items-center gap-2 border rounded-lg px-3 py-2 bg-white cursor-pointer transition-all ${
                      isDropdownOpen 
                        ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm' 
                        : (errors.tables ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-blue-500')
                    }`}
                  >
                    {selectedTables.length === 0 ? (
                      <span className="text-sm text-gray-400">请选择</span>
                    ) : (
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto custom-scrollbar">
                        {selectedTables.map(table => (
                          <div key={table} className="flex items-center bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-md border border-blue-100 group">
                            <span className="truncate max-w-[200px]">{table}</span>
                            <X 
                              size={12} 
                              className="ml-1 cursor-pointer hover:text-blue-900" 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTableSelection(table);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    <ChevronDown size={14} className={`ml-auto text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl z-[60] animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                          <input 
                            type="text" 
                            placeholder="搜索 Hive 表..."
                            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-sm outline-none focus:border-blue-500"
                            value={tableSearch}
                            onChange={(e) => setTableSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredTables.length > 0 ? (
                          filteredTables.map(table => (
                            <div 
                              key={table}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTableSelection(table);
                              }}
                              className="flex items-center justify-between px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors group"
                            >
                              <span className={`text-sm ${selectedTables.includes(table) ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                                {table}
                              </span>
                              {selectedTables.includes(table) && (
                                <Check size={14} className="text-blue-600" />
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-gray-400">
                            没有找到相关的表
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {errors.tables && (
                <div className="flex items-center ml-24 mt-1 text-xs text-red-500">
                  <AlertCircle size={12} className="mr-1" />
                  {errors.tables}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-xl border-t border-gray-100">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleCreate}
            className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            新建
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRequirementModal;
