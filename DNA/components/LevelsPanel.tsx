import { useState, useEffect } from 'react';
import type { HelixNode, ProgressStatus } from '../types/dna';

interface LevelsPanelProps {
  activeNode: HelixNode | null;
  isOpen: boolean;
}

export const LevelsPanel: React.FC<LevelsPanelProps> = ({ activeNode, isOpen }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setExpandedIndex(null);
    }
  }, [isOpen, activeNode]);

  if (!activeNode) return null;

  const getTag = (): string => {
    if (activeNode.type === 'origin') return 'Skills';
    if (activeNode.type === 'goal') return 'Course';
    return 'Course Skills';
  };

  const getTitle = (): string => activeNode.data.label;

  const renderList = (): React.ReactNode => {
    if (activeNode.type === 'origin') {
      return activeNode.data.skills.map((item, idx) => (
        <AccordionItem
          key={item.id}
          index={idx}
          title={item.title}
          desc={item.desc}
          status={item.status}
          progress={item.progress}
          isExpanded={expandedIndex === idx}
          onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          progressMessage="Track your progress: You must complete this skill to unlock the next one."
        />
      ));
    } else if (activeNode.type === 'goal') {
      return (
        <AccordionItem
          index={0}
          title={activeNode.data.project}
          desc={activeNode.data.desc}
          status={activeNode.data.status}
          progress={activeNode.data.progress}
          isExpanded={expandedIndex === 0}
          onToggle={() => setExpandedIndex(expandedIndex === 0 ? null : 0)}
          progressMessage="Track your progress: You must complete all underlying skills to complete this course."
        />
      );
    } else {
      return activeNode.data.projects.map((item, idx) => (
        <AccordionItem
          key={item.id}
          index={idx}
          title={item.title}
          desc={item.desc}
          status={item.status}
          progress={item.progress}
          isExpanded={expandedIndex === idx}
          onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          progressMessage="Track your progress: You must complete this skill to unlock the next one."
        />
      ));
    }
  };

  return (
    <div
      className={`
        absolute top-0 right-0 w-[400px] h-full z-[90] flex flex-col py-10 px-[30px]
        bg-[rgba(2,10,5,0.65)] backdrop-blur-2xl
        border-l border-[rgba(0,255,120,0.2)]
        shadow-[-10px_0_40px_rgba(0,0,0,0.8),inset_1px_0_0_rgba(255,255,255,0.05)]
        transition-all duration-[800ms] ease-[cubic-bezier(0.175,0.885,0.32,1.05)] delay-75
        ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[420px] opacity-0 pointer-events-none'}
      `}
    >
      <div className="mb-[30px]">
        <div className="text-[11px] tracking-[2px] text-[rgba(0,255,120,0.6)] uppercase mb-2">
          {getTag()}
        </div>
        <div className="text-[26px] font-semibold text-[#e8fff2] leading-[1.2] drop-shadow-[0_0_20px_rgba(0,255,120,0.3)]">
          {getTitle() || 'Awaiting Sync...'}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col gap-[15px] pr-2 custom-scrollbar">
        {renderList()}
      </div>
    </div>
  );
};

interface AccordionItemProps {
  index: number;
  title: string;
  desc: string;
  status: ProgressStatus;
  progress: number;
  isExpanded: boolean;
  onToggle: () => void;
  progressMessage: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ index, title, desc, status, progress, isExpanded, onToggle, progressMessage }) => {
  const getStatusColor = (): string => {
    if (status === 'completed') return 'rgba(0, 255, 120, 1)';
    if (status === 'locked') return 'rgba(100, 100, 100, 0.5)';
    return 'rgba(0, 200, 255, 1)'; // in-progress
  };

  const getStatusIcon = (): string | number => {
    if (status === 'completed') return '✓';
    if (status === 'locked') return '🔒';
    return index + 1;
  };

  return (
    <div 
      className={`
        bg-[rgba(0,255,120,0.04)] border border-[rgba(0,255,120,0.15)] rounded-xl flex flex-col transition-all duration-200 overflow-hidden
        hover:bg-[rgba(0,255,120,0.08)] hover:border-[rgba(0,255,120,0.4)] hover:-translate-x-1
        ${isExpanded ? 'bg-[rgba(0,255,120,0.08)] border-[rgba(0,255,120,0.4)]' : ''}
        ${status === 'locked' ? 'opacity-60 grayscale' : ''}
      `}
    >
      <div 
        className="p-4 flex gap-4 items-center cursor-pointer"
        onClick={status === 'locked' ? undefined : onToggle}
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-[0_0_10px_rgba(0,0,0,0.2)] border"
          style={{
            backgroundColor: status === 'locked' ? 'rgba(50,50,50,0.5)' : (status === 'completed' ? 'rgba(0,255,120,0.15)' : 'rgba(0,200,255,0.15)'),
            borderColor: status === 'locked' ? 'rgba(100,100,100,0.3)' : (status === 'completed' ? 'rgba(0,255,120,0.3)' : 'rgba(0,200,255,0.3)'),
            color: getStatusColor()
          }}
        >
          {getStatusIcon()}
        </div>
        <div className="flex-1">
          <div className="text-[rgba(200,255,220,0.9)] text-sm leading-[1.5]">
            {title}
          </div>
          {status === 'in-progress' && (
            <div className="w-full h-1 bg-[rgba(255,255,255,0.1)] rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-[#00c8ff] rounded-full transition-all duration-1000 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
        
        {status === 'completed' && (
          <div className="text-xs text-[#00ff78] font-bold uppercase tracking-wider">
            Done
          </div>
        )}
      </div>
      
      <div 
        className={`
          transition-all duration-300 ease-in-out bg-[rgba(0,0,0,0.2)]
          ${isExpanded ? 'max-h-[600px] opacity-100 p-0 px-4 pb-4 pointer-events-auto' : 'max-h-0 opacity-0 px-4 pointer-events-none'}
        `}
      >
        <div className="text-[13px] text-[rgba(180,255,210,0.7)] leading-[1.5] mb-3 pl-12">
          {desc}
          <br /><br />
          <span className="opacity-70 text-[11px] text-[#a3e6c2]">
            {progressMessage}
          </span>
        </div>
      </div>
    </div>
  );
};
