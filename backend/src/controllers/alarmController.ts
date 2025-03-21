import { Request, Response } from 'express';
import { AlarmService } from '../services/alarmService.ts';
import type { paths } from '../generated/types.ts';
import { handleFileUploads } from '../services/fileService.ts';
import { v4 as uuidv4 } from 'uuid';

type CreateAlarmRouteBody = paths['/api/alarms']['post']['requestBody']['content']['application/json'];
type GetAlarmListQuery = paths['/api/alarms']['get']['parameters']['query'];

export const AlarmController = {
  getListAlarms: async (req: Request, res: Response): Promise<void> => {
    const { sensor, type, page, limit } = (req.query as GetAlarmListQuery) ?? {};

    try {
      const alarms = await AlarmService.getAlarms(sensor, type, page, limit);
      res.json(alarms);
    } catch (error) {
      console.error('Error fetching alarms:', error);
      res.status(500).json({ error: 'Failed to fetch alarms' });
    }
  },

  getAlarmById: async (req: Request, res: Response): Promise<void> => {
    const uuid = req.params.id;

    if (!uuid) {
      res.status(400).json({ error: 'Invalid or missing alarm ID.' });
      return;
    }

    try {
      const alarm = await AlarmService.getAlarmById(uuid);

      if (!alarm) {
        res.status(404).json({ error: 'Alarm not found' });
        return;
      }

      // Ensure visualizations is an array of strings
      if (typeof alarm.visualizations === 'string') {
        try {
          alarm.visualizations = JSON.parse(alarm.visualizations);
        } catch (error) {
          console.error('Failed to parse visualizations JSON:', error);
          alarm.visualizations = [];
        }
      }

      if (!Array.isArray(alarm.visualizations)) {
        alarm.visualizations = [];
      }

      // Filter only valid paths (relative or full URLs)
      alarm.visualizations = alarm.visualizations.filter((item) => typeof item === 'string' && /^(https?:\/\/|\/uploads\/)/.test(item));

      res.json(alarm);
    } catch (error) {
      console.error('Error fetching alarm details:', error);
      res.status(500).json({ error: 'Failed to fetch alarm details' });
    }
  },

  createAlarm: async (req: Request, res: Response): Promise<void> => {
    const timestamp = Date.now();
    const { sensor, type } = req.body as CreateAlarmRouteBody;
    const uuid = req.body.uuid || uuidv4();

    try {
      const newAlarm = await AlarmService.createAlarm(uuid, sensor, timestamp, type);
      res.status(201).json(newAlarm);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: 'Error creating alarm', details: error.message });
        return;
      }
      res.status(400).json({ error: 'Error creating alarm' });
    }
  },

  uploadVisualizations: async (req: Request, res: Response): Promise<void> => {
    const uuid = req.params.id;
    if (!uuid) {
      res.status(400).json({ error: 'Invalid or missing alarm ID.' });
      return;
    }

    try {
      const alarm = await AlarmService.getAlarmById(uuid);
      if (!alarm) {
        res.status(404).json({ error: 'Alarm not found' });
        return;
      }

      let currentVisualizations: string[] = [];
      try {
        currentVisualizations = Array.isArray(alarm.visualizations) ? alarm.visualizations : JSON.parse(alarm.visualizations);
      } catch (error) {
        console.error('Error parsing current visualizations:', error);
        res.status(500).json({ error: 'Failed to parse current visualizations.' });
        return;
      }

      const filePaths = await handleFileUploads(req);

      if (!filePaths || filePaths.length === 0) {
        res.status(400).json({ error: 'No files uploaded' });
        return;
      }

      const updatedVisualizations = [...currentVisualizations, ...filePaths];
      await AlarmService.updateVisualizations(uuid, updatedVisualizations);

      res.status(201).json({
        message: 'Visualizations uploaded successfully',
        visualizations: updatedVisualizations,
      });
    } catch (err) {
      console.error('Error uploading visualizations:', err);
      res.status(500).json({ error: 'Failed to upload visualizations' });
    }
  },
};
