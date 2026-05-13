// @ts-nocheck
import React from 'react';

interface TopUIProps {
  isZoomed: boolean;
  onZoomOut: () => void;
}

export const TopUI: React.FC<TopUIProps> = ({ isZoomed, onZoomOut }) => {
  return (
    <>
      <div className="absolute top-5 left-5 z-50 flex gap-4 items-center">
        <button
          onClick={onZoomOut}
          className={`
            bg-[rgba(0,40,20,0.8)] border border-[rgba(0,255,120,0.5)] text-[#00ff78] 
            px-4 py-2 rounded-lg text-[13px] uppercase tracking-[1px] 
            transition-all duration-300 shadow-[0_0_15px_rgba(0,255,120,0.2)]
            hover:bg-[rgba(0,80,40,0.9)] hover:shadow-[0_0_25px_rgba(0,255,120,0.4)]
            ${isZoomed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        >
          &larr; Zoom Out
        </button>
      </div>

      <div 
        className={`
          absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-[rgba(255,255,255,0.8)] font-semibold
          tracking-[2px] z-[50] pointer-events-none transition-opacity duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]
          ${isZoomed ? 'opacity-0' : 'opacity-100'}
        `}
      >
        SCROLL TO NAVIGATE &middot; CLICK NODES TO EXPAND
      </div>

      <div className="absolute bottom-[14px] left-4 flex gap-[14px] z-10">
        <div className="flex items-center gap-[6px] text-[11px] text-[rgba(180,255,210,0.55)]">
          <div className="w-[9px] h-[9px] rounded-full shrink-0 bg-[#00ff78] shadow-[0_0_5px_#00ff78]" />
          Skills
        </div>
        <div className="flex items-center gap-[6px] text-[11px] text-[rgba(180,255,210,0.55)]">
          <div className="w-[9px] h-[9px] rounded-full shrink-0 bg-[#32ff00] shadow-[0_0_5px_#32ff00]" />
          Course
        </div>
        <div className="flex items-center gap-[6px] text-[11px] text-[rgba(180,255,210,0.55)]">
          <div className="w-[9px] h-[9px] rounded-full shrink-0 bg-gradient-to-br from-[#00ff78] to-[#32ff00]" />
          Course Skills
        </div>
      </div>
    </>
  );
};
