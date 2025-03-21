import axios from "axios";

const API_URL = "http://localhost:3000/api/alarms";

export const getAlarms = async (
  token: string,
  page = 1,
  limit = 10,
  filterParams = {}
) => {
  try {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filterParams).filter(([_, value]) => value)
    );

    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit, ...cleanedFilters },
    });

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch alarms.");
  }
};

export const getAlarmDetails = async (id: string, token: string) => {
  try {
    console.log("📡 Requesting details for ID:", id);

    const response = await axios.get(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("📡 Alarm details received:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch alarm details:", error);
    throw new Error("There was a problem fetching alarm details.");
  }
};
