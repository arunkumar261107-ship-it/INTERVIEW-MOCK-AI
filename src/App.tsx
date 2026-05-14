import React, { useState, useEffect, useRef, useReducer } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Terminal, 
  ShieldCheck, 
  Globe, 
  Github, 
  Cpu, 
  MessageSquare, 
  FileText, 
  Target, 
  BarChart3, 
  Award,
  ArrowRight,
  RefreshCcw,
  Download,
  Share2,
  Check,
  X,
  AlertTriangle,
  Link as LinkIcon,
  Search,
  Activity,
  Compass,
  Clock
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';

// --- Types & Schema ---

interface FormData {
  // Step 1: Technical
  language: string;
  topics: string[];
  leetCodeComfort: number;
  solvedProblems: string;
  
  // Step 2: Resume
  resumeText: string;
  resumeSections: string[];
  quantifiedAchievements: boolean;
  projectExperience: number;
  
  // Step 3: Communication
  englishProficiency: string;
  mockInterviews: boolean;
  verbalArticulation: number;
  practicedQuestions: string[];
  
  // Step 4: Portfolio
  githubUrl: string;
  repoCount: string;
  hasPortfolio: boolean;
  bestProjectType: string;
  portfolioFeatures: string[];
  
  // Step 5: Aptitude
  aptitudeConfidence: number;
  codingExperience: string;
  complexityFamiliarity: boolean;
  practicePlatforms: string[];
  
  // Step 6: Confidence
  confidenceLevel: number;
  extracurriculars: string[];
  gdExperience: string;
  biggestAchievement: string;
}

const initialFormData: FormData = {
  language: 'Python',
  topics: [],
  leetCodeComfort: 5,
  solvedProblems: '0-50',
  resumeText: '',
  resumeSections: [],
  quantifiedAchievements: false,
  projectExperience: 1,
  englishProficiency: 'Intermediate',
  mockInterviews: false,
  verbalArticulation: 5,
  practicedQuestions: [],
  githubUrl: '',
  repoCount: '0-5',
  hasPortfolio: false,
  bestProjectType: 'Personal',
  portfolioFeatures: [],
  aptitudeConfidence: 5,
  codingExperience: 'None',
  complexityFamiliarity: false,
  practicePlatforms: [],
  confidenceLevel: 5,
  extracurriculars: [],
  gdExperience: 'None',
  biggestAchievement: ''
};

// --- AI Interaction Layer ---

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

async function performAIAnalysis(formData: FormData) {
  const model = "gemini-2.0-flash";
  const prompt = `[SYSTEM CONTEXT]: You are a high-end placement analyst AI. 
  Evaluate the candidate's interview readiness based on the provided form data.
  
  [FORM DATA]: ${JSON.stringify(formData)}

  [INSTRUCTION]: Return ONLY valid raw JSON matching this schema perfectly:
  {
    "overallScore": number (0-100),
    "categoryScores": {
      "technical": number, "resume": number,
      "communication": number, "portfolio": number,
      "aptitude": number, "softSkills": number
    },
    "categoryVerdicts": { "technical": "string", "resume": "string", "communication": "string", "portfolio": "string", "aptitude": "string", "softSkills": "string" },
    "overallAssessment": "string",
    "strengths": ["string"],
    "weaknesses": ["string"],
    "roadmap": [{ "priority": 1|2|3, "title": "string", 
                "description": "string", "effort": "string",
                "resources": ["string"] }],
    "companyTiers": {
      "dream": { "match": number, "gap": "string" },
      "target": { "match": number, "gap": "string" },
      "safe": { "match": number, "gap": "string" }
    },
    "detailedReport": {
      "technical": { "wellDone": ["string"], "improve": ["string"], "resources": [{ "title": "string", "url": "string" }], "thirtyDayPlan": ["string"] },
      "resume": { "wellDone": ["string"], "improve": ["string"], "resources": [{ "title": "string", "url": "string" }], "thirtyDayPlan": ["string"] },
      "communication": { "wellDone": ["string"], "improve": ["string"], "resources": [{ "title": "string", "url": "string" }], "thirtyDayPlan": ["string"] },
      "portfolio": { "wellDone": ["string"], "improve": ["string"], "resources": [{ "title": "string", "url": "string" }], "thirtyDayPlan": ["string"] },
      "aptitude": { "wellDone": ["string"], "improve": ["string"], "resources": [{ "title": "string", "url": "string" }], "thirtyDayPlan": ["string"] },
      "softSkills": { "wellDone": ["string"], "improve": ["string"], "resources": [{ "title": "string", "url": "string" }], "thirtyDayPlan": ["string"] }
    }
  }`;

  try {
    const result = await genAI.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const text = result.text.replace(/```json|```/g, "").trim();
    return JSON.parse(text);
  } catch (error: any) {
    console.error("Gemini AI Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze data via neural link.");
  }
}

// --- Components ---

const CyberCorner = () => (
  <>
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/40" />
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/40" />
  </>
);

const DataReadout = ({ label, value }: { label: string, value: string }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[8px] font-bold text-text-muted tracking-[0.2em] uppercase">{label}</span>
    <span className="text-[10px] font-mono text-accent tracking-widest">{value}</span>
  </div>
);

const ScanLine = () => <div className="scan-line" />;

const ParticleGrid = () => (
  <div className="fixed inset-0 pointer-events-none opacity-20" style={{ zIndex: -1 }}>
    <div className="absolute inset-0 bg-[radial-gradient(var(--color-accent)_0.8px,transparent_0.8px)] [background-size:48px_48px] opacity-20" />
    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,212,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,212,255,0.05)_1px,transparent_1px)] [background-size:120px_120px]" />
  </div>
);

const ScoreGauge = ({ score }: { score: number }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.floor(easeOut * score));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 90) return '#00d4ff'; // Cyan glow
    if (s >= 75) return '#00ffaa'; // Green
    if (s >= 60) return '#fbbf24'; // Yellow
    if (s >= 40) return '#ff6b35'; // Orange
    return '#f43f5e'; // Red
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(displayScore)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut" }}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${getColor(displayScore)})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-display font-black glow-text">{displayScore}</span>
        <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Readiness</span>
      </div>
    </div>
  );
};

