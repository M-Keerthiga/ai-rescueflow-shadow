import { useState, useEffect, type FormEvent } from "react";
import { emergencyService, type CitizenReport } from "@/lib/emergencyService";
import { FileText, MapPin, Clock, User, RefreshCw, GitMerge, Shield, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface IncidentReportProps {
  onIncidentCreated: (report?: CitizenReport) => void;
}

export function IncidentReport({ onIncidentCreated }: IncidentReportProps) {
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    location: "",
    severity: "MODERATE",
    type: "COLLISION"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await emergencyService.getCitizenReports();
      setReports(data || []);
    } catch (error) {
      console.error("Failed to load reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const report = await emergencyService.createCitizenReport({
        description: formData.description,
        location: {
          lat: 13.0827 + (Math.random() - 0.5) * 0.01,
          lng: 80.2707 + (Math.random() - 0.5) * 0.01,
          address: formData.location || "Simulated Chennai Road Location"
        },
        severity: formData.severity,
        type: formData.type,
      });
      
      if (report) {
        setReports((current) => [report, ...current]);
        setShowForm(false);
        setFormData({
          description: "",
          location: "",
          severity: "MODERATE",
          type: "COLLISION"
        });
        onIncidentCreated(report);
      }
    } catch (error) {
      console.error("Failed to submit report:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string = "MODERATE") => {
    const colors: Record<string, string> = {
      LOW: "bg-emerald-500/20 text-emerald-400",
      MODERATE: "bg-yellow-500/20 text-yellow-400",
      HIGH: "bg-orange-500/20 text-orange-400",
      CRITICAL: "bg-red-500/20 text-red-400",
      CATASTROPHIC: "bg-purple-500/20 text-purple-400"
    };
    return colors[severity] || colors.MODERATE;
  };

  const getStatusColor = (status: string = "PENDING") => {
    const colors: Record<string, string> = {
      PENDING: "bg-yellow-500/20 text-yellow-400",
      VALIDATED: "bg-blue-500/20 text-blue-400",
      MERGED: "bg-emerald-500/20 text-emerald-400",
      CREATED_INCIDENT: "bg-purple-500/20 text-purple-400",
      REJECTED: "bg-red-500/20 text-red-400"
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">INCIDENT REPORTING</h2>
            <p className="text-sm text-slate-400 mt-1">Citizen reports and incident creation workflow</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadReports}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
            >
              {showForm ? "CANCEL" : "+ NEW REPORT"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <FileText className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Reports</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{reports.length}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <GitMerge className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Merged</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {reports.filter(r => r.status === "MERGED").length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Active</span>
            </div>
            <p className="text-2xl font-bold text-blue-400 mt-2">
              {reports.filter(r => r.status === "VALIDATED" || r.status === "PENDING").length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Incidents</span>
            </div>
            <p className="text-2xl font-bold text-purple-400 mt-2">
              {reports.filter(r => r.status === "CREATED_INCIDENT").length}
            </p>
          </div>
        </div>
      </div>

      {/* Report Form */}
      {showForm && (
        <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">SUBMIT CITIZEN REPORT</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                placeholder="Describe the incident..."
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                placeholder="Enter location or address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Severity</label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="LOW">LOW</option>
                  <option value="MODERATE">MODERATE</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="CATASTROPHIC">CATASTROPHIC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Incident Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-red-500"
                >
                  <option value="COLLISION">COLLISION</option>
                  <option value="FIRE">FIRE</option>
                  <option value="MEDICAL">MEDICAL</option>
                  <option value="HAZARD">HAZARD</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {submitting ? "SUBMITTING..." : "SUBMIT REPORT"}
              </button>
              <span className="text-xs text-slate-500">
                SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
              </span>
            </div>
          </form>
        </div>
      )}

      {/* Reports List */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
          <h3 className="text-sm font-semibold text-white">CITIZEN REPORTS</h3>
        </div>
        <div className="divide-y divide-slate-800">
          {reports.length === 0 && !loading ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No reports yet. Submit a citizen report to begin.</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.reportId} className="p-4 hover:bg-slate-800/30 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-white font-mono">{report.reportId}</span>
                      <span className={cn("px-2 py-1 rounded text-xs font-bold", getStatusColor(report.status))}>
                        {report.status?.replace("_", " ")}
                      </span>
                      <span className={cn("px-2 py-1 rounded text-xs font-bold", getSeverityColor(report.severity))}>
                        {report.severity}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-2">{report.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {report.location?.address || "Location pending"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(report.timestamp).toLocaleTimeString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {report.callerId}
                      </span>
                    </div>
                    {report.confidence && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Confidence:</span>
                          <div className="flex-1 max-w-xs h-2 rounded-full bg-slate-700">
                            <div
                              className="h-2 rounded-full bg-emerald-500"
                              style={{ width: `${report.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-emerald-400">{report.confidence}%</span>
                        </div>
                      </div>
                    )}
                    {report.mergedInto && (
                      <div className="mt-2 p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-xs text-emerald-400">
                          <GitMerge className="h-3 w-3 inline mr-1" />
                          Merged into incident: <span className="font-mono font-bold">{report.mergedInto}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}