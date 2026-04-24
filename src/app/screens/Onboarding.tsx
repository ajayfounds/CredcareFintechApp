import React, { useState, useEffect } from 'react';
import { Shield, Lock, ChevronRight, CheckCircle, Loader2, CreditCard } from 'lucide-react';
import { Button, Card } from '../components/ui/WireframeComponents';
import { motion, AnimatePresence } from 'motion/react';
import { api, USERS } from '../utils/api';
import { toast } from "sonner@2.0.3";

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep(prev => prev + 1);

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 0 && <WelcomeStep key="welcome" onNext={nextStep} />}
          {step === 1 && <SafetyStep key="safety" onNext={nextStep} />}
          {step === 2 && <DataPrivacyStep key="privacy" onNext={nextStep} />}
          {step === 3 && <ConnectStep key="connect" onNext={nextStep} />}
          {step === 4 && <LoadingStep key="loading" onComplete={onComplete} />}
        </AnimatePresence>
      </div>
      
      {/* Pagination Dots */}
      {step < 4 && (
        <div className="absolute top-12 left-0 right-0 flex justify-center gap-2 z-10">
          {[0, 1, 2, 3].map(i => (
             <div 
               key={i} 
               className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-black' : 'w-1.5 bg-gray-200'}`} 
             />
          ))}
        </div>
      )}
    </div>
  );
};

const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
    className="flex flex-col h-full p-6 pt-24 pb-12"
  >
    <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
      <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center mb-4 shadow-sm border border-gray-100">
        <Shield className="w-12 h-12 text-black" strokeWidth={1.5} />
      </div>
      <h1 className="text-[34px] font-bold text-black leading-tight tracking-tight">Rebuild Trust.<br />Without Shame.</h1>
      <p className="text-[17px] text-gray-500 leading-relaxed max-w-[280px]">
        A safe path to financial recovery. No judgment, just progress.
      </p>
    </div>
    <Button className="w-full h-14 text-[17px] font-semibold rounded-2xl bg-black text-white shadow-lg shadow-black/10 active:scale-95 transition-transform" onClick={onNext}>
      Get Started
    </Button>
  </motion.div>
);

const SafetyStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
    className="flex flex-col h-full p-6 pt-24 pb-12"
  >
    <div className="flex-1">
      <h2 className="text-[28px] font-bold text-black mb-2">This is a safe space</h2>
      <p className="text-[17px] text-gray-500 mb-10">We prioritize your privacy and emotional safety.</p>
      
      <div className="space-y-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
             <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900">Checking won't hurt</h3>
            <p className="text-[15px] text-gray-500 mt-1 leading-relaxed">Viewing your score here will never lower it. Check as often as you like.</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
             <Lock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-[17px] font-semibold text-gray-900">Private & Secure</h3>
            <p className="text-[15px] text-gray-500 mt-1 leading-relaxed">Your data is encrypted. We never sell your personal information to banks.</p>
          </div>
        </div>
      </div>
    </div>
    <Button className="w-full h-14 text-[17px] font-semibold rounded-2xl bg-black text-white active:scale-95 transition-transform" onClick={onNext}>
      I Understand
    </Button>
  </motion.div>
);

const DataPrivacyStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
    className="flex flex-col h-full p-6 pt-24 pb-12"
  >
    <div className="flex-1">
      <h2 className="text-[28px] font-bold text-black mb-2">How we use data</h2>
      <p className="text-[17px] text-gray-500 mb-10">We need minimal access to build your plan.</p>
      
      <Card className="bg-gray-50 border-none p-6 space-y-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <CreditCard className="w-8 h-8 text-gray-900" />
          <div>
            <p className="font-semibold text-gray-900 text-[17px]">Credit History</p>
            <p className="text-[14px] text-gray-500">To identify missed payments</p>
          </div>
        </div>
        <div className="h-px bg-gray-200" />
        <div className="flex items-center gap-4">
          <Shield className="w-8 h-8 text-gray-900" />
          <div>
            <p className="font-semibold text-gray-900 text-[17px]">Identity Verification</p>
            <p className="text-[14px] text-gray-500">To ensure it's really you</p>
          </div>
        </div>
      </Card>
    </div>
    
    <div className="space-y-4">
      <p className="text-[12px] text-center text-gray-400">
        By continuing, you agree to our Terms & Privacy Policy.
      </p>
      <Button className="w-full h-14 text-[17px] font-semibold rounded-2xl bg-black text-white active:scale-95 transition-transform" onClick={onNext}>
        Agree & Continue
      </Button>
    </div>
  </motion.div>
);

const ConnectStep = ({ onNext }: { onNext: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
    className="flex flex-col h-full p-6 pt-24 pb-12"
  >
    <div className="flex-1">
      <h2 className="text-[28px] font-bold text-black mb-2">Verify identity</h2>
      <p className="text-[17px] text-gray-500 mb-8">Enter your mobile number linked to your bank accounts.</p>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide ml-1">Mobile Number</label>
          <div className="flex gap-3">
            <div className="h-14 w-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-900 font-semibold border border-gray-100">
              +91
            </div>
            <input 
              type="tel" 
              className="flex-1 h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl text-[17px] font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all"
              placeholder="98765 43210"
              defaultValue="98765 43210"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-[13px] font-semibold text-gray-900 uppercase tracking-wide ml-1">PAN Number (Optional)</label>
          <input 
            type="text" 
            className="w-full h-14 px-4 bg-gray-50 border border-gray-100 rounded-2xl text-[17px] font-semibold focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all uppercase placeholder:normal-case"
            placeholder="ABCDE1234F"
            defaultValue="ABCDE1234F"
          />
        </div>
      </div>
    </div>
    <Button className="w-full h-14 text-[17px] font-semibold rounded-2xl bg-black text-white active:scale-95 transition-transform" onClick={onNext}>
      Fetch My Report
    </Button>
  </motion.div>
);

const LoadingStep = ({ onComplete }: { onComplete: () => void }) => {
  const [status, setStatus] = useState(0);

  useEffect(() => {
    // Simulate steps
    const t1 = setTimeout(() => setStatus(1), 800);
    const t2 = setTimeout(() => setStatus(2), 2000);

    const initData = async () => {
      try {
        await api.post(`/seed/${USERS.CURRENT_USER_ID}`, {});
        setTimeout(onComplete, 3500);
      } catch (err) {
        console.error("Failed to seed data", err);
        toast.error("Something went wrong. Please try again.");
      }
    };

    initData();

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="flex flex-col h-full justify-center items-center text-center space-y-8 p-8"
    >
      <div className="relative">
        <div className="w-24 h-24 border-4 border-gray-100 rounded-full" />
        <div className="absolute top-0 left-0 w-24 h-24 border-4 border-t-black border-r-black border-b-transparent border-l-transparent rounded-full animate-spin" />
      </div>
      <div>
        <h3 className="text-[22px] font-bold text-gray-900 mb-2">Building your plan...</h3>
        <p className="text-[17px] text-gray-500">We're analyzing your credit history to find the best path forward.</p>
      </div>
      
      <div className="w-full max-w-[240px] space-y-4 pt-4">
        <StatusItem label="Connecting to bureau" active={status >= 0} completed={status > 0} />
        <StatusItem label="Verifying identity" active={status >= 1} completed={status > 1} />
        <StatusItem label="Calculating trust score" active={status >= 2} completed={status > 2} />
      </div>
    </motion.div>
  );
};

const StatusItem = ({ label, active, completed }: { label: string, active: boolean, completed: boolean }) => (
  <div className={`flex items-center gap-3 transition-colors duration-500 ${active ? 'opacity-100' : 'opacity-30'}`}>
    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors duration-500 ${completed ? 'bg-green-500 border-green-500' : active ? 'border-black' : 'border-gray-300'}`}>
      {completed && <CheckCircle className="w-3.5 h-3.5 text-white" />}
      {!completed && active && <div className="w-2 h-2 bg-black rounded-full animate-pulse" />}
    </div>
    <span className={`text-[15px] font-medium transition-colors ${completed ? 'text-gray-900' : active ? 'text-gray-900' : 'text-gray-400'}`}>{label}</span>
  </div>
);

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
