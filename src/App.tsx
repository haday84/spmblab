/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { RegisterForm } from './components/RegisterForm';
import { CheckStatusView } from './components/CheckStatusView';
import { VerificationAdmin } from './components/VerificationAdmin';
import { AnnouncementView } from './components/AnnouncementView';
import { RegistrationCard } from './components/RegistrationCard';
import { GitHubDeployModal } from './components/GitHubDeployModal';
import { Footer } from './components/Footer';
import { Candidate } from './types/spmb';

type ActiveTab = 'home' | 'register' | 'check-status' | 'admin-verify' | 'announcement';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [viewingCardCandidate, setViewingCardCandidate] = useState<Candidate | null>(null);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);

  // When card is opened
  const handleOpenCard = (candidate: Candidate) => {
    setViewingCardCandidate(candidate);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseCard = () => {
    setViewingCardCandidate(null);
  };

  const handleNavigate = (tab: ActiveTab) => {
    setViewingCardCandidate(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* If currently viewing printable participant card */}
        {viewingCardCandidate ? (
          <RegistrationCard
            candidate={viewingCardCandidate}
            onBack={handleCloseCard}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeView onNavigate={handleNavigate} />
            )}

            {activeTab === 'register' && (
              <RegisterForm
                onSuccess={(cand) => {
                  // User can view card or stay
                }}
                onViewCard={handleOpenCard}
              />
            )}

            {activeTab === 'check-status' && (
              <CheckStatusView
                onViewCard={handleOpenCard}
                onNavigateAnnouncement={() => handleNavigate('announcement')}
              />
            )}

            {activeTab === 'admin-verify' && (
              <VerificationAdmin />
            )}

            {activeTab === 'announcement' && (
              <AnnouncementView />
            )}
          </>
        )}
      </main>

      {/* GitHub Deployment Modal */}
      <GitHubDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      {/* Official School Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenDeploy={() => setIsDeployModalOpen(true)}
      />
    </div>
  );
}

