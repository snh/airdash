import L from "leaflet";
import Plane from "AirDash/webapp/images/airplane.svg";
import ReactDOMServer from 'react-dom/server';

import './plane-icon.scss';

const STYLE = {
    width: 32,
    height: 32,
};

const ALTITUDE_LEVELS = [
  500,
  1000,
  2000,
  4000,
  6000,
  8000,
  10000,
  20000,
  30000,
  40000,
];

const getCssClassForStatus = (airGroundStatus, altitude) => {
  if (airGroundStatus === 'AG_GROUND') {
    return 'altitude-ground';
  }

  for (let [i, v] of ALTITUDE_LEVELS.entries()) {
    if (altitude < v) {
      return `altitude-${i}`;
    }
  }
  return `altitude-${ALTITUDE_LEVELS.length}`;
}

const PlaneIcon = (aircraftInfo) => {
  const { adsbData, tailNumber, typeCode } = aircraftInfo;
  const rotation = adsbData ? adsbData.track : 0;
  const style = {
      ...STYLE,
      transform: `rotate(${rotation}deg)`,
  };
  const altitude = adsbData.altGeom || 0;
  const altitudeClass = getCssClassForStatus(adsbData.airGround, altitude);
  const addrName = adsbData.addr.toString(16).toUpperCase();

  const callsign = adsbData.flight || addrName;
  const showTailNumber = tailNumber && tailNumber !== callsign;

  const icon = L.divIcon({
    className: "custom-icon",
    popupAnchor: [0, -16],
    html: ReactDOMServer.renderToString((
        <div key={`icon-${adsbData.addr}`} className="plane-icon">
            <Plane style={style} className={altitudeClass} />
            <div className="map-icon-detail">
              <div className="callsign">{callsign}</div>
              {showTailNumber && <div className="tail-number">{tailNumber}</div>}
            </div>
        </div>
    )),
  });
  return icon;
};

export default PlaneIcon;
