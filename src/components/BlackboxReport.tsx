import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, Activity, Shield, Hospital, Ambulance, Users } from "lucide-react";
import { Incident } from "@/lib/emergencyService";

interface BlackboxReportProps {
  incident: Incident | null;
}

export function BlackboxReport({ incident }: BlackboxReportProps) {
  if (!incident) {
    return (
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-12 text-center">
          <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Select an incident to view its Blackbox Report</p>
          <p className="text-sm text-slate-500 mt-2">Click on an incident in the Command Center</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Blackbox Report</h2>
          <p className="text-sm text-slate-400 mt-1">Complete incident analysis and response documentation</p>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
          SIMULATION MODE
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Overview */}
        <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-400" />
              Incident Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Incident ID</p>
                <p className="text-lg font-bold text-white">{incident.incidentId}</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Severity</p>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  {incident.severity}
                </Badge>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Confidence</p>
                <p className="text-lg font-bold text-white">{incident.confidence}%</p>
              </div>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Risk Score</p>
                <p className="text-lg font-bold text-white">{incident.riskScore}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-500 mb-2">Location</p>
              <p className="text-sm text-slate-300">{incident.location.address}</p>
              <p className="text-xs text-slate-500 mt-1">
                Coordinates: {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
              </p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-lg">
              <p className="text-xs text-slate-500 mb-2">Detection Sources</p>
              <div className="flex flex-wrap gap-2">
                {incident.sources.map((source, idx) => (
                  <Badge key={idx} variant="outline" className="bg-slate-800 text-slate-300 border-slate-700">
                    {source}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Source Count: {incident.sourceCount}</p>
              <p className="text-xs text-slate-500">Merge Status: {incident.mergeStatus}</p>
            </div>
          </CardContent>
        </Card>

        {/* Response Summary */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-400" />
              Response Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Hospital className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-slate-300">Hospital</span>
              </div>
              {incident.hospital ? (
                <>
                  <p className="text-sm text-white">{incident.hospital.hospitalName}</p>
                  <p className="text-xs text-slate-500">Trauma Level: {incident.hospital.traumaLevel}</p>
                  <p className="text-xs text-slate-500">Beds: {incident.hospital.availableBeds}</p>
                  <p className="text-xs text-slate-500">ICU: {incident.hospital.availableICUBeds}</p>
                  <Badge variant="outline" className="mt-2 bg-green-500/10 text-green-400 border-green-500/30">
                    {incident.hospital.acceptanceStatus}
                  </Badge>
                </>
              ) : (
                <p className="text-sm text-slate-500">Not assigned</p>
              )}
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Ambulance className="h-4 w-4 text-red-400" />
                <span className="text-sm text-slate-300">Ambulance</span>
              </div>
              {incident.ambulance ? (
                <>
                  <p className="text-sm text-white">{incident.ambulance.ambulanceId}</p>
                  <p className="text-xs text-slate-500">Crew: {incident.ambulance.crewMembers.join(", ")}</p>
                  <p className="text-xs text-amber-400">ETA: {incident.ambulance.etaMinutes} minutes</p>
                </>
              ) : (
                <p className="text-sm text-slate-500">Not assigned</p>
              )}
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-amber-400" />
                <span className="text-sm text-slate-300">Police Units</span>
              </div>
              {incident.police.length > 0 ? (
                <div className="space-y-1">
                  {incident.police.map((unit, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">{unit.unitType}</span>
                      <span className="text-xs text-slate-500">ETA: {unit.eta} min</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">Not assigned</p>
              )}
            </div>

            <div className="p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-slate-300">Family Notification</span>
              </div>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                {incident.familyNotification.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Coordination Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incident.timeline.map((event, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-red-500 mt-1"></div>
                  {idx < incident.timeline.length - 1 && (
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

      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <p className="text-sm text-amber-400 font-medium">
            SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
          </p>
          <p className="text-xs text-amber-500/70 mt-2">
            This blackbox report contains simulated data for demonstration purposes only. No real emergency services were contacted.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}