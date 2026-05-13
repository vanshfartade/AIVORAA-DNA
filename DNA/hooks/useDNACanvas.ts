// @ts-nocheck
import { useEffect, useRef, useState, useCallback } from 'react';
import { HelixNode, Particle, OriginNodeData, GoalNodeData, RungData } from '../types/dna';

interface UseDNACanvasProps {
  onNodeClick: (node: HelixNode) => void;
  isZoomed: boolean;
  activeNode: HelixNode | null;
  originData?: OriginNodeData[];
  goalData?: GoalNodeData[];
  rungData?: RungData[];
}

export const useDNACanvas = ({ onNodeClick, isZoomed, activeNode, originData = [], goalData = [], rungData = [] }: UseDNACanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  // State
  const [hoveredNode, setHoveredNode] = useState<HelixNode | null>(null);

  // Mutable values for animation loop to avoid dependency triggers
  const state = useRef({
    W: 0, H: 0, dpr: 1,
    scrollY: 0, targetScrollY: 0,
    rotationY: 0,
    mouseX: null as number | null, mouseY: null as number | null,
    worldMouseX: null as number | null, worldMouseY: null as number | null,
    animT: 0,
    camX: 0, camY: 0, camScale: 1,
    targetCamX: 0, targetCamY: 0, targetCamScale: 1,
    particles: [] as Particle[],
    nodes: [] as HelixNode[],
    hoveredNode: null as HelixNode | null,
    activeNode: null as HelixNode | null,
    isZoomed: false
  });

  // Sync props to mutable state
  useEffect(() => {
    state.current.isZoomed = isZoomed;
    state.current.activeNode = activeNode;
    
    if (isZoomed && activeNode) {
      state.current.targetCamScale = 2.4;
      const panelOffsetWorld = (400 / 2) / state.current.targetCamScale;
      state.current.targetCamX = activeNode.wx + panelOffsetWorld;
      state.current.targetCamY = activeNode.wy;
    } else {
      state.current.targetCamX = state.current.W ? state.current.W / 4 : 0;
      state.current.targetCamY = 0;
      state.current.targetCamScale = 1;
    }
  }, [isZoomed, activeNode]);

  // Init
  useEffect(() => {
    const s = state.current;
    
    // Initialize particles
    const types: ('hex' | 'orb' | 'cross' | 'ring' | 'triangle')[] = ['hex', 'orb', 'cross', 'ring', 'triangle'];
    const colors = ['0, 255, 120', '0, 200, 255', '255, 100, 200', '255, 180, 50', '100, 255, 100'];
    s.particles = Array.from({ length: 150 }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 3000 - 1000,
      z: Math.random() * 0.5 + 0.1,
      r: Math.random() * 30 + 15,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.01,
      speedY: -(Math.random() * 0.5 + 0.1),
      type: types[Math.floor(Math.random() * types.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    const handleResize = () => {
      if (!canvasRef.current || !wrapRef.current) return;
      s.dpr = window.devicePixelRatio || 1;
      s.W = wrapRef.current.offsetWidth;
      s.H = wrapRef.current.offsetHeight;
      canvasRef.current.width = s.W * s.dpr;
      canvasRef.current.height = s.H * s.dpr;
      
      if (!s.isZoomed) {
        s.targetCamX = s.W / 4;
        if (s.camX === 0) s.camX = s.W / 4;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Event Listeners
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const s = state.current;
    const helixHeight = 1000, baseY = 80;

    const onWheel = (e: WheelEvent) => {
      if (s.isZoomed) return;
      s.targetScrollY += e.deltaY * 0.6;
      e.preventDefault();
    };

    let touchY0: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (!s.isZoomed) touchY0 = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (s.isZoomed) return;
      if (touchY0 !== null) {
        s.targetScrollY -= (e.touches[0].clientY - touchY0) * 1.5;
        touchY0 = e.touches[0].clientY;
      }
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      s.mouseX = e.clientX - r.left;
      s.mouseY = e.clientY - r.top;
    };
    const onMouseLeave = () => {
      s.mouseX = null; s.mouseY = null; s.hoveredNode = null;
      setHoveredNode(null);
    };

    const onClick = () => {
      if (s.isZoomed) return;
      let hit = s.hoveredNode;
      
      // Check rung nodes if no main node hovered
      if (!hit && s.worldMouseX !== null && s.worldMouseY !== null) {
        const RUNGS = 15, cx = 0;
        const rungStep = helixHeight / (RUNGS + 1);
        for (let ri = 0; ri < RUNGS; ri++) {
          const wy = rungStep * (ri + 1);
          const a = s.rotationY + (wy / helixHeight) * Math.PI * 4;
          const R = 60;
          const sx = cx + R * Math.cos(a), ex = cx + R * Math.cos(a + Math.PI);
          const mx2 = (sx + ex) / 2, my2 = baseY + wy - s.scrollY;
          const dx = s.worldMouseX - mx2, dy = s.worldMouseY - my2;
          if (Math.sqrt(dx * dx + dy * dy) < 18) {
            hit = { type: 'rung', idx: ri, wx: mx2, wy: my2, worldY: wy, angle: a, sx, ex, sy: my2, data: rungs[ri % rungs.length] };
            break;
          }
        }
      }

      if (hit) {
        onNodeClick(hit);
      }
    };

    wrap.addEventListener('wheel', onWheel, { passive: false });
    wrap.addEventListener('touchstart', onTouchStart, { passive: true });
    wrap.addEventListener('touchmove', onTouchMove, { passive: false });
    wrap.addEventListener('mousemove', onMouseMove);
    wrap.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      wrap.removeEventListener('wheel', onWheel);
      wrap.removeEventListener('touchstart', onTouchStart);
      wrap.removeEventListener('touchmove', onTouchMove);
      wrap.removeEventListener('mousemove', onMouseMove);
      wrap.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [onNodeClick]);

  // Main Render Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const s = state.current;
    const AUTO_SPIN = 0.001;
    const helixHeight = 1000, cx = 0, baseY = 80;
    const NODES_PER_STRAND = 15, RUNGS = 15;

    // Drawing helpers
    const drawHexagon = (x: number, y: number, r: number, rot: number, alpha: number, color: string) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const px = r * Math.cos(a), py = r * Math.sin(a);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath(); ctx.strokeStyle = `rgba(${color}, ${alpha})`; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    };

    const drawOrb = (x: number, y: number, r: number, alpha: number, color: string) => {
      ctx.save(); ctx.translate(x, y);
      ctx.beginPath(); ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${alpha * 0.8})`; 
      ctx.shadowColor = `rgba(${color}, 1)`; ctx.shadowBlur = r;
      ctx.fill(); ctx.restore();
    };

    const drawCross = (x: number, y: number, r: number, rot: number, alpha: number, color: string) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
      const s = r * 0.5;
      ctx.moveTo(-s, 0); ctx.lineTo(s, 0);
      ctx.moveTo(0, -s); ctx.lineTo(0, s);
      ctx.strokeStyle = `rgba(${color}, ${alpha})`; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    };

    const drawRing = (x: number, y: number, r: number, alpha: number, color: string) => {
      ctx.save(); ctx.translate(x, y);
      ctx.beginPath(); ctx.arc(0, 0, r * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${color}, ${alpha * 0.7})`; ctx.lineWidth = 2;
      ctx.shadowColor = `rgba(${color}, 1)`; ctx.shadowBlur = r * 0.5;
      ctx.stroke(); ctx.restore();
    };

    const drawTriangle = (x: number, y: number, r: number, rot: number, alpha: number, color: string) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
      ctx.moveTo(0, -r * 0.6);
      ctx.lineTo(r * 0.5, r * 0.4);
      ctx.lineTo(-r * 0.5, r * 0.4);
      ctx.closePath();
      ctx.strokeStyle = `rgba(${color}, ${alpha * 0.8})`; ctx.lineWidth = 1.5; ctx.stroke(); ctx.restore();
    };

    const buildHelix = (t: number) => {
      const R = 60;
      const step = helixHeight / (NODES_PER_STRAND + 1);
      const rungStep = helixHeight / (RUNGS + 1);
      const nodes: HelixNode[] = [];

      for (let i = 0; i < NODES_PER_STRAND; i++) {
        const worldY = step * (i + 1);
        const angle = s.rotationY + (worldY / helixHeight) * Math.PI * 4;
        const sx = cx + R * Math.cos(angle), sy = baseY + worldY - s.scrollY;
        const sx2 = cx + R * Math.cos(angle + Math.PI);
        
        // Safe fallbacks for blank slate
        const originDatum = originData.length > 0 
          ? originData[i % originData.length] 
          : { label: 'Locked Skill', skills: [], desc: 'Awaiting curriculum data.' };
          
        const goalDatum = goalData.length > 0
          ? goalData[i % goalData.length]
          : { label: 'Locked Project', project: '', desc: 'Awaiting curriculum data.', status: 'locked', progress: 0 };

        nodes.push({ type: 'origin', idx: i, wx: sx, wy: sy, worldY, angle, data: originDatum as any });
        nodes.push({ type: 'goal', idx: i, wx: sx2, wy: sy, worldY, angle, data: goalDatum as any });
      }
      for (let r = 0; r < RUNGS; r++) {
        const worldY = rungStep * (r + 1);
        const angle = s.rotationY + (worldY / helixHeight) * Math.PI * 4;
        const sx = cx + R * Math.cos(angle), ex = cx + R * Math.cos(angle + Math.PI), sy = baseY + worldY - s.scrollY;
        
        const rungDatum = rungData.length > 0
          ? rungData[r % rungData.length]
          : { label: 'Locked Pathway', projects: [] };

        nodes.push({ type: 'rung', idx: r, wx: (sx + ex) / 2, wy: sy, worldY, sx, ex, sy, angle, data: rungDatum as any });
      }
      return nodes;
    };

    const render = () => {
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      ctx.clearRect(0, 0, s.W, s.H);

      if (!s.isZoomed) {
        s.rotationY += AUTO_SPIN;
        s.scrollY += (s.targetScrollY - s.scrollY) * 0.08;
        s.targetScrollY = Math.max(0, Math.min(s.targetScrollY, helixHeight - s.H + baseY * 2));
      }

      s.animT += 0.016;
      s.camX += (s.targetCamX - s.camX) * 0.12;
      s.camY += (s.targetCamY - s.camY) * 0.12;
      s.camScale += (s.targetCamScale - s.camScale) * 0.10;

      if (s.mouseX !== null && s.mouseY !== null) {
        s.worldMouseX = (s.mouseX - s.W / 2) / s.camScale + s.W / 2 + s.camX - s.W / 2;
        s.worldMouseY = (s.mouseY - s.H / 2) / s.camScale + s.H / 2 + s.camY;
      } else {
        s.worldMouseX = null; s.worldMouseY = null;
      }

      // Draw background particles
      ctx.save();
      ctx.translate(s.W / 2, s.H / 2);
      ctx.translate(-s.camX * 0.2, -s.camY * 0.2);
      s.particles.forEach(p => {
        p.y += p.speedY; p.rot += p.rotSpeed;
        if (p.y < -1000) p.y = helixHeight + 500;
        const alpha = p.z * 0.4 * (1 - (s.camScale - 1) * 0.4);
        if (alpha > 0) {
          if (p.type === 'hex') drawHexagon(p.x, p.y - s.scrollY * p.z, p.r, p.rot, alpha, p.color);
          else if (p.type === 'orb') drawOrb(p.x, p.y - s.scrollY * p.z, p.r, alpha, p.color);
          else if (p.type === 'cross') drawCross(p.x, p.y - s.scrollY * p.z, p.r, p.rot, alpha, p.color);
          else if (p.type === 'ring') drawRing(p.x, p.y - s.scrollY * p.z, p.r, alpha, p.color);
          else if (p.type === 'triangle') drawTriangle(p.x, p.y - s.scrollY * p.z, p.r, p.rot, alpha, p.color);
        }
      });
      ctx.restore();

      s.nodes = buildHelix(s.animT);

      // Main Camera
      ctx.save();
      ctx.translate(s.W / 2, s.H / 2);
      ctx.scale(s.camScale, s.camScale);
      ctx.translate(-s.W / 2 - s.camX, -s.H / 2 - s.camY);
      ctx.translate(s.W / 2, 0);

      const R = 60;
      const EXTRA = 3000;
      const startWy = -EXTRA;
      const endWy = helixHeight + EXTRA;
      const totalWy = endWy - startWy;
      const segments = 600;

      const drawList: { z: number, draw: () => void }[] = [];

      // 1. Generate Strand Segments
      for (let i = 0; i < segments; i++) {
        const wy1 = startWy + (i / segments) * totalWy;
        const wy2 = startWy + ((i + 1) / segments) * totalWy;
        
        const sy1 = baseY + wy1 - s.scrollY;
        const sy2 = baseY + wy2 - s.scrollY;
        
        if (sy1 < -500 && sy2 < -500) continue;
        if (sy1 > s.H + 500 && sy2 > s.H + 500) continue;

        const numThreads = 3;
        const baseThreadRadius = 4;
        const threadTwist = 10;

        for (let strandIdx = 0; strandIdx < 2; strandIdx++) {
          const baseA1 = s.rotationY + (wy1 / helixHeight) * Math.PI * 4 + (strandIdx * Math.PI);
          const baseA2 = s.rotationY + (wy2 / helixHeight) * Math.PI * 4 + (strandIdx * Math.PI);
          
          const bx1 = cx + R * Math.cos(baseA1);
          const bz1 = R * Math.sin(baseA1);
          const bx2 = cx + R * Math.cos(baseA2);
          const bz2 = R * Math.sin(baseA2);

          for (let t = 0; t < numThreads; t++) {
            const phase = (t / numThreads) * Math.PI * 2;
            const tw1 = (wy1 / helixHeight) * Math.PI * threadTwist - s.animT * 0.5;
            const tw2 = (wy2 / helixHeight) * Math.PI * threadTwist - s.animT * 0.5;

            // Very subtle organic shifting
            const breathing = Math.sin(s.animT * 0.5 + t) * 0.5;
            const radius = baseThreadRadius + breathing;

            const ox1 = radius * Math.cos(phase + tw1);
            const oz1 = radius * Math.sin(phase + tw1);
            const ox2 = radius * Math.cos(phase + tw2);
            const oz2 = radius * Math.sin(phase + tw2);

            const tx1 = bx1 + ox1;
            const tz1 = bz1 + oz1;
            const tx2 = bx2 + ox2;
            const tz2 = bz2 + oz2;
            const tz_mid = (tz1 + tz2) / 2;

            drawList.push({
              z: tz_mid,
              draw: () => {
                const sf = (tz_mid + R + baseThreadRadius) / (2 * (R + baseThreadRadius));
                
                // Calm, highly transparent alpha
                const activeAlpha = Math.max(0, 0.05 + 0.6 * sf);
                const width = 0.8 + (1.2 * sf);
                
                ctx.beginPath(); ctx.moveTo(tx1, sy1); ctx.lineTo(tx2, sy2);
                
                if (strandIdx === 0) {
                  ctx.strokeStyle = `rgba(0,255,120,${activeAlpha})`; 
                  ctx.shadowColor = '#00ff78';
                } else {
                  ctx.strokeStyle = `rgba(50,255,0,${activeAlpha})`; 
                  ctx.shadowColor = '#32ff00';
                }
                ctx.lineWidth = width;
                ctx.shadowBlur = 2 + 6 * sf;
                ctx.stroke(); ctx.shadowBlur = 0;
              }
            });

            // Calm, slow-floating "essence" for the second strand
            if (strandIdx === 1) {
              const hash = Math.abs(Math.sin(wy1 * 12.345 + t * 67.89));
              const spawnChance = 0.992; // Rare, calming
              if (hash > spawnChance) { 
                const essenceAge = (s.animT * 0.4 + hash * 100) % 1; // Very slow age progression
                const floatDist = essenceAge * 25; // Doesn't fly far away
                const spiralAngle = tw1 + hash * 10 + essenceAge * 2; 
                
                const ex = tx1 + Math.cos(spiralAngle) * floatDist;
                const ez = tz1 + Math.sin(spiralAngle) * floatDist;
                const ey = sy1 - floatDist * 0.8; 
                
                drawList.push({
                  z: ez,
                  draw: () => {
                    const sfP = (ez + R) / (2 * R);
                    const alpha = Math.max(0, (1 - essenceAge) * sfP * 0.6); // Very soft alpha max 0.6
                    const size = (1 + 1.5 * sfP) * (1 - essenceAge);
                    
                    ctx.beginPath();
                    ctx.arc(ex, ey, size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(150,255,150,${alpha})`;
                    ctx.shadowColor = '#32ff00';
                    ctx.shadowBlur = 4 * alpha;
                    ctx.fill();
                    ctx.shadowBlur = 0;
                  }
                });
              }
            }
          }
        }
      }

      // 2. Generate Rungs
      const rungStep = helixHeight / (RUNGS + 1);
      const EXTRA_RUNGS = 50;
      for (let r = -EXTRA_RUNGS; r < RUNGS + EXTRA_RUNGS; r++) {
        const wy = rungStep * (r + 1);
        const sy = baseY + wy - s.scrollY;
        if (sy < -500 || sy > s.H + 500) continue;

        const a1 = s.rotationY + (wy / helixHeight) * Math.PI * 4;
        const a2 = a1 + Math.PI;
        const x1 = cx + R * Math.cos(a1);
        const z1 = R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2);
        const z2 = R * Math.sin(a2);

        // Split rung into 3 pieces for accurate depth intersection
        const pieces = 3;
        for (let p = 0; p < pieces; p++) {
          const t1 = p / pieces;
          const t2 = (p + 1) / pieces;
          const px1 = x1 + (x2 - x1) * t1;
          const pz1 = z1 + (z2 - z1) * t1;
          const px2 = x1 + (x2 - x1) * t2;
          const pz2 = z1 + (z2 - z1) * t2;
          const pz_mid = (pz1 + pz2) / 2;

          drawList.push({
            z: pz_mid,
            draw: () => {
              const sf = (pz_mid + R) / (2 * R);
              const g = ctx.createLinearGradient(px1, sy, px2, sy);
              g.addColorStop(0, `rgba(0,255,120,${0.1 + 0.7 * sf})`);
              g.addColorStop(1, `rgba(50,255,0,${0.1 + 0.7 * sf})`);
              ctx.beginPath(); ctx.moveTo(px1, sy); ctx.lineTo(px2, sy);
              ctx.strokeStyle = g; ctx.lineWidth = 1 + 3 * sf;
              ctx.shadowColor = 'rgba(0,255,80,0.6)'; ctx.shadowBlur = 2 + 10 * sf;
              ctx.stroke(); ctx.shadowBlur = 0;
            }
          });
        }

        // Draw the glowing center sphere of the rung
        drawList.push({
          z: 0,
          draw: () => {
            const mx = (x1 + x2) / 2;
            const pulse = 1 + 0.12 * Math.sin(s.animT * 2 + r);
            const sf = 0.5; // center z=0
            const nr = 8 * pulse * (0.6 + 0.4 * sf);
            ctx.beginPath(); ctx.arc(mx, sy, nr, 0, Math.PI * 2);
            const rg = ctx.createRadialGradient(mx, sy, 0, mx, sy, nr);
            rg.addColorStop(0, `rgba(0,255,120,${0.4 + 0.6*sf})`); 
            rg.addColorStop(0.5, `rgba(50,255,0,${0.3 + 0.5*sf})`); 
            rg.addColorStop(1, `rgba(0,100,20,0.1)`);
            ctx.fillStyle = rg; ctx.shadowColor = '#00ff78'; ctx.shadowBlur = 5 + 15*sf; 
            ctx.fill(); ctx.shadowBlur = 0;
          }
        });
      }

      // Hover detection
      s.hoveredNode = null;
      if (s.worldMouseX !== null && s.worldMouseY !== null && !s.isZoomed) {
        for (const n of s.nodes) {
          const dx = s.worldMouseX - n.wx, dy = s.worldMouseY - n.wy;
          if (Math.sqrt(dx * dx + dy * dy) < 22) { s.hoveredNode = n; break; }
        }
      }

      let newHovered = null;

      // 3. Generate Nodes
      for (const n of s.nodes) {
        if (n.type === 'rung') continue;
        const isHovered = s.hoveredNode && s.hoveredNode === n;
        if (isHovered) newHovered = n;
        const isActive = s.activeNode && s.activeNode === n;
        const pulse = 1 + 0.15 * Math.sin(s.animT * 1.5 + n.idx * 1.2 + (n.type === 'goal' ? Math.PI : 0));
        
        const z = R * Math.sin(n.angle);

        drawList.push({
          z: z,
          draw: () => {
            const sf = (z + R) / (2 * R);
            let r = isHovered ? 18 : 14 * pulse;
            if (isActive) r = 20 + 2 * Math.sin(s.animT * 4);
            
            // Apply depth scaling to node size
            r = r * (0.7 + 0.5 * sf);

            if (n.wy > -100 && n.wy < s.H + 100 || s.isZoomed) {
              ctx.beginPath(); ctx.arc(n.wx, n.wy, r, 0, Math.PI * 2);
              const rg = ctx.createRadialGradient(n.wx, n.wy, 0, n.wx, n.wy, r);
              if (n.type === 'origin') {
                rg.addColorStop(0, `rgba(200,255,220,${0.5 + 0.5*sf})`); 
                rg.addColorStop(0.4, `rgba(0,255,120,${0.4 + 0.5*sf})`); 
                rg.addColorStop(1, `rgba(0,100,50,0.1)`);
              } else {
                rg.addColorStop(0, `rgba(180,255,180,${0.5 + 0.5*sf})`); 
                rg.addColorStop(0.5, `rgba(50,255,0,${0.3 + 0.5*sf})`); 
                rg.addColorStop(1, `rgba(20,100,0,0.1)`);
              }
              ctx.fillStyle = rg; ctx.shadowColor = n.type === 'origin' ? '#00ff78' : '#32ff00';
              ctx.shadowBlur = (isHovered || isActive) ? 40 : (10 + 20 * sf); 
              ctx.fill(); ctx.shadowBlur = 0;
              
              ctx.strokeStyle = n.type === 'origin' ? `rgba(200,255,220,${0.3 + 0.5*sf})` : `rgba(180,255,180,${0.3 + 0.5*sf})`;
              if (isActive) ctx.strokeStyle = '#fff';
              ctx.lineWidth = isActive ? 2.5 : (1 + 1 * sf); ctx.stroke();

              // Text always drawn on top of the node, but we'll push it to a very high Z so it never gets obscured
              if (isHovered || isActive) {
                drawList.push({
                  z: 1000, // force text to draw last (on top of everything)
                  draw: () => {
                    ctx.font = '500 13px "Anthropic Sans", sans-serif';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillStyle = n.type === 'origin' ? 'rgba(220,255,230,1)' : 'rgba(200,255,200,1)';
                    if (isActive) { ctx.font = '700 16px sans-serif'; ctx.fillStyle = '#fff'; }
                    ctx.shadowColor = n.type === 'origin' ? '#00ff78' : '#32ff00'; ctx.shadowBlur = 12;
                    ctx.fillText(n.data.label, n.wx, n.wy - (isActive ? 35 : 28)); ctx.shadowBlur = 0;
                  }
                });
              }
            }
          }
        });
      }

      // Sort and Draw!
      drawList.sort((a, b) => a.z - b.z);
      for (const item of drawList) {
        item.draw();
      }
      
      setHoveredNode(newHovered);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return { wrapRef, canvasRef, hoveredNode };
};
