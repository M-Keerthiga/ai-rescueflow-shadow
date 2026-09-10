import { useApp } from '../../context/AppContext.jsx';

export default function VehicleOverlay() {
  const { riskResult, vehicleA, vehicleB } = useApp();

  if (!riskResult) return null;

  const ttc = riskResult.estimatedTTC || 1.8;
  const isCritical = riskResult.category === 'CRITICAL';
  const isHigh = riskResult.category === 'HIGH';

  const distA = Math.max(1, vehicleA?.distance ?? 38);
  const distB = Math.max(1, vehicleB?.distance ?? 22);

  return (
    <div className="absolute inset-0 pointer-events-none z-20 font-mono">
      {(isHigh || isCritical || distA < 15 || distB < 15) && (
        <div
          className="absolute border-2 border-dashed border-red-500 rounded-full bg-red-500/20 flex flex-col items-center justify-center p-2 animate-pulse"
          style={{ left: '46%', top: '42%', width: '90px', height: '90px', transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-[10px] font-mono font-extrabold text-red-400 text-center uppercase tracking-tighter">CONFLICT NODE</span>
          <span className="text-[9px] font-mono text-white font-bold bg-red-950/80 px-1 rounded mt-0.5">TTC: {ttc}s</span>
        </div>
      )}
    </div>
  );
}

