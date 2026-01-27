import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { GlucoseForm } from '@/components/GlucoseForm';
import { FeedingForm } from '@/components/FeedingForm';
import { InsulinForm } from '@/components/InsulinForm';
import { GlucoseChart } from '@/components/GlucoseChart';
import { DailyLogList } from '@/components/DailyLogList';
import { QuickStats } from '@/components/QuickStats';
import { ShareDialog } from '@/components/ShareDialog';
import { Disclaimer } from '@/components/Disclaimer';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Download, Droplet, Utensils, Syringe } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    logs,
    isLoaded,
    addGlucoseRecord,
    addFeedingRecord,
    addInsulinRecord,
    deleteRecord,
    exportToCSV,
  } = useLocalStorage();

  const [activeTab, setActiveTab] = useState('glucose');

  const latestGlucose = useMemo(() => {
    const allGlucose = logs.flatMap((log) => log.glucose);
    if (allGlucose.length === 0) return undefined;
    
    return allGlucose.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    )[0];
  }, [logs]);

  const handleGlucoseSubmit = (record: Parameters<typeof addGlucoseRecord>[0]) => {
    addGlucoseRecord(record);
    toast({
      title: '✅ 혈당 기록 완료',
      description: `${record.value} mg/dL이 기록되었습니다.`,
    });
  };

  const handleFeedingSubmit = (record: Parameters<typeof addFeedingRecord>[0]) => {
    addFeedingRecord(record);
    toast({
      title: '✅ 식이 기록 완료',
      description: '식이 정보가 기록되었습니다.',
    });
  };

  const handleInsulinSubmit = (record: Parameters<typeof addInsulinRecord>[0]) => {
    addInsulinRecord(record);
    toast({
      title: '✅ 인슐린 기록 완료',
      description: `${record.type} ${record.dose}단위가 기록되었습니다.`,
    });
  };

  const handleExport = () => {
    exportToCSV();
    toast({
      title: '📥 내보내기 완료',
      description: 'CSV 파일이 다운로드되었습니다.',
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center paw-pattern">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/20 animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen paw-pattern">
      <Header />
      
      <main className="container pb-8 pt-4 space-y-6 max-w-lg mx-auto">
        {/* Quick Stats */}
        <QuickStats logs={logs} />

        {/* Record Forms */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="glucose" className="gap-1.5">
              <Droplet className="w-4 h-4" />
              <span className="hidden sm:inline">혈당</span>
            </TabsTrigger>
            <TabsTrigger value="feeding" className="gap-1.5">
              <Utensils className="w-4 h-4" />
              <span className="hidden sm:inline">식이</span>
            </TabsTrigger>
            <TabsTrigger value="insulin" className="gap-1.5">
              <Syringe className="w-4 h-4" />
              <span className="hidden sm:inline">인슐린</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="glucose" className="mt-4">
            <GlucoseForm
              onSubmit={handleGlucoseSubmit}
              previousValue={latestGlucose?.value}
              previousTimestamp={latestGlucose?.timestamp}
            />
          </TabsContent>

          <TabsContent value="feeding" className="mt-4">
            <FeedingForm onSubmit={handleFeedingSubmit} />
          </TabsContent>

          <TabsContent value="insulin" className="mt-4">
            <InsulinForm onSubmit={handleInsulinSubmit} />
          </TabsContent>
        </Tabs>

        {/* Chart */}
        <GlucoseChart logs={logs} days={7} />

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleExport}
            disabled={logs.length === 0}
          >
            <Download className="w-4 h-4" />
            CSV 내보내기
          </Button>
          <ShareDialog logs={logs} />
        </div>

        {/* Daily Logs */}
        <div>
          <h2 className="text-lg font-semibold mb-3">기록 히스토리</h2>
          <DailyLogList logs={logs} onDelete={deleteRecord} />
        </div>

        {/* Disclaimer */}
        <Disclaimer />
      </main>
    </div>
  );
};

export default Index;
