import React, { useEffect, useMemo, useState } from 'react';
import {
  Hospital,
  AlertTriangle,
  Ambulance,
  MapPin,
  Bed,
  CheckCircle2,
  Radio,
  FileText,
  Activity,
  Shield,
  HeartPulse,
  Users,
  Gauge,
  RefreshCw,
  Navigation,
  Wifi,
  Phone,
  Siren,
  Truck,
  Stethoscope,
  Droplets,
  Wind,
  Monitor,
  UserRound,
  Route,
  CircleDot,
  ChevronRight,
  Zap,
  Building2,
  X,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { SIMULATION_DISCLAIMER } from '../services/hospitalService.js';

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const safeText = (value, fallback = 'N/A') => {
  if (value === null || value === undefined) return fallback;

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  if (typeof value === 'object') {
    return (
      value.name ||
      value.label ||
      value.type ||
      value.description ||
      value.id ||
      fallback
    );
  }

  return fallback;
};

const getVehicleName = (vehicle, fallback) => {
  if (!vehicle) return fallback;

  if (typeof vehicle === 'string') return vehicle;

  return (
    vehicle.type ||
    vehicle.name ||
    vehicle.label ||
    vehicle.vehicleType ||
    fallback
  );
};

const clamp = (value, min = 0, max = 100) => {
  const number = Number(value);

  if (Number.isNaN(number)) return min;

  return Math.min(max, Math.max(min, number));
};

/* -------------------------------------------------------------------------- */
/* Demo hospital data                                                         */
/* -------------------------------------------------------------------------- */

const HOSPITAL_OPTIONS = [
  {
    id: 'HOSP-CTC-01',
    name: 'City Trauma Center',
    shortName: 'CTC',
    address: 'Kathipara Junction, Chennai',
    distanceKm: 2.4,
    traumaLevel: 'LEVEL 1',
    traumaLevelNumber: 1,
    capacity: 35,
    status: 'AVAILABLE',

    beds: {
      total: 30,
      available: 12,
      occupied: 18,
    },

    icu: {
      total: 8,
      available: 4,
      occupied: 4,
    },

    traumaBays: {
      total: 8,
      available: 6,
    },

    ventilators: {
      total: 12,
      available: 10,
    },

    operatingTheatres: {
      total: 4,
      available: 3,
    },

    bloodBank: {
      type: 'O−',
      units: 12,
    },

    ambulances: 3,

    phone: '+91 44 4000 1001',

    ambulancesList: [
      {
        id: 'AMB-12',
        status: 'READY',
        crewId: 'CREW-01',
        crew: [
          {
            name: 'Dr. Priya Sharma',
            role: 'Trauma Doctor',
          },
          {
            name: 'Ravi Kumar',
            role: 'Paramedic',
          },
        ],
        lat: '13.0910',
        lng: '80.2510',
        eta: 8,
        equipment: ['ALS', 'Trauma Kit', 'Ventilator'],
      },

      {
        id: 'AMB-07',
        status: 'READY',
        crewId: 'CREW-02',
        crew: [
          {
            name: 'Dr. Arun Patel',
            role: 'Emergency Doctor',
          },
          {
            name: 'Suresh',
            role: 'Paramedic',
          },
        ],
        lat: '13.0500',
        lng: '80.2450',
        eta: 12,
        equipment: ['ALS', 'Trauma Kit'],
      },

      {
        id: 'AMB-03',
        status: 'READY',
        crewId: 'CREW-03',
        crew: [
          {
            name: 'Dr. Meera Nair',
            role: 'Trauma Doctor',
          },
          {
            name: 'John',
            role: 'Paramedic',
          },
        ],
        lat: '13.0780',
        lng: '80.1800',
        eta: 15,
        equipment: ['ALS', 'Cardiac Monitor'],
      },
    ],
  },

  {
    id: 'HOSP-MGH-02',
    name: 'Metro General Hospital',
    shortName: 'MGH',
    address: 'OMR Tech Corridor, Sholinganallur',
    distanceKm: 4.8,
    traumaLevel: 'LEVEL 2',
    traumaLevelNumber: 2,
    capacity: 60,
    status: 'MODERATE',

    beds: {
      total: 20,
      available: 6,
      occupied: 14,
    },

    icu: {
      total: 6,
      available: 1,
      occupied: 5,
    },

    traumaBays: {
      total: 6,
      available: 3,
    },

    ventilators: {
      total: 8,
      available: 4,
    },

    operatingTheatres: {
      total: 3,
      available: 1,
    },

    bloodBank: {
      type: 'O−',
      units: 8,
    },

    ambulances: 2,

    phone: '+91 44 4000 1002',

    ambulancesList: [
      {
        id: 'AMB-21',
        status: 'READY',
        crewId: 'CREW-04',
        crew: [
          {
            name: 'Dr. Karthik',
            role: 'Emergency Doctor',
          },
          {
            name: 'Manoj',
            role: 'Paramedic',
          },
        ],
        lat: '12.9010',
        lng: '80.2270',
        eta: 12,
        equipment: ['ALS', 'Trauma Kit'],
      },

      {
        id: 'AMB-22',
        status: 'READY',
        crewId: 'CREW-05',
        crew: [
          {
            name: 'Dr. Anitha',
            role: 'Emergency Doctor',
          },
          {
            name: 'Vijay',
            role: 'Paramedic',
          },
        ],
        lat: '12.9150',
        lng: '80.2290',
        eta: 16,
        equipment: ['BLS', 'Trauma Kit'],
      },
    ],
  },

  {
    id: 'HOSP-NEH-03',
    name: 'National Emergency Hospital',
    shortName: 'NEH',
    address: 'Guindy Emergency Medical District, Chennai',
    distanceKm: 6.2,
    traumaLevel: 'LEVEL 1',
    traumaLevelNumber: 1,
    capacity: 85,
    status: 'CRITICAL',

    beds: {
      total: 14,
      available: 2,
      occupied: 12,
    },

    icu: {
      total: 4,
      available: 0,
      occupied: 4,
    },

    traumaBays: {
      total: 4,
      available: 1,
    },

    ventilators: {
      total: 6,
      available: 1,
    },

    operatingTheatres: {
      total: 2,
      available: 0,
    },

    bloodBank: {
      type: 'O−',
      units: 4,
    },

    ambulances: 1,

    phone: '+91 44 4000 1003',

    ambulancesList: [
      {
        id: 'AMB-31',
        status: 'READY',
        crewId: 'CREW-06',
        crew: [
          {
            name: 'Dr. Rahul',
            role: 'Trauma Doctor',
          },
          {
            name: 'Kiran',
            role: 'Paramedic',
          },
        ],
        lat: '13.0060',
        lng: '80.2200',
        eta: 20,
        equipment: ['ALS'],
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Status Badge                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const normalized = safeText(status, 'UNKNOWN').toUpperCase();

  const styles = {
    AVAILABLE:
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',

    READY:
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',

    ONLINE:
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',

    ACCEPTED:
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',

    ARRIVED:
      'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',

    MODERATE:
      'bg-amber-500/10 border-amber-500/30 text-amber-400',

    PENDING:
      'bg-amber-500/10 border-amber-500/30 text-amber-400',

    EN_ROUTE:
      'bg-amber-500/10 border-amber-500/30 text-amber-400',

    'EN ROUTE':
      'bg-amber-500/10 border-amber-500/30 text-amber-400',

    CRITICAL:
      'bg-red-500/10 border-red-500/30 text-red-400',

    UNAVAILABLE:
      'bg-red-500/10 border-red-500/30 text-red-400',

    ASSIGNED:
      'bg-blue-500/10 border-blue-500/30 text-blue-400',

    AMBULANCE_DISPATCHED:
      'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold tracking-wide ${
        styles[normalized] ||
        'bg-slate-500/10 border-slate-500/30 text-slate-400'
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {normalized.replaceAll('_', ' ')}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Capacity Card                                                              */
/* -------------------------------------------------------------------------- */

function CapacityCard({
  icon: Icon,
  label,
  value,
  supporting,
  status = 'AVAILABLE',
  progress,
}) {
  const safeProgress =
    progress !== undefined ? clamp(progress) : undefined;

  return (
    <div className="group bg-[#111a2b] border border-slate-800/90 rounded-2xl p-4 hover:border-slate-700 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/70 flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-300" />
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-4">
        <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
          {label}
        </p>

        <div className="mt-1 flex items-end gap-2">
          <span className="text-2xl font-bold text-slate-100">
            {safeText(value, '0')}
          </span>
        </div>

        <p className="mt-1 text-[10px] text-slate-500">
          {safeText(supporting)}
        </p>

        {safeProgress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  safeProgress >= 80
                    ? 'bg-red-500'
                    : safeProgress >= 60
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{
                  width: `${safeProgress}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Hospital Card                                                              */
/* -------------------------------------------------------------------------- */

function HospitalCard({
  hospital,
  selected,
  onSelect,
  disabled,
}) {
  const utilization =
    hospital.beds?.total > 0
      ? clamp(
          (hospital.beds.occupied /
            hospital.beds.total) *
            100
        )
      : clamp(hospital.capacity);

  return (
    <button
      type="button"
      onClick={() =>
        !disabled && onSelect(hospital)
      }
      disabled={disabled}
      className={`w-full text-left rounded-2xl border p-4 transition-all duration-200 ${
        selected
          ? 'border-cyan-400/70 bg-cyan-400/[0.07] shadow-lg shadow-cyan-950/20'
          : 'border-slate-800 bg-[#0e1727] hover:border-slate-700 hover:bg-[#111b2d]'
      } ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : 'cursor-pointer'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              selected
                ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Hospital className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {safeText(hospital.name)}
            </h3>

            <p className="mt-1 text-[10px] text-slate-500">
              {safeText(hospital.address)}
            </p>
          </div>
        </div>

        {selected ? (
          <span className="px-2 py-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[9px] font-bold">
            SELECTED
          </span>
        ) : (
          <StatusBadge status={hospital.status} />
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
          <p className="text-[9px] text-slate-500">
            TRAUMA
          </p>

          <p className="text-xs text-slate-200 font-bold mt-1">
            {safeText(hospital.traumaLevel)}
          </p>
        </div>

        <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
          <p className="text-[9px] text-slate-500">
            BEDS
          </p>

          <p className="text-xs text-emerald-400 font-bold mt-1">
            {safeText(
              hospital.beds?.available,
              '0'
            )}
          </p>
        </div>

        <div className="bg-slate-950/60 rounded-lg p-2 border border-slate-800">
          <p className="text-[9px] text-slate-500">
            ICU
          </p>

          <p className="text-xs text-indigo-300 font-bold mt-1">
            {safeText(
              hospital.icu?.available,
              '0'
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <MapPin className="w-3.5 h-3.5" />

          {safeText(hospital.distanceKm)} km away
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <Ambulance className="w-3.5 h-3.5" />

          {safeText(hospital.ambulances)} ambulances
        </div>
      </div>

      <div className="mt-3">
        <div className="flex justify-between text-[9px] mb-1">
          <span className="text-slate-500">
            CURRENT UTILIZATION
          </span>

          <span className="text-slate-300 font-bold">
            {Math.round(utilization)}%
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full rounded-full ${
              utilization >= 80
                ? 'bg-red-500'
                : utilization >= 60
                ? 'bg-amber-400'
                : 'bg-emerald-400'
            }`}
            style={{
              width: `${utilization}%`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800">
        <span className="text-[10px] text-slate-500">
          DISTANCE FROM INCIDENT
        </span>

        <span className="text-xs text-cyan-300 font-bold">
          {safeText(hospital.distanceKm)} km
        </span>
      </div>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Ambulance Card                                                             */
/* -------------------------------------------------------------------------- */

function AmbulanceCard({
  ambulance,
  selected,
  onSelect,
  dispatched,
}) {
  const status = dispatched
    ? 'EN_ROUTE'
    : safeText(ambulance.status, 'READY');

  return (
    <div
      className={`bg-[#0e1727] border rounded-2xl p-4 transition-all ${
        selected
          ? 'border-cyan-400/60 bg-cyan-500/[0.04]'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Ambulance className="w-5 h-5 text-amber-400" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-100">
              {safeText(ambulance.id)}
            </h3>

            <p className="text-[10px] text-slate-500 mt-0.5">
              {safeText(ambulance.crewId)}
            </p>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-4">
        <p className="text-[9px] uppercase text-slate-500 tracking-wider">
          Crew Members
        </p>

        <div className="flex flex-wrap gap-1.5 mt-2">
          {Array.isArray(ambulance.crew) &&
            ambulance.crew.map(
              (member, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 border border-slate-700 text-[9px] text-slate-300"
                >
                  <UserRound className="w-3 h-3" />

                  {safeText(
                    member?.name,
                    'Crew Member'
                  )}
                </span>
              )
            )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2">
          <p className="text-[9px] text-slate-500">
            LOCATION
          </p>

          <p className="text-[10px] text-slate-300 font-mono mt-1">
            {safeText(ambulance.lat)} ,{' '}
            {safeText(ambulance.lng)}
          </p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-2">
          <p className="text-[9px] text-slate-500">
            ETA
          </p>

          <p className="text-sm text-cyan-300 font-bold mt-0.5">
            {safeText(ambulance.eta, '—')} min
          </p>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-[9px] text-slate-500 uppercase">
          Equipment
        </p>

        <div className="flex flex-wrap gap-1 mt-2">
          {Array.isArray(ambulance.equipment) &&
            ambulance.equipment.map(
              (item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded bg-slate-800/70 border border-slate-700 text-[9px] text-slate-400"
                >
                  {safeText(item)}
                </span>
              )
            )}
        </div>
      </div>

      {!dispatched &&
        ambulance.status === 'READY' && (
          <button
            type="button"
            onClick={() =>
              onSelect(ambulance)
            }
            className={`w-full mt-4 py-2 rounded-lg text-[10px] font-bold transition-all ${
              selected
                ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
            }`}
          >
            {selected
              ? '✓ AMBULANCE SELECTED'
              : 'SELECT AMBULANCE'}
          </button>
        )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Dashboard                                                             */
/* -------------------------------------------------------------------------- */

export default function HospitalDashboard() {
  const navigate = useNavigate();

  const {
    activeIncident,
    assignedHospital,
    assignedAmbulance,
    ambulanceTracking,
    hospitalStatus,
    acceptHospitalEmergency,
  } = useApp();

  const [notificationDismissed, setNotificationDismissed] =
    useState(false);

  const [selectedHospitalId, setSelectedHospitalId] =
    useState(
      assignedHospital?.id ||
        assignedHospital?.hospitalId ||
        HOSPITAL_OPTIONS[0].id
    );

  const [selectedAmbulanceId, setSelectedAmbulanceId] =
    useState(
      assignedAmbulance?.ambulanceId ||
        assignedAmbulance?.id ||
        HOSPITAL_OPTIONS[0]
          .ambulancesList[0].id
    );

  const [refreshing, setRefreshing] =
    useState(false);

  /*
   * LOCAL DISPATCH STATE
   *
   * This is what makes ACCEPT & DISPATCH
   * work immediately inside this dashboard.
   */
  const [localDispatch, setLocalDispatch] =
    useState({
      accepted: false,
      hospital: null,
      ambulance: null,
      status: 'STANDBY',
      progress: 0,
      eta: null,
    });

  /* ------------------------------------------------------------------------ */
  /* Incident                                                                  */
  /* ------------------------------------------------------------------------ */

  const incident =
    activeIncident || {
      id: 'INC-CHN-2401',
      incidentId: 'INC-CHN-2401',

      timestamp:
        new Date().toISOString(),

      location:
        'Kathipara Junction, GST Road, Chennai',

      lat: 13.021,
      lng: 80.207,

      severityLevel: 'CRITICAL',

      severityScore: 92,

      impactSpeedKmH: 58,

      vehicleA: {
        type: 'HEAVY TRUCK #02',
        speed: 58,
      },

      vehicleB: {
        type: 'SEDAN #15',
        speed: 28,
      },

      severity: {
        description:
          'Critical collision detected. Automated trauma triage initiated and emergency medical response requested.',
      },
    };

  /* ------------------------------------------------------------------------ */
  /* Selected Hospital                                                        */
  /* ------------------------------------------------------------------------ */

  const selectedHospital = useMemo(() => {
    const contextHospitalId =
      assignedHospital?.id ||
      assignedHospital?.hospitalId;

    return (
      HOSPITAL_OPTIONS.find(
        (hospital) =>
          hospital.id ===
          selectedHospitalId
      ) ||
      HOSPITAL_OPTIONS.find(
        (hospital) =>
          hospital.id ===
          contextHospitalId
      ) ||
      HOSPITAL_OPTIONS[0]
    );
  }, [
    selectedHospitalId,
    assignedHospital,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Selected Ambulance                                                       */
  /* ------------------------------------------------------------------------ */

  const selectedAmbulance = useMemo(() => {
    const list =
      selectedHospital?.ambulancesList ||
      [];

    const contextAmbulanceId =
      assignedAmbulance?.ambulanceId ||
      assignedAmbulance?.id;

    return (
      list.find(
        (ambulance) =>
          ambulance.id ===
          selectedAmbulanceId
      ) ||
      list.find(
        (ambulance) =>
          ambulance.id ===
          contextAmbulanceId
      ) ||
      list[0] ||
      null
    );
  }, [
    selectedHospital,
    selectedAmbulanceId,
    assignedAmbulance,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Dispatch State                                                           */
  /* ------------------------------------------------------------------------ */

  const contextTrackingStatus =
    safeText(
      ambulanceTracking?.status,
      ''
    ).toUpperCase();

  const localTrackingStatus =
    safeText(
      localDispatch.status,
      ''
    ).toUpperCase();

  const isDispatched =
    localDispatch.accepted ||
    hospitalStatus ===
      'AMBULANCE_DISPATCHED' ||
    hospitalStatus ===
      'ARRIVED_AT_SCENE' ||
    contextTrackingStatus === 'EN_ROUTE' ||
    contextTrackingStatus ===
      'ARRIVED_AT_SCENE';

  const trackingStatus =
    localDispatch.accepted
      ? localTrackingStatus
      : contextTrackingStatus;

  const progress = localDispatch.accepted
    ? clamp(localDispatch.progress)
    : clamp(
        ambulanceTracking?.progressPercent ||
          0
      );

  const ambulanceDisplayId =
    localDispatch.ambulance?.id ||
    safeText(
      assignedAmbulance?.ambulanceId ||
        assignedAmbulance?.id,
      ''
    ) ||
    safeText(
      selectedAmbulance?.id,
      'AMB-12'
    );

  const eta =
    localDispatch.accepted
      ? localDispatch.eta
      : ambulanceTracking?.etaMinutes ||
        selectedAmbulance?.eta ||
        8;

  /* ------------------------------------------------------------------------ */
  /* LOCAL LIVE DISPATCH SIMULATION                                           */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!localDispatch.accepted) {
      return undefined;
    }

    if (
      localDispatch.status !==
      'EN_ROUTE'
    ) {
      return undefined;
    }

    const timer = setInterval(() => {
      setLocalDispatch((previous) => {
        const nextProgress = Math.min(
          previous.progress + 5,
          100
        );

        const nextEta = Math.max(
          Number(previous.eta || 0) - 1,
          0
        );

        if (nextProgress >= 100) {
          return {
            ...previous,
            progress: 100,
            eta: 0,
            status: 'ARRIVED_AT_SCENE',
          };
        }

        return {
          ...previous,
          progress: nextProgress,
          eta: nextEta,
          status: 'EN_ROUTE',
        };
      });
    }, 2000);

    return () =>
      clearInterval(timer);
  }, [
    localDispatch.accepted,
    localDispatch.status,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Sync local arrival status                                                */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      localDispatch.status ===
      'ARRIVED_AT_SCENE'
    ) {
      console.log(
        '🚑 Ambulance arrived at incident scene'
      );
    }
  }, [localDispatch.status]);

  /* ------------------------------------------------------------------------ */
  /* Handlers                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleHospitalSelect = (
    hospital
  ) => {
    if (!hospital) return;

    if (isDispatched) {
      return;
    }

    if (
      hospital.status === 'CRITICAL'
    ) {
      return;
    }

    setSelectedHospitalId(
      hospital.id
    );

    const firstReadyAmbulance =
      hospital.ambulancesList?.find(
        (ambulance) =>
          ambulance.status ===
          'READY'
      );

    if (firstReadyAmbulance) {
      setSelectedAmbulanceId(
        firstReadyAmbulance.id
      );
    }
  };

  const handleAmbulanceSelect = (
    ambulance
  ) => {
    if (!ambulance) return;

    if (isDispatched) return;

    if (
      ambulance.status !== 'READY'
    ) {
      return;
    }

    setSelectedAmbulanceId(
      ambulance.id
    );
  };

  /* ------------------------------------------------------------------------ */
  /* ACCEPT & DISPATCH                                                        */
  /* ------------------------------------------------------------------------ */

  const handleAcceptDispatch = () => {
    console.log(
      '🚨 ACCEPT & DISPATCH BUTTON CLICKED'
    );

    if (isDispatched) {
      console.log(
        'Dispatch already accepted.'
      );

      return;
    }

    if (!selectedHospital) {
      alert(
        'Please select a destination hospital.'
      );

      return;
    }

    if (!selectedAmbulance) {
      alert(
        'Please select an ambulance.'
      );

      return;
    }

    if (
      selectedAmbulance.status !==
      'READY'
    ) {
      alert(
        'Selected ambulance is not ready.'
      );

      return;
    }

    /*
     * STEP 1
     * Immediately update local dashboard.
     */
    setLocalDispatch({
      accepted: true,

      hospital:
        selectedHospital,

      ambulance:
        selectedAmbulance,

      status: 'EN_ROUTE',

      progress: 5,

      eta:
        Number(
          selectedAmbulance.eta
        ) || 8,
    });

    /*
     * STEP 2
     * Also update AppContext if the
     * function exists.
     */
    if (
      typeof acceptHospitalEmergency ===
      'function'
    ) {
      try {
        acceptHospitalEmergency({
          hospital:
            selectedHospital,

          ambulance:
            selectedAmbulance,

          incident,
        });
      } catch (error) {
        console.error(
          'AppContext dispatch update failed:',
          error
        );
      }
    }

    /*
     * STEP 3
     * Useful console event for testing.
     */
    console.log(
      '🏥 Hospital:',
      selectedHospital.name
    );

    console.log(
      '🚑 Ambulance:',
      selectedAmbulance.id
    );

    console.log(
      '📍 Incident:',
      incidentId
    );

    console.log(
      '✅ Emergency dispatch accepted successfully'
    );
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  /* ------------------------------------------------------------------------ */
  /* Derived Values                                                           */
  /* ------------------------------------------------------------------------ */

  const bedAvailability = clamp(
    ((selectedHospital.beds
      ?.available || 0) /
      Math.max(
        selectedHospital.beds
          ?.total || 1,
        1
      )) *
      100
  );

  const icuAvailability = clamp(
    ((selectedHospital.icu
      ?.available || 0) /
      Math.max(
        selectedHospital.icu
          ?.total || 1,
        1
      )) *
      100
  );

  const incidentId = safeText(
    incident.id ||
      incident.incidentId,
    'INC-CHN-2401'
  );

  const accidentLocation =
    safeText(
      incident.location ||
        incident.telemetry?.location,
      'Emergency Incident Location'
    );

  const severityScore = clamp(
    incident.severityScore || 92
  );

  const severityDescription =
    typeof incident.severity ===
    'object'
      ? safeText(
          incident.severity?.description,
          'Critical collision detected. Emergency trauma response initiated.'
        )
      : safeText(
          incident.severity,
          'Critical collision detected. Emergency trauma response initiated.'
        );

  const impactSpeed = safeText(
    incident.impactSpeedKmH,
    '58'
  );

  const vehicleA = getVehicleName(
    incident.vehicleA,
    'Vehicle A'
  );

  const vehicleB = getVehicleName(
    incident.vehicleB,
    'Vehicle B'
  );

  const dispatcher = {
    id: 'DISP-001',
    name: 'Emergency Control Operator',
    status: 'ONLINE',
    radio: 'CH-09',
    team: 'Metropolitan Emergency Response',
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-[#080f1d] text-slate-100 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-5 space-y-5">

        {/* ---------------------------------------------------------------- */}
        {/* Simulation Banner                                                 */}
        {/* ---------------------------------------------------------------- */}

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />

            <span className="text-[10px] uppercase tracking-wider font-bold text-amber-300">
              {safeText(
                SIMULATION_DISCLAIMER,
                'Simulation Environment'
              )}
            </span>
          </div>

          <span className="text-[9px] text-amber-400/80 border border-amber-500/20 bg-amber-500/10 rounded-md px-2 py-1">
            HOSPITAL TRAUMA OPERATIONS
          </span>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Header                                                            */}
        {/* ---------------------------------------------------------------- */}

        <header className="rounded-2xl border border-slate-800 bg-[#0c1525] overflow-hidden">
          <div className="px-5 py-4 flex flex-wrap items-center justify-between gap-4">

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Hospital className="w-6 h-6 text-emerald-400" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] text-emerald-400 font-bold tracking-[0.18em]">
                    MEDICAL EMERGENCY NETWORK
                  </span>

                  <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-0.5">
                  HOSPITAL EMERGENCY CONTROL CENTER
                </h1>

                <p className="text-[10px] text-slate-500 mt-1">
                  {safeText(
                    selectedHospital.name
                  )}{' '}
                  •{' '}
                  {safeText(
                    selectedHospital.address
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05]">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />

                <span className="text-[9px] text-emerald-300 font-bold">
                  SYSTEM ONLINE
                </span>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="p-2.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 border border-slate-700 transition-all"
              >
                <RefreshCw
                  className={`w-4 h-4 text-slate-300 ${
                    refreshing
                      ? 'animate-spin'
                      : ''
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/police-dashboard'
                  )
                }
                className="px-3 py-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-[10px] font-bold flex items-center gap-2"
              >
                <Shield className="w-3.5 h-3.5" />

                POLICE DASHBOARD
              </button>
            </div>
          </div>

          <div className="border-t border-slate-800 px-5 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px]">

            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              POLICE LINK ACTIVE
            </span>

            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" />
              AMBULANCE NETWORK CONNECTED
            </span>

            <span className="flex items-center gap-1.5 text-cyan-400">
              <Activity className="w-3 h-3" />
              HOSPITAL STATUS SYNCED
            </span>

            <span className="text-slate-600">
              LAST SYNC: JUST NOW
            </span>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Emergency Request                                                */}
        {/* ---------------------------------------------------------------- */}

        <section className="rounded-2xl border border-red-500/30 bg-red-500/[0.045] overflow-hidden">

          <div className="px-5 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                <Siren className="w-5 h-5 text-red-400 animate-pulse" />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-[10px] text-red-400 font-bold tracking-wider">
                    CRITICAL EMERGENCY REQUEST
                  </span>

                  <span className="px-2 py-0.5 rounded-md bg-red-500/10 border border-red-500/20 text-[9px] text-red-300 font-bold">
                    {incidentId}
                  </span>
                </div>

                <h2 className="text-sm sm:text-base font-bold text-white mt-1">
                  Trauma response required at{' '}
                  {accidentLocation}
                </h2>

                <div className="flex flex-wrap items-center gap-4 mt-2 text-[9px] text-slate-400">

                  <span>
                    RISK{' '}
                    <strong className="text-red-400">
                      {severityScore}%
                    </strong>
                  </span>

                  <span>
                    IMPACT{' '}
                    <strong className="text-slate-200">
                      {impactSpeed} km/h
                    </strong>
                  </span>

                  <span>
                    VEHICLES{' '}
                    <strong className="text-slate-200">
                      {vehicleA} × {vehicleB}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* ------------------------------------------------------------ */}
            {/* ACCEPT DISPATCH BUTTON                                       */}
            {/* ------------------------------------------------------------ */}

            <div className="flex items-center gap-2 shrink-0">

              {!isDispatched ? (
                <button
                  type="button"
                  onClick={
                    handleAcceptDispatch
                  }
                  disabled={
                    !selectedHospital ||
                    !selectedAmbulance
                  }
                  className="group px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-slate-950 font-black text-[10px] tracking-wide shadow-lg shadow-emerald-950/30 transition-all flex items-center gap-2"
                >
                  <Ambulance className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />

                  ACCEPT & DISPATCH

                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ) : (
                <div className="px-5 py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/20">

                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />

                  DISPATCH ACCEPTED

                  <span className="text-emerald-500/60">
                    •
                  </span>

                  {ambulanceDisplayId}
                </div>
              )}

              {!notificationDismissed && (
                <button
                  type="button"
                  onClick={() =>
                    setNotificationDismissed(
                      true
                    )
                  }
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Workflow */}

          <div className="border-t border-red-500/10 px-5 py-3 overflow-x-auto">

            <div className="min-w-[650px] flex items-center justify-between">

              {[
                ['REQUEST', true],

                [
                  'ACCEPTED',
                  isDispatched,
                ],

                [
                  'DISPATCHED',
                  isDispatched,
                ],

                [
                  'EN ROUTE',
                  trackingStatus ===
                    'EN_ROUTE' ||
                    progress > 0,
                ],

                [
                  'ARRIVED',
                  trackingStatus ===
                    'ARRIVED_AT_SCENE',
                ],
              ].map(
                ([label, active], index) => (
                  <React.Fragment
                    key={label}
                  >
                    <div
                      className={`flex items-center gap-2 text-[9px] font-bold ${
                        active
                          ? 'text-emerald-400'
                          : 'text-slate-600'
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          active
                            ? 'border-emerald-400 bg-emerald-500/10'
                            : 'border-slate-700 bg-slate-900'
                        }`}
                      >
                        {active ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          index + 1
                        )}
                      </span>

                      {label}
                    </div>

                    {index < 4 && (
                      <div
                        className={`h-px flex-1 mx-3 ${
                          active
                            ? 'bg-emerald-500/40'
                            : 'bg-slate-800'
                        }`}
                      />
                    )}
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Hospital Capacity                                                */}
        {/* ---------------------------------------------------------------- */}

        <section>

          <div className="flex items-end justify-between mb-3">

            <div>
              <p className="text-[9px] text-emerald-400 font-bold tracking-[0.18em]">
                RESOURCE MONITORING
              </p>

              <h2 className="text-lg font-bold text-white mt-1">
                Hospital Capacity
              </h2>
            </div>

            <span className="text-[9px] text-slate-500">
              {safeText(
                selectedHospital.name
              )}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">

            <CapacityCard
              icon={Bed}
              label="Emergency Beds"
              value={
                selectedHospital.beds
                  ?.available
              }
              supporting={`${selectedHospital.beds?.occupied || 0} occupied / ${selectedHospital.beds?.total || 0} total`}
              status={
                bedAvailability >= 50
                  ? 'AVAILABLE'
                  : bedAvailability >= 20
                  ? 'MODERATE'
                  : 'CRITICAL'
              }
              progress={
                100 - bedAvailability
              }
            />

            <CapacityCard
              icon={HeartPulse}
              label="ICU Beds"
              value={
                selectedHospital.icu
                  ?.available
              }
              supporting={`${selectedHospital.icu?.occupied || 0} occupied / ${selectedHospital.icu?.total || 0} total`}
              status={
                selectedHospital.icu
                  ?.available > 0
                  ? 'AVAILABLE'
                  : 'CRITICAL'
              }
              progress={
                100 - icuAvailability
              }
            />

            <CapacityCard
              icon={Building2}
              label="Trauma Bays"
              value={
                selectedHospital
                  .traumaBays
                  ?.available
              }
              supporting={`${selectedHospital.traumaBays?.total || 0} total trauma bays`}
              status={
                selectedHospital
                  .traumaBays
                  ?.available > 0
                  ? 'READY'
                  : 'CRITICAL'
              }
            />

            <CapacityCard
              icon={Wind}
              label="Ventilators"
              value={
                selectedHospital
                  .ventilators
                  ?.available
              }
              supporting={`${selectedHospital.ventilators?.total || 0} total units`}
              status={
                selectedHospital
                  .ventilators
                  ?.available > 0
                  ? 'READY'
                  : 'CRITICAL'
              }
            />

            <CapacityCard
              icon={Activity}
              label="Operating Theatres"
              value={
                selectedHospital
                  .operatingTheatres
                  ?.available
              }
              supporting={`${selectedHospital.operatingTheatres?.total || 0} total theatres`}
              status={
                selectedHospital
                  .operatingTheatres
                  ?.available > 0
                  ? 'AVAILABLE'
                  : 'CRITICAL'
              }
            />

            <CapacityCard
              icon={Droplets}
              label="Blood Bank"
              value={
                selectedHospital
                  .bloodBank?.units
              }
              supporting={`${safeText(selectedHospital.bloodBank?.type)} compatible reserve`}
              status={
                selectedHospital
                  .bloodBank?.units > 0
                  ? 'READY'
                  : 'CRITICAL'
              }
            />
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Hospital Selection                                               */}
        {/* ---------------------------------------------------------------- */}

        <section className="rounded-2xl border border-slate-800 bg-[#0c1525] p-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">

            <div>
              <div className="flex items-center gap-2">

                <Building2 className="w-4 h-4 text-cyan-400" />

                <span className="text-[9px] text-cyan-400 font-bold tracking-[0.16em]">
                  DESTINATION MANAGEMENT
                </span>
              </div>

              <h2 className="text-lg font-bold text-white mt-1">
                Select Destination Hospital
              </h2>

              <p className="text-[10px] text-slate-500 mt-1">
                Choose the most suitable trauma
                facility based on capacity and
                emergency readiness.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 border border-slate-800">

              <Gauge className="w-3.5 h-3.5 text-cyan-400" />

              <span className="text-[9px] text-slate-400">
                SELECTED:
              </span>

              <span className="text-[9px] text-cyan-300 font-bold">
                {safeText(
                  selectedHospital.name
                )}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">

            {HOSPITAL_OPTIONS.map(
              (hospital) => (
                <HospitalCard
                  key={hospital.id}
                  hospital={hospital}
                  selected={
                    hospital.id ===
                    selectedHospital.id
                  }
                  disabled={
                    hospital.status ===
                      'CRITICAL' ||
                    isDispatched
                  }
                  onSelect={
                    handleHospitalSelect
                  }
                />
              )
            )}
          </div>

          <div className="mt-4 p-3 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <CheckCircle2 className="w-4 h-4 text-cyan-400" />

              <div>

                <p className="text-[10px] text-slate-200 font-bold">
                  Destination selected
                </p>

                <p className="text-[9px] text-slate-500 mt-0.5">
                  {safeText(
                    selectedHospital.name
                  )}{' '}
                  •{' '}
                  {safeText(
                    selectedHospital.traumaLevel
                  )}{' '}
                  •{' '}
                  {safeText(
                    selectedHospital.beds
                      ?.available
                  )}{' '}
                  beds available
                </p>
              </div>
            </div>

            <span className="text-[9px] text-emerald-400 font-bold">
              ✓ READY FOR EMERGENCY INTAKE
            </span>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Ambulance + Dispatcher                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

          {/* Ambulance */}

          <section className="xl:col-span-8 rounded-2xl border border-slate-800 bg-[#0c1525] p-5">

            <div className="flex items-center justify-between mb-4">

              <div>
                <div className="flex items-center gap-2">

                  <Ambulance className="w-4 h-4 text-amber-400" />

                  <span className="text-[9px] text-amber-400 font-bold tracking-[0.16em]">
                    FLEET MANAGEMENT
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mt-1">
                  Ambulance Dispatch
                </h2>
              </div>

              <span className="text-[9px] text-slate-500">
                {safeText(
                  selectedHospital
                    .ambulancesList
                    ?.length,
                  '0'
                )}{' '}
                UNITS
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">

              {[
                [
                  'TOTAL',
                  selectedHospital
                    .ambulancesList
                    ?.length || 0,
                  'text-slate-200',
                ],

                [
                  'READY',
                  isDispatched
                    ? Math.max(
                        (selectedHospital
                          .ambulancesList
                          ?.filter(
                            (a) =>
                              a.status ===
                              'READY'
                          ).length ||
                          0) - 1,
                        0
                      )
                    : selectedHospital
                        .ambulancesList
                        ?.filter(
                          (a) =>
                            a.status ===
                            'READY'
                        ).length || 0,
                  'text-emerald-400',
                ],

                [
                  'EN ROUTE',
                  isDispatched ? 1 : 0,
                  'text-amber-400',
                ],

                [
                  'ASSIGNED',
                  isDispatched ? 1 : 0,
                  'text-cyan-400',
                ],
              ].map(
                ([label, value, color]) => (
                  <div
                    key={label}
                    className="bg-slate-950/60 border border-slate-800 rounded-xl p-3"
                  >
                    <p className="text-[8px] text-slate-500 font-bold">
                      {label}
                    </p>

                    <p
                      className={`text-xl font-bold mt-1 ${color}`}
                    >
                      {value}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

              {(
                selectedHospital
                  .ambulancesList ||
                []
              ).map(
                (ambulance) => (
                  <AmbulanceCard
                    key={ambulance.id}
                    ambulance={
                      ambulance
                    }
                    selected={
                      ambulance.id ===
                      selectedAmbulance?.id
                    }
                    onSelect={
                      handleAmbulanceSelect
                    }
                    dispatched={
                      isDispatched &&
                      ambulance.id ===
                        ambulanceDisplayId
                    }
                  />
                )
              )}
            </div>
          </section>

          {/* Dispatcher */}

          <section className="xl:col-span-4 rounded-2xl border border-slate-800 bg-[#0c1525] p-5">

            <div className="flex items-center gap-2 mb-4">

              <Radio className="w-4 h-4 text-indigo-400" />

              <div>

                <span className="text-[9px] text-indigo-400 font-bold tracking-[0.16em]">
                  CONTROL ROOM
                </span>

                <h2 className="text-lg font-bold text-white mt-1">
                  Dispatch Coordination
                </h2>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/60 border border-slate-800 p-4">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">

                    <Monitor className="w-5 h-5 text-indigo-300" />

                  </div>

                  <div>

                    <p className="text-xs font-bold text-slate-200">
                      {dispatcher.name}
                    </p>

                    <p className="text-[9px] text-slate-500 mt-0.5">
                      {dispatcher.id}
                    </p>
                  </div>
                </div>

                <StatusBadge
                  status={
                    dispatcher.status
                  }
                />
              </div>

              <div className="space-y-2 mt-5">

                <div className="flex items-center justify-between py-2 border-b border-slate-800">

                  <span className="text-[9px] text-slate-500">
                    RADIO CHANNEL
                  </span>

                  <span className="text-[10px] text-cyan-300 font-bold">
                    {dispatcher.radio}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">

                  <span className="text-[9px] text-slate-500">
                    RESPONSE TEAM
                  </span>

                  <span className="text-[9px] text-slate-300 font-semibold text-right max-w-[170px]">
                    {dispatcher.team}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">

                  <span className="text-[9px] text-slate-500">
                    DISPATCH STATUS
                  </span>

                  <span className="text-[9px] text-emerald-400 font-bold">
                    {isDispatched
                      ? trackingStatus ===
                        'ARRIVED_AT_SCENE'
                        ? 'ARRIVED AT SCENE'
                        : 'AMBULANCE DISPATCHED'
                      : 'AWAITING ACCEPTANCE'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2">

              {[
                [
                  'POLICE',
                  'HOSPITAL',
                  'CONNECTED',
                ],

                [
                  'HOSPITAL',
                  'AMBULANCE',
                  isDispatched
                    ? 'ACTIVE'
                    : 'STANDBY',
                ],

                [
                  'AMBULANCE',
                  'HOSPITAL',
                  isDispatched
                    ? 'ACTIVE'
                    : 'STANDBY',
                ],
              ].map(
                ([from, to, status]) => (
                  <div
                    key={`${from}-${to}`}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-950/50 border border-slate-800"
                  >
                    <span className="text-[8px] text-slate-400 w-16">
                      {from}
                    </span>

                    <ChevronRight className="w-3 h-3 text-slate-600" />

                    <span className="text-[8px] text-slate-300 flex-1">
                      {to}
                    </span>

                    <span className="text-[8px] text-emerald-400 font-bold">
                      ● {status}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">

              <a
                href={`tel:${safeText(
                  selectedHospital.phone,
                  ''
                )}`}
                className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[9px] text-slate-300 font-bold flex items-center justify-center gap-2"
              >
                <Phone className="w-3 h-3" />
                CALL HOSPITAL
              </a>

              <button
                type="button"
                className="py-2.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-[9px] text-indigo-300 font-bold flex items-center justify-center gap-2"
              >
                <Radio className="w-3 h-3" />
                RADIO LINK
              </button>
            </div>
          </section>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Live Tracking                                                    */}
        {/* ---------------------------------------------------------------- */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          <section className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#0c1525] p-5">

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">

              <div className="flex items-center gap-2">

                <Navigation className="w-4 h-4 text-cyan-400" />

                <div>

                  <span className="text-[9px] text-cyan-400 font-bold tracking-[0.16em]">
                    REAL-TIME TELEMETRY
                  </span>

                  <h2 className="text-base font-bold text-white mt-0.5">
                    Live Ambulance Tracking
                  </h2>
                </div>
              </div>

              <span
                className={`px-2 py-1 rounded-md text-[9px] font-bold border ${
                  isDispatched
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                }`}
              >
                ●{' '}
                {isDispatched
                  ? 'LIVE'
                  : 'STANDBY'}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-slate-800 bg-[#080f1d] p-5">

              <div className="relative h-32">

                <svg
                  viewBox="0 0 700 130"
                  className="w-full h-full"
                >

                  <defs>

                    <pattern
                      id="hospitalGrid"
                      width="24"
                      height="24"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 24 0 L 0 0 0 24"
                        fill="none"
                        stroke="#172236"
                        strokeWidth="0.7"
                      />
                    </pattern>

                  </defs>

                  <rect
                    width="700"
                    height="130"
                    fill="url(#hospitalGrid)"
                  />

                  <path
                    d="M 70 70 Q 180 20 300 70 T 630 65"
                    fill="none"
                    stroke="#26364f"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 70 70 Q 180 20 300 70 T 630 65"
                    fill="none"
                    stroke="#22d3ee"
                    strokeWidth="3"
                    strokeDasharray="7 6"
                    strokeLinecap="round"
                    opacity="0.8"
                  />

                  <circle
                    cx="70"
                    cy="70"
                    r="9"
                    fill="#10b981"
                  />

                  <circle
                    cx="630"
                    cy="65"
                    r="10"
                    fill="#ef4444"
                  />

                  {isDispatched && (
                    <g
                      transform={`translate(${
                        70 +
                        (630 - 70) *
                          (progress /
                            100)
                      }, ${
                        70 +
                        Math.sin(
                          (progress /
                            100) *
                            Math.PI *
                            2
                        ) *
                          20
                      })`}
                    >

                      <circle
                        r="14"
                        fill="#22d3ee"
                        opacity="0.2"
                        className="animate-ping"
                      />

                      <circle
                        r="7"
                        fill="#22d3ee"
                        stroke="#fff"
                        strokeWidth="2"
                      />
                    </g>
                  )}

                  <text
                    x="35"
                    y="105"
                    fill="#10b981"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    HOSPITAL
                  </text>

                  <text
                    x="565"
                    y="103"
                    fill="#ef4444"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    INCIDENT
                  </text>
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">

                {[
                  [
                    'AMBULANCE',
                    ambulanceDisplayId,
                    'text-slate-200',
                  ],

                  [
                    'STATUS',
                    isDispatched
                      ? trackingStatus ===
                        'ARRIVED_AT_SCENE'
                        ? 'ARRIVED'
                        : 'EN ROUTE'
                      : 'STANDBY',
                    trackingStatus ===
                      'ARRIVED_AT_SCENE'
                      ? 'text-emerald-400'
                      : 'text-amber-400',
                  ],

                  [
                    'ETA',
                    `${safeText(
                      eta
                    )} min`,
                    'text-amber-400',
                  ],

                  [
                    'PROGRESS',
                    `${progress}%`,
                    'text-cyan-300',
                  ],
                ].map(
                  ([label, value, color]) => (
                    <div
                      key={label}
                      className="bg-slate-900 border border-slate-800 rounded-lg p-2.5"
                    >
                      <p className="text-[8px] text-slate-500">
                        {label}
                      </p>

                      <p
                        className={`text-xs font-bold mt-1 ${color}`}
                      >
                        {value}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="mt-4">

              <div className="flex items-center gap-2 mb-2">

                <Route className="w-3.5 h-3.5 text-slate-400" />

                <span className="text-[9px] text-slate-400 font-bold tracking-wider">
                  TRANSIT MILESTONES
                </span>
              </div>

              <div className="space-y-1.5">

                {[
                  ['HOSPITAL BASE', 0],
                  ['DISPATCHED', 15],
                  ['EN ROUTE', 40],
                  ['ACCIDENT SCENE', 100],
                ].map(
                  ([label, target]) => {

                    const reached =
                      progress >=
                        target &&
                      isDispatched;

                    return (
                      <div
                        key={label}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                          reached
                            ? 'bg-emerald-500/[0.05] border-emerald-500/20'
                            : 'bg-slate-950/40 border-slate-800'
                        }`}
                      >

                        <div className="flex items-center gap-2">

                          {reached ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <CircleDot className="w-3.5 h-3.5 text-slate-600" />
                          )}

                          <span
                            className={`text-[9px] font-bold ${
                              reached
                                ? 'text-slate-200'
                                : 'text-slate-600'
                            }`}
                          >
                            {label}
                          </span>
                        </div>

                        <span className="text-[8px] text-slate-600">
                          {target}%
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </section>

          {/* Incident Intelligence */}

          <section className="lg:col-span-5 rounded-2xl border border-slate-800 bg-[#0c1525] p-5">

            <div className="flex items-center justify-between border-b border-slate-800 pb-3">

              <div className="flex items-center gap-2">

                <FileText className="w-4 h-4 text-cyan-400" />

                <div>

                  <span className="text-[9px] text-cyan-400 font-bold tracking-[0.16em]">
                    AI INCIDENT INTELLIGENCE
                  </span>

                  <h2 className="text-base font-bold text-white mt-0.5">
                    Incident Details
                  </h2>
                </div>
              </div>

              <StatusBadge
                status={safeText(
                  incident.severityLevel,
                  'CRITICAL'
                )}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">

              {[
                [
                  'INCIDENT ID',
                  incidentId,
                ],
                [
                  'LOCATION',
                  accidentLocation,
                ],
                [
                  'RISK SCORE',
                  `${severityScore}%`,
                ],
                [
                  'IMPACT SPEED',
                  `${impactSpeed} km/h`,
                ],
                [
                  'VEHICLE A',
                  vehicleA,
                ],
                [
                  'VEHICLE B',
                  vehicleB,
                ],
              ].map(
                ([label, value]) => (
                  <div
                    key={label}
                    className="bg-slate-950/50 border border-slate-800 rounded-lg p-2.5"
                  >

                    <p className="text-[8px] text-slate-500">
                      {label}
                    </p>

                    <p className="text-[10px] text-slate-200 font-semibold mt-1 truncate">
                      {safeText(value)}
                    </p>
                  </div>
                )
              )}
            </div>

            <div className="mt-3">

              <div className="flex items-center justify-between mb-1.5">

                <span className="text-[9px] text-slate-500">
                  COLLISION RISK
                </span>

                <span className="text-[9px] text-red-400 font-bold">
                  {severityScore}/100
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">

                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{
                    width: `${severityScore}%`,
                  }}
                />
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-slate-950/60 border border-slate-800 p-3">

              <div className="flex items-center gap-2 mb-2">

                <Zap className="w-3.5 h-3.5 text-amber-400" />

                <span className="text-[9px] text-amber-400 font-bold">
                  AI GENERATED SUMMARY
                </span>
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                {safeText(
                  severityDescription
                )}
              </p>
            </div>
          </section>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Trauma Readiness                                                 */}
        {/* ---------------------------------------------------------------- */}

        <section className="rounded-2xl border border-slate-800 bg-[#0c1525] p-5">

          <div className="flex items-center gap-2 mb-4">

            <Stethoscope className="w-4 h-4 text-rose-400" />

            <div>

              <span className="text-[9px] text-rose-400 font-bold tracking-[0.16em]">
                EMERGENCY PREPARATION
              </span>

              <h2 className="text-lg font-bold text-white mt-1">
                Trauma Response Readiness
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">

            {[
              [
                'Trauma ER Bay',
                'Emergency Resuscitation Bay #02',
                true,
                HeartPulse,
              ],

              [
                'Surgical Trauma Team',
                'Vascular & Orthopedic Team',
                true,
                Users,
              ],

              [
                'Blood Bank',
                `${safeText(
                  selectedHospital
                    .bloodBank?.units
                )} O− units available`,
                selectedHospital
                  .bloodBank?.units > 0,
                Droplets,
              ],

              [
                'ICU Capacity',
                `${safeText(
                  selectedHospital
                    .icu?.available
                )} ICU beds available`,
                selectedHospital
                  .icu?.available > 0,
                Bed,
              ],

              [
                'Ventilator Support',
                `${safeText(
                  selectedHospital
                    .ventilators
                    ?.available
                )} ventilators ready`,
                selectedHospital
                  .ventilators
                  ?.available > 0,
                Wind,
              ],

              [
                'Ambulance Communication',
                'Direct emergency radio link',
                true,
                Radio,
              ],
            ].map(
              ([title, subtitle, ready, Icon]) => (
                <div
                  key={title}
                  className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3"
                >

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                      ready
                        ? 'bg-emerald-500/10 border-emerald-500/20'
                        : 'bg-red-500/10 border-red-500/20'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        ready
                          ? 'text-emerald-400'
                          : 'text-red-400'
                      }`}
                    />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-[10px] text-slate-200 font-bold">
                      {title}
                    </p>

                    <p className="text-[9px] text-slate-500 mt-0.5 truncate">
                      {subtitle}
                    </p>
                  </div>

                  <span
                    className={`text-[8px] font-bold ${
                      ready
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }`}
                  >
                    {ready
                      ? 'READY'
                      : 'NOT READY'}
                  </span>
                </div>
              )
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Active Transport                                                 */}
        {/* ---------------------------------------------------------------- */}

        <section className="rounded-2xl border border-slate-800 bg-[#0c1525] overflow-hidden">

          <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <Truck className="w-4 h-4 text-amber-400" />

              <div>

                <span className="text-[9px] text-amber-400 font-bold tracking-[0.16em]">
                  LIVE OPERATIONS
                </span>

                <h2 className="text-base font-bold text-white mt-0.5">
                  Active Transports
                </h2>
              </div>
            </div>

            <span className="text-[9px] text-slate-500">
              {isDispatched
                ? '1 ACTIVE'
                : '0 ACTIVE'}
            </span>
          </div>

          {isDispatched ? (
            <div className="p-4">

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">

                  <div>
                    <p className="text-[8px] text-slate-500">
                      INCIDENT
                    </p>

                    <p className="text-[10px] text-slate-200 font-bold mt-1">
                      {incidentId}
                    </p>
                  </div>

                  <div className="lg:col-span-2">

                    <p className="text-[8px] text-slate-500">
                      LOCATION
                    </p>

                    <p className="text-[10px] text-slate-200 font-semibold mt-1 truncate">
                      {accidentLocation}
                    </p>
                  </div>

                  <div>

                    <p className="text-[8px] text-slate-500">
                      AMBULANCE
                    </p>

                    <p className="text-[10px] text-cyan-300 font-bold mt-1">
                      {ambulanceDisplayId}
                    </p>
                  </div>

                  <div>

                    <p className="text-[8px] text-slate-500">
                      DESTINATION
                    </p>

                    <p className="text-[10px] text-slate-200 font-semibold mt-1 truncate">
                      {safeText(
                        localDispatch
                          .hospital
                          ?.name ||
                          selectedHospital.name
                      )}
                    </p>
                  </div>

                  <div>

                    <p className="text-[8px] text-slate-500">
                      ETA / STATUS
                    </p>

                    <div className="flex items-center gap-2 mt-1">

                      <span className="text-[10px] text-amber-400 font-bold">
                        {safeText(
                          eta
                        )}{' '}
                        min
                      </span>

                      <StatusBadge
                        status={
                          trackingStatus ===
                          'ARRIVED_AT_SCENE'
                            ? 'ARRIVED'
                            : 'EN_ROUTE'
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800">

                  <div className="flex justify-between text-[8px] mb-1.5">

                    <span className="text-slate-500">
                      TRANSPORT PROGRESS
                    </span>

                    <span className="text-cyan-300 font-bold">
                      {progress}%
                    </span>
                  </div>

                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">

              <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700 mx-auto flex items-center justify-center">

                <Ambulance className="w-5 h-5 text-slate-500" />

              </div>

              <p className="text-xs text-slate-400 font-semibold mt-3">
                No active ambulance transport
              </p>

              <p className="text-[9px] text-slate-600 mt-1">
                Select a hospital and ambulance,
                then accept the emergency request.
              </p>
            </div>
          )}
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Footer                                                           */}
        {/* ---------------------------------------------------------------- */}

        <footer className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 pb-4 text-[8px] text-slate-600">

          <span>
            AI RescueFlow Shadow • Hospital
            Emergency Operations
          </span>

          <span className="flex items-center gap-1.5">

            <Activity className="w-3 h-3" />

            All displayed data is part of the
            emergency response simulation.
          </span>
        </footer>
      </div>
    </div>
  );
}