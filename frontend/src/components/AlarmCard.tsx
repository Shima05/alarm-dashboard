import React from "react";
import { Link } from "react-router-dom";

interface AlarmProps {
  uuid: string;
  sensor: string;
  timestamp: number;
  type: string;
  visualizations: string[];
}

const AlarmCard: React.FC<AlarmProps> = ({
  uuid,
  sensor,
  timestamp,
  type,
  visualizations,
}) => {
  console.log("🔗 Link to alarm details:", `/alarm/${uuid}`);

  return (
    <Link to={`/alarm/${uuid}`} className="alarm-card">
      <h3>Type: {type}</h3>
      <p>Sensor: {sensor}</p>
      <p>Time: {new Date(timestamp).toLocaleString()}</p>
      <p>Image Count: {visualizations.length}</p>
    </Link>
  );
};

export default AlarmCard;
