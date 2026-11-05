'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
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

  const handleDownload = async (platform: 'android' | 'ios') => {
    // Record download event in Supabase backend
    try {
      fetch('/api/downloads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform, source: 'landing_modal' }),
      }).catch(() => {});
    } catch {}

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice?.outcome === 'accepted') {
          setDeferredPrompt(null);
          window.location.href = '/app';
          return;
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }
    // Navigate directly into the standalone FitFlow app (/app)
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

            {/* Header (No Green Dot) */}
            <div className="mb-6 text-left">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-neutral-300 mb-3 tracking-wider">
                <span>FITFLOW APP</span>
              </div>
              <h2 id="download-modal-title" className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Install FitFlow on your phone
              </h2>
              <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                Connect directly with your phone sensors and wearable hardware. Installs directly to your device.
              </p>
            </div>

            {/* Interactive Options Grid (White & Black Theme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {/* Option 1: Android Devices */}
              <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col justify-between text-left">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center mb-3">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-white">Android</h3>
                  <p className="text-xs text-neutral-400 mt-1">Direct device install for Android phones and tablets.</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload('android')}
                  className="mt-5 w-full h-11 px-5 rounded-full bg-white hover:bg-neutral-100 active:scale-95 text-neutral-950 text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg aria-hidden="true" className="w-4 h-4 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download</span>
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
                  <p className="text-xs text-neutral-400 mt-1">Full standalone app support for iPhone and iPad.</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload('ios')}
                  className="mt-5 w-full h-11 px-5 rounded-full bg-white hover:bg-neutral-100 active:scale-95 text-neutral-950 text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <svg aria-hidden="true" className="w-4 h-4 text-neutral-950" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Bottom Status bar (Clean Monochrome, No Green Dot) */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span>Standalone Athlete Application</span>
              <span>Direct App Install</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
