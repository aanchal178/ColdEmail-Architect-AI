/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Terminal, 
  Briefcase, 
  User, 
  Settings2,
  RefreshCw,
  ChevronRight,
  Mail,
  Zap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tone = 'professional' | 'startup' | 'edgy';

interface GenerationResult {
  subject: string;
  email: string;
  strategyNote: string;
  followUp3Day: string;
  followUp7Day: string;
}

export default function App() {
  const [jd, setJd] = useState('');
  const [profile, setProfile] = useState('');
  const [tone, setTone] = useState<Tone>('startup');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const generateOutreach = useCallback(async () => {
    if (!jd || !profile) return;

    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3-flash-preview";

      const prompt = `
        Role: Elite Career Coach and Copywriting Specialist for Engineering Students.
        Mission: Turn generic emails into high-conversion, value-first outreach.

        Inputs:
        Job Description (JD): "${jd}"
        Student Profile: "${profile}"
        Tone: ${tone}

        Analysis Framework:
        1. The 'Hook': Identify a specific achievement from the student profile and tie it to the primary pain point in the JD.
        2. The 'Value Add': Explain how the student's project experience directly solves a problem for the company.
        3. The 'Bridge': Connect the company's tech stack to the student’s specific technical projects.

        Requirements:
        - Subject Line: High-open-rate (e.g., "Question about [Specific Project Name] at [Company]").
        - The Email: Under 150 words. No "I am a hardworking student." Use "I noticed [Company] is [Problem/Goal from JD], and I recently built [Student Project] which [Results]."
        - The 'Ask': Low-friction CTA (e.g., "Would you be open to a 5-minute chat about how my work in [Specific Field] aligns with your team's goals?").
        - Tone Adjustment: ${tone === 'professional' ? 'Formal, Big 4 firm style' : tone === 'startup' ? 'Fast-paced, Series A startup style' : 'Edgy, bold, and direct'}.
        - Follow-ups: Generate a 3-day and 7-day follow-up sequence that adds new value (like sharing a relevant article or insight) instead of just "checking in."

        Output Format: Respond ONLY in JSON with the following keys:
        {
          "subject": "...",
          "email": "...",
          "strategyNote": "...",
          "followUp3Day": "...",
          "followUp7Day": "..."
        }
      `;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const data = JSON.parse(response.text || '{}');
      setResult(data);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }, [jd, profile, tone]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F4] text-[#141414] font-sans selection:bg-emerald-100">
      {/* Header */}
      <header className="border-b border-[#141414]/10 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#141414] rounded flex items-center justify-center">
              <Terminal className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold tracking-tight text-lg">FORGE <span className="font-normal opacity-50">/ Outreach Architect</span></h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-widest opacity-60">
            <span>v1.0.2</span>
            <div className="w-1 h-1 bg-[#141414] rounded-full" />
            <span>Engineering Specialist</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-8">
            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[#141414]/10">
                <Briefcase className="w-4 h-4 opacity-50" />
                <h2 className="text-xs font-bold uppercase tracking-widest">Target Context</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-50 flex justify-between">
                    Job Description
                    <span className="normal-case font-normal italic">Paste the JD or key requirements</span>
                  </label>
                  <textarea 
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="e.g. Seeking an intern familiar with Python and Gemini API to help automate our internal documentation workflows..."
                    className="w-full h-32 p-4 bg-white border border-[#141414]/10 rounded-xl focus:ring-2 focus:ring-[#141414]/5 focus:border-[#141414] transition-all outline-none text-sm leading-relaxed resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider opacity-50 flex justify-between">
                    Student Profile
                    <span className="normal-case font-normal italic">LinkedIn text or project list</span>
                  </label>
                  <textarea 
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    placeholder="e.g. I am an engineering student at SVPCET. I built an Adaptive AI documentation platform that automates report workflows using AI templates."
                    className="w-full h-32 p-4 bg-white border border-[#141414]/10 rounded-xl focus:ring-2 focus:ring-[#141414]/5 focus:border-[#141414] transition-all outline-none text-sm leading-relaxed resize-none"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-[#141414]/10">
                <Settings2 className="w-4 h-4 opacity-50" />
                <h2 className="text-xs font-bold uppercase tracking-widest">Architectural Settings</h2>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['professional', 'startup', 'edgy'] as Tone[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "py-3 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                      tone === t 
                        ? "bg-[#141414] text-white border-[#141414]" 
                        : "bg-white text-[#141414] border-[#141414]/10 hover:border-[#141414]/30"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                onClick={generateOutreach}
                disabled={isGenerating || !jd || !profile}
                className="w-full py-4 bg-[#141414] text-white rounded-xl font-bold uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-[#222] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing Proof of Work...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Generate Outreach
                  </>
                )}
              </button>
            </section>
          </div>

          {/* Right Column: Output */}
          <div className="lg:col-span-7">
            {!result && !isGenerating ? (
              <div className="h-full min-h-[500px] border-2 border-dashed border-[#141414]/10 rounded-3xl flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 opacity-20" />
                </div>
                <h3 className="font-bold text-lg">Ready for Construction</h3>
                <p className="text-sm opacity-50 max-w-xs leading-relaxed">
                  Input the target JD and your profile to generate a hyper-personalized outreach sequence.
                </p>
              </div>
            ) : isGenerating ? (
              <div className="h-full min-h-[500px] bg-white rounded-3xl border border-[#141414]/10 p-12 flex flex-col items-center justify-center space-y-8">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-[#141414]/5 rounded-full animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <RefreshCw className="w-8 h-8 animate-spin opacity-40" />
                  </div>
                </div>
                <div className="space-y-2 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest">Forging Strategy</p>
                  <p className="text-sm opacity-50 italic">"Connecting tech stack to proof of work..."</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Email Card */}
                <div className="bg-white rounded-3xl border border-[#141414]/10 overflow-hidden shadow-sm">
                  <div className="bg-[#141414] px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="text-white w-4 h-4 opacity-60" />
                      <span className="text-[10px] font-bold text-white uppercase tracking-widest">Primary Outreach</span>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(`${result?.subject}\n\n${result?.email}`)}
                      className="text-white/60 hover:text-white transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="pb-6 border-b border-[#141414]/5">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-1">Subject Line</p>
                      <p className="font-bold text-[#141414]">{result?.subject}</p>
                    </div>
                    <div className="prose prose-sm max-w-none text-[#141414] leading-relaxed">
                      <Markdown>{result?.email}</Markdown>
                    </div>
                  </div>
                </div>

                {/* Strategy Note */}
                <div className="bg-emerald-50 rounded-3xl border border-emerald-200/50 p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-800">Strategy Note</h3>
                  </div>
                  <p className="text-sm text-emerald-900/80 leading-relaxed italic">
                    {result?.strategyNote}
                  </p>
                </div>

                {/* Follow-ups */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl border border-[#141414]/10 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Day 3 Follow-up</span>
                      <button onClick={() => copyToClipboard(result?.followUp3Day || '')} className="opacity-40 hover:opacity-100 transition-opacity">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs leading-relaxed opacity-80">
                      <Markdown>{result?.followUp3Day}</Markdown>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-[#141414]/10 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Day 7 Follow-up</span>
                      <button onClick={() => copyToClipboard(result?.followUp7Day || '')} className="opacity-40 hover:opacity-100 transition-opacity">
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-xs leading-relaxed opacity-80">
                      <Markdown>{result?.followUp7Day}</Markdown>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-[#141414]/5 mt-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">
            © 2026 Forge Systems • Built for High-Performance Outreach
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Documentation</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Framework</a>
            <a href="#" className="text-[10px] font-bold uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
