'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      setDownloadStatus(null);
      setShowIosGuide(false);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Capture PWA install prompt event if supported
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleDownloadAndroid = () => {
    // 1. Record download event in Supabase backend
    try {
      fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: 'android', source: 'landing_apk_download' }),
      }).catch(() => {});
    } catch {}

    // 2. Trigger native browser file download for FitFlow APK
    const link = document.createElement('a');
    link.href = '/download/FitFlow-v1.0.0.apk';
    link.download = 'FitFlow-v1.0.0.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadStatus('Downloading FitFlow-v1.0.0.apk! Check your notifications or Downloads folder to install.');
  };

  const handleDownloadIos = () => {
    // Record download event in Supabase backend
    try {
      fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform: 'ios', source: 'landing_ios_install' }),
      }).catch(() => {});
    } catch {}

    setShowIosGuide(true);
  };

  const handlePwaInstall = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }
    window.location.href = '/app';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 select-none"
        >
          {/* Obsidian Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container: Black & White Theme Only */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-[0_24px_70px_rgba(0,0,0,0.8)] overflow-hidden text-white"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close download dialog"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6 text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-neutral-300 mb-3 tracking-wider">
                <span>FITFLOW APP</span>
              </div>
              <h2 id="download-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Download FitFlow App
              </h2>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Install directly on your smartphone to track workouts, telemetry, and health habits offline.
              </p>
            </div>

            {/* Notification / Toast feedback */}
            {downloadStatus && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2.5"
              >
                <span className="text-base">✓</span>
                <span>{downloadStatus}</span>
              </motion.div>
            )}

            {showIosGuide && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-4 rounded-2xl bg-white/[0.06] border border-white/15 text-neutral-200 text-xs sm:text-sm leading-relaxed"
              >
                <div className="font-bold text-white mb-1.5 flex items-center gap-2">
                  <span>📱 How to install on iPhone & iPad:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-xs">
                  <li>Tap the <strong>Share</strong> button (⎋) in Safari browser.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (➕).</li>
                  <li>Tap <strong>Add</strong> — FitFlow app icon will appear on your home screen!</li>
                </ol>
                <button
                  type="button"
                  onClick={handlePwaInstall}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200"
                >
                  <span>Open Web App Now →</span>
                </button>
              </motion.div>
            )}

            {/* Interactive Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {/* Option 1: Android APK Download */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center mb-3">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white">Android APK</h3>
                  <p className="text-xs text-neutral-400 mt-1">Direct APK installer file for Android phones and tablets.</p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadAndroid}
                  className="mt-5 w-full h-11 px-5 rounded-full bg-white hover:bg-neutral-100 active:scale-95 text-neutral-950 text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg aria-hidden="true" className="w-4 h-4 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download APK</span>
                </button>
              </div>

              {/* Option 2: Apple iOS Devices */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center mb-3">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="12" y1="5" x2="12.01" y2="5" strokeWidth="3" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white">Apple iOS</h3>
                  <p className="text-xs text-neutral-400 mt-1">Standalone home screen app for iPhone and iPad.</p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadIos}
                  className="mt-5 w-full h-11 px-5 rounded-full bg-white hover:bg-neutral-100 active:scale-95 text-neutral-950 text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg aria-hidden="true" className="w-4 h-4 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Install on iOS</span>
                </button>
              </div>
            </div>

            {/* Alternative Direct Web App Option */}
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={handlePwaInstall}
                className="text-xs text-neutral-400 hover:text-white underline underline-offset-4 transition-colors"
              >
                Or launch instant web app in browser (/app) →
              </button>
            </div>

            {/* Bottom Status bar */}
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span>Standalone Athlete Application</span>
              <span>Direct APK & Device Install</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
