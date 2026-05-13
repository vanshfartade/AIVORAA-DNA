// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useDNACanvas } from '../hooks/useDNACanvas';
import { TopUI } from './TopUI';
import { LevelsPanel } from './LevelsPanel';
import { HelixNode, OriginNodeData, GoalNodeData, RungData } from '../types/dna';

// Temporary mock import to simulate backend AI payload
import { originNodes as mockOrigin, goalNodes as mockGoal, rungs as mockRungs } from '../mocks/dnaData';

export const DNADashboard: React.FC = () => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeNode, setActiveNode] = useState<HelixNode | null>(null);

  // Centralized state to be populated by the AI agent (Ciro)
  const [originData, setOriginData] = useState<OriginNodeData[]>([]);
  const [goalData, setGoalData] = useState<GoalNodeData[]>([]);
  const [rungData, setRungData] = useState<RungData[]>([]);

  // Simulate AI Agent streaming data after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setOriginData(mockOrigin);
      setGoalData(mockGoal);
      setRungData(mockRungs);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNodeClick = (node: HelixNode) => {
    setActiveNode(node);
    setIsZoomed(true);
  };

  const handleZoomOut = () => {
    setIsZoomed(false);
    setActiveNode(null);
  };

  const { wrapRef, canvasRef, hoveredNode } = useDNACanvas({
    onNodeClick: handleNodeClick,
    isZoomed,
    activeNode,
    originData,
    goalData,
    rungData,
  });

  return (
    <div className="w-screen h-screen bg-[#050b08] text-white font-sans overflow-hidden relative">
      {/* Full Screen DNA Canvas and Background Effects */}
      <div 
        ref={wrapRef} 
        className="absolute inset-0 overflow-hidden bg-[#020604] z-0"
        style={{ cursor: hoveredNode ? 'pointer' : 'default' }}
      >
        {/* Deep space radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,50,25,0.4)_0%,rgba(0,10,5,0.8)_60%,rgba(0,0,0,1)_100%)] z-[1]"></div>
        
        {/* High-tech Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,255,120,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,255,120,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_40%,transparent_100%)] z-[2]"></div>

        {/* Subtle Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.2)_50%)] bg-[size:100%_4px] pointer-events-none z-[3]"></div>
        
        {/* Vignette (Darkened Edges) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.9)_100%)] pointer-events-none z-[4]"></div>

        {/* Ambient Glowing Orbs */}
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-[rgba(0,255,120,0.05)] rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse z-[5]" style={{ animationDuration: '4s' }}></div>
        <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-[rgba(0,150,255,0.03)] rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse z-[5]" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>

        <canvas ref={canvasRef} className="block w-full h-full relative z-[10]" />
        
        <LevelsPanel isOpen={isZoomed} activeNode={activeNode} />
      </div>

      <TopUI isZoomed={isZoomed} onZoomOut={handleZoomOut} />

      {/* Right side: Information Panel - Slides out when zoomed */}
      <div 
        className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center px-10 py-8 overflow-y-auto custom-scrollbar bg-[rgba(0,10,5,0.15)] backdrop-blur-xl [mask-image:linear-gradient(to_right,transparent,black_15%)] z-20 origin-right transition-all duration-[900ms] ease-[cubic-bezier(0.175,0.885,0.32,1.1)] ${isZoomed ? 'translate-x-[110%] scale-90 opacity-0 blur-md pointer-events-none' : 'translate-x-0 scale-100 opacity-100 blur-0'}`}
      >
        
        <div className="max-w-xl mx-auto relative z-10 w-full">
          <div className="mb-3 inline-block">
            <span className="px-3 py-1 bg-[rgba(255,255,255,0.1)] backdrop-blur-md border border-[rgba(255,255,255,0.2)] rounded-full text-white text-[10px] font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Curriculum Map
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            Your Learning DNA
          </h1>
          
          <div className="space-y-4 text-[rgba(255,255,255,0.85)] text-[13px] md:text-sm leading-relaxed">
            <section className="relative overflow-hidden bg-gradient-to-br from-[rgba(0,255,120,0.08)] to-[rgba(0,0,0,0.5)] backdrop-blur-3xl border border-t-[rgba(255,255,255,0.15)] border-l-[rgba(255,255,255,0.15)] border-b-[rgba(0,255,120,0.1)] border-r-[rgba(0,255,120,0.1)] p-6 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[rgba(0,255,120,0.4)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <h2 className="relative z-10 text-lg font-semibold text-white mb-2 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff78] shadow-[0_0_10px_#00ff78]"></span>
                The Strands: Skills & Goals
              </h2>
              <p className="relative z-10">
                The two twisting strands of the helix represent the core foundation of your educational journey. One strand embodies your <strong>Foundational Skills</strong> (like Web Dev or Python), while the opposing strand represents your ultimate <strong>Career Goals</strong> (like becoming a Full Stack Developer or AI Engineer).
              </p>
            </section>

            <section className="relative overflow-hidden bg-gradient-to-br from-[rgba(0,255,120,0.08)] to-[rgba(0,0,0,0.5)] backdrop-blur-3xl border border-t-[rgba(255,255,255,0.15)] border-l-[rgba(255,255,255,0.15)] border-b-[rgba(0,255,120,0.1)] border-r-[rgba(0,255,120,0.1)] p-6 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[rgba(0,255,120,0.4)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <h2 className="relative z-10 text-lg font-semibold text-white mb-2 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff78] shadow-[0_0_10px_#00ff78]"></span>
                The Rungs: Learning Pathways
              </h2>
              <p className="relative z-10">
                Bridging the gap between your starting skills and your ultimate goals are the connecting rungs. These are your <strong>Course Skills</strong> and projects. By completing these sequential pathways, you build the necessary knowledge to advance through your curriculum and achieve mastery.
              </p>
            </section>

            <section className="relative overflow-hidden bg-gradient-to-br from-[rgba(0,255,120,0.08)] to-[rgba(0,0,0,0.5)] backdrop-blur-3xl border border-t-[rgba(255,255,255,0.15)] border-l-[rgba(255,255,255,0.15)] border-b-[rgba(0,255,120,0.1)] border-r-[rgba(0,255,120,0.1)] p-6 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-[rgba(0,255,120,0.4)] hover:-translate-y-1 transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[rgba(255,255,255,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              <h2 className="relative z-10 text-lg font-semibold text-white mb-2 flex items-center gap-2 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff78] shadow-[0_0_10px_#00ff78]"></span>
                Interactive Exploration
              </h2>
              <p className="relative z-10 mb-2">
                This 3D structure is fully interactive. You can scroll to navigate through the entire curriculum database. 
              </p>
              <p className="relative z-10">
                <strong>Click on any node or rung</strong> to zoom in and examine the specific prerequisites, tasks, and detailed progressions required to unlock your next achievement.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNADashboard;
