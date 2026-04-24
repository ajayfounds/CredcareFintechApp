import React, { useEffect, useState } from 'react';
import { Button, Switch, Input } from '../components/ui/WireframeComponents';
import { User, Shield, Bell, HelpCircle, LogOut, FileText, Loader2, ChevronRight, ChevronLeft, Settings, Mail, Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { api, USERS } from '../utils/api';
import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from "sonner";

type UserProfile = {
  name: string;
  email?: string;
  phone?: string;
};

type ViewState = 'main' | 'personal' | 'privacy' | 'data' | 'notifications' | 'help';

export const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewState>('main');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.get(`/user/${USERS.CURRENT_USER_ID}`);
        // Mock extra data if not present (since API might return limited fields)
        setUser({
          ...userData,
          email: userData.email || 'user@example.com',
          phone: userData.phone || '+91 98765 43210'
        });
      } catch (error) {
        console.error("Failed to fetch user", error);
        // Fallback for demo
        setUser({
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com",
            phone: "+91 98765 43210"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  const handleBack = () => setView('main');

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="bg-[#F2F2F7] min-h-full pb-24 relative overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {view === 'main' ? (
          <MainView 
            key="main" 
            user={user} 
            onChangeView={setView} 
            onLogout={handleLogout} 
          />
        ) : (
          <SubViewContainer key="subview" view={view} onBack={handleBack}>
             {view === 'personal' && <PersonalView user={user} />}
             {view === 'privacy' && <PrivacyView />}
             {view === 'data' && <DataUsageView />}
             {view === 'notifications' && <NotificationsView />}
             {view === 'help' && <HelpView />}
          </SubViewContainer>
        )}
      </AnimatePresence>
    </div>
  );
};

const MainView = ({ user, onChangeView, onLogout }: { user: UserProfile | null, onChangeView: (view: ViewState) => void, onLogout: () => void }) => (
  <motion.div 
    initial={{ x: -100, opacity: 0 }} 
    animate={{ x: 0, opacity: 1 }} 
    exit={{ x: -100, opacity: 0 }}
    className="h-full"
  >
      {/* iOS Header */}
      <div className="bg-[#F2F2F7] px-4 pt-4 pb-2 sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-[34px] font-bold text-black tracking-tight leading-tight">Profile</h1>
      </div>

      <div className="px-4 mt-4 mb-8 text-center">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-gray-500 border-4 border-white shadow-sm overflow-hidden">
           {user?.name?.[0] || "U"}
        </div>
        <h2 className="text-[22px] font-bold text-gray-900">{user?.name || "User"}</h2>
        <p className="text-[15px] text-gray-500 mt-0.5">{user?.phone || "+91 98765 43210"}</p>
      </div>

      <div className="px-4 space-y-8">
        <section>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            <ProfileLink icon={<User size={20} />} label="Personal Information" onClick={() => onChangeView('personal')} />
            <ProfileLink icon={<Shield size={20} />} label="Privacy & Security" onClick={() => onChangeView('privacy')} />
            <ProfileLink icon={<FileText size={20} />} label="Data Usage Permissions" onClick={() => onChangeView('data')} />
          </div>
        </section>

        <section>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            <ProfileLink icon={<Bell size={20} />} label="Notifications" onClick={() => onChangeView('notifications')} />
            <ProfileLink icon={<HelpCircle size={20} />} label="Help & Support" onClick={() => onChangeView('help')} />
          </div>
        </section>

        <Button 
            variant="ghost" 
            className="w-full bg-white h-12 text-red-500 hover:bg-red-50 text-[17px] font-semibold rounded-2xl shadow-sm"
            onClick={onLogout}
        >
          Log Out
        </Button>
        
        <p className="text-center text-[13px] text-gray-400">
          Version 1.0.0 (Build 20240202)
        </p>
      </div>
  </motion.div>
);

