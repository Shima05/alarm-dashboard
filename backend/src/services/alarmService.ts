import db from '../config/db.ts';
import { Alarm } from '../models/alarmModel.ts';

// Helper function to run SELECT queries
const dbQuery = <T>(query: string, params: (string | number)[]): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(new Error(` DB query failed: ${err.message}`));
      } else {
        resolve(rows as T);
      }
    });
  });
};

// Helper function to run INSERT/UPDATE/DELETE queries
const dbRun = (query: string, params: (string | number)[]): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.run(query, params, (err) => {
      if (err) {
        reject(new Error(` DB execution failed: ${err.message}`));
      } else {
        resolve();
      }
    });
  });
};

export const AlarmService = {
  getAlarmById: async (id: string): Promise<Alarm | undefined> => {
    const rows = await dbQuery<Alarm[]>('SELECT * FROM alarms WHERE uuid = ?', [id]);
    const alarm = rows[0];

    if (alarm) {
      try {
        alarm.visualizations = JSON.parse(alarm.visualizations as unknown as string) || [];
      } catch {
        alarm.visualizations = [];
      }
      return alarm;
    }

    return undefined;
  },

  getAlarms: async (sensor?: string, type?: string, page = 1, limit = 10): Promise<Alarm[]> => {
    const offset = (page - 1) * limit;
    const params: (string | number)[] = [];
    let query = 'SELECT * FROM alarms WHERE 1=1';

    if (sensor) {
      query += ' AND sensor = ?';
      params.push(sensor);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await dbQuery<Alarm[]>(query, params);

    return rows.map((row) => {
      try {
        row.visualizations = JSON.parse(row.visualizations as unknown as string) || [];
      } catch {
        row.visualizations = [];
      }
      return row;
    });
  },

  createAlarm: async (uuid: string, sensor: string, timestamp: number, type: string): Promise<Alarm> => {
    const query = `INSERT INTO alarms (uuid, sensor, timestamp, type) VALUES (?, ?, ?, ?)`;
    await dbRun(query, [uuid, sensor, timestamp, type]);

    return { uuid, sensor, timestamp, type, visualizations: [] };
  },

  updateVisualizations: async (id: string, visualizations: string[]): Promise<void> => {
    const query = 'UPDATE alarms SET visualizations = ? WHERE uuid = ?';
    await dbRun(query, [JSON.stringify(visualizations), id]);
  },
};
