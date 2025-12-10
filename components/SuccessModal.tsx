import React from 'react';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  title: string;
  isActive: boolean;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ title, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
      <div className="bg-white w-[85%] rounded-3xl p-8 flex flex-col items-center shadow-2xl transform transition-all scale-100">
        <h3 className="text-xl font-bold text-gray-900 mb-8">{title}</h3>

        <div className="relative w-48 h-48 bg-green-50 rounded-full flex items-center justify-center mb-8 border-4 border-green-100">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Check className="w-12 h-12 text-white stroke-[3]" />
            </div>
            {/* Ripple Effect Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-green-200 animate-ping opacity-20"></div>
        </div>

        <p className="text-green-600 font-bold text-xl mb-8">확인 완료!</p>

        <div className="text-gray-400 text-sm">
          AI 엔진 v2.4 액티브
        </div>
      </div>
    </div>
  );
};
