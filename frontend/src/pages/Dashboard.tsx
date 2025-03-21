import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setAlarms } from "../redux/alarmsSlice";
import { getAlarms } from "../services/alarmService";
import AlarmCard from "../components/AlarmCard";

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alarms = useSelector((state: RootState) => state.alarms.alarms) || [];
  const token = useSelector((state: RootState) => state.auth.token);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      console.log("🚀 User not logged in, redirecting to login...");
      navigate("/login");
      return;
    }

    const fetchAlarms = async () => {
      try {
        const data = await getAlarms(token);
        dispatch(setAlarms(data));
      } catch (err) {
        setError("❌ Failed to fetch alarms.");
      }
    };

    fetchAlarms();
  }, [dispatch, token, navigate]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Alarm Dashboard</h1>

      {error && <p className="error">{error}</p>}

      <div className="alarm-list">
        {alarms.length === 0 ? (
          <p className="empty-state">❌ No alarms received.</p>
        ) : (
          alarms.map((alarm) => <AlarmCard key={alarm.uuid} {...alarm} />)
        )}
      </div>
    </div>
  );
};

export default Dashboard;
