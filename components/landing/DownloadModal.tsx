'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DownloadModal({ isOpen, onClose }: DownloadModalProps) {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="download-modal-title"
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-neutral-950/70"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close download dialog"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 active:scale-95 text-neutral-600 flex items-center justify-center transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
            >
              <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
                <span>Mobile Installation</span>
              </div>
              <h2 id="download-modal-title" className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight">
                Install FitFlow on your phone
              </h2>
              <p className="mt-2 text-sm text-neutral-600 leading-relaxed">
                FitFlow connects directly with your device sensors and wearable hardware. Download the app directly to your mobile device.
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
              {/* Option 1: Android APK Direct Download */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center mb-3">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="3" />
                      <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900">Android Package</h3>
                  <p className="text-xs text-neutral-500 mt-1">Direct APK installation for Android 10 and above.</p>
                </div>

                <a
                  href="/download/FitFlow-v1.0.0.apk"
                  download="FitFlow-v1.0.0.apk"
                  className="mt-4 w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-white text-xs font-semibold text-center transition-colors shadow-xs flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                >
                  <svg aria-hidden="true" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  <span>Download APK (v1.0.0)</span>
                </a>
              </div>

              {/* Option 2: iOS / Mobile Safari */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-neutral-200/60 text-neutral-800 flex items-center justify-center mb-3">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
                      <path d="M12 2a10 10 0 0 1 10 10" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900">Apple iOS & Safari</h3>
                  <p className="text-xs text-neutral-500 mt-1">Open in mobile Safari and tap Share to add to Home Screen.</p>
                </div>

                <div className="mt-4 w-full py-2 px-3 rounded-xl bg-white border border-neutral-200 text-neutral-700 text-xs font-medium leading-relaxed">
                  Safari Share &rarr; <strong>Add to Home Screen</strong>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
              <span>Native mobile application build</span>
              <span>Build 1.0.0</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
