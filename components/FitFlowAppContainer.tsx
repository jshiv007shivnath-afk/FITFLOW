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
import { HelpCenterView } from '@/components/screens/HelpCenterView';
import { WeeklyPlannerView } from '@/components/screens/WeeklyPlannerView';
import { DisclaimerView } from '@/components/screens/DisclaimerView';
import { AccessibilityStatementView } from '@/components/screens/AccessibilityStatementView';
import { BannedAccountView } from '@/components/screens/BannedAccountView';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { NotificationsView } from '@/components/screens/NotificationsView';
import { motion, AnimatePresence } from 'motion/react';

export function FitFlowAppContainer() {
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
    isAccountBanned,
    dismissBannedAndLogout,
    user,
  } = useFitFlow();

  const renderActiveScreen = () => {
    if (!isHydrated) {
      return <DashboardSkeleton />;
    }
    if (isAccountBanned) {
      return (
        <BannedAccountView
          email={user.email}
          onTryOtherEmail={dismissBannedAndLogout}
        />
      );
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

  const hideNav =
    isAccountBanned ||
    showLogin ||
    showOtp ||
    showSetName ||
    showOnboarding ||
    showWelcome ||
    showNotifications ||
    showPrivacyPolicy ||
    showTerms ||
    showHelpCenter ||
    showDisclaimer ||
    showAccessibilityStatement;

  const currentScreenKey = isAccountBanned
    ? 'banned'
    : showLogin
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
    <div className="relative min-h-[100dvh] w-full bg-[#F8F8F6] sm:bg-neutral-950 flex items-center justify-center overflow-x-hidden">
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
                <div
                  className="w-5 h-5 shrink-0 relative flex items-center justify-center"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 28 28"
                    className="w-5 h-5 -rotate-90 transform"
                  >
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="#371018"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="11"
                      fill="none"
                      stroke="#FA114F"
                      strokeWidth="2.5"
                      strokeDasharray="69.1"
                      strokeDashoffset="18"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="7.5"
                      fill="none"
                      stroke="#182E06"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="7.5"
                      fill="none"
                      stroke="#B8F45A"
                      strokeWidth="2.5"
                      strokeDasharray="47.1"
                      strokeDashoffset="12"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="4"
                      fill="none"
                      stroke="#062230"
                      strokeWidth="2.2"
                    />
                    <circle
                      cx="14"
                      cy="14"
                      r="4"
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="2.2"
                      strokeDasharray="25.1"
                      strokeDashoffset="6"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="truncate">{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        }
      >
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreenKey}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.99 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              className="flex-1 w-full flex flex-col"
            >
              {renderActiveScreen()}
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </PhoneSimulator>
    </div>
  );
}
