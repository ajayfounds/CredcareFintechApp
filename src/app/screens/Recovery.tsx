import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, cn } from '../components/ui/WireframeComponents';
import { ChevronLeft, Calendar, AlertTriangle, CheckCircle, Info, ArrowRight, Loader2, ChevronRight } from 'lucide-react';
import { api, USERS } from '../utils/api';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from "sonner@2.0.3";

type ViewState = 'main' | 'timeline' | 'roadmap-detail';

type Insight = {
  id: string;
  title: string;
  description: string;
  type: string;
  date: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  impact: string;
};

export const Recovery = () => {
  const [view, setView] = useState<ViewState>('main');
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [insightsData, tasksData] = await Promise.all([
          api.get(`/insights/${USERS.CURRENT_USER_ID}`),
          api.get(`/tasks/${USERS.CURRENT_USER_ID}`)
        ]);
        setInsights(insightsData);
        setTasks(tasksData);
      } catch (err) {
        console.error("Failed to fetch recovery data", err);
        toast.error("Failed to load recovery plan");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleBack = () => {
    setView('main');
    setSelectedPeriod(null);
  };

  const openRoadmap = (period: string) => {
    setSelectedPeriod(period);
    setView('roadmap-detail');
  };

  if (loading && insights.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F2F2F7]">
      {/* iOS Header */}
      <div className="bg-[#F2F2F7] px-4 pt-4 pb-2 sticky top-0 z-20 flex items-center">
        {view !== 'main' && (
          <button onClick={handleBack} className="mr-2 -ml-2 p-2 text-[#007AFF] flex items-center">
            <ChevronLeft size={24} strokeWidth={2.5} />
            <span className="text-[17px]">Back</span>
          </button>
        )}
      </div>
      
      <div className="px-4 pb-2">
         <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight mb-4">
           {view === 'main' ? 'Recovery Plan' : 
            view === 'timeline' ? 'Analysis' : 
            selectedPeriod}
         </h1>
      </div>

      <div className="pb-32">
        <AnimatePresence mode="wait">
          {view === 'main' && (
            <MainRecoveryView 
              onViewTimeline={() => setView('timeline')}
              onViewRoadmap={openRoadmap}
              tasksCount={tasks.filter(t => t.status !== 'completed').length}
            />
          )}
          {view === 'timeline' && <TimelineView insights={insights} />}
          {view === 'roadmap-detail' && <RoadmapDetailView period={selectedPeriod} tasks={tasks} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

const MainRecoveryView = ({ onViewTimeline, onViewRoadmap, tasksCount }: { onViewTimeline: () => void, onViewRoadmap: (period: string) => void, tasksCount: number }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="space-y-8 px-4"
  >
    {/* Analysis Teaser */}
    <section>
      <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-4">Current Status</h2>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform cursor-pointer" onClick={onViewTimeline}>
        <div className="p-4 flex justify-between items-center border-b border-gray-100">
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900">Why your score dropped</h3>
            <p className="text-[14px] text-gray-500 mt-0.5">2 key events detected</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300" />
        </div>
        <div className="p-4 bg-gray-50/50 flex gap-3">
          <Badge variant="destructive">Missed Payment</Badge>
          <Badge variant="destructive">High Utilization</Badge>
        </div>
      </div>
    </section>

    {/* Roadmap */}
    <section>
      <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-4">Your Roadmap</h2>
      
      <div className="relative pl-8 space-y-8 before:absolute before:left-[15px] before:top-4 before:bottom-4 before:w-[2px] before:bg-gray-200">
        
        {/* Step 1 */}
        <div className="relative" onClick={() => onViewRoadmap('0-30 Days')}>
          <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-black flex items-center justify-center border-4 border-[#F2F2F7] z-10 shadow-sm">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
             <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-[17px] text-gray-900">Immediate Fixes</h3>
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">Current</span>
             </div>
             <p className="text-[14px] text-gray-500 mb-4 leading-relaxed">Stop the bleeding. Focus on stabilizing your score within 30 days.</p>
             <div className="flex items-center gap-2 text-[13px] font-medium text-gray-900">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               {tasksCount} Tasks Active
             </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative opacity-60 grayscale" onClick={() => onViewRoadmap('30-90 Days')}>
          <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border-4 border-[#F2F2F7] z-10">
            <span className="text-gray-500 text-xs font-bold">2</span>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-dashed border-gray-300">
             <h3 className="font-bold text-[17px] text-gray-900 mb-1">Building Trust</h3>
             <p className="text-[14px] text-gray-500">Establish a pattern of good behavior (30-90 days).</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative opacity-40 grayscale" onClick={() => onViewRoadmap('90-180 Days')}>
          <div className="absolute -left-[41px] top-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-4 border-[#F2F2F7] z-10">
            <span className="text-gray-400 text-xs font-bold">3</span>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-dashed border-gray-300">
             <h3 className="font-bold text-[17px] text-gray-900 mb-1">Score Growth</h3>
             <p className="text-[14px] text-gray-500">See visible improvements (90-180 days).</p>
          </div>
        </div>

      </div>
    </section>
  </motion.div>
);

const TimelineView = ({ insights }: { insights: Insight[] }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
    className="px-4 space-y-6"
  >
    <div className="bg-white p-6 rounded-3xl shadow-sm">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900">Score History</h2>
          <p className="text-[13px] text-gray-500 mt-1">Last 6 months</p>
        </div>
        <div className="text-right">
          <p className="text-[34px] font-bold text-black leading-none">624</p>
          <span className="text-red-500 text-xs font-bold">↓ 42 pts</span>
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex items-end justify-between h-40 gap-3">
        {[680, 675, 670, 640, 624].map((score, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-gray-900 text-white px-1.5 py-0.5 rounded mb-1 absolute -mt-8">
               {score}
            </div>
            <div 
              className={cn(
                "w-full rounded-t-lg transition-all duration-500 ease-out",
                i === 4 ? "bg-black" : "bg-gray-100 hover:bg-gray-200"
              )}
              style={{ height: `${(score - 500) / 1.5}px` }} 
            />
            <span className="text-[11px] font-semibold text-gray-400 uppercase">
              {['Oct', 'Nov', 'Dec', 'Jan', 'Feb'][i]}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide ml-4">Impact Events</h3>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 flex gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              insight.type === 'negative' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
            )}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex justify-between items-start">
                 <h4 className="text-[16px] font-semibold text-gray-900">{insight.title}</h4>
                 <span className="text-[12px] font-medium text-gray-400">{insight.date}</span>
              </div>
              <p className="text-[14px] text-gray-500 mt-1 leading-relaxed">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const RoadmapDetailView = ({ period, tasks }: { period: string | null, tasks: Task[] }) => {
  const currentTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
      className="px-4 space-y-6"
    >
      <div className="bg-white p-5 rounded-2xl shadow-sm flex items-start gap-4">
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
          <Calendar className="w-6 h-6 text-gray-900" />
        </div>
        <div>
           <p className="text-[13px] font-medium text-gray-500 uppercase tracking-wide mb-1">Focus</p>
           <h3 className="text-[17px] font-bold text-gray-900 leading-snug">Stabilization & Damage Control</h3>
        </div>
      </div>

      <div>
        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-4">Action Plan</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
          {currentTasks.length > 0 ? currentTasks.map(task => (
             <div key={task.id} className="p-4 flex gap-4">
              <div className="mt-0.5">
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center" />
              </div>
              <div>
                <h4 className="font-semibold text-[16px] text-gray-900">{task.title}</h4>
                <p className="text-[14px] text-gray-500 mt-1">{task.description}</p>
              </div>
            </div>
          )) : (
            <div className="p-6 text-center text-gray-500 italic">No pending tasks for this period.</div>
          )}

          {completedTasks.map(task => (
            <div key={task.id} className="p-4 flex gap-4 opacity-50 bg-gray-50">
              <div className="mt-0.5">
                <CheckCircle className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <h4 className="font-semibold text-[16px] text-gray-900 line-through">{task.title}</h4>
                <p className="text-[14px] text-gray-500 mt-1">Completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
        <Info className="w-5 h-5 text-blue-600 shrink-0" />
        <p className="text-[13px] text-blue-800 leading-relaxed font-medium">
          Completing these tasks within 30 days can stop your score from dropping further by ~15-20 points.
        </p>
      </div>
    </motion.div>
  );
};
