import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Settings2 } from "lucide-react";
import { emergencyService, type Settings } from "@/lib/emergencyService";

const defaultSettings: Settings = {
  hospitalCoordinationEnabled: true,
  ambulanceSimulationEnabled: true,
  citizenReportsEnabled: true,
  hospitalCapacitySimulationEnabled: true,
  policeUnitSimulationEnabled: true,
  incidentMergeThreshold: 500,
  hospitalSelectionStrategy: "weighted",
  etaSimulationEnabled: true,
  autoCoordinationEnabled: true,
  demoSpeed: 1,
  scoringWeights: {
    distance: 0.25,
    beds: 0.2,
    icu: 0.2,
    trauma: 0.15,
    load: 0.1,
    ambulance: 0.1,
  },
};

export function EmergencySettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const data = await emergencyService.getSettings();
    setSettings({ ...defaultSettings, ...data, scoringWeights: { ...defaultSettings.scoringWeights, ...data.scoringWeights } });
  };

  const handleSave = async () => {
    await emergencyService.updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const renderSwitch = (key: keyof Settings, enabled: boolean) => (
    <button
      type="button"
      aria-pressed={enabled}
      aria-label={`Toggle ${key}`}
      onClick={() => updateSetting(key, !settings[key] as never)}
      className={`relative inline-flex h-6 w-12 items-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60 focus:ring-offset-2 focus:ring-offset-slate-900 ${
        enabled ? "border-emerald-500 bg-emerald-500" : "border-slate-600 bg-slate-700"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Emergency Settings</h2>
          <p className="text-sm text-slate-400 mt-1">Configure simulation and coordination parameters</p>
        </div>
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          {saved ? "Saved!" : "Save Settings"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-blue-400" />
              Coordination Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "hospitalCoordinationEnabled", label: "Hospital Coordination", description: "Enable hospital selection and acceptance" },
              { key: "ambulanceSimulationEnabled", label: "Ambulance Simulation", description: "Enable ambulance dispatch simulation" },
              { key: "citizenReportsEnabled", label: "Citizen Reports", description: "Enable citizen emergency reports" },
              { key: "hospitalCapacitySimulationEnabled", label: "Hospital Capacity Simulation", description: "Simulate hospital bed and ICU availability" },
              { key: "policeUnitSimulationEnabled", label: "Police Unit Simulation", description: "Enable police unit assignment simulation" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                {renderSwitch(item.key as keyof Settings, Boolean(settings[item.key as keyof Settings]))}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white">Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <label className="text-sm text-slate-300 block">Incident Merge Threshold (meters)</label>
              <input
                type="number"
                value={settings.incidentMergeThreshold}
                onChange={(e) => updateSetting("incidentMergeThreshold", Number(e.target.value))}
                className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
              />
              <p className="text-xs text-slate-500 mt-1">Maximum distance for merging duplicate reports</p>
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg">
              <label className="text-sm text-slate-300 block">Hospital Selection Strategy</label>
              <select
                value={settings.hospitalSelectionStrategy}
                onChange={(e) => updateSetting("hospitalSelectionStrategy", e.target.value)}
                className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
              >
                <option value="weighted">Weighted Score</option>
                <option value="distance">Nearest First</option>
                <option value="capability">Capability First</option>
              </select>
            </div>

            {[{ key: "etaSimulationEnabled", label: "ETA Simulation", description: "Enable simulated ETA calculations" }, { key: "autoCoordinationEnabled", label: "Auto Coordination", description: "Automatically coordinate all services" }].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                {renderSwitch(item.key as keyof Settings, Boolean(settings[item.key as keyof Settings]))}
              </div>
            ))}

            <div className="p-3 bg-slate-800/50 rounded-lg">
              <label className="text-sm text-slate-300 block">Demo Speed</label>
              <input
                type="number"
                min="0.5"
                max="2"
                step="0.1"
                value={settings.demoSpeed}
                onChange={(e) => updateSetting("demoSpeed", Number(e.target.value))}
                className="mt-2 w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-300"
              />
              <p className="text-xs text-slate-500 mt-1">Speed multiplier for demo animations</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <p className="text-sm text-amber-400 font-medium">SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED</p>
          <p className="text-xs text-amber-500/70 mt-2">All settings control simulated behavior only. No real emergency services are ever contacted.</p>
        </CardContent>
      </Card>
    </div>
  );
}