import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  /* ------------------------------------------------------------------------ */
  /* Incident                                                                 */
  /* ------------------------------------------------------------------------ */

  const [activeIncident, setActiveIncident] =
    useState(null);

  /* ------------------------------------------------------------------------ */
  /* Hospital                                                                  */
  /* ------------------------------------------------------------------------ */

  const [assignedHospital, setAssignedHospital] =
    useState(null);

  const [hospitalStatus, setHospitalStatus] =
    useState('PENDING');

  /* ------------------------------------------------------------------------ */
  /* Ambulance                                                                 */
  /* ------------------------------------------------------------------------ */

  const [assignedAmbulance, setAssignedAmbulance] =
    useState(null);

  const [ambulanceTracking, setAmbulanceTracking] =
    useState({
      status: 'STANDBY',
      progressPercent: 0,
      speedKmH: 0,
      etaMinutes: 0,
      ambulanceId: null,
      currentLocation: null,
      destination: null,
    });

  /* ------------------------------------------------------------------------ */
  /* ACCEPT & DISPATCH                                                        */
  /* ------------------------------------------------------------------------ */

  const acceptHospitalEmergency = ({
    hospital,
    ambulance,
    incident,
  } = {}) => {
    console.log(
      '🚨 HOSPITAL ACCEPT & DISPATCH'
    );

    if (!hospital) {
      console.error(
        'No hospital selected'
      );
      return;
    }

    if (!ambulance) {
      console.error(
        'No ambulance selected'
      );
      return;
    }

    /*
     * Save the incident if supplied.
     */
    if (incident) {
      setActiveIncident(incident);
    }

    /*
     * Assign hospital.
     */
    setAssignedHospital({
      ...hospital,
      status: 'ASSIGNED',
    });

    /*
     * Assign ambulance.
     */
    setAssignedAmbulance({
      ...ambulance,
      ambulanceId: ambulance.id,
      status: 'EN_ROUTE',
    });

    /*
     * Update hospital state.
     */
    setHospitalStatus(
      'AMBULANCE_DISPATCHED'
    );

    /*
     * Start ambulance tracking.
     */
    setAmbulanceTracking({
      ambulanceId: ambulance.id,

      status: 'EN_ROUTE',

      progressPercent: 5,

      speedKmH: 40,

      etaMinutes:
        Number(ambulance.eta) || 8,

      currentLocation: {
        lat: ambulance.lat,
        lng: ambulance.lng,
      },

      destination: {
        lat:
          incident?.lat ||
          incident?.location?.lat ||
          null,

        lng:
          incident?.lng ||
          incident?.location?.lng ||
          null,
      },
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Ambulance simulation                                                     */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (
      ambulanceTracking.status !==
      'EN_ROUTE'
    ) {
      return undefined;
    }

    const timer = setInterval(() => {
      setAmbulanceTracking(
        (previous) => {
          const currentProgress =
            Number(
              previous.progressPercent
            ) || 0;

          const nextProgress =
            Math.min(
              currentProgress + 5,
              100
            );

          const currentEta =
            Number(
              previous.etaMinutes
            ) || 0;

          const nextEta = Math.max(
            currentEta - 1,
            0
          );

          if (
            nextProgress >= 100
          ) {
            setHospitalStatus(
              'ARRIVED_AT_SCENE'
            );

            setAssignedAmbulance(
              (previousAmbulance) =>
                previousAmbulance
                  ? {
                      ...previousAmbulance,
                      status:
                        'ARRIVED',
                    }
                  : previousAmbulance
            );

            return {
              ...previous,

              status:
                'ARRIVED_AT_SCENE',

              progressPercent: 100,

              speedKmH: 0,

              etaMinutes: 0,
            };
          }

          return {
            ...previous,

            status: 'EN_ROUTE',

            progressPercent:
              nextProgress,

            speedKmH:
              40 +
              Math.round(
                Math.random() * 20
              ),

            etaMinutes: nextEta,
          };
        }
      );
    }, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [
    ambulanceTracking.status,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Context                                                                  */
  /* ------------------------------------------------------------------------ */

  const value = {
    activeIncident,
    setActiveIncident,

    assignedHospital,
    setAssignedHospital,

    assignedAmbulance,
    setAssignedAmbulance,

    ambulanceTracking,
    setAmbulanceTracking,

    hospitalStatus,
    setHospitalStatus,

    acceptHospitalEmergency,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useApp() {
  const context = useContext(
    AppContext
  );

  if (!context) {
    throw new Error(
      'useApp must be used inside AppProvider'
    );
  }

  return context;
}

export default AppContext;