import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, cn } from '../components/ui/WireframeComponents';
import { api, USERS } from '../utils/api';
import { 
  AlertCircle, 
  Calendar, 
  ChevronRight, 
  Loader2, 
  Check, 
  Banknote, 
  FileText,
  AlertTriangle,
  ArrowRight,
  UploadCloud,
  Camera,
  Image as ImageIcon,
  FileCheck,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "../components/ui/drawer";

// --- Types ---

type Tab = 'tasks' | 'loans';

type TaskCategory = 'payment' | 'document' | 'review' | 'generic';

type Task = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  category: TaskCategory;
  impact: 'high' | 'medium' | 'low';
  amount?: number;
  provider?: string;
  documentType?: string;
};

type Loan = {
  id: string;
  lender: string;
  type: string;
  amountDue: number;
  dueDate: string;
  status: string;
  missedPayments: number;
};

// --- Mock Data ---

const MOCK_TASKS: Task[] = [
    {
        id: '1',
        title: "Pay HDFC Credit Card",
        description: "Minimum due payment to avoid late fees. This will positively impact your payment history.",
        dueDate: "Today",
        status: "pending",
        category: "payment",
        impact: "high",
        amount: 15400,
        provider: "HDFC Bank"
    },
    {
        id: '2',
        title: "Upload Income Proof",
        description: "Update your income details to increase credit limit eligibility. Please provide your latest payslip.",
        dueDate: "Tomorrow",
        status: "pending",
        category: "document",
        impact: "medium",
        documentType: "Payslip / IT Return"
    },
    {
        id: '3',
        title: "Dispute CIBIL Error",
        description: "You flagged an unknown loan inquiry. Review the dispute form before submission.",
        dueDate: "Fri, Feb 14",
        status: "pending",
        category: "review",
        impact: "high"
    },
    {
        id: '4',
        title: "Setup Auto-pay",
        description: "Never miss a payment by enabling auto-debit for your SBI Loan.",
        dueDate: "Next Week",
        status: "pending",
        category: "generic",
        impact: "medium"
    },
    {
        id: '5',
        title: "Verify Email",
        description: "Complete your profile verification.",
        dueDate: "Past",
        status: "completed",
        category: "generic",
        impact: "low"
    }
];

// --- Main Component ---

