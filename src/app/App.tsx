import { BrowserRouter, Routes, Route } from 'react-router';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { CalendarView } from './components/CalendarView';
import { ExtensionPopup } from './components/ExtensionPopup';
import { Settings } from './components/Settings';
import { useState } from 'react';

export default function App() {
  const [showExtension, setShowExtension] = useState(false);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#E5E5E5]">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        {showExtension && <ExtensionPopup onClose={() => setShowExtension(false)} />}
      </div>
    </BrowserRouter>
  );
}