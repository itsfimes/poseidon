import { useState } from 'react';

export default function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeMessage = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setResult(null);
    
    try {
      const res = await fetch('http://localhost:3001/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: 'Analysis failed' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) analyzeMessage();
  };

  return (
    <>
      {/* Top Navigation Shell */}
      <nav className="fixed top-0 w-full z-50 bg-[#FCF9F8] dark:bg-[#1C1B1B] transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="text-xl font-black tracking-tighter text-[#1C1B1B] dark:text-[#FCF9F8] font-headline">
            Poseidon Privacy
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a className="text-[#1C1B1B]/60 dark:text-[#FCF9F8]/60 font-medium hover:text-[#1E40AF] transition-all duration-300 font-label text-sm uppercase tracking-widest" href="#how-it-works">How it Works</a>
            <a className="text-[#1C1B1B]/60 dark:text-[#FCF9F8]/60 font-medium hover:text-[#1E40AF] transition-all duration-300 font-label text-sm uppercase tracking-widest" href="#privacy">Privacy</a>
            <a className="text-[#1C1B1B]/60 dark:text-[#FCF9F8]/60 font-medium hover:text-[#1E40AF] transition-all duration-300 font-label text-sm uppercase tracking-widest" href="#examples">Examples</a>
          </div>
          <button className="bg-primary-container text-white px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-all scale-95 active:opacity-80">
            Analyze a Message
          </button>
        </div>
      </nav>
      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 mb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-fixed-dim text-on-primary-fixed rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
              Verified Protection
            </span>
            <h1 className="font-headline text-6xl md:text-7xl font-extrabold tracking-tighter leading-[0.9] mb-8 text-on-surface">
              Analyze your messages for scams <span className="text-primary-container">instantly.</span>
            </h1>
            <p className="text-on-surface-variant text-lg max-w-lg mb-10 leading-relaxed">
              Protect yourself from digital fraud. Our architectural-grade analysis identifies phishing attempts in SMS, Emails, and DMs before you click.
            </p>
            <div className="flex items-center gap-4 text-xs font-bold text-primary-container font-label uppercase tracking-widest">
              <span>Works on SMS</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
              <span>Email</span>
              <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
              <span>Direct Messages</span>
            </div>
          </div>
          <div className="lg:col-span-6 relative">
            <div className="surface-container-high rounded-xl p-8 shadow-2xl shadow-on-background/5 relative z-10">
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
                  className="w-full h-48 bg-surface-container-lowest border-none rounded-lg p-6 focus:ring-2 focus:ring-primary-container/10 resize-none text-on-surface placeholder:text-on-surface/20 font-body transition-all" placeholder="Example: 'Your bank account has been suspended. Click here to verify: bit.ly/unsecure-link'"></textarea>
                <div className="absolute bottom-4 right-4">
                  <button 
                    onClick={analyzeMessage}
                    disabled={isAnalyzing || !text.trim()}
                    className="bg-gradient-to-br from-primary to-primary-container text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Message'}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                </div>
              </div>
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
            {/* Background Architectural Element */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-fixed-dim/20 rounded-full blur-3xl -z-0"></div>
          </div>
        </section>
        {/* How it Works: Step Process */}
        <section className="bg-surface-container-low py-32" id="how-it-works">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-20">
              <h2 className="font-headline text-4xl font-extrabold tracking-tighter mb-4">How it Works</h2>
              <div className="h-1 w-20 bg-primary-container"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="group">
                <div className="text-primary-container font-headline text-8xl font-black opacity-10 mb-[-40px] group-hover:opacity-20 transition-opacity">01</div>
                <h3 className="font-headline text-xl font-bold mb-4 relative z-10">Capture</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  Copy any suspicious text from your SMS, Email, or Messaging app and paste it into the analyzer above.
                </p>
              </div>
              <div className="group">
                <div className="text-primary-container font-headline text-8xl font-black opacity-10 mb-[-40px] group-hover:opacity-20 transition-opacity">02</div>
                <h3 className="font-headline text-xl font-bold mb-4 relative z-10">Scan</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  Our linguistic engine cross-references known scam patterns, malicious URL structures, and social engineering tactics.
                </p>
              </div>
              <div className="group">
                <div className="text-primary-container font-headline text-8xl font-black opacity-10 mb-[-40px] group-hover:opacity-20 transition-opacity">03</div>
                <h3 className="font-headline text-xl font-bold mb-4 relative z-10">Resolve</h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  Receive an instant risk score and specific warnings about why the message was flagged.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Privacy Matters: Bento Grid Layout */}
        <section className="py-32 bg-surface" id="privacy">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 bg-on-background text-white p-12 rounded-xl flex flex-col justify-between min-h-[400px]">
                <div>
                  <h2 className="font-headline text-5xl font-extrabold tracking-tighter mb-6 leading-tight">Privacy-first:<br />Your data is never stored.</h2>
                  <p className="text-white/60 max-w-md text-lg leading-relaxed">
                    We utilize stateless processing. Once the analysis is complete, your message is purged from our temporary memory instantly. No logs, no history, no tracking.
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 rounded-full border-2 border-on-background overflow-hidden">
                      <img className="w-full h-full object-cover" data-alt="portrait of a professional security architect in a modern office" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7UqJURFvw9GRZDRDrRO-5I-lm59ZUUn2VlR8PpxgxcXCxmzMvZkeLZ21YPZ8CMvYl7cuqC7GyKu27pW8x6W6ayc6wzrtH-Sxk0f0f0E6tN2ZMh9e-PzzuRMM_PEC0KglvyMtRw_KTqtKDM7jEgId-qHtzh0EtRdT6zgRb6qr_T890fp1euoIlTKgtkLl-O_q8igPShkcap7xcwQup7m21IIOdArXgLrFR2t4gUbAXJ5CfmMIOIF8xXMY02UsZzG4QSOmip_4K9uFb" />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-on-background overflow-hidden">
                      <img className="w-full h-full object-cover" data-alt="portrait of a confident cybersecurity expert smiling" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSSfLPHsE4RGy89KHuThtHCWqjrH2-Jsvr6WYTWeGaolBK6FZZed4vGdwWrzoc7rQwgfst8_N9c-_9V79NqKqfUYTwPTKeqeN2hGtTS9liLiUSpFN4esq1gFQU_64vVJkIHq1D20Ldq_hNYSK_467moxnpeQgzVp_EoVJZF_ZxJNOWAL97qp47sUCCigD-E6fxyvw-FKawO_3NGOShjsAU1f-6XQ6IAcNJdI_eLEiuZev_Ce7VtvnhfVCIiEQsuadpRBXbu_w_1nI3" />
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-white/40">Trusted by Security Professionals</span>
                </div>
              </div>
              <div className="lg:col-span-4 bg-surface-container-high p-8 rounded-xl flex flex-col justify-center">
                <span className="material-symbols-outlined text-4xl text-primary-container mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>vpn_lock</span>
                <h3 className="font-headline text-2xl font-bold mb-4">Encryption by Default</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Every request is routed through an encrypted tunnel, ensuring that even your network provider cannot see what you're analyzing.
                </p>
              </div>
              <div className="lg:col-span-4 bg-primary-container text-white p-8 rounded-xl flex flex-col justify-center">
                <span className="material-symbols-outlined text-4xl mb-6">analytics</span>
                <h3 className="font-headline text-2xl font-bold mb-4">Zero-Bias AI</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Our models are trained strictly on threat patterns, ignoring personal identifiers to maintain objective security standards.
                </p>
              </div>
              <div className="lg:col-span-8 relative overflow-hidden rounded-xl bg-surface-container-low group">
                <img className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-700" data-alt="abstract digital structural network with glowing blue lines on a dark architectural background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPI7XtzdWu74SkEf664YYd0-9hoPRyJ5sZ2n7li3JkUGbmf_VoiX__CEEJo32f7TINrjRG7YI_oyDKgV-wt_yJpu39kKFMT12bQ2ygTd-M-2dyWS_stwfPQAdh4Og3A6sW3-0PY83UcbIyOTqaVHXmC1LgcVhpjpZrsWjk3yNRQUurp98WY-O2JU_WSR4a3GUBA-1LTmje7m3lnyYU9zQlZ0yAFfnJ03eu4wG1U-K0pDigbYSm6b15jJfoxV7GeaD0EqFTtab472gU" />
                <div className="relative z-10 p-12 h-full flex flex-col justify-center">
                  <h3 className="font-headline text-3xl font-bold mb-4">Architectural Integrity</h3>
                  <p className="text-on-surface-variant max-w-sm text-sm">
                    Built on a foundation of ethical AI principles. We believe security should never come at the cost of personal liberty.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Common Examples Section */}
        <section className="py-32 bg-surface-container-low" id="examples">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-2xl">
                <label className="font-label text-xs font-bold uppercase tracking-widest text-primary-container mb-4 block">Case Studies</label>
                <h2 className="font-headline text-5xl font-extrabold tracking-tighter leading-tight">Common Examples</h2>
              </div>
              <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed">
                Identify these patterns before they identify you. Knowledge is your first line of defense.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Example 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl hover:shadow-xl hover:shadow-on-background/5 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>sms</span>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-error">SMS Phishing</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg mb-6 font-body text-sm italic text-on-surface/70 border-l-4 border-error">
                  "USPS: Your package is on hold due to missing address. Update now: usps-delivery-support.com"
                </div>
                <h4 className="font-headline font-bold mb-2">The "Delivery" Scam</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Targets your anxiety about missing mail. Real carriers will never ask for personal info via generic SMS links.
                </p>
              </div>
              {/* Example 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl hover:shadow-xl hover:shadow-on-background/5 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-primary">Bank Alert</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg mb-6 font-body text-sm italic text-on-surface/70 border-l-4 border-primary">
                  "Urgent: Unrecognized login detected from Moscow. If this was not you, secure your account: mybank-verify.net"
                </div>
                <h4 className="font-headline font-bold mb-2">Account Takeover</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Uses fear of theft to trick you into entering login credentials on a fraudulent portal.
                </p>
              </div>
              {/* Example 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-xl hover:shadow-xl hover:shadow-on-background/5 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-on-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>card_giftcard</span>
                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container">Sweepstakes</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-lg mb-6 font-body text-sm italic text-on-surface/70 border-l-4 border-on-tertiary-container">
                  "Congrats! You won a $1000 Amazon Gift Card. Claim your reward in the next 10 minutes: win-big-now.biz"
                </div>
                <h4 className="font-headline font-bold mb-2">The Reward Hook</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Uses false scarcity and excitement. Legitimate rewards aren't distributed via unsolicited messaging.
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* Final Call to Action */}
        <section className="py-32 relative overflow-hidden bg-on-background text-white">
          <div className="absolute inset-0 bg-primary-container mix-blend-multiply opacity-20"></div>
          <div className="max-w-4xl mx-auto px-8 relative z-10 text-center">
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter mb-8">Ready to stay safe?</h2>
            <p className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
              No sign-up required. No credit card needed. Just professional security at your fingertips.
            </p>
            <button className="bg-white text-on-background px-12 py-5 rounded-lg font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl">
              Analyze Your First Message
            </button>
          </div>
        </section>
      </main>
      {/* Footer */}
      <footer className="w-full py-12 px-8 bg-[#F6F3F2] dark:bg-[#1C1B1B]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-headline font-bold text-[#1C1B1B] dark:text-[#FCF9F8]">
            Poseidon Privacy
          </div>
          <div className="flex gap-8">
            <a className="font-label text-xs uppercase tracking-widest text-[#1C1B1B]/60 hover:text-[#1E40AF] cursor-pointer transition-opacity" href="#">Terms of Service</a>
            <a className="font-label text-xs uppercase tracking-widest text-[#1C1B1B]/60 hover:text-[#1E40AF] cursor-pointer transition-opacity" href="#">Security Whitepaper</a>
            <a className="font-label text-xs uppercase tracking-widest text-[#1C1B1B]/60 hover:text-[#1E40AF] cursor-pointer transition-opacity" href="#">Contact Support</a>
          </div>
          <div className="font-label text-xs uppercase tracking-widest text-[#1C1B1B]/50">
            © 2025 Poseidon Privacy. Architectural Integrity in Security.
          </div>
        </div>
      </footer>
    </>
  );
}
