import React from 'react';
import { MapPin, Compass, Navigation, Radio, CheckCircle2 } from 'lucide-react';

/**
 * IncidentLocationCard Component
 * Displays resolved geospatial coordinates, road network, city, and confidence score.
 * 
 * Props:
 * - location: { GPS, nearestCity, roadName, confidence, coordinates }
 * - loading: boolean
 */
export default function IncidentLocationCard({ location, loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-3 bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-800 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const gps = location?.GPS || location?.coordinates ? `${location?.coordinates?.latitude}, ${location?.coordinates?.longitude}` : '37.774900, -122.419400';
  const nearestCity = location?.nearestCity || location?.['nearest city'] || 'San Francisco';
  const roadName = location?.roadName || location?.['road name'] || 'Primary Transit Corridor';
  const confidence = location?.confidence != null ? Math.round(Number(location.confidence) * 100) : 98;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Incident Location
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
          <span>GEOSPATIAL LOCKED</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 font-mono text-xs">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">GPS Coordinates</span>
          <span className="text-slate-100 font-semibold select-all font-mono text-[11px] break-all">
            {gps}
          </span>
        </div>

        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Nearest City</span>
          <span className="text-slate-200 font-medium">
            {nearestCity}
          </span>
        </div>

        <div className="sm:col-span-2">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Road Network & Segment</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Navigation className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="text-slate-100 font-semibold truncate text-[11px]">
              {roadName}
            </span>
          </div>
        </div>

        <div className="sm:col-span-2 flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px]">
          <span className="text-slate-400">Resolution Confidence</span>
          <div className="flex items-center gap-1 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>{confidence}% OFFLINE LOCK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