export const Tasks = () => {
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskOpen, setIsTaskOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // For button loading states

  // Loan specific (retained from previous)
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isPayOpen, setIsPayOpen] = useState(false);

  useEffect(() => {
    // Simulate API Load
    const loadData = async () => {
        setLoading(true);
        await new Promise(r => setTimeout(r, 800)); // Network delay simulation
        setTasks(MOCK_TASKS);
        setLoans([
            { id: 'l1', lender: "HDFC Bank", type: "Credit Card", amountDue: 15400, dueDate: "Today", status: "due", missedPayments: 0 },
            { id: 'l2', lender: "Bajaj Finserv", type: "Personal Loan", amountDue: 8250, dueDate: "Feb 20", status: "active", missedPayments: 0 },
            { id: 'l3', lender: "SBI Cards", type: "Credit Card", amountDue: 4500, dueDate: "Overdue", status: "overdue", missedPayments: 1 }
        ]);
        setLoading(false);
    };
    loadData();
  }, []);

  // --- Handlers ---

  const handleTaskClick = (task: Task) => {
    if (task.status === 'completed') return;
    setSelectedTask(task);
    setIsTaskOpen(true);
    setIsProcessing(false);
  };

  const handleTaskAction = async () => {
    if (!selectedTask) return;
    setIsProcessing(true);

    // Simulate different action durations based on type
    const delay = selectedTask.category === 'payment' ? 2000 : 1000;
    
    await new Promise(r => setTimeout(r, delay));

    setTasks(prev => prev.map(t => t.id === selectedTask.id ? { ...t, status: 'completed' } : t));
    setIsProcessing(false);
    setIsTaskOpen(false);

    if (selectedTask.category === 'payment') {
        toast.success(`Payment of ₹${selectedTask.amount?.toLocaleString()} successful`);
    } else if (selectedTask.category === 'document') {
        toast.success("Document uploaded successfully");
    } else {
        toast.success("Task completed");
    }
  };

  const handleQuickComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t));
    toast.success("Task updated");
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F2F2F7]">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-[#F2F2F7]">
      {/* iOS Header */}
      <div className="bg-[#F2F2F7] px-5 pt-4 pb-2 sticky top-0 z-10">
        <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight">Action Center</h1>
      </div>

      {/* Segmented Control */}
      <div className="px-5 mb-6">
        <div className="bg-[#767680]/15 p-0.5 rounded-lg flex relative h-[32px]">
          <button
            onClick={() => setActiveTab('tasks')}
            className={cn(
              "flex-1 text-[13px] font-semibold text-center z-10 relative transition-colors duration-200",
              activeTab === 'tasks' ? "text-black" : "text-gray-500"
            )}
          >
            My Tasks
          </button>
          <button
            onClick={() => setActiveTab('loans')}
            className={cn(
              "flex-1 text-[13px] font-semibold text-center z-10 relative transition-colors duration-200",
              activeTab === 'loans' ? "text-black" : "text-gray-500"
            )}
          >
            Loans & Cards
          </button>
          <motion.div
            className="absolute top-0.5 bottom-0.5 bg-white rounded-[6px] shadow-sm w-[calc(50%-2px)]"
            initial={false}
            animate={{ x: activeTab === 'tasks' ? 2 : "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-32">
        <AnimatePresence mode="wait">
            {activeTab === 'tasks' ? (
                <TaskListSection tasks={tasks} onTaskClick={handleTaskClick} onQuickComplete={handleQuickComplete} />
            ) : (
                <LoanListSection loans={loans} onLoanClick={(l) => { setSelectedLoan(l); setIsPayOpen(true); }} />
            )}
        </AnimatePresence>
      </div>

      {/* Dynamic Task Drawer */}
      <Drawer open={isTaskOpen} onOpenChange={setIsTaskOpen}>
        <DrawerContent className="bg-[#F2F2F7] rounded-t-[20px] max-h-[92vh] flex flex-col">
            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1 px-4 pt-2 pb-safe">
                {selectedTask && (
                    <>
                        {/* Header Card */}
                        <div className="bg-white rounded-[20px] p-5 shadow-sm mb-4 text-center relative overflow-hidden">
                            <div className={cn(
                                "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-sm",
                                selectedTask.category === 'payment' ? "bg-orange-100 text-orange-600" :
                                selectedTask.category === 'document' ? "bg-blue-100 text-blue-600" :
                                "bg-gray-100 text-gray-600"
                            )}>
                                {selectedTask.category === 'payment' && <Banknote size={32} />}
                                {selectedTask.category === 'document' && <UploadCloud size={32} />}
                                {selectedTask.category === 'review' && <FileCheck size={32} />}
                                {selectedTask.category === 'generic' && <Check size={32} />}
                            </div>
                            
                            <DrawerTitle className="text-[22px] font-bold text-gray-900 leading-tight mb-2">
                                {selectedTask.title}
                            </DrawerTitle>
                            <DrawerDescription className="text-[15px] text-gray-500 leading-relaxed max-w-[90%] mx-auto">
                                {selectedTask.description}
                            </DrawerDescription>
                        </div>

                        {/* Action Specific Content */}
                        {selectedTask.category === 'payment' && (
                            <div className="bg-white rounded-[20px] overflow-hidden shadow-sm mb-6">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                                    <span className="text-[15px] font-medium text-gray-500">Amount Due</span>
                                    <span className="text-[24px] font-bold text-gray-900">₹{selectedTask.amount?.toLocaleString()}</span>
                                </div>
                                <div className="p-4 flex justify-between items-center">
                                    <span className="text-[15px] font-medium text-gray-500">Due By</span>
                                    <span className="text-[15px] font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                                        {selectedTask.dueDate}
                                    </span>
                                </div>
                            </div>
                        )}

                        {selectedTask.category === 'document' && (
                            <div className="space-y-3 mb-6">
                                <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide ml-4">Upload Options</h3>
                                <button className="w-full bg-white active:bg-gray-50 p-4 rounded-xl flex items-center gap-4 transition-colors">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <Camera size={20} />
                                    </div>
                                    <span className="text-[17px] font-medium text-blue-600">Scan Document</span>
                                </button>
                                <button className="w-full bg-white active:bg-gray-50 p-4 rounded-xl flex items-center gap-4 transition-colors">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <ImageIcon size={20} />
                                    </div>
                                    <span className="text-[17px] font-medium text-blue-600">Choose from Library</span>
                                </button>
                            </div>
                        )}

                        {selectedTask.category === 'review' && (
                            <div className="bg-white rounded-[20px] p-5 shadow-sm mb-6 max-h-[200px] overflow-y-auto">
                                <h4 className="font-semibold text-gray-900 mb-2">Dispute Details</h4>
                                <p className="text-[15px] text-gray-600 leading-relaxed">
                                    You are disputing an inquiry from "Bajaj Finance" dated Jan 12, 2026. 
                                    By proceeding, you confirm that you did not authorize this inquiry. 
                                    This will trigger a formal investigation with CIBIL.
                                </p>
                            </div>
                        )}

                        {/* Sticky Bottom Actions */}
                        <div className="mt-4 pb-8">
                            <Button 
                                size="lg" 
                                className={cn(
                                    "w-full h-14 text-[17px] font-bold rounded-xl shadow-lg mb-3 transition-all",
                                    selectedTask.category === 'payment' ? "bg-black text-white hover:bg-gray-900" :
                                    selectedTask.category === 'document' ? "bg-blue-600 text-white hover:bg-blue-700" :
                                    "bg-[#007AFF] text-white hover:bg-[#0062cc]"
                                )}
                                onClick={handleTaskAction}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : (
                                    selectedTask.category === 'payment' ? `Pay ₹${selectedTask.amount?.toLocaleString()}` :
                                    selectedTask.category === 'document' ? 'Upload & Submit' :
                                    selectedTask.category === 'review' ? 'Submit Dispute' :
                                    'Mark as Complete'
                                )}
                            </Button>
                            
                            <DrawerClose asChild>
                                <Button variant="ghost" size="lg" className="w-full h-14 text-[17px] font-semibold text-gray-500 rounded-xl">
                                    Do Later
                                </Button>
                            </DrawerClose>
                        </div>
                    </>
                )}
            </div>
        </DrawerContent>
      </Drawer>

      {/* Simplified Loan Pay Drawer for completeness */}
      <Drawer open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DrawerContent className="bg-white rounded-t-[20px]">
             <div className="px-6 pb-8 pt-4">
                 <DrawerTitle className="text-2xl font-bold mb-2">Pay {selectedLoan?.lender}</DrawerTitle>
                 <DrawerDescription className="mb-6">Paying full amount due</DrawerDescription>
                 <Button className="w-full h-14 rounded-xl text-[17px] font-bold" onClick={() => setIsPayOpen(false)}>Confirm Payment</Button>
             </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

// --- Sub Components ---

const TaskListSection = ({ tasks, onTaskClick, onQuickComplete }: { tasks: Task[], onTaskClick: (t: Task) => void, onQuickComplete: (e: any, id: string) => void }) => {
    const pending = tasks.filter(t => t.status !== 'completed');
    const completed = tasks.filter(t => t.status === 'completed');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            {pending.length === 0 && (
                 <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">You're all set!</h3>
                    <p className="text-gray-500">No pending tasks for today.</p>
                 </div>
            )}

            {pending.length > 0 && (
                <section>
                    <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-4">To Do</h2>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100 border border-gray-200/60">
                        {pending.map(task => (
                            <TaskRow key={task.id} task={task} onClick={() => onTaskClick(task)} onCheck={onQuickComplete} />
                        ))}
                    </div>
                </section>
            )}

            {completed.length > 0 && (
                <section>
                    <h2 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide mb-2 ml-4">Completed</h2>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100 border border-gray-200/60 opacity-60">
                        {completed.map(task => (
                            <TaskRow key={task.id} task={task} onClick={() => onTaskClick(task)} onCheck={onQuickComplete} />
                        ))}
                    </div>
                </section>
            )}
        </motion.div>
    );
};

