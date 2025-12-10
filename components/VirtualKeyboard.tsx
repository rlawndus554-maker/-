import React from 'react';
import { ChevronUp, Delete } from 'lucide-react';

export const VirtualKeyboard: React.FC = () => {
  const rows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm']
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-[#d1d5db] pt-2 pb-6 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] animate-slideUp z-50 select-none">
      <div className="flex justify-center mb-3">
        <div className="w-10 h-1 bg-gray-400 rounded-full opacity-50"></div>
      </div>
      <div className="space-y-2.5 px-1 max-w-md mx-auto">
        {rows.map((row, i) => (
          <div key={i} className={`flex justify-center gap-1.5 ${i === 1 ? 'px-4' : ''}`}>
            {i === 2 && (
               <div className="bg-[#b1b8c2] active:bg-white rounded-[5px] p-2 w-[14%] flex items-center justify-center shadow-[0_1px_0px_#898989] text-gray-800 transition-colors">
                 <ChevronUp className="w-6 h-6 stroke-[2.5]" />
               </div>
            )}
            {row.map((key) => (
              <div key={key} className="bg-white active:bg-[#e5e5e5] rounded-[5px] h-11 flex-1 flex items-center justify-center shadow-[0_1px_0px_#898989] text-xl font-medium text-gray-900 pb-1 uppercase transition-colors">
                {key}
              </div>
            ))}
            {i === 2 && (
               <div className="bg-[#b1b8c2] active:bg-white rounded-[5px] p-2 w-[14%] flex items-center justify-center shadow-[0_1px_0px_#898989] text-gray-800 transition-colors">
                 <Delete className="w-6 h-6" />
               </div>
            )}
          </div>
        ))}
        <div className="flex gap-2 px-1 mt-2">
           <div className="bg-[#b1b8c2] rounded-[5px] h-11 w-[25%] flex items-center justify-center shadow-[0_1px_0px_#898989] font-medium text-gray-800 text-sm">123</div>
           <div className="bg-white rounded-[5px] h-11 flex-1 shadow-[0_1px_0px_#898989]"></div>
           <div className="bg-[#3b82f6] rounded-[5px] h-11 w-[25%] flex items-center justify-center shadow-[0_1px_0px_#1d4ed8] font-medium text-white text-sm">이동</div>
        </div>
      </div>
    </div>
  );
};