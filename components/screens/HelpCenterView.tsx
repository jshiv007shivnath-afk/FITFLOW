'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Variants } from 'motion/react';
import { useFitFlow } from '@/context/FitFlowContext';
import {
  ArrowLeft,
  Message,
  ArrowRight2,
  CheckCircle,
  Activity,
  Drop,
  ShieldTick,
  ChevronDown,
} from 'reicon-react';

interface FaqItem {
  id: string;
  category: 'general' | 'sync' | 'privacy';
  question: string;
  answer: string;
}

export function HelpCenterView() {
  const { setShowHelpCenter, showToast } = useFitFlow();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'general' | 'sync' | 'privacy'>('all');
  const [expandedId, setExpandedId] = useState<string | null>('1');

  const faqs: FaqItem[] = [
    {
      id: '1',
      category: 'general',
      question: 'How is daily active burn and calorie pacing calculated?',
      answer: 'FitFlow tracks your daily burn using your body stats, workouts, and steps. Your targets update as you move.',
    },
    {
      id: '2',
      category: 'sync',
      question: 'How do I change my profile photo across the app?',
      answer: 'Navigate to the Profile tab and tap directly on your circular avatar image or the plus (+) icon. You can select any photo from your device; it will be optimized and updated across all dashboards instantly.',
    },
    {
      id: '3',
      category: 'privacy',
      question: 'Where is my personal biometric data stored?',
      answer: 'Your health metrics, workout logs, hydration timeline, and custom goals are saved exclusively in your browser local storage. FitFlow operates privacy-first without transmitting telemetry to third-party ad brokers.',
    },
    {
      id: '4',
      category: 'general',
      question: 'How do I log quick water intake throughout the day?',
      answer: 'On your Home Dashboard, simply tap the "Drink Water" bento tile or the "+250ml Quick Add" shortcut to log one glass of hydration immediately with tactile feedback.',
    },
    {
      id: '5',
      category: 'sync',
      question: 'When will payments and advanced coaching be available?',
      answer: 'Advanced clinical coaching and subscription billing modules are actively scheduled for our upcoming release. The current version provides complete biometric tracking without payment gates.',
    },
  ];

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === selectedCategory);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 440,
        damping: 30,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col w-full pb-28 px-5 pt-4 bg-[#F8F8F6] text-[#111312]"
    >
      {/* 1. Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between pb-3 mb-3 border-b border-[#ECECE9]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHelpCenter(false)}
            aria-label="Back to Profile"
            className="w-10 h-10 rounded-full bg-white shadow-xs border border-[#ECECE9] flex items-center justify-center text-[#111312] hover:bg-[#F4F5F2] active:scale-95 transition"
            type="button"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[18px] font-bold tracking-tight text-[#111312]">Help &amp; Support</h1>
            <span className="text-xs text-[#5A5E59]">FitFlow Knowledge Base</span>
          </div>
        </div>
      </motion.div>

      {/* 2. Hero Assistance Card */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-[#111312] rounded-2xl p-5 mb-4 text-white shadow-xs border border-white/10"
      >
        <span className="text-xs font-bold text-[#B8F45A] block mb-1">24/7 Wellness Desk</span>
        <h2 className="text-[19px] font-bold text-white tracking-tight leading-snug">
          How can we help you thrive today?
        </h2>
        <p className="text-xs text-[#E8EAE5] mt-1 leading-relaxed">
          Find answers to common questions below, or reach out directly to our team.
        </p>
      </motion.div>

      {/* 3. Category Filter Pills */}
      <motion.div variants={itemVariants} className="w-full flex gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-4">
        {[
          { key: 'all' as const, label: 'All Topics' },
          { key: 'general' as const, label: 'General & Goals' },
          { key: 'sync' as const, label: 'Photos & Sync' },
          { key: 'privacy' as const, label: 'Privacy & Storage' },
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            type="button"
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat.key
                ? 'bg-[#111312] text-white shadow-xs font-bold'
                : 'bg-white text-[#5A5E59] border border-[#ECECE9] hover:bg-[#F4F5F2]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </motion.div>

      {/* 4. Accordion FAQ List */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2.5 mb-6">
        <h3 className="text-xs font-bold text-[#5A5E59] uppercase tracking-wider">Top Questions</h3>
        {filteredFaqs.map(faq => {
          const isExpanded = expandedId === faq.id;
          return (
            <div
              key={faq.id}
              className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] transition-all"
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                className="w-full flex items-center justify-between text-left gap-3"
              >
                <span className="text-sm font-bold text-[#111312] leading-snug">{faq.question}</span>
                <motion.span
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 text-[#5A5E59]"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-[#5A5E59] leading-relaxed pt-2.5 mt-2.5 border-t border-[#F4F5F2]">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* 5. Direct Contact Action */}
      <motion.div
        variants={itemVariants}
        className="w-full bg-white rounded-2xl p-4 shadow-xs border border-[#ECECE9] flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E5FBC5] flex items-center justify-center text-[#456800] shrink-0">
            <Message size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#111312]">Need personalized assistance?</h4>
            <p className="text-xs text-[#5A5E59]">Send a priority inquiry to our support team</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => showToast('Support request sent! We will reply within 2 hours.')}
          className="px-3.5 py-2 rounded-xl bg-[#111312] text-white text-xs font-bold hover:bg-black active:scale-95 transition"
        >
          Contact
        </button>
      </motion.div>
    </motion.div>
  );
}
