import { useState, useEffect, useCallback } from 'react';
import { DailyLog, GlucoseRecord, FeedingRecord, InsulinRecord } from '@/types/glucose';

const STORAGE_KEY = 'cat-glucose-logs';

export function useLocalStorage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert timestamp strings back to Date objects
        const logsWithDates = parsed.map((log: DailyLog) => ({
          ...log,
          glucose: log.glucose.map((g: GlucoseRecord) => ({
            ...g,
            timestamp: new Date(g.timestamp),
          })),
          feeding: log.feeding.map((f: FeedingRecord) => ({
            ...f,
            timestamp: new Date(f.timestamp),
          })),
          insulin: log.insulin.map((i: InsulinRecord) => ({
            ...i,
            timestamp: new Date(i.timestamp),
          })),
        }));
        setLogs(logsWithDates);
      }
    } catch (e) {
      console.error('Failed to load logs from localStorage:', e);
    }
    setIsLoaded(true);
  }, []);

  const saveLogs = useCallback((newLogs: DailyLog[]) => {
    setLogs(newLogs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLogs));
    } catch (e) {
      console.error('Failed to save logs to localStorage:', e);
    }
  }, []);

  const getOrCreateDailyLog = useCallback((date: Date): DailyLog => {
    const dateStr = date.toISOString().split('T')[0];
    const existing = logs.find(log => log.date === dateStr);
    if (existing) return existing;
    
    return {
      date: dateStr,
      glucose: [],
      feeding: [],
      insulin: [],
    };
  }, [logs]);

  const addGlucoseRecord = useCallback((record: GlucoseRecord) => {
    const dateStr = record.timestamp.toISOString().split('T')[0];
    const existingLogIndex = logs.findIndex(log => log.date === dateStr);
    
    let newLogs: DailyLog[];
    if (existingLogIndex >= 0) {
      newLogs = [...logs];
      newLogs[existingLogIndex] = {
        ...newLogs[existingLogIndex],
        glucose: [...newLogs[existingLogIndex].glucose, record].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
      };
    } else {
      const newLog: DailyLog = {
        date: dateStr,
        glucose: [record],
        feeding: [],
        insulin: [],
      };
      newLogs = [...logs, newLog].sort((a, b) => b.date.localeCompare(a.date));
    }
    
    saveLogs(newLogs);
  }, [logs, saveLogs]);

  const addFeedingRecord = useCallback((record: FeedingRecord) => {
    const dateStr = record.timestamp.toISOString().split('T')[0];
    const existingLogIndex = logs.findIndex(log => log.date === dateStr);
    
    let newLogs: DailyLog[];
    if (existingLogIndex >= 0) {
      newLogs = [...logs];
      newLogs[existingLogIndex] = {
        ...newLogs[existingLogIndex],
        feeding: [...newLogs[existingLogIndex].feeding, record].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
      };
    } else {
      const newLog: DailyLog = {
        date: dateStr,
        glucose: [],
        feeding: [record],
        insulin: [],
      };
      newLogs = [...logs, newLog].sort((a, b) => b.date.localeCompare(a.date));
    }
    
    saveLogs(newLogs);
  }, [logs, saveLogs]);

  const addInsulinRecord = useCallback((record: InsulinRecord) => {
    const dateStr = record.timestamp.toISOString().split('T')[0];
    const existingLogIndex = logs.findIndex(log => log.date === dateStr);
    
    let newLogs: DailyLog[];
    if (existingLogIndex >= 0) {
      newLogs = [...logs];
      newLogs[existingLogIndex] = {
        ...newLogs[existingLogIndex],
        insulin: [...newLogs[existingLogIndex].insulin, record].sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
        ),
      };
    } else {
      const newLog: DailyLog = {
        date: dateStr,
        glucose: [],
        feeding: [],
        insulin: [record],
      };
      newLogs = [...logs, newLog].sort((a, b) => b.date.localeCompare(a.date));
    }
    
    saveLogs(newLogs);
  }, [logs, saveLogs]);

  const deleteRecord = useCallback((type: 'glucose' | 'feeding' | 'insulin', id: string) => {
    const newLogs = logs.map(log => ({
      ...log,
      [type]: log[type].filter((r: { id: string }) => r.id !== id),
    })).filter(log => 
      log.glucose.length > 0 || log.feeding.length > 0 || log.insulin.length > 0
    );
    
    saveLogs(newLogs);
  }, [logs, saveLogs]);

  const exportToCSV = useCallback(() => {
    const rows: string[] = ['날짜,시간,유형,값,상세'];
    
    logs.forEach(log => {
      log.glucose.forEach(g => {
        rows.push(`${log.date},${g.timestamp.toLocaleTimeString('ko-KR')},혈당,${g.value}mg/dL,${g.notes || ''}`);
      });
      log.feeding.forEach(f => {
        rows.push(`${log.date},${f.timestamp.toLocaleTimeString('ko-KR')},식이,${f.amount}${f.unit === 'gram' ? 'g' : '스푼'},${f.type} - ${f.notes || ''}`);
      });
      log.insulin.forEach(i => {
        rows.push(`${log.date},${i.timestamp.toLocaleTimeString('ko-KR')},인슐린,${i.dose}단위,${i.type} - ${i.administered ? '투여완료' : '미투여'}`);
      });
    });
    
    const csv = rows.join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `고양이혈당기록_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  return {
    logs,
    isLoaded,
    addGlucoseRecord,
    addFeedingRecord,
    addInsulinRecord,
    deleteRecord,
    exportToCSV,
  };
}