// --- Main App Logic ---

export default function App() {
  const [screen, setScreen] = useState<'hero' | 'form' | 'analyzing' | 'results' | 'simulator'>('hero');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const reportParam = params.get('report');
    if (reportParam) {
      try {
        const decoded = JSON.parse(atob(reportParam));
        setAnalysisResult(decoded);
        setScreen('results');
      } catch (e) {
        console.error('Failed to decode shared report');
      }
    }
  }, []);

  const updateForm = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleStart = () => {
    setScreen('form');
  };

  const handleSubmit = async () => {
    setScreen('analyzing');
    try {
      const data = await performAIAnalysis(formData);
      setAnalysisResult(data);
      setScreen('results');
    } catch (err: any) {
      setError(err.message);
      setScreen('form');
    }
  };

  return (
    <div className="min-h-screen text-text overflow-x-hidden selection:bg-accent selection:text-bg">
      <ScanLine />
      <ParticleGrid />

      <AnimatePresence mode="wait">
        {screen === 'hero' && <HeroSection key="hero" onStart={handleStart} />}
        {screen === 'form' && (
          <AnalysisForm 
            key="form"
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep} 
            formData={formData} 
            updateForm={updateForm} 
            onSubmit={handleSubmit}
          />
        )}
        {screen === 'analyzing' && <AnalyzingScreen key="analyzing" />}
        {screen === 'simulator' && (
          <InterviewSimulator 
            key="simulator"
            onBack={() => setScreen('results')}
          />
        )}
        {screen === 'results' && analysisResult && (
          <ResultsDashboard 
            key="results"
            data={analysisResult} 
            onRetake={() => {
              setScreen('hero');
              setCurrentStep(1);
              setFormData(initialFormData);
            }} 
            onSimulate={() => setScreen('simulator')}
          />
        )}
      </AnimatePresence>

      {error && (
        <div className="fixed bottom-6 right-6 z-[1000]">
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-panel border-warn/50 flex items-center gap-3 pr-8"
          >
            <AlertTriangle className="text-warn w-5 h-5" />
            <div>
              <div className="text-xs font-display text-warn tracking-widest uppercase mb-1">System Error</div>
              <div className="text-[10px] text-text-muted uppercase">{error}</div>
            </div>
            <button onClick={() => setError(null)} className="ml-4 p-1 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// --- Section Components ---

const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative overflow-hidden"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
      className="z-10 relative"
    >
      <div className="flex items-center justify-center gap-6 mb-12">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <motion.span 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-accent text-[9px] font-display tracking-[0.5em] uppercase glow-text"
        >
          NEURAL INTERFACE V1.0.42
        </motion.span>
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
      </div>
      
      <h1 className="text-5xl md:text-8xl font-display font-black mb-8 leading-[0.9] max-w-6xl mx-auto tracking-tighter">
        INTERVIEW <br/>
        <span className="text-accent glow-text italic">READINESS</span> <br/>
        ANALYZER
      </h1>
      
      <p className="text-text-muted text-xs md:text-sm max-w-xl mx-auto mb-16 tracking-[0.2em] font-medium leading-relaxed uppercase opacity-80">
        AI-powered placement intelligence cluster. <br/>
        quantify parameters. optimize vectors. conquer market.
      </p>

      <div className="flex flex-col items-center gap-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button onClick={onStart} className="btn-cyber flex items-center gap-4 !bg-surface shadow-[0_0_30px_rgba(0,212,255,0.05)]">
            INITIALIZE SEQUENCE <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        <div className="grid grid-cols-3 gap-12 text-[9px] font-bold text-text-muted tracking-[0.3em] uppercase max-w-lg">
          <div className="flex flex-col items-center gap-2">
            <Target className="w-5 h-5 text-accent animate-pulse" />
            <span>6 DIMENSIONS</span>
          </div>
          <div className="flex flex-col items-center gap-2 border-x border-border px-8">
            <Zap className="w-5 h-5 text-accent2 animate-pulse [animation-delay:0.5s]" />
            <span>LIVE SCORING</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent3 animate-pulse [animation-delay:1s]" />
            <span>ENCRYPTED</span>
          </div>
        </div>
      </div>
    </motion.div>

    {/* HUD Elements */}
    <div className="absolute top-12 left-12 hidden lg:flex flex-col gap-6 opacity-40">
       <DataReadout label="System Load" value="12.4ms" />
       <DataReadout label="Cluster" value="Gemini-Flash" />
       <DataReadout label="Protocol" value="TCP/AES-256" />
    </div>

    <div className="absolute bottom-12 right-12 hidden lg:flex flex-col items-end gap-6 opacity-40">
       <DataReadout label="Lat/Long" value="40.7128° N, 74.0060° W" />
       <DataReadout label="Node" value="AIS-PRIMUS-01" />
       <div className="w-32 h-px bg-border mt-2" />
    </div>
  </motion.div>
);

const StepIndicator = ({ current, total }: { current: number, total: number }) => (
  <div className="w-full mb-16 px-4">
    <div className="flex justify-between items-end mb-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-accent animate-pulse" />
          <span className="text-accent text-[9px] font-display tracking-[0.4em] uppercase font-bold">Primary Data Input</span>
        </div>
        <h2 className="text-2xl font-display font-black tracking-widest italic">SEGMENT {current}<span className="text-xs italic font-medium opacity-40 ml-2">[{total}]</span></h2>
      </div>
      <div className="text-right">
        <div className="text-[9px] tracking-[0.3em] font-bold text-text-muted uppercase mb-1">Vector Completion</div>
        <div className="text-lg font-display font-black text-white">{Math.round((current / total) * 100)}%</div>
      </div>
    </div>
    <div className="h-1 bg-surface2 relative overflow-hidden flex gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <div 
          key={i} 
          className="flex-1 h-full bg-border transition-all duration-700 relative"
        >
          {i + 1 <= current && (
            <motion.div 
              layoutId="step-progress"
              className="absolute inset-0 bg-accent shadow-[0_0_15px_rgba(0,212,255,0.5)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
);

const AnalysisForm: React.FC<{ 
  currentStep: number, 
  setCurrentStep: (s: number) => void, 
  formData: FormData, 
  updateForm: (u: Partial<FormData>) => void,
  onSubmit: () => void
}> = ({ 
  currentStep, 
  setCurrentStep, 
  formData, 
  updateForm, 
  onSubmit,
}) => {
  
  const next = () => currentStep < 6 ? setCurrentStep(currentStep + 1) : onSubmit();
  const prev = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 py-24 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <StepIndicator current={currentStep} total={6} />

        <motion.div 
          key={currentStep}
          initial={{ x: 30, opacity: 0, filter: 'blur(10px)' }}
          animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ x: -30, opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="w-full glass-panel min-h-[550px] flex flex-col group"
        >
          <CyberCorner />
          
          <div className="flex-1 p-4 md:p-8">
            <div className="mb-10 flex items-center justify-between opacity-40">
              <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-text-muted">Node Access Granted</span>
              <span className="text-[9px] font-mono text-accent">ID: {Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
            </div>

            {currentStep === 1 && <StepTechnical data={formData} update={updateForm} />}
            {currentStep === 2 && <StepResume data={formData} update={updateForm} />}
            {currentStep === 3 && <StepCommunication data={formData} update={updateForm} />}
            {currentStep === 4 && <StepPortfolio data={formData} update={updateForm} />}
            {currentStep === 5 && <StepAptitude data={formData} update={updateForm} />}
            {currentStep === 6 && <StepSoftSkills data={formData} update={updateForm} />}
          </div>

          <div className="flex justify-between items-center p-8 mt-auto bg-surface/50 border-t border-border">
            <button 
              onClick={prev} 
              disabled={currentStep === 1}
              className={`flex items-center gap-3 text-[10px] font-display tracking-[0.3em] uppercase transition-all ${currentStep === 1 ? 'opacity-10 cursor-not-allowed' : 'hover:text-accent hover:translate-x-[-4px]'}`}
            >
              <ChevronLeft className="w-5 h-5" /> REVERSE
            </button>
            
            <button 
              onClick={next}
              className="btn-cyber flex items-center gap-4 !bg-surface shadow-[0_0_20px_rgba(0,212,255,0.05)]"
            >
              {currentStep === 6 ? 'EVALUATE' : 'CONTINUE'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// --- Form Steps ---

const Label = ({ children, required = false }: { children: React.ReactNode, required?: boolean }) => (
  <label className="block text-[10px] font-bold text-text-muted tracking-widest uppercase mb-3">
    {children} {required && <span className="text-accent ml-1">*</span>}
  </label>
);

const StepTechnical = ({ data, update }: { data: FormData, update: (u: any) => void }) => {
  const languages = ['Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'Go', 'Rust', 'Swift'];
  const topics = ['DSA', 'System Design', 'DBMS', 'OS', 'Networks', 'Machine Learning', 'Cloud', 'DevOps'];
  
  return (
    <div className="space-y-8">
      <div>
        <Label required>Primary Language of Operation</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => update({ language: lang })}
              className={`px-4 py-2 border text-xs transition-all ${data.language === lang ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted hover:border-accent/40'}`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Knowledge Core Matrix</Label>
        <div className="flex flex-wrap gap-2">
          {topics.map(topic => (
            <button
              key={topic}
              onClick={() => {
                const newTopics = data.topics.includes(topic) 
                  ? data.topics.filter(t => t !== topic)
                  : [...data.topics, topic];
                update({ topics: newTopics });
              }}
              className={`px-3 py-1.5 border text-[10px] uppercase font-bold tracking-widest transition-all ${data.topics.includes(topic) ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted'}`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>DSA / Problem Solving Comfort Level ({data.leetCodeComfort}/10)</Label>
        <input 
          type="range" min="0" max="10" 
          value={data.leetCodeComfort}
          onChange={(e) => update({ leetCodeComfort: parseInt(e.target.value) })}
          className="w-full accent-accent h-1.5 bg-surface2 rounded-full appearance-none"
        />
      </div>

      <div>
        <Label>Coded Index (Solved Problems)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['0-50', '51-200', '201-500', '500+'].map(val => (
            <button
              key={val}
              onClick={() => update({ solvedProblems: val })}
              className={`px-4 py-2 border text-xs transition-all ${data.solvedProblems === val ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted'}`}
            >
              {val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StepResume = ({ data, update }: { data: FormData, update: (u: any) => void }) => (
  <div className="space-y-8">
    <div>
      <Label required>Neural Blueprint (Paste Resume Content)</Label>
      <textarea 
        value={data.resumeText}
        onChange={(e) => update({ resumeText: e.target.value })}
        placeholder="PASTE PLAIN TEXT RESUME DATA HERE..."
        className="input-cyber h-48 resize-none text-[12px] leading-relaxed custom-scrollbar"
      />
      <div className="mt-2 text-right text-[10px] text-text-muted uppercase tracking-widest">
        Character Count: {data.resumeText.length}
      </div>
    </div>

    <div>
      <Label>Structure Verification</Label>
      <div className="flex flex-wrap gap-3">
        {['Summary', 'Education', 'Experience', 'Projects', 'Skills', 'Certifications', 'Links'].map(sec => (
          <label key={sec} className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="checkbox"
              checked={data.resumeSections.includes(sec)}
              onChange={() => {
                const newSecs = data.resumeSections.includes(sec)
                  ? data.resumeSections.filter(s => s !== sec)
                  : [...data.resumeSections, sec];
                update({ resumeSections: newSecs });
              }}
              className="hidden"
            />
            <div className={`w-4 h-4 border flex items-center justify-center transition-all ${data.resumeSections.includes(sec) ? 'border-accent bg-accent bg-opacity-20 text-accent' : 'border-border'}`}>
              {data.resumeSections.includes(sec) && <Check className="w-3 h-3" />}
            </div>
            <span className={`text-xs transition-colors ${data.resumeSections.includes(sec) ? 'text-accent' : 'text-text-muted group-hover:text-text'}`}>{sec}</span>
          </label>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between p-4 bg-surface2 border border-border">
      <div className="text-xs tracking-widest uppercase">Quantified Performance Impact Indicators</div>
      <button 
        onClick={() => update({ quantifiedAchievements: !data.quantifiedAchievements })}
        className={`w-12 h-6 rounded-full relative transition-colors ${data.quantifiedAchievements ? 'bg-accent/40' : 'bg-surface'}`}
      >
        <div className={`absolute top-1 h-4 w-4 rounded-full transition-all ${data.quantifiedAchievements ? 'left-7 bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'left-1 bg-text-muted'}`} />
      </button>
    </div>
  </div>
);

const StepCommunication = ({ data, update }: { data: FormData, update: (u: any) => void }) => (
  <div className="space-y-8">
     <div>
      <Label>Linguistic Proficiency (English)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Basic', 'Intermediate', 'Advanced', 'Native'].map(val => (
          <button
            key={val}
            onClick={() => update({ englishProficiency: val })}
            className={`px-4 py-2 border text-xs transition-all ${data.englishProficiency === val ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted'}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between p-4 bg-surface2 border border-border">
      <div className="text-xs tracking-widest uppercase">Neural Simulation (Mock Interviews)</div>
      <button 
        onClick={() => update({ mockInterviews: !data.mockInterviews })}
        className={`w-12 h-6 rounded-full relative transition-colors ${data.mockInterviews ? 'bg-accent/40' : 'bg-surface'}`}
      >
        <div className={`absolute top-1 h-4 w-4 rounded-full transition-all ${data.mockInterviews ? 'left-7 bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'left-1 bg-text-muted'}`} />
      </button>
    </div>

    <div>
      <Label>Verbal Articulation / Logic Clarity ({data.verbalArticulation}/10)</Label>
      <input 
        type="range" min="1" max="10" 
        value={data.verbalArticulation}
        onChange={(e) => update({ verbalArticulation: parseInt(e.target.value) })}
        className="w-full accent-accent h-1.5 bg-surface2 rounded-full appearance-none"
      />
    </div>

    <div>
       <Label>Combat Drills (Practiced Content)</Label>
       <div className="flex flex-wrap gap-4">
          {['HR Questions', 'Behavioral Loops', 'STAR Format', 'Technical Pitch', 'Conflict Resolution'].map(q => (
            <label key={q} className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={data.practicedQuestions.includes(q)}
                onChange={() => {
                  const newQs = data.practicedQuestions.includes(q)
                    ? data.practicedQuestions.filter(i => i !== q)
                    : [...data.practicedQuestions, q];
                  update({ practicedQuestions: newQs });
                }}
                className="hidden"
              />
              <div className={`w-4 h-4 border flex items-center justify-center transition-all ${data.practicedQuestions.includes(q) ? 'border-accent bg-accent bg-opacity-20 text-accent' : 'border-border'}`}>
                {data.practicedQuestions.includes(q) && <Check className="w-3 h-3" />}
              </div>
              <span className={`text-xs ${data.practicedQuestions.includes(q) ? 'text-accent' : 'text-text-muted'}`}>{q}</span>
            </label>
          ))}
       </div>
    </div>
  </div>
);

const StepPortfolio = ({ data, update }: { data: FormData, update: (u: any) => void }) => (
  <div className="space-y-8">
    <div>
      <Label>Global Sync (GitHub Handle/URL)</Label>
      <input 
        type="text" 
        value={data.githubUrl}
        onChange={(e) => update({ githubUrl: e.target.value })}
        placeholder="github.com/identity"
        className="input-cyber"
      />
    </div>

    <div>
      <Label>Repository Density</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['0-5', '6-15', '16-30', '30+'].map(val => (
          <button
            key={val}
            onClick={() => update({ repoCount: val })}
            className={`px-4 py-2 border text-xs transition-all ${data.repoCount === val ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted'}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>

    <div>
      <Label>Strategic Artifacts (Best Project Type)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['Academic', 'Personal', 'Open-source', 'Internship'].map(val => (
          <button
            key={val}
            onClick={() => update({ bestProjectType: val })}
            className={`px-4 py-2 border text-xs transition-all ${data.bestProjectType === val ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted'}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>

    <div>
       <Label>Deployment & Documentation Status</Label>
       <div className="flex flex-wrap gap-6">
          {['README.md present', 'Live deployment links', 'Tech Diversity', 'Active Contribution', 'License info'].map(feature => (
            <label key={feature} className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={data.portfolioFeatures.includes(feature)}
                onChange={() => {
                  const items = data.portfolioFeatures.includes(feature)
                    ? data.portfolioFeatures.filter(i => i !== feature)
                    : [...data.portfolioFeatures, feature];
                  update({ portfolioFeatures: items });
                }}
                className="hidden"
              />
              <div className={`w-4 h-4 border flex items-center justify-center transition-all ${data.portfolioFeatures.includes(feature) ? 'border-accent bg-accent bg-opacity-20 text-accent' : 'border-border'}`}>
                {data.portfolioFeatures.includes(feature) && <Check className="w-3 h-3" />}
              </div>
              <span className={`text-xs ${data.portfolioFeatures.includes(feature) ? 'text-accent' : 'text-text-muted'}`}>{feature}</span>
            </label>
          ))}
       </div>
    </div>
  </div>
);

const StepAptitude = ({ data, update }: { data: FormData, update: (u: any) => void }) => (
  <div className="space-y-8">
    <div>
      <Label>Quant / Logical Confidence Level ({data.aptitudeConfidence}/10)</Label>
      <input 
        type="range" min="1" max="10" 
        value={data.aptitudeConfidence}
        onChange={(e) => update({ aptitudeConfidence: parseInt(e.target.value) })}
        className="w-full accent-accent h-1.5 bg-surface2 rounded-full appearance-none"
      />
    </div>

    <div>
      <Label>Field Combat (Coding Round Experience)</Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['None', '1-2 rounds', '3-5 rounds', '5+ rounds'].map(val => (
          <button
            key={val}
            onClick={() => update({ codingExperience: val })}
            className={`px-4 py-2 border text-xs transition-all ${data.codingExperience === val ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted'}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>

    <div className="flex items-center justify-between p-4 bg-surface2 border border-border">
      <div className="text-xs tracking-widest uppercase">Big-O / Complexity Recognition</div>
      <button 
        onClick={() => update({ complexityFamiliarity: !data.complexityFamiliarity })}
        className={`w-12 h-6 rounded-full relative transition-colors ${data.complexityFamiliarity ? 'bg-accent/40' : 'bg-surface'}`}
      >
        <div className={`absolute top-1 h-4 w-4 rounded-full transition-all ${data.complexityFamiliarity ? 'left-7 bg-accent shadow-[0_0_8px_var(--color-accent)]' : 'left-1 bg-text-muted'}`} />
      </button>
    </div>

    <div>
       <Label>Neural Training Zones (Practice Platforms)</Label>
       <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
          {['LeetCode', 'HackerRank', 'CodeChef', 'InterviewBit', 'Codeforces', 'GeeksforGeeks'].map(platform => (
            <label key={platform} className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox"
                checked={data.practicePlatforms.includes(platform)}
                onChange={() => {
                  const items = data.practicePlatforms.includes(platform)
                    ? data.practicePlatforms.filter(i => i !== platform)
                    : [...data.practicePlatforms, platform];
                  update({ practicePlatforms: items });
                }}
                className="hidden"
              />
              <div className={`w-4 h-4 border flex items-center justify-center transition-all ${data.practicePlatforms.includes(platform) ? 'border-accent bg-accent bg-opacity-20 text-accent' : 'border-border'}`}>
                {data.practicePlatforms.includes(platform) && <Check className="w-3 h-3" />}
              </div>
              <span className={`text-xs ${data.practicePlatforms.includes(platform) ? 'text-accent' : 'text-text-muted'}`}>{platform}</span>
            </label>
          ))}
       </div>
    </div>
  </div>
);

const StepSoftSkills = ({ data, update }: { data: FormData, update: (u: any) => void }) => (
  <div className="space-y-8">
    <div>
      <Label>System Confidence Threshold ({data.confidenceLevel}/10)</Label>
      <input 
        type="range" min="1" max="10" 
        value={data.confidenceLevel}
        onChange={(e) => update({ confidenceLevel: parseInt(e.target.value) })}
        className="w-full accent-accent h-1.5 bg-surface2 rounded-full appearance-none"
      />
    </div>

    <div>
       <Label>Operational Influence (Extracurriculars)</Label>
       <div className="flex flex-wrap gap-4">
          {['Hackathons', 'Tech Fests', 'Presentations', 'Volunteering', 'Sports'].map(item => (
             <label key={item} className="flex items-center gap-3 cursor-pointer">
             <input 
               type="checkbox"
               checked={data.extracurriculars.includes(item)}
               onChange={() => {
                 const items = data.extracurriculars.includes(item)
                   ? data.extracurriculars.filter(i => i !== item)
                   : [...data.extracurriculars, item];
                 update({ extracurriculars: items });
               }}
               className="hidden"
             />
             <div className={`w-4 h-4 border flex items-center justify-center transition-all ${data.extracurriculars.includes(item) ? 'border-accent bg-accent bg-opacity-20 text-accent' : 'border-border'}`}>
               {data.extracurriculars.includes(item) && <Check className="w-3 h-3" />}
             </div>
             <span className={`text-xs ${data.extracurriculars.includes(item) ? 'text-accent' : 'text-text-muted'}`}>{item}</span>
           </label>
          ))}
       </div>
    </div>

    <div>
      <Label>Interpersonal Sync (Group Discussion Experience)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {['None', 'Occasional', 'Frequent'].map(val => (
          <button
            key={val}
            onClick={() => update({ gdExperience: val })}
            className={`px-4 py-2 border text-xs transition-all ${data.gdExperience === val ? 'border-accent text-accent bg-accent/5' : 'border-border text-text-muted'}`}
          >
            {val}
          </button>
        ))}
      </div>
    </div>

    <div>
       <Label>Flagship Achievement (Max 2 Sentences)</Label>
       <textarea 
          value={data.biggestAchievement}
          onChange={(e) => update({ biggestAchievement: e.target.value })}
          placeholder="DESCRIBE YOUR PEAK PERFORMANCE METRIC..."
          className="input-cyber h-24 resize-none text-[12px] lowercase"
          maxLength={300}
       />
    </div>
  </div>
);

const AnalyzingScreen: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const messages = [
    "SCANNING TECHNICAL DEPTH...",
    "EVALUATING RESUME IMPACT...",
    "MEASURING COMMUNICATION SIGNALS...",
    "MAPPING PORTFOLIO STRENGTH...",
    "CALCULATING APTITUDE READINESS...",
    "PROFILING SOFT SKILLS..."
  ];

  useEffect(() => {
    const msgInterval = setInterval(() => setMsgIdx(prev => (prev + 1) % messages.length), 1500);
    const progInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 95) return prev + Math.random() * 2;
        return prev;
      });
    }, 100);
    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bg overflow-hidden relative">
      <div className="absolute inset-0 bg-accent/5 animate-pulse pointer-events-none" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel p-12 relative flex flex-col items-center"
      >
        <CyberCorner />
        <div className="relative mb-12">
          <div className="w-64 h-64 border-2 border-accent/20 rounded-full flex items-center justify-center">
             <motion.div 
                className="absolute w-72 h-72 border border-accent rounded-full border-dashed"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             />
             <div className="text-center">
                <span className="text-4xl font-display font-black glow-text">{Math.floor(progress)}%</span>
                <div className="text-[8px] tracking-[0.4em] uppercase font-bold text-accent">Neural Sync</div>
             </div>
          </div>
          <div className="absolute top-0 right-0 w-4 h-4 bg-accent" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-accent" />
        </div>

        <div className="max-w-md w-full text-center">
          <h2 className="text-xl font-display font-bold mb-4 flex items-center justify-center gap-4">
             <Cpu className="text-accent w-6 h-6 animate-spin" /> {messages[msgIdx]}
          </h2>
          <div className="h-1 bg-surface2 relative w-full overflow-hidden mb-6">
            <motion.div 
              className="absolute inset-y-0 left-0 bg-accent shadow-[0_0_15px_var(--color-accent)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-[9px] text-text-muted tracking-widest uppercase font-mono">Parallel processing AI assessment clusters...</p>
        </div>
      </motion.div>
    </div>
  );
};

const ResultsDashboard: React.FC<{ data: any, onRetake: () => void, onSimulate: () => void }> = ({ data, onRetake, onSimulate }) => {
  const radarData = [
    { subject: 'Technical', A: data.categoryScores.technical, fullMark: 100 },
    { subject: 'Resume', A: data.categoryScores.resume, fullMark: 100 },
    { subject: 'Comm.', A: data.categoryScores.communication, fullMark: 100 },
    { subject: 'Portfolio', A: data.categoryScores.portfolio, fullMark: 100 },
    { subject: 'Aptitude', A: data.categoryScores.aptitude, fullMark: 100 },
    { subject: 'Soft Skills', A: data.categoryScores.softSkills, fullMark: 100 },
  ];

  return (
    <div className="min-h-screen py-32 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-12 mb-20">
        <motion.div
           initial={{ x: -20, opacity: 0 }}
           animate={{ x: 0, opacity: 1 }}
        >
          <div className="flex items-center gap-3 mb-4">
             <div className="w-2 h-2 bg-accent animate-pulse" />
             <h2 className="text-[10px] font-display text-accent tracking-[0.4em] uppercase font-bold glow-text">DIAGNOSTIC COMPLETED</h2>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-black leading-none tracking-tight">DATA <br/><span className="text-white/40 italic">VISUALIZATION</span></h1>
        </motion.div>

        <div className="flex flex-wrap gap-4 w-full xl:w-auto">
           <button onClick={onSimulate} className="btn-cyber !px-10 flex-1 xl:flex-none flex items-center justify-center gap-3 !border-accent !text-accent group shadow-[0_0_20px_rgba(0,212,255,0.05)]">
             <MessageSquare className="w-4 h-4 group-hover:rotate-12 transition-transform" /> SIMULATE REALITY
           </button>
           <button onClick={() => window.print()} className="btn-cyber !px-10 flex-1 xl:flex-none flex items-center justify-center gap-3 !border-text-muted/40 !text-text-muted hover:!border-white hover:!text-white group">
             <Download className="w-4 h-4 group-hover:translate-y-px transition-transform" /> ARCHIVE REPORT
           </button>
           <button onClick={onRetake} className="btn-cyber !px-10 flex-1 xl:flex-none flex items-center justify-center gap-3 !border-accent2/40 !text-accent2 hover:!border-accent2 group">
             <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> RESET PROTOCOL
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column: Visual Metrics */}
        <div className="xl:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="lg:col-span-1 glass-panel flex flex-col items-center justify-center py-16"
            >
               <CyberCorner />
               <ScoreGauge score={data.overallScore} />
               <div className="mt-8 text-center space-y-2">
                  <div className="text-[10px] font-black tracking-[0.4em] uppercase text-accent glow-text animate-pulse-accent">
                     {data.overallScore >= 75 ? 'S-TIER OPERATIVE' : data.overallScore >= 50 ? 'B-TIER CANDIDATE' : 'RECRUIT LEVEL'}
                  </div>
                  <div className="text-[8px] font-bold text-text-muted uppercase tracking-[0.2em]">{data.categoryVerdicts.technical} Evaluation Complete</div>
               </div>
            </motion.div>

            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.3 }}
               className="lg:col-span-1 glass-panel flex flex-col pt-10"
            >
               <CyberCorner />
               <h3 className="text-[10px] font-bold tracking-[0.3em] text-text-muted mb-10 px-6 uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" /> COMPETENCY MATRIX
               </h3>
               <div className="w-full h-72">
                 <ResponsiveContainer width="100%" height="100%">
                   <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                     <PolarGrid stroke="rgba(0, 212, 255, 0.05)" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#5e7087', fontSize: 9, fontWeight: '900', letterSpacing: '0.1em' }} />
                     <Radar
                       name="Candidate"
                       dataKey="A"
                       stroke="var(--color-accent)"
                       fill="var(--color-accent)"
                       fillOpacity={0.2}
                       strokeWidth={2}
                     />
                   </RadarChart>
                 </ResponsiveContainer>
               </div>
            </motion.div>

            <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.4 }}
               className="lg:col-span-1 glass-panel p-8"
            >
               <CyberCorner />
               <h3 className="text-[10px] font-bold tracking-[0.3em] text-text-muted mb-10 uppercase flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-accent2" /> MARKET POSITIONING
               </h3>
               <div className="space-y-8">
                  {Object.entries(data.companyTiers).map(([tier, val]: [string, any], i) => (
                    <div key={tier} className="relative">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-[10px] font-display uppercase tracking-widest text-white/60">{tier} TIERS</span>
                        <span className="text-xl font-display font-black text-white">{val.match}%</span>
                      </div>
                      <div className="h-2 bg-surface2 relative">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${val.match}%` }}
                            transition={{ duration: 1.5, delay: 0.5 + i * 0.1 }}
                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${i === 0 ? 'from-accent to-accent2' : i === 1 ? 'from-accent3 to-accent' : 'from-accent2 to-accent3'}`}
                         />
                      </div>
                      <p className="text-[9px] text-text-muted mt-3 uppercase leading-relaxed font-bold tracking-wider">{val.gap}</p>
                    </div>
                  ))}
               </div>
            </motion.div>
        </div>

        <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
           {Object.entries(data.detailedReport).map(([cat, content]: [string, any], i) => (
             <motion.div 
                key={cat}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass-panel group/card"
             >
                <div className="flex justify-between items-start mb-8">
                   <h4 className="text-sm font-display font-black tracking-[0.2em] italic flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-accent" /> {cat}
                   </h4>
                   <div className="w-10 h-10 border border-border flex items-center justify-center text-xs font-black text-accent/40 group-hover/card:text-accent group-hover/card:border-accent transition-colors">
                      {Math.round(data.categoryScores[cat])}
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="space-y-3">
                      <p className="text-[9px] font-bold tracking-[0.2em] text-accent/60 uppercase">Strengths Identified</p>
                      <ul className="space-y-2">
                         {content.wellDone.slice(0, 2).map((item: string, j: number) => (
                           <li key={j} className="text-[11px] font-medium text-text uppercase flex items-start gap-2 leading-tight">
                              <span className="text-accent mt-0.5">•</span> {item}
                           </li>
                         ))}
                      </ul>
                   </div>
                   
                   <div className="h-px bg-gradient-to-r from-border via-transparent to-transparent" />

                   <div className="space-y-3">
                      <p className="text-[9px] font-bold tracking-[0.2em] text-warn/60 uppercase">Vectors to Optimize</p>
                      <ul className="space-y-2">
                         {content.improve.slice(0, 2).map((item: string, j: number) => (
                            <li key={j} className="text-[11px] font-medium text-text-muted uppercase flex items-start gap-2 leading-tight">
                               <span className="text-warn mt-0.5">•</span> {item}
                            </li>
                         ))}
                      </ul>
                   </div>

                   <button className="w-full py-4 mt-4 border border-border text-[9px] font-bold tracking-[0.4em] uppercase text-text-muted hover:border-accent hover:text-accent transition-all">
                      EXPAND DATA SEGMENT
                   </button>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Strategic Roadmap Section */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="xl:col-span-12 glass-panel p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Compass className="w-5 h-5 text-accent2" />
                <h3 className="text-[10px] font-black tracking-[0.4em] text-accent2 uppercase">Strategic Execution Path</h3>
              </div>
              <h2 className="text-2xl font-display font-black tracking-widest italic uppercase">Improvement Roadmap</h2>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-mono text-text-muted">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-warn" /> HIGH PRIORITY</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-400" /> MEDIUM</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-accent" /> STANDARD</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {data.roadmap.map((item: any, i: number) => (
              <motion.div 
                key={i}
                initial={{ x: 20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative h-full flex flex-col p-6 border border-border/40 hover:border-accent2 transition-all bg-surface/30"
              >
                <div className={`absolute top-0 left-0 w-1 h-full ${item.priority === 1 ? 'bg-warn' : item.priority === 2 ? 'bg-amber-400' : 'bg-accent'}`} />
                
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-text-muted">PROTOCOL 0{i + 1}</span>
                    <h4 className="text-sm font-black tracking-widest uppercase group-hover:text-accent2 transition-colors">{item.title}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-surface2 border border-border rounded text-[9px] font-bold text-text-muted">
                    <Clock className="w-3 h-3 text-accent2" />
                    {item.effort}
                  </div>
                </div>

                <p className="text-[11px] text-text-muted font-mono leading-relaxed lowercase mb-8 flex-1">
                  {item.description}
                </p>

                {item.resources && item.resources.length > 0 && (
                  <div className="space-y-3">
                    <div className="text-[8px] font-bold text-accent2 tracking-widest uppercase flex items-center gap-2">
                       <LinkIcon className="w-3 h-3" /> External Buffs
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.resources.map((res: string, j: number) => (
                        <a 
                          key={j}
                          href={res.startsWith('http') ? res : `https://www.google.com/search?q=${encodeURIComponent(res)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-surface2 border border-border text-[9px] font-bold text-text-muted hover:text-white hover:border-accent2 transition-all block"
                        >
                          {res.replace(/(^\w+:|^)\/\//, '').split('/')[0] || 'RESOURCE'}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <DetailedReport data={data.detailedReport} />
    </div>
  );
};

const DetailedReport = ({ data }: { data: any }) => (
  <div className="mt-16 space-y-8">
     <h3 className="text-xs font-display text-accent tracking-[0.3em] uppercase mb-8 border-l-4 border-accent pl-4">SEGMENTED METRIC BREAKDOWN</h3>
     <div className="space-y-4">
        {Object.entries(data).map(([cat, detail]: [string, any]) => (
           <details key={cat} className="glass-panel group">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-surface2 border border-border flex items-center justify-center">
                       {cat === 'technical' && <Cpu className="w-5 h-5 text-accent" />}
                       {cat === 'resume' && <FileText className="w-5 h-5 text-accent" />}
                       {cat === 'communication' && <MessageSquare className="w-5 h-5 text-accent" />}
                       {cat === 'portfolio' && <Globe className="w-5 h-5 text-accent" />}
                       {cat === 'aptitude' && <Target className="w-5 h-5 text-accent" />}
                       {cat === 'softSkills' && <Award className="w-5 h-5 text-accent" />}
                    </div>
                    <span className="text-xs font-display font-bold tracking-widest uppercase italic group-open:text-accent transition-colors">{cat} DEPTH ANALYSIS</span>
                 </div>
                 <ChevronRight className="w-5 h-5 text-text-muted group-open:rotate-90 transition-transform" />
              </summary>
              
              <div className="mt-8 pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-2 duration-300">
                 <div className="space-y-6">
                    <div>
                       <h4 className="text-[10px] font-bold text-accent3 tracking-widest uppercase mb-3 underline">Verified Strength Points</h4>
                       <ul className="space-y-2 text-[10px] text-text-muted uppercase leading-relaxed">
                          {detail.wellDone.map((item: string, i: number) => <li key={i} className="flex gap-2"><span>[OK]</span> {item}</li>)}
                       </ul>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-bold text-accent tracking-widest uppercase mb-3 underline">Combat Resources</h4>
                        <div className="space-y-2">
                           {detail.resources.map((res: any, i: number) => (
                              <a 
                                key={i} href={res.url} target="_blank" rel="noreferrer"
                                className="flex items-center justify-between px-3 py-2 bg-surface2 border border-border hover:border-accent hover:text-accent transition-all text-[9px] font-bold uppercase tracking-widest"
                              >
                                 {res.title} <ChevronRight className="w-3 h-3" />
                              </a>
                           ))}
                        </div>
                    </div>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                       <h4 className="text-[10px] font-bold text-warn tracking-widest uppercase mb-3 underline">Correction Directives</h4>
                       <ul className="space-y-2 text-[10px] text-text-muted uppercase leading-relaxed">
                          {detail.improve.map((item: string, i: number) => <li key={i} className="flex gap-2"><span>[!!]</span> {item}</li>)}
                       </ul>
                    </div>
                    <div className="bg-surface2 p-4 border border-border">
                       <h4 className="text-[10px] font-bold text-text tracking-widest uppercase mb-4 flex items-center gap-2 italic">
                          <Target className="w-3 h-3 text-accent" /> 30-DAY EXECUTION PROTOCOL
                       </h4>
                       <div className="space-y-4">
                          {detail.thirtyDayPlan.map((plan: string, i: number) => (
                             <div key={i} className="flex gap-3">
                                <span className="text-[9px] font-black text-accent mt-0.5">D{(i+1)*10}</span>
                                <span className="text-[10px] text-text-muted lowercase leading-snug">{plan}</span>
                             </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>
           </details>
        ))}
     </div>
  </div>
);

const InterviewSimulator: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Initial message
    if (messages.length === 0) {
      startInterview();
    }
  }, []);

  const startInterview = async () => {
    setIsTyping(true);
    const model = "gemini-2.0-flash";
    const prompt = `You are an elite HR Interviewer at a top-tier tech firm. 
    Your goal is to conduct a realistic, challenging, yet professional mock interview.
    Start the interview by introducing yourself briefly and asking the candidate to introduce themselves.
    Wait for their response. Do not output everything at once. One question at a time.`;

    try {
      const result = await genAI.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: prompt }] }]
      });
      setMessages([{ role: 'ai', text: result.text }]);
    } catch (err) {
      setMessages([{ role: 'ai', text: "SYSTEM ERROR: Neural link offline. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const chat = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          ...messages.map(m => ({
            role: m.role === 'ai' ? 'model' as const : 'user' as const,
            parts: [{ text: m.text }]
          })),
          { role: 'user', parts: [{ text: userMsg }] }
        ]
      });
      
      setMessages(prev => [...prev, { role: 'ai', text: chat.text }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: "ERROR: Neural feedback loop interrupted." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen pt-24 pb-12 px-6 flex flex-col items-center max-w-5xl mx-auto w-full"
    >
      <div className="w-full flex justify-between items-center mb-8 border-b border-border pb-6">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-accent/20 flex items-center justify-center border border-accent">
              <Terminal className="text-accent w-5 h-5" />
           </div>
           <div>
              <h1 className="text-xl font-display font-bold uppercase tracking-widest italic">NEURAL INTERVIEW SIMULATOR</h1>
              <span className="text-[8px] font-bold text-accent tracking-[0.4em] uppercase">Status: Live Link Active</span>
           </div>
        </div>
        <button onClick={onBack} className="btn-cyber !px-4 py-2 text-[10px] border-text-muted text-text-muted hover:border-white hover:text-white">
          ABORT SIMULATION
        </button>
      </div>

      <div className="flex-1 w-full glass-panel flex flex-col overflow-hidden min-h-[600px] border-accent/20">
         <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/40">
            {messages.map((m, i) => (
               <motion.div 
                 key={i}
                 initial={{ x: m.role === 'user' ? 10 : -10, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                  <div className={`max-w-[80%] p-4 border ${m.role === 'user' ? 'border-accent bg-accent/10 rounded-l-xl rounded-tr-xl' : 'border-border bg-surface2 rounded-r-xl rounded-tl-xl'}`}>
                     <div className="text-[8px] font-bold tracking-widest uppercase mb-2 opacity-50">
                        {m.role === 'ai' ? 'NEURAL INTERVIEWER' : 'CANDIDATE'}
                     </div>
                     <p className="text-sm font-mono leading-relaxed">{m.text}</p>
                  </div>
               </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                 <div className="p-4 border border-border bg-surface2 rounded-r-xl rounded-tl-xl">
                    <span className="flex gap-1">
                       <span className="w-1 h-1 bg-accent rounded-full animate-bounce" />
                       <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.2s]" />
                       <span className="w-1 h-1 bg-accent rounded-full animate-bounce [animation-delay:0.4s]" />
                    </span>
                 </div>
              </div>
            )}
         </div>

         <div className="p-6 border-t border-border bg-surface flex gap-4">
            <input 
               type="text"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => e.key === 'ENTER' && handleSend()}
               placeholder="ENTER RESPONSE SEQUENCE..."
               className="input-cyber flex-1 !text-xs font-mono uppercase"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="btn-cyber !px-8 flex items-center gap-2"
            >
              TRANSMIT <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
      
      <div className="mt-6 flex justify-between w-full text-[10px] font-bold text-text-muted tracking-widest uppercase font-mono">
         <span>Encryption: End-to-End Neural Link</span>
         <span>Latency: ~124ms</span>
         <span>Cluster: Gemini-2.0-Flash-Pro</span>
      </div>
    </motion.div>
  );
};
