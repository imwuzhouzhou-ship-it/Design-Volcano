
import React from 'react';
import { X } from 'lucide-react';

interface NotifyConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  requirementName: string;
  tableName: string;
  metricCount: number;
}

const NotifyConfirmationModal: React.FC<NotifyConfirmationModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  requirementName,
  tableName,
  metricCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">确定通知业务吗</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            你在 <span className="font-semibold text-gray-800">{requirementName}</span> 需求中选定了 {metricCount} 个指标通知业务确认，其中
          </p>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs font-mono text-gray-500 break-all">
              {tableName} | 生活服务-商品域-商品维表增加了 {metricCount} 个指标
            </p>
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition-colors"
          >
            取消
          </button>
          <button 
            onClick={onConfirm}
            className="px-6 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
          >
            通知
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotifyConfirmationModal;
