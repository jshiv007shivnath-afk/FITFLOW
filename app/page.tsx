'use client';

import React from 'react';
import { useFitFlow } from '@/context/FitFlowContext';
import { PhoneSimulator } from '@/components/PhoneSimulator';
import { BottomNav } from '@/components/BottomNav';
import { HomeDashboard } from '@/components/screens/HomeDashboard';
import { ProgressView } from '@/components/screens/ProgressView';
import { ProfileView } from '@/components/screens/ProfileView';
import { OnboardingView } from '@/components/screens/OnboardingView';
import { LoginView } from '@/components/screens/LoginView';
import { OtpVerificationView } from '@/components/screens/OtpVerificationView';
import { SetNameView } from '@/components/screens/SetNameView';
import { WelcomeView } from '@/components/screens/WelcomeView';
import { PrivacyPolicyView } from '@/components/screens/PrivacyPolicyView';
import { TermsView } from '@/components/screens/TermsView';
import { NotificationsView } from '@/components/screens/NotificationsView';
import { HelpCenterView } from '@/components/screens/HelpCenterView';
import { WeeklyPlannerView } from '@/components/screens/WeeklyPlannerView';
import { DisclaimerView } from '@/components/screens/DisclaimerView';
import { AccessibilityStatementView } from '@/components/screens/AccessibilityStatementView';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const {
    activeTab,
    showOnboarding,
    showLogin,
    showOtp,
    showSetName,
    showWelcome,
    showNotifications,
    showPrivacyPolicy,
    showTerms,
    showHelpCenter,
    showDisclaimer,
    showAccessibilityStatement,
    isHydrated,
    toastMessage,
    dismissToast,
  } = useFitFlow();

  const renderActiveScreen = () => {
    if (!isHydrated) {
      return <DashboardSkeleton />;
    }
    if (showLogin) {
      return <LoginView />;
    }
    if (showOtp) {
      return <OtpVerificationView />;
    }
    if (showSetName) {
      return <SetNameView />;
    }
    if (showOnboarding) {
      return <OnboardingView />;
    }
    if (showWelcome) {
      return <WelcomeView />;
    }
    if (showNotifications) {
      return <NotificationsView />;
    }
    if (showPrivacyPolicy) {
      return <PrivacyPolicyView />;
    }
    if (showTerms) {
      return <TermsView />;
    }
    if (showHelpCenter) {
      return <HelpCenterView />;
    }
    if (showDisclaimer) {
      return <DisclaimerView />;
    }
    if (showAccessibilityStatement) {
      return <AccessibilityStatementView />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeDashboard />;
      case 'planner':
        return <WeeklyPlannerView />;
      case 'progress':
        return <ProgressView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeDashboard />;
    }
  };

  const hideNav = showLogin || showOtp || showSetName || showOnboarding || showWelcome || showNotifications || showPrivacyPolicy || showTerms || showHelpCenter || showDisclaimer || showAccessibilityStatement;
  const currentScreenKey = showLogin
    ? 'login'
    : showOtp
    ? 'otp'
    : showSetName
    ? 'set-name'
    : showOnboarding
    ? 'onboarding'
    : showWelcome
    ? 'welcome'
    : showNotifications
    ? 'notifications'
    : showPrivacyPolicy
    ? 'privacy'
    : showTerms
    ? 'terms'
    : showHelpCenter
    ? 'help'
    : showDisclaimer
    ? 'disclaimer'
    : showAccessibilityStatement
    ? 'accessibility'
    : activeTab;

  return (
    <PhoneSimulator
      bottomNav={!hideNav ? <BottomNav /> : null}
      topToast={
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -24, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -24, scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              onClick={dismissToast}
              role="status"
              aria-live="polite"
              className="absolute top-3.5 left-1/2 -translate-x-1/2 z-50 bg-[#111312] text-white px-3.5 py-2 rounded-full text-xs font-semibold shadow-[0_16px_36px_rgba(0,0,0,0.45)] flex items-center gap-2.5 border border-white/20 cursor-pointer w-auto max-w-[calc(100%-48px)] select-none overflow-hidden"
            >
              {/* Handcrafted Vector Activity Rings */}
              <div className="w-5 h-5 shrink-0 relative flex items-center justify-center" aria-hidden="true">
                <svg viewBox="0 0 28 28" className="w-5 h-5 -rotate-90 transform">
                  <circle cx="14" cy="14" r="11" fill="none" stroke="#371018" strokeWidth="2.5" />
                  <circle cx="14" cy="14" r="11" fill="none" stroke="#FA114F" strokeWidth="2.5" strokeDasharray="69.1" strokeDashoffset="18" strokeLinecap="round" />
                  <circle cx="14" cy="14" r="7.5" fill="none" stroke="#182E06" strokeWidth="2.5" />
                  <circle cx="14" cy="14" r="7.5" fill="none" stroke="#B8F45A" strokeWidth="2.5" strokeDasharray="47.1" strokeDashoffset="12" strokeLinecap="round" />
                  <circle cx="14" cy="14" r="4" fill="none" stroke="#062230" strokeWidth="2.2" />
                  <circle cx="14" cy="14" r="4" fill="none" stroke="#00E5FF" strokeWidth="2.2" strokeDasharray="25.1" strokeDashoffset="7" strokeLinecap="round" />
                </svg>
              </div>
              <span className="truncate min-w-0 flex-1 leading-tight">{toastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      {/* Main Content View (Zero extra trailing space) */}
      <div className="flex-1 w-full flex flex-col pb-0 relative">
        <div key={currentScreenKey} className="flex-1 w-full flex flex-col">
          <ErrorBoundary>
            {renderActiveScreen()}
          </ErrorBoundary>
        </div>
      </div>
    </PhoneSimulator>
  );
}
