import React, { useContext } from "react";
import DataHubContext from "../DataHubContext";
import { Table } from "react-bootstrap";

import "./boat-table.scss";

const boatSort = (a, b) => {
  if (a.mmsi === b.mmsi) {
    return 0;
  }
  if (b.mmsi > a.mmsi) {
    return -1;
  }
  return 1;
};

const BoatTable = (props) => {
  const { boats } = useContext(DataHubContext);

  if (!boats.length) {
    return null;
  }

  const rows = boats.sort(boatSort).map((b) => {
    return (
      <tr key={b.mmsi}>
        <td>{b.mmsi}</td>
        <td>{b.name}</td>
        <td>{b.speedOverGround}</td>
        <td>{b.heading}</td>
      </tr>
    );
  });

  return (
    <div className="table-container aircraft-table">
      <Table striped hover size="sm">
        <thead>
          <tr>
            <th>MMSI</th>
            <th>Name</th>
            <th>Speed</th>
            <th>Heading</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </div>
  );
};

BoatTable.propTypes = {};

export default BoatTable;
