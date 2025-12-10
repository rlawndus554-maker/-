import React from 'react';
import { ScanFace } from 'lucide-react';

interface FaceScanModalProps {
  title: string;
  isActive: boolean;
}

export const FaceScanModal: React.FC<FaceScanModalProps> = ({ title, isActive }) => {
  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fadeIn">
      <div className="bg-white w-[85%] rounded-3xl p-8 flex flex-col items-center shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-8">{title}</h3>

        <div className="relative w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center mb-8 overflow-hidden">
            {/* Simulated Camera Feed Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-300 opacity-50" />
            
            {/* Face Icon / Guide */}
            <ScanFace className="w-24 h-24 text-gray-400 z-10" />
            
            {/* Scanning Line Animation */}
            <div className="absolute w-full h-1 bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.5)] z-20 animate-scan" style={{ top: '50%' }}></div>
            
            {/* Corner Brackets */}
            <div className="absolute top-8 left-8 w-4 h-4 border-t-4 border-l-4 border-gray-400 rounded-tl-lg"></div>
            <div className="absolute top-8 right-8 w-4 h-4 border-t-4 border-r-4 border-gray-400 rounded-tr-lg"></div>
            <div className="absolute bottom-8 left-8 w-4 h-4 border-b-4 border-l-4 border-gray-400 rounded-bl-lg"></div>
            <div className="absolute bottom-8 right-8 w-4 h-4 border-b-4 border-r-4 border-gray-400 rounded-br-lg"></div>
        </div>

        <p className="text-gray-600 font-medium mb-8">프레임 안에 얼굴을 맞춥니다.</p>

        <div className="text-gray-400 text-sm">
          AI 엔진 v2.4 액티브
        </div>
      </div>
    </div>
  );
};
