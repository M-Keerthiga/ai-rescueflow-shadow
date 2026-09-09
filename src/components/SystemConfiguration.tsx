import { useEffect, useState } from "react";
import { emergencyService, type Settings } from "@/lib/emergencyService";
import { Save, RefreshCw, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SystemConfiguration() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await emergencyService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    setSaved(false);
    try {
      await emergencyService.saveSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  if (!settings) {
    return (
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-12 text-center">
        <p className="text-slate-400">Loading settings...</p>
      </div>
    );
  }

  const toggleSettings: Array<{ key: keyof Settings; label: string; description: string }> = [
    { key: "hospitalCoordinationEnabled", label: "Hospital Coordination", description: "Enable hospital selection and coordination" },
    { key: "ambulanceSimulationEnabled", label: "Ambulance Simulation", description: "Enable ambulance dispatch simulation" },
    { key: "citizenReportsEnabled", label: "Citizen Reports", description: "Enable citizen incident reporting" },
    { key: "hospitalCapacitySimulationEnabled", label: "Hospital Capacity Simulation", description: "Simulate hospital bed and ICU availability" },
    { key: "policeUnitSimulationEnabled", label: "Police Unit Simulation", description: "Enable police unit assignment simulation" },
    { key: "etaSimulationEnabled", label: "ETA Simulation", description: "Generate simulated ETA calculations" },
    { key: "autoCoordinationEnabled", label: "Auto Coordination", description: "Automatically coordinate emergency response" },
  ];

  const scoringWeightKeys = Object.keys(settings.scoringWeights) as Array<keyof typeof settings.scoringWeights>;

  const renderSwitch = (key: keyof Settings, enabled: boolean) => (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={`Toggle ${key}`}
      onClick={() => updateSetting(key, !settings[key] as never)}
      className={cn(
        "relative inline-flex h-6 w-12 items-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:ring-offset-2 focus:ring-offset-slate-900",
        enabled ? "border-emerald-500 bg-emerald-500" : "border-slate-600 bg-slate-700"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
          enabled ? "translate-x-7" : "translate-x-1"
        )}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">SYSTEM CONFIGURATION</h2>
            <p className="text-sm text-slate-400 mt-1">Configure emergency response system parameters</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && (
              <span className="flex items-center gap-1 text-sm text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Toggle Settings */}
        <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">EMERGENCY RESPONSE</h3>
          </div>
          <div className="p-4 space-y-4">
            {toggleSettings.map((setting) => (
              <div key={setting.key} className="flex items-start justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                <div>
                  <p className="text-sm font-medium text-white">{setting.label}</p>
                  <p className="text-xs text-slate-400 mt-1">{setting.description}</p>
                </div>
                {renderSwitch(setting.key, Boolean(settings[setting.key]))}
              </div>
            ))}
          </div>
        </div>

        {/* Numeric Settings */}
        <div className="space-y-6">
          <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">COORDINATION PARAMETERS</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Incident Merge Threshold (meters)
                </label>
                <input
                  type="number"
                  value={settings.incidentMergeThreshold}
                  onChange={(e) => updateSetting("incidentMergeThreshold", parseInt(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Hospital Selection Strategy</label>
                <select
                  value={settings.hospitalSelectionStrategy}
                  onChange={(e) => updateSetting("hospitalSelectionStrategy", e.target.value)}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="COORDINATION_SCORE">Coordination Score</option>
                  <option value="DISTANCE">Distance Only</option>
                  <option value="TRAUMA_LEVEL">Trauma Level</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Demo Speed</label>
                <input
                  type="number"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.demoSpeed}
                  onChange={(e) => updateSetting("demoSpeed", Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>
          </div>

          {/* Scoring Weights */}
          <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
            <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white">HOSPITAL SCORING WEIGHTS</h3>
            </div>
            <div className="p-4 space-y-4">
              {scoringWeightKeys.map((key) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-300 mb-2 capitalize">
                    {key}
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={settings.scoringWeights[key]}
                    onChange={(e) => updateSetting("scoringWeights", {
                      ...settings.scoringWeights,
                      [key]: parseFloat(e.target.value)
                    })}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}