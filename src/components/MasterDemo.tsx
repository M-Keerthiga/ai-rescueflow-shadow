import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Eye, FileText, Activity } from "lucide-react";
import { emergencyService, Incident } from "@/lib/emergencyService";

interface MasterDemoProps {
  onIncidentCreated: () => void;
}

const demoSteps = [
  "AI Detects Collision",
  "Severity Classified",
  "GPS Obtained",
  "Incident Created",
  "Hospital Candidates Evaluated",
  "Best Hospital Selected",
  "Hospital Accepts",
  "Ambulance Assigned",
  "ETA Generated",
  "Police Unit Assigned",
  "Family Notification Simulated",
  "Citizen Report Simulated/Received",
  "Reports Merged",
  "Dashboard Updated",
  "Dispatch Timeline Updated",
  "Blackbox Generated",
  "Completion Summary",
];

export function MasterDemo({ onIncidentCreated }: MasterDemoProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [createdIncident, setCreatedIncident] = useState<Incident | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCreatedIncident(null);
    setShowTimeline(false);

    // Simulate the demo steps
    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Create the incident
    const incident = await emergencyService.createIncident({
      location: {
        lat: 13.0827,
        lng: 80.2707,
        address: "NH-45, Chennai - Tiruvallur High Road",
      },
      severity: "CRITICAL",
      riskScore: 92,
      confidence: 97,
      source: "AI Camera",
    });

    // Simulate citizen report
    await emergencyService.submitCitizenReport({
      location: { lat: 13.0827, lng: 80.2707 },
      description: "Witnessed multi-vehicle collision on NH-45",
    });

    // Simulate police report
    incident.sources.push("Police");
    incident.sourceCount = incident.sources.length;
    incident.confidence = 99;
    incident.mergeStatus = "MERGED";

    setCreatedIncident(incident);
    setIsRunning(false);
    onIncidentCreated();
  };

  const resetDemo = async () => {
    await emergencyService.resetDemo();
    setCurrentStep(-1);
    setCreatedIncident(null);
    setShowTimeline(false);
    onIncidentCreated();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Master Demo</h2>
          <p className="text-sm text-slate-400 mt-1">Automated emergency response simulation</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={runDemo}
            disabled={isRunning}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? "Running..." : "Start Demo"}
          </Button>
          <Button onClick={resetDemo} variant="outline" className="bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demo Steps */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-400" />
              Demo Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    index === currentStep
                      ? "bg-red-500/10 border border-red-500/30"
                      : index < currentStep
                      ? "bg-green-500/5 border border-green-500/20"
                      : "bg-slate-800/50 border border-slate-700"
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index < currentStep
                        ? "bg-green-500 text-white"
                        : index === currentStep
                        ? "bg-red-500 text-white"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-sm ${
                      index < currentStep
                        ? "text-green-400"
                        : index === currentStep
                        ? "text-red-400"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </span>
                  {index < currentStep && (
                    <Badge variant="outline" className="ml-auto bg-green-500/10 text-green-400 border-green-500/30 text-xs">
                      COMPLETE
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demo Results */}
        <div className="space-y-4">
          {createdIncident && (
            <>
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Demo Complete</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Incident ID</span>
                      <span className="text-lg font-bold text-white">{createdIncident.incidentId}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Severity</span>
                      <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                        {createdIncident.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Confidence</span>
                      <span className="text-sm text-white">{createdIncident.confidence}%</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Sources</span>
                      <div className="flex gap-1">
                        {createdIncident.sources.map((source, idx) => (
                          <Badge key={idx} variant="outline" className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Hospital</span>
                      <span className="text-sm text-white">{createdIncident.hospital?.hospitalName}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-400">Ambulance</span>
                      <span className="text-sm text-white">{createdIncident.ambulance?.ambulanceId}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Status</span>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                        {createdIncident.coordinationStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowTimeline(!showTimeline)}
                      variant="outline"
                      className="flex-1 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {showTimeline ? "Hide Timeline" : "View Timeline"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showTimeline && createdIncident.timeline && (
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-lg text-white">Dispatch Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {createdIncident.timeline.map((event, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="h-2 w-2 rounded-full bg-red-500 mt-1.5"></div>
                            {idx < createdIncident.timeline.length - 1 && (
                              <div className="w-px h-full bg-slate-700"></div>
                            )}
                          </div>
                          <div className="pb-4">
                            <p className="text-xs text-slate-500">{event.timestamp}</p>
                            <p className="text-sm text-slate-300">{event.event}</p>
                            {event.details && (
                              <p className="text-xs text-slate-500 mt-1">{event.details}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <Card className="bg-amber-500/10 border-amber-500/30">
            <CardContent className="p-4">
              <p className="text-sm text-amber-400 font-medium">
                SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
              </p>
              <p className="text-xs text-amber-500/70 mt-2">
                This demo simulates the complete emergency response workflow. No real emergency services are contacted.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}