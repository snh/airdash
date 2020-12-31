import React, { useState, useEffect } from "react";
import DataHub from "./data-sources/data-hub";

const DataHubContext = React.createContext(null);

/**
 * DataHubProvider is a React ContextProvider that acts as the
 * primary hub of data coming from all data sources.
 *
 * An AirDash application instance will have a single provider,
 * and may have multiple consumers throughout the app.
 */
export const DataHubProvider = function ({ children }) {
  const [entities, setEntities] = useState({});

  const onDataHubChange = (newEntities) => {
    setEntities(newEntities);
  };

  const [dataHub] = useState(new DataHub(onDataHubChange));

  useEffect(() => {
    dataHub.start();
    return () => dataHub.stop();
  }, [dataHub]);

  const aircraft = Object.values(entities)
    .filter((v) => v.type === "ADSB")
    .map((v) => v.adsbData);

  const boats = Object.values(entities)
    .filter((v) => v.type === "AIS")
    .map((v) => v.aisData);

  return (
    <DataHubContext.Provider
      value={{
        entities,
        aircraft,
        boats,
      }}
    >
      {children}
    </DataHubContext.Provider>
  );
};

export const DataHubConsumer = DataHubContext.Consumer;
export default DataHubContext;