const TaskRow = ({ task, onClick, onCheck }: { task: Task, onClick: () => void, onCheck: (e: any, id: string) => void }) => {
    // Icon Logic
    const Icon = task.category === 'payment' ? Banknote : 
                 task.category === 'document' ? FileText : 
                 task.category === 'review' ? AlertTriangle : Check;
    
    const iconColor = task.category === 'payment' ? "text-orange-500 bg-orange-50" :
                      task.category === 'document' ? "text-blue-500 bg-blue-50" :
                      task.category === 'review' ? "text-red-500 bg-red-50" : "text-gray-500 bg-gray-100";

    return (
        <div 
            onClick={onClick}
            className="group flex items-center gap-3 p-4 active:bg-gray-50 transition-colors cursor-pointer"
        >
            {/* Custom Checkbox / Icon Area */}
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", iconColor)}>
                <Icon size={20} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                    <h3 className={cn("text-[17px] font-medium text-gray-900 truncate", task.status === 'completed' && "line-through text-gray-400")}>
                        {task.title}
                    </h3>
                    {task.dueDate === 'Today' && task.status !== 'completed' && (
                        <span className="text-[12px] font-semibold text-gray-400 shrink-0">Today</span>
                    )}
                </div>
                <p className="text-[14px] text-gray-500 line-clamp-1">{task.description}</p>
            </div>

            {task.status !== 'completed' && (
                 <ChevronRight size={18} className="text-gray-300 shrink-0" />
            )}
        </div>
    );
};

const LoanListSection = ({ loans, onLoanClick }: { loans: Loan[], onLoanClick: (l: Loan) => void }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
        {loans.map(loan => (
             <div 
                key={loan.id} 
                onClick={() => onLoanClick(loan)}
                className="bg-white rounded-2xl p-4 shadow-sm active:scale-[0.98] transition-transform flex items-center gap-4 border border-gray-100"
             >
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600 text-lg">
                    {loan.lender.charAt(0)}
                </div>
                <div className="flex-1">
                    <h3 className="font-semibold text-[17px] text-gray-900">{loan.lender}</h3>
                    <p className="text-[14px] text-gray-500">{loan.type} • Due {loan.dueDate}</p>
                </div>
                <div className="text-right">
                    <span className="block font-bold text-[17px]">₹{loan.amountDue.toLocaleString()}</span>
                    {loan.status === 'overdue' && (
                        <span className="text-[12px] font-semibold text-red-600">Overdue</span>
                    )}
                </div>
             </div>
        ))}
    </motion.div>
);
