import React, { useState } from 'react';
import { MobileLayout } from './components/layout/MobileLayout';
import { Dashboard } from './screens/Dashboard';
import { Recovery } from './screens/Recovery';
import { Tasks } from './screens/Tasks';
import { Learn } from './screens/Learn';
import { Profile } from './screens/Profile';

type Tab = 'home' | 'recovery' | 'tasks' | 'learn' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

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

  return (
    <MobileLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </MobileLayout>
  );
}
