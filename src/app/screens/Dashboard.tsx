import React, { useEffect, useState } from 'react';
import { Card, Button, Badge, cn } from '../components/ui/WireframeComponents';
import { ChevronRight, TrendingUp, AlertCircle, Shield, Loader2, Zap, ArrowRight, CheckCircle2, AlertTriangle, Calendar, FileText } from 'lucide-react';
import { api, USERS } from '../utils/api';
import { motion } from 'motion/react';
import { toast } from "sonner";

type User = {
  name: string;
  creditScore: number;
  scoreStatus: string;
  lastUpdated: string;
  streak: number;
  level: number;
  nextLevelProgress: number; // 0-100
};

type Alert = {
  id: string;
  type: 'danger' | 'warning' | 'info';
  title: string;
  message: string;
};

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  impact: string;
};

export const Dashboard = ({ onChangeTab }: { onChangeTab: (tab: any) => void }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate fetching enhanced user data
        // In a real app, this would come from the API
        try {
          const userData = await api.get(`/user/${USERS.CURRENT_USER_ID}`);
          setUser({
             ...userData,
             streak: 12,
             level: 1,
             nextLevelProgress: 85
          });
        } catch (e) {
          // Fallback mock data
          setUser({
            name: "Rahul",
            creditScore: 624,
            scoreStatus: "Needs Work",
            lastUpdated: "Just now",
            streak: 12,
            level: 1,
            nextLevelProgress: 85
          });
        }

        const tasksData = await api.get(`/tasks/${USERS.CURRENT_USER_ID}`);
        setTasks(tasksData);

        // Mock Alerts logic based on tasks
        const newAlerts: Alert[] = [];
        const overdue = tasksData.filter((t: Task) => t.dueDate === 'Overdue' || t.status === 'overdue');
        if (overdue.length > 0) {
            newAlerts.push({
                id: '1',
                type: 'danger',
                title: 'Action Required',
                message: `You have ${overdue.length} overdue payment(s).`
            });
        }
        setAlerts(newAlerts);

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Loader2 className="animate-spin text-gray-400" size={32} />
      </div>
    );
  }

  const nextTask = tasks.find(t => t.status !== 'completed');
  const greeting = getGreeting();

  return (
    <div className="bg-[#F2F2F7] min-h-full pb-32">
      {/* Header Section */}
      <div className="px-5 pt-4 pb-4 sticky top-0 bg-[#F2F2F7]/90 backdrop-blur-xl z-20 flex justify-between items-start border-b border-gray-200/50 transition-all duration-200">
        <div className="flex-1 pr-4">
          <p className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
             {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <div className="flex flex-col gap-1">
            <h1 className="text-[24px] font-bold text-black tracking-tight leading-tight">
                {greeting}, {user?.name?.split(' ')[0] || 'User'}.
            </h1>
            <div className="flex items-start gap-2 mt-1">
               <CheckCircle2 size={16} className="text-green-600 shrink-0 mt-0.5" />
               <p className="text-[15px] text-gray-500 leading-relaxed">
                  You're making steady progress. Consistency is key to rebuilding trust.
               </p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onChangeTab('profile')} 
          className="w-10 h-10 rounded-full bg-[rgb(100,153,251)] overflow-hidden flex items-center justify-center text-[rgb(245,245,245)] font-bold text-sm border border-gray-300 mt-2 active:scale-90 transition-transform shadow-sm shrink-0 text-[20px] font-normal"
        >
          {user?.name?.[0]}
        </button>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Risk Alerts */}
        {alerts.map(alert => (
            <motion.div 
                key={alert.id}
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className={cn(
                    "p-4 rounded-2xl flex items-start gap-3 shadow-sm border",
                    alert.type === 'danger' ? "bg-red-50 border-red-100 text-red-900" : "bg-orange-50 border-orange-100 text-orange-900"
                )}
            >
                <AlertTriangle className={cn("shrink-0 w-5 h-5", alert.type === 'danger' ? "text-red-600" : "text-orange-600")} />
                <div className="flex-1">
                    <h3 className="font-semibold text-[15px]">{alert.title}</h3>
                    <p className="text-[13px] opacity-90 mt-0.5">{alert.message}</p>
                </div>
                <Button 
                    size="sm" 
                    variant="ghost" 
                    className={cn("h-8 px-3 bg-white/50 hover:bg-white", alert.type === 'danger' ? "text-red-700" : "text-orange-700")}
                    onClick={() => onChangeTab('tasks')}
                >
                    Fix
                </Button>
            </motion.div>
        ))}

        {/* Credit Score Snapshot (Apple Health Style) */}
        <Card 
            className="p-5 relative overflow-hidden active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-sm border-0" 
            onClick={() => onChangeTab('recovery')}
        >
           <div className="flex justify-between items-start mb-6">
             <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <TrendingUp size={18} />
               </div>
               <span className="text-[17px] font-semibold text-gray-900">Credit Score</span>
             </div>
             <span className="text-[13px] text-gray-400 font-medium flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                Updated {user?.lastUpdated}
             </span>
           </div>
           
           <div className="flex items-end justify-between">
             <div>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-[40px] font-bold text-black tracking-tight leading-none">{user?.creditScore}</h2>
                    <span className="text-[20px] font-medium text-gray-400">/ 900</span>
                </div>
                <div className={cn(
                    "inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[13px] font-semibold",
                    user?.creditScore! >= 750 ? "bg-green-100 text-green-700" :
                    user?.creditScore! >= 650 ? "bg-yellow-100 text-yellow-700" : "bg-orange-100 text-orange-700"
                )}>
                    {user?.scoreStatus}
                </div>
             </div>

             {/* Visual Ring Indicator */}
             <div className="relative w-24 h-12 overflow-hidden flex items-end justify-center mb-1">
                <div className="w-20 h-20 rounded-full border-[6px] border-gray-100 absolute -bottom-10" />
                <div 
                    className="w-20 h-20 rounded-full border-[6px] border-indigo-500 absolute -bottom-10 border-l-transparent border-b-transparent border-r-transparent transition-all duration-1000 ease-out"
                    style={{ transform: `rotate(${(user?.creditScore! / 900) * 180 - 45}deg)` }}
                />
             </div>
           </div>
        </Card>

        {/* Confidence / Trust Indicator (Gamified) */}
        <section>
          <div className="flex justify-between items-center px-1 mb-2">
            <h3 className="text-[20px] font-bold text-black tracking-tight">Trust Meter</h3>
            <span className="text-[13px] font-medium text-[#007AFF]">Level {user?.level}</span>
          </div>
          <Card className="p-0 overflow-hidden bg-[#1C1C1E] text-white border-0 shadow-lg shadow-black/5">
            <div className="p-5">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3 items-center">
                    <div className="p-2 bg-yellow-500/20 rounded-xl">
                        <Shield className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                    </div>
                    <div>
                        <div className="text-[15px] font-semibold text-gray-200">Recovery Streak</div>
                        <div className="text-[24px] font-bold">{user?.streak} Days</div>
                    </div>
                </div>
                <Badge variant="warning" className="bg-yellow-500/20 text-yellow-400 border-0">
                    +10 pts
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[13px] font-medium text-gray-400">
                    <span>Progress to Level {user?.level! + 1}</span>
                    <span>{user?.nextLevelProgress}%</span>
                </div>
                <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }} animate={{ width: `${user?.nextLevelProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-full rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)]" 
                    />
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* Next Best Action */}
        <section>
          <div className="flex justify-between items-center px-1 mb-2">
            <h3 className="text-[20px] font-bold text-black tracking-tight">Next Best Action</h3>
          </div>
          {nextTask ? (
            <div 
                onClick={() => onChangeTab('tasks')}
                className="bg-white p-5 rounded-2xl shadow-sm active:scale-[0.98] transition-transform duration-200 border border-gray-100 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#007AFF]" />
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={nextTask.impact === 'high' ? 'destructive' : 'neutral'} className="rounded-md px-2">
                      {nextTask.impact === 'high' ? 'High Impact' : 'Recommended'}
                    </Badge>
                    <span className="text-[12px] font-medium text-gray-400">
                        {nextTask.dueDate === 'Today' ? 'Due Today' : nextTask.dueDate}
                    </span>
                  </div>
                  <h4 className="text-[17px] font-semibold text-gray-900 leading-snug">{nextTask.title}</h4>
                  <p className="text-[15px] text-gray-500 mt-1 line-clamp-1">{nextTask.description}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <ArrowRight size={20} className="text-[#007AFF]" />
                </div>
              </div>
            </div>
          ) : (
            <Card className="p-6 flex flex-col items-center justify-center text-center text-gray-500 gap-2">
               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                  <CheckCircle2 size={24} />
               </div>
               <h4 className="font-semibold text-gray-900">All caught up!</h4>
               <p className="text-[15px]">You've completed all pending actions.</p>
            </Card>
          )}
        </section>

        {/* Quick Access Grid */}
        <section>
             <h3 className="text-[20px] font-bold text-black tracking-tight px-1 mb-3">Quick Actions</h3>
             <div className="grid grid-cols-2 gap-3">
                <QuickActionCard 
                    icon={<Zap className="text-orange-600" size={24} />} 
                    label="Instant Pay" 
                    subLabel="Clear dues" 
                    color="bg-orange-50"
                    onClick={() => onChangeTab('tasks')} 
                />
                <QuickActionCard 
                    icon={<FileText className="text-purple-600" size={24} />} 
                    label="View Report" 
                    subLabel="Detailed analysis" 
                    color="bg-purple-50"
                    onClick={() => onChangeTab('recovery')} 
                />
                <QuickActionCard 
                    icon={<AlertTriangle className="text-red-600" size={24} />} 
                    label="Dispute Error" 
                    subLabel="Fix mistakes" 
                    color="bg-red-50"
                    onClick={() => onChangeTab('learn')} 
                />
                <QuickActionCard 
                    icon={<Calendar className="text-blue-600" size={24} />} 
                    label="Plan Ahead" 
                    subLabel="Upcoming" 
                    color="bg-blue-50"
                    onClick={() => onChangeTab('tasks')} 
                />
             </div>
        </section>

      </div>
    </div>
  );
};

const QuickActionCard = ({ icon, label, subLabel, color, onClick }: { icon: React.ReactNode, label: string, subLabel: string, color: string, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-[0.96] transition-transform cursor-pointer flex flex-col gap-3 items-start"
    >
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
            {icon}
        </div>
        <div>
            <h4 className="font-semibold text-[15px] text-gray-900 leading-tight">{label}</h4>
            <p className="text-[13px] text-gray-400 mt-0.5">{subLabel}</p>
        </div>
    </div>
);

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
}
