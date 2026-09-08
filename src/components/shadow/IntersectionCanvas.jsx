import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function IntersectionCanvas() {
  const canvasRef = useRef(null);
  const { vehicleA, vehicleB, environment, riskResult } = useApp();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let progress = 0; // 0 to 1 for vehicle motion animation

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const roadWidth = 110;

      // 1. Draw Asphalt Background & Roads
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // North-South Road
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(centerX - roadWidth / 2, 0, roadWidth, height);

      // East-West Road
      ctx.fillRect(0, centerY - roadWidth / 2, width, roadWidth);

      // Road Borders
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(centerX - roadWidth / 2, 0, roadWidth, height);
      ctx.strokeRect(0, centerY - roadWidth / 2, width, roadWidth);

      // Center Intersection Zone
      ctx.fillStyle = '#334155';
      ctx.fillRect(centerX - roadWidth / 2, centerY - roadWidth / 2, roadWidth, roadWidth);

      // Dashed Center Lanes
      ctx.setLineDash([12, 12]);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;

      // Vertical Lane Divider
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, height);
      ctx.stroke();

      // Horizontal Lane Divider
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // 2. Draw Traffic Signal Indicator
      const signalColor = environment.trafficSignal === 'red' ? '#ef4444' : environment.trafficSignal === 'yellow' ? '#f59e0b' : '#10b981';
      ctx.beginPath();
      ctx.arc(centerX + roadWidth / 2 + 18, centerY - roadWidth / 2 - 18, 10, 0, Math.PI * 2);
      ctx.fillStyle = signalColor;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Signal Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`SIGNAL: ${environment.trafficSignal.toUpperCase()}`, centerX + roadWidth / 2 + 32, centerY - roadWidth / 2 - 14);

      // 3. Vehicle Positions Calculation
      // Vehicle A (Bus) approaches from bottom (South) upwards
      const distA_m = Number(vehicleA.distance) || 38;
      const speedA_kmh = Number(vehicleA.speed) || 42;
      const pixelPerMeter = 4.2;

      // Distance offset in pixels from intersection center
      const offsetA = distA_m * pixelPerMeter;
      const busY = centerY + offsetA - (progress % 1) * (speedA_kmh * 0.4);
      const busX = centerX + 20;

      // Vehicle B (Ola Car) approaches from left (West) rightwards
      const distB_m = Number(vehicleB.distance) || 22;
      const speedB_kmh = Number(vehicleB.speed) || 8;
      const offsetB = distB_m * pixelPerMeter;
      const carX = centerX - offsetB + (progress % 1) * (speedB_kmh * 0.4);
      const carY = centerY - 20;

      // 4. Draw Conflict Zone Risk Indicator
      const isHighRisk = riskResult?.category === 'HIGH' || riskResult?.category === 'CRITICAL';
      if (isHighRisk) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
        ctx.fillStyle = riskResult.category === 'CRITICAL' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(249, 115, 22, 0.2)';
        ctx.fill();
        ctx.strokeStyle = riskResult.category === 'CRITICAL' ? '#ef4444' : '#f97316';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`⚠️ CONFLICT ZONE (${riskResult.predictedCollisionRisk}%)`, centerX - 55, centerY - 45);
      }

      // 5. Draw Vehicle A (College Bus)
      ctx.fillStyle = '#f59e0b'; // Amber Bus
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.fillRect(busX - 16, busY - 32, 32, 64);
      ctx.shadowBlur = 0; // reset shadow

      // Bus windshield & Roof markings
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(busX - 12, busY - 28, 24, 10);
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px sans-serif';
      ctx.fillText('COLLEGE BUS', busX - 28, busY + 45);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`${speedA_kmh} km/h (${distA_m}m)`, busX - 25, busY + 58);

      // Bus stopping distance projection arc
      const dStopA = riskResult?.vehicleA?.stoppingDistanceMeters || 30;
      ctx.strokeStyle = dStopA > distA_m ? '#ef4444' : '#10b981';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(busX, busY);
      ctx.lineTo(busX, busY - dStopA * pixelPerMeter);
      ctx.stroke();
      ctx.setLineDash([]);

      // 6. Draw Vehicle B (Ola Car)
      ctx.fillStyle = '#06b6d4'; // Cyan Car
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.fillRect(carX - 20, carY - 12, 40, 24);
      ctx.shadowBlur = 0;

      // Car windshield
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(carX + 4, carY - 9, 8, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = '9px sans-serif';
      ctx.fillText('OLA CAR', carX - 20, carY - 20);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`${speedB_kmh} km/h (${distB_m}m)`, carX - 24, carY - 8);

      progress += 0.05;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [vehicleA, vehicleB, environment, riskResult]);

  return (
    <div className="relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
      <div className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur px-3 py-1.5 rounded-md border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-2 z-10">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
        <span>2D INTERSECTION HUD — INTERACTIVE TELEMETRY</span>
      </div>

      <canvas ref={canvasRef} width={580} height={380} className="w-full h-auto block" />

      <div className="p-3 bg-navy-900 border-t border-slate-800 text-xs flex justify-between text-slate-400 font-mono">
        <div>VEHICLE A: College Bus (42 km/h, 38m)</div>
        <div>VEHICLE B: Ola Car (8 km/h, 22m)</div>
      </div>
    </div>
  );
}
