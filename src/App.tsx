/**
 * Flow Video Studio Auto - Master Desktop Application
 * @license Apache-2.0
 */

import React from 'react';
import { StudioProvider, useStudio } from './context/StudioContext';
import { AppHeader } from './components/layout/AppHeader';
import { Sidebar } from './components/layout/Sidebar';
import { FlowVideoModule } from './components/modules/flow-video/FlowVideoModule';
import { FlowImageModule } from './components/modules/flow-image/FlowImageModule';
import { CharacterWorkflowModule } from './components/modules/character-workflow/CharacterWorkflowModule';
import { LogViewerModule } from './components/modules/logs/LogViewerModule';
import { AccountSettingsModule } from './components/modules/settings/AccountSettingsModule';

const MainWorkspace: React.FC = () => {
  const { activeTab } = useStudio();

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sidebar Navigation (Tabs per SRS) */}
      <Sidebar />

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#0b0f17]">
        {activeTab === 'video' && <FlowVideoModule />}
        {activeTab === 'image' && <FlowImageModule />}
        {activeTab === 'character' && <CharacterWorkflowModule />}
        {activeTab === 'logs' && <LogViewerModule />}
        {activeTab === 'settings' && <AccountSettingsModule />}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <div className="h-screen w-screen flex flex-col bg-[#0b0f17] text-slate-100 overflow-hidden select-none font-sans">
        <AppHeader />
        <MainWorkspace />
      </div>
    </StudioProvider>
  );
}
