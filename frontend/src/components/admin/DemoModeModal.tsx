import React from 'react';
import { ShieldOff, X } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export const DemoModeModal: React.FC = () => {
  const { showDemoModeModal, setShowDemoModeModal } = useUIStore();

  if (!showDemoModeModal) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 animate-in fade-in duration-300"
      onClick={() => setShowDemoModeModal(false)}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

      {/* Modal */}
      <div 
        className="relative bg-white rounded-3xl shadow-2xl shadow-red-500/10 border border-red-100 max-w-sm w-full overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-red-500 via-orange-400 to-red-500" />

        <div className="p-6 md:p-8 text-center space-y-5">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border-2 border-red-100 shadow-inner">
            <ShieldOff className="w-8 h-8 text-red-500" strokeWidth={2} />
          </div>

          {/* English */}
          <div className="space-y-1">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              Demo Mode
            </h3>
            <p className="text-sm font-bold text-red-600">
              This action is prohibited in demo mode.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">বাংলা</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Bangla */}
          <div className="space-y-1">
            <h3 className="text-lg font-black text-gray-900 tracking-tight">
              ডেমো মোড
            </h3>
            <p className="text-sm font-bold text-red-600">
              এই কাজটি ডেমো মোডে নিষিদ্ধ।
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={() => setShowDemoModeModal(false)}
            className="w-full mt-2 py-3 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[10px] hover:bg-gray-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Dismiss / বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
