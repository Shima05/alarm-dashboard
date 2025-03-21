import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { getAlarmDetails } from "../services/alarmService";
import "../styles/alarmCard.css";

const AlarmDetails = () => {
  const { id } = useParams();
  const token = useSelector((state: RootState) => state.auth.token);

  const [alarm, setAlarm] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAlarmDetails = async () => {
      if (!id || !token) {
        setError("❌ Alarm ID or token not found.");
        return;
      }

      try {
        const data = await getAlarmDetails(id, token);
        setAlarm(data);
      } catch (err) {
        setError("❌ Failed to fetch alarm details.");
      }
    };

    fetchAlarmDetails();
  }, [id, token]);

  if (error) return <p className="error">{error}</p>;
  if (!alarm) return <p>Loading...</p>;

  return (
    <div className="alarm-detail-container">
      <div className="card">
        <h1 className="alarm-title">Alarm Details</h1>
        <div className="alarm-info">
          <p>
            <strong>Type:</strong> {alarm.type}
          </p>
          <p>
            <strong>Sensor:</strong> {alarm.sensor}
          </p>
          <p>
            <strong>Time:</strong> {new Date(alarm.timestamp).toLocaleString()}
          </p>
        </div>

        <h3>Images from Sensor:</h3>
        <div className="image-gallery">
          {alarm.visualizations && alarm.visualizations.length > 0 ? (
            alarm.visualizations.map((image: string, index: number) => (
              <img
                key={index}
                src={`http://localhost:3000${image}`}
                alt={`Image ${index + 1}`}
                className="alarm-image"
              />
            ))
          ) : (
            <p>No images sent by the sensor.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmDetails;
