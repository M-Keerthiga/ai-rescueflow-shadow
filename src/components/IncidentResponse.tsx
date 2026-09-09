import { useState, type FormEvent } from "react";
import { emergencyService, type CitizenReport } from "@/lib/emergencyService";
import { MapPin, Camera, AlertTriangle, Send, Loader2, CheckCircle2, Radio, Building2, Ambulance, Shield, Users, Clock3, Activity } from "lucide-react";

interface IncidentResponseProps {
  onIncidentCreated: () => void;
}

export function IncidentResponse({ onIncidentCreated }: IncidentResponseProps) {
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    severity: "MODERATE",
    source: "CITIZEN",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CitizenReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      const response = await emergencyService.createCitizenReport({
        location: formData.location,
        description: formData.description,
        severity: formData.severity,
        source: formData.source,
      });
      setResult(response);
      if (onIncidentCreated) {
        onIncidentCreated();
      }
    } catch (err) {
      setError("Unable to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">INCIDENT RESPONSE</h2>
        <p className="text-sm text-slate-400 mt-1">Report an incident or view active response operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Form */}
        <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">REPORT INCIDENT</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  placeholder="Enter location or coordinates"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 min-h-[100px]"
                placeholder="Describe the incident..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <option value="LOW">LOW</option>
                <option value="MODERATE">MODERATE</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="CATASTROPHIC">CATASTROPHIC</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Report Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              >
                <option value="CITIZEN">Citizen Report</option>
                <option value="POLICE">Police Report</option>
                <option value="AI">AI Detection</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Report
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-400">Report Submitted</span>
              </div>
              <p className="text-sm text-slate-300">Report ID: {result.reportId}</p>
              <p className="text-sm text-slate-300">Caller ID: {result.callerId}</p>
              <p className="text-sm text-slate-300">Confidence: {result.confidence}%</p>
              {result.mergedInto && (
                <p className="text-sm text-yellow-400 mt-2">
                  Merged with existing incident: {result.mergedInto}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Active Operations */}
        <div className="space-y-6">
          <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Radio className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-bold text-white">ACTIVE OPERATIONS</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Critical", value: "1", color: "text-red-400", icon: AlertTriangle },
                { label: "Ambulance", value: "2", color: "text-yellow-400", icon: Ambulance },
                { label: "Hospitals", value: "2", color: "text-emerald-400", icon: Building2 },
                { label: "Police", value: "3", color: "text-blue-400", icon: Shield },
              ].map((item) => (
                <div key={item.label} className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <p className={`mt-2 text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Camera className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">DISPATCH SUMMARY</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-slate-700 px-3 py-2">
                <span className="flex items-center gap-2"><Clock3 className="h-4 w-4 text-yellow-400" />Nearest ETA</span>
                <span className="font-semibold text-white">8 min</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-slate-700 px-3 py-2">
                <span className="flex items-center gap-2"><Building2 className="h-4 w-4 text-emerald-400" />Accepted Hospital</span>
                <span className="font-semibold text-white">City Trauma</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-slate-700 px-3 py-2">
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-pink-400" />Family Updates</span>
                <span className="font-semibold text-white">2 active</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-5 w-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">LIVE STATUS</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400" />AI camera monitoring active</p>
              <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-400" />Traffic corridor cleared</p>
              <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-yellow-400" />Ambulance route confirmed</p>
              <p className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pink-400" />Family notification in progress</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}