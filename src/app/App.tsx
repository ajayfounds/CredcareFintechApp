import React, { useState, useEffect } from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import { Onboarding } from './screens/Onboarding';
import { Dashboard } from './screens/Dashboard';
import { Recovery } from './screens/Recovery';
import { Tasks } from './screens/Tasks';
import { Learn } from './screens/Learn';
import { Profile } from './screens/Profile';
import { Loader2 } from 'lucide-react';

type AppState = 'loading' | 'onboarding' | 'app';
type Tab = 'home' | 'recovery' | 'tasks' | 'learn' | 'profile';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [activeTab, setActiveTab] = useState<Tab>('home');

  useEffect(() => {
    // Check if user has completed onboarding
    const hasOnboarded = localStorage.getItem('hasOnboarded');
    if (hasOnboarded) {
      setAppState('app');
    } else {
      setAppState('onboarding');
    }
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasOnboarded', 'true');
    setAppState('app');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard onChangeTab={setActiveTab} />;
      case 'recovery': return <Recovery />;
      case 'tasks': return <Tasks />;
      case 'learn': return <Learn />;
      case 'profile': return <Profile />;
      default: return <Dashboard onChangeTab={setActiveTab} />;
    }
  };

  if (appState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (appState === 'onboarding') {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center font-sans text-gray-900 items-center">
         <div className="w-full max-w-[400px] bg-white h-screen sm:h-[800px] shadow-2xl overflow-hidden sm:rounded-3xl relative">
            <Onboarding onComplete={handleOnboardingComplete} />
         </div>
      </div>
    );
  }

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileLayout>
  );
}