const SubViewContainer = ({ view, onBack, children }: { view: ViewState, onBack: () => void, children: React.ReactNode }) => {
    const titles: Record<string, string> = {
        personal: "Personal Info",
        privacy: "Privacy & Security",
        data: "Data Permissions",
        notifications: "Notifications",
        help: "Help & Support"
    };

    return (
        <motion.div 
            initial={{ x: 100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            exit={{ x: 100, opacity: 0 }}
            className="h-full flex flex-col"
        >
             <div className="bg-[#F2F2F7] px-2 pt-2 pb-2 sticky top-0 z-20 flex items-center border-b border-gray-200/50 backdrop-blur-xl">
                <button onClick={onBack} className="p-2 text-[#007AFF] flex items-center gap-1 active:opacity-50 transition-opacity">
                    <ChevronLeft size={24} strokeWidth={2.5} />
                    <span className="text-[17px] font-medium">Back</span>
                </button>
                <h1 className="text-[17px] font-semibold text-black absolute left-1/2 -translate-x-1/2">
                    {titles[view]}
                </h1>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pt-6 pb-24">
                {children}
            </div>
        </motion.div>
    );
};

const PersonalView = ({ user }: { user: UserProfile | null }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100 px-4 py-2">
            <div className="py-3">
                <label className="text-[13px] text-gray-500 uppercase font-medium">Full Name</label>
                <Input defaultValue={user?.name} className="mt-1 border-gray-200" />
            </div>
            <div className="py-3">
                <label className="text-[13px] text-gray-500 uppercase font-medium">Email</label>
                <div className="relative">
                    <Input defaultValue={user?.email} className="mt-1 pl-10 border-gray-200" />
                    <Mail size={18} className="absolute left-3 top-4 text-gray-400" />
                </div>
            </div>
            <div className="py-3">
                <label className="text-[13px] text-gray-500 uppercase font-medium">Phone</label>
                <div className="relative">
                    <Input defaultValue={user?.phone} className="mt-1 pl-10 border-gray-200" />
                    <Phone size={18} className="absolute left-3 top-4 text-gray-400" />
                </div>
            </div>
        </div>
        <p className="text-[13px] text-gray-400 px-4">
            Changes to your personal information may require re-verification of your identity.
        </p>
        <Button className="w-full bg-black text-white rounded-xl h-12 text-[17px] font-semibold">Save Changes</Button>
    </div>
);

const PrivacyView = () => (
    <div className="space-y-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <div className="flex items-center justify-between p-4">
                 <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <Lock size={18} />
                     </div>
                     <span className="text-[17px] font-medium text-gray-900">Change Password</span>
                 </div>
                 <ChevronRight className="text-gray-300 w-5 h-5" />
             </div>
             <div className="flex items-center justify-between p-4">
                 <div className="flex items-center gap-3">
                     <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <Shield size={18} />
                     </div>
                     <span className="text-[17px] font-medium text-gray-900">Face ID Login</span>
                 </div>
                 <Switch defaultChecked />
             </div>
        </div>

        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide px-4">Session</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
            <div className="p-4 flex flex-col gap-1">
                <div className="flex justify-between">
                     <span className="text-[17px] font-medium text-gray-900">iPhone 14 Pro</span>
                     <span className="text-[13px] text-green-600 font-medium">Active now</span>
                </div>
                <span className="text-[13px] text-gray-500">Mumbai, India</span>
            </div>
             <div className="p-4 flex flex-col gap-1 opacity-50">
                <div className="flex justify-between">
                     <span className="text-[17px] font-medium text-gray-900">Chrome on Mac</span>
                     <span className="text-[13px] text-gray-400">2d ago</span>
                </div>
                <span className="text-[13px] text-gray-500">Mumbai, India</span>
            </div>
        </div>
    </div>
);

const DataUsageView = () => (
    <div className="space-y-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm flex gap-4 items-start">
            <Shield className="w-8 h-8 text-green-600 shrink-0" />
            <div>
                <h3 className="font-bold text-[17px] text-gray-900">Your Data is Encrypted</h3>
                <p className="text-[15px] text-gray-500 mt-1 leading-relaxed">
                    We use bank-grade 256-bit encryption to protect your sensitive financial information.
                </p>
            </div>
        </div>

        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide px-4">Permissions</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <div className="flex items-center justify-between p-4">
                 <div className="pr-4">
                     <span className="text-[17px] font-medium text-gray-900 block">Credit Bureau Access</span>
                     <span className="text-[13px] text-gray-500 leading-tight block mt-0.5">Allow us to refresh your credit report monthly.</span>
                 </div>
                 <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between p-4">
                 <div className="pr-4">
                     <span className="text-[17px] font-medium text-gray-900 block">SMS Parsing</span>
                     <span className="text-[13px] text-gray-500 leading-tight block mt-0.5">Analyze transaction SMS to track spending automatically.</span>
                 </div>
                 <Switch defaultChecked />
             </div>
        </div>
    </div>
);

const NotificationsView = () => (
     <div className="space-y-6">
        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide px-4">Alerts</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <div className="flex items-center justify-between p-4">
                 <span className="text-[17px] font-medium text-gray-900">Payment Reminders</span>
                 <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between p-4">
                 <span className="text-[17px] font-medium text-gray-900">Score Changes</span>
                 <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between p-4">
                 <span className="text-[17px] font-medium text-gray-900">New Offers</span>
                 <Switch />
             </div>
        </div>

        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide px-4">Channels</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <div className="flex items-center justify-between p-4">
                 <span className="text-[17px] font-medium text-gray-900">Push Notifications</span>
                 <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between p-4">
                 <span className="text-[17px] font-medium text-gray-900">Email</span>
                 <Switch defaultChecked />
             </div>
             <div className="flex items-center justify-between p-4">
                 <span className="text-[17px] font-medium text-gray-900">WhatsApp</span>
                 <Switch />
             </div>
        </div>
     </div>
);

const HelpView = () => (
    <div className="space-y-6">
        <div className="bg-black text-white p-6 rounded-2xl shadow-sm text-center">
             <h3 className="text-[20px] font-bold mb-2">Need Help?</h3>
             <p className="text-[15px] opacity-80 mb-6">Our support team is available Mon-Fri, 9am - 6pm.</p>
             <Button className="w-full bg-white text-black hover:bg-gray-100 h-12 text-[17px] font-semibold rounded-xl">Contact Support</Button>
        </div>

        <h3 className="text-[13px] font-semibold text-gray-500 uppercase tracking-wide px-4">FAQ</h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm divide-y divide-gray-100">
             <FAQItem question="How often is my score updated?" />
             <FAQItem question="Is my data safe?" />
             <FAQItem question="How do I close my account?" />
        </div>
    </div>
);

const FAQItem = ({ question }: { question: string }) => (
    <div className="flex items-center justify-between p-4 cursor-pointer active:bg-gray-50 transition-colors">
        <span className="text-[17px] font-medium text-gray-900">{question}</span>
        <ChevronRight className="text-gray-300 w-5 h-5" />
    </div>
);


const ProfileLink = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 bg-white active:bg-gray-50 transition-colors text-left group"
  >
    <div className="flex items-center gap-4">
      <div className="text-[#007AFF]">{icon}</div>
      <span className="text-[17px] text-gray-900 font-medium">{label}</span>
    </div>
    <ChevronRight className="text-gray-300 w-5 h-5 group-active:text-gray-400" />
  </button>
);
