/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { AndroidFrame } from './components/AndroidFrame';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav, TabType } from './components/BottomNav';
import { PlayScreen } from './components/PlayScreen';
import { TricksScreen } from './components/TricksScreen';
import { DuelScreen } from './components/DuelScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { ShopScreen } from './components/ShopScreen';
import { CertificateModal } from './components/CertificateModal';
import { ProfileModal } from './components/ProfileModal';

function MainContent() {
  const [activeTab, setActiveTab] = useState<TabType>('play');
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  return (
    <AndroidFrame
      onOpenShop={() => setActiveTab('shop')}
    >
      {/* Top Bar inside Android Frame */}
      <HeaderNav
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenShop={() => setActiveTab('shop')}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {activeTab === 'play' && (
          <PlayScreen
            onOpenTricks={() => setActiveTab('tricks')}
            onOpenLeaderboard={() => setActiveTab('leaderboard')}
            onOpenShop={() => setActiveTab('shop')}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}
        {activeTab === 'tricks' && <TricksScreen />}
        {activeTab === 'duel' && <DuelScreen />}
        {activeTab === 'leaderboard' && <LeaderboardScreen />}
        {activeTab === 'shop' && (
          <ShopScreen
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}
      </div>

      {/* Bottom Thumb-Friendly Tab Bar */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />
    </AndroidFrame>
  );
}

export default function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}
