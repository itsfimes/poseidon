import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DemoPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const animRef = useRef(0);
  const navigate = useNavigate();

  const startProgress = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    setProgress(0);
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      setProgress(88 * (1 - Math.exp(-elapsed / 2500)));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const finishProgress = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    const from = performance.now();

    const tick = (now: number) => {
      const t = Math.min((now - from) / 500, 1);
      const eased = 1 - Math.pow(1 - t, 2);
      setProgress(88 + 12 * eased);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, []);

  const analyzeMessage = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    startProgress();

    try {
      const res = await fetch('http://localhost:3001/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      finishProgress();
      await new Promise(r => setTimeout(r, 600));
      setResult(data);
    } catch (err) {
      setResult({ error: 'Analysis failed' });
    } finally {
      cancelAnimationFrame(animRef.current);
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) analyzeMessage();
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-[#FCF9F8] dark:bg-[#1C1B1B] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <button onClick={() => navigate('/')} className="text-xl font-black tracking-tighter text-[#1C1B1B] dark:text-[#FCF9F8] font-headline">
            Poseidon Privacy
          </button>
        </div>
      </nav>
      <main className="pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-on-surface-variant text-sm font-medium mb-8 hover:text-[#1E40AF] transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to Home
        </button>

        <div className="mb-12">
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter mb-4 text-on-surface">
            Message <span className="text-primary-container">Analyzer</span>
          </h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            Paste any suspicious message below and we&apos;ll analyze it for potential scam indicators.
          </p>
        </div>

        <div className="surface-container-high rounded-xl p-8 shadow-2xl shadow-on-background/5">
          <div className="flex justify-between items-center mb-6">
            <label className="font-label text-xs font-bold uppercase tracking-widest text-on-surface/40">Paste message below</label>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-outline-variant/30"></div>
            </div>
          </div>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-48 bg-surface-container-lowest border-none rounded-lg p-6 focus:ring-2 focus:ring-primary-container/10 resize-none text-on-surface placeholder:text-on-surface/20 font-body transition-all"
              placeholder="Example: 'Your bank account has been suspended. Click here to verify: bit.ly/unsecure-link'"
            />
            <div className="absolute bottom-4 right-4">
              <button
                onClick={analyzeMessage}
                disabled={isAnalyzing || !text.trim()}
                className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>
          </div>

          {isAnalyzing && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-on-surface/50">Analyzing...</span>
                <span className="text-xs font-bold text-primary-container tabular-nums">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${result.is_scam ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{result.is_scam ? '🚨' : '✅'}</span>
                <span className={`font-bold ${result.is_scam ? 'text-red-700' : 'text-green-700'}`}>
                  {result.is_scam ? 'SCAM DETECTED' : 'Appears Safe'}
                </span>
                <span className="text-sm text-gray-500">({result.confidence}% confidence)</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{result.reason}</p>
              {result.red_flags?.length > 0 && (
                <div className="text-sm">
                  <span className="font-semibold text-red-600">Red flags:</span>
                  <span className="text-gray-600"> {result.red_flags.join(', ')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-4 text-xs font-bold text-primary-container font-label uppercase tracking-widest">
          <span>Works on SMS</span>
          <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
          <span>Email</span>
          <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
          <span>Direct Messages</span>
        </div>
      </div>
    </main>
    </>
  );
}
