import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Zap, 
  Shield, 
  Globe, 
  Cpu, 
  BarChart3, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Layout,
  Eye,
  Settings,
  Lock,
  Rocket,
  Mic,
  Coins,
  MousePointer2,
  Layers,
  Activity,
  Loader2
} from 'lucide-react';

interface SalesCenterProps {
  onClose: () => void;
  currentTier: string;
  userEmail?: string | null;
  stripeCustomerId?: string;
}

const NEURAL_NEXUS_TIERS = [
  {
    name: 'Navigator (SMB Starter)',
    price: 499,
    limits: '50,000 AI workflow runs /mo',
    seats: '5 team seats',
    features: ['Full API access', 'Essential toolkit automation', 'Standard Support'],
    color: '#00E0FF'
  },
  {
    name: 'Lighthouse (Growth)',
    price: 1299,
    limits: '250,000 AI workflow runs /mo',
    seats: '20 team seats',
    features: ['Priority processing', 'Faster operational scaling', 'Advanced Analytics'],
    color: '#0080FF'
  },
  {
    name: 'Neural Nexus (Scale)',
    price: 3499,
    limits: '1,000,000 AI workflow runs /mo',
    seats: 'Unlimited team seats',
    features: ['Dedicated infrastructure', 'Enterprise-grade power', 'Custom Integrations'],
    color: '#FFD700'
  },
  {
    name: 'Island Sovereign (Elite)',
    price: 7999,
    limits: 'Unlimited AI workflow runs',
    seats: 'Full Organization',
    features: ['On-premise deployment', 'Dedicated success manager', 'Total ecosystem mastery'],
    color: '#FFFFFF'
  }
];

const CRM_PLANS = [
  {
    name: 'Professional Plan',
    price: 149,
    description: 'Direct alternative to HubSpot or Salesforce.',
    savings: 'Estimated $23,000+ annual savings',
    features: [
      '12+ Industry-Specific Modules',
      'AI Sales Coach',
      'Full CRM Suite',
      'Lead Management'
    ]
  },
  {
    name: 'Enterprise & Custom',
    price: 'Custom',
    description: 'Complete Business Operations Suite.',
    features: [
      'Invoicing & Inventory',
      'Purchase Order Tracking',
      'Job Scheduling',
      'Advanced Customization'
    ]
  }
];

export default function SalesCenter({ onClose, currentTier, userEmail, stripeCustomerId }: SalesCenterProps) {
  const [visualMode, setVisualMode] = useState<'professional' | 'aesthetic'>('aesthetic');
  const [activeTab, setActiveTab] = useState<'tiers' | 'crm' | 'features'>('tiers');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const isAesthetic = visualMode === 'aesthetic';

  const handleCheckout = async (plan: { name: string, price: number | string, description?: string }) => {
    if (typeof plan.price !== 'number') return;
    
    setCheckoutLoading(plan.name);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: plan.name,
          price: plan.price,
          description: plan.description || `Subscription for ${plan.name}`,
          email: userEmail
        })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to create checkout session.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout.");
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    if (!stripeCustomerId) return;
    
    setPortalLoading(true);
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: stripeCustomerId })
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to open billing portal.");
      }
    } catch (error) {
      console.error("Portal error:", error);
      alert("An error occurred opening the billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 transition-colors duration-700 ${
        isAesthetic ? 'bg-black/95 backdrop-blur-3xl' : 'bg-[#0a0a0a]'
      }`}
    >
      <div className={`max-w-7xl w-full h-full max-h-[900px] flex flex-col overflow-hidden transition-all duration-700 ${
        isAesthetic 
          ? 'bg-black border border-[#00E0FF]/20 rounded-[40px] shadow-[0_0_100px_rgba(0,224,255,0.1)]' 
          : 'bg-white/[0.02] border border-white/10 rounded-2xl'
      }`}>
        
        {/* Header */}
        <div className={`p-8 border-b transition-colors duration-700 ${
          isAesthetic ? 'border-[#00E0FF]/10 bg-[#00E0FF]/5' : 'border-white/5 bg-transparent'
        } flex items-center justify-between`}>
          <div className="flex items-center gap-6">
            <div className={`p-4 rounded-2xl transition-all duration-700 ${
              isAesthetic ? 'bg-[#00E0FF]/20 text-[#00E0FF] shadow-[0_0_20px_rgba(0,224,255,0.3)]' : 'bg-white/5 text-white/60'
            }`}>
              <Rocket size={32} />
            </div>
            <div>
              <h2 className={`text-4xl font-bold tracking-tighter uppercase ${isAesthetic ? 'text-white' : 'text-white/90'}`}>
                Sales & Infrastructure Hub
              </h2>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${isAesthetic ? 'text-[#00E0FF]/60' : 'text-white/30'}`}>
                Neural Nexus • Infinite Visions AI • Enterprise Operations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Visual Mode Toggle */}
            <div className={`flex p-1 rounded-full border transition-colors duration-700 ${
              isAesthetic ? 'bg-white/5 border-white/10' : 'bg-black border-white/5'
            }`}>
              <button
                onClick={() => setVisualMode('professional')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  visualMode === 'professional' ? 'bg-white text-black' : 'text-white/40 hover:text-white/60'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => setVisualMode('aesthetic')}
                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${
                  visualMode === 'aesthetic' ? 'bg-[#00E0FF] text-black' : 'text-white/40 hover:text-white/60'
                }`}
              >
                Aesthetic
              </button>
            </div>

            <button 
              onClick={onClose}
              className="p-3 rounded-full hover:bg-white/5 text-white/40 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className={`flex border-b transition-colors duration-700 ${isAesthetic ? 'border-white/10' : 'border-white/5'}`}>
          {[
            { id: 'tiers', label: 'Neural Nexus Tiers', icon: Cpu },
            { id: 'crm', label: 'CRM & Operations', icon: Layout },
            { id: 'features', label: 'Feature Breakdown', icon: Layers }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 p-6 flex items-center justify-center gap-3 transition-all ${
                activeTab === tab.id 
                ? isAesthetic 
                  ? 'bg-[#00E0FF]/10 text-[#00E0FF] border-b-2 border-[#00E0FF]' 
                  : 'bg-white/5 text-white border-b-2 border-white'
                : 'text-white/40 hover:text-white/60'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'tiers' && (
              <motion.div
                key="tiers"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h3 className="text-3xl font-bold tracking-tighter uppercase">Core Service Tiers</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    High-volume AI automation and infrastructure designed for scale. 
                    Neural Nexus provides the backbone for your digital ecosystem.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {NEURAL_NEXUS_TIERS.map((tier) => (
                    <div 
                      key={tier.name}
                      className={`p-8 rounded-[32px] border flex flex-col transition-all duration-500 ${
                        isAesthetic 
                          ? 'bg-white/5 border-white/10 hover:border-[#00E0FF]/40 hover:bg-[#00E0FF]/5' 
                          : 'bg-white/[0.01] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="mb-8">
                        <h4 className="text-xl font-bold tracking-tighter uppercase mb-2" style={{ color: tier.color }}>{tier.name}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold">${tier.price}</span>
                          <span className="text-white/40 text-sm">/mo</span>
                        </div>
                      </div>

                      <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            <Activity size={12} />
                            Workflow Limits
                          </div>
                          <p className="text-sm font-bold text-white/80">{tier.limits}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            <Users size={12} />
                            User Seats
                          </div>
                          <p className="text-sm font-bold text-white/80">{tier.seats}</p>
                        </div>

                        <div className="space-y-3 pt-4 border-t border-white/5">
                          {tier.features.map((f, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] text-white/60">
                              <CheckCircle2 size={14} className="text-[#00FF00] shrink-0 mt-0.5" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleCheckout({ name: tier.name, price: tier.price, description: tier.limits })}
                        disabled={!!checkoutLoading || currentTier === tier.name}
                        className={`mt-8 w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        currentTier === tier.name
                        ? 'bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30'
                        : isAesthetic ? 'bg-[#00E0FF] text-black hover:scale-[1.02]' : 'bg-white text-black hover:bg-white/90'
                      }`}>
                        {checkoutLoading === tier.name ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : currentTier === tier.name ? (
                          <>
                            Active Plan
                            <CheckCircle2 size={14} />
                          </>
                        ) : (
                          <>
                            Initialize Nexus
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'crm' && (
              <motion.div
                key="crm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <h3 className="text-3xl font-bold tracking-tighter uppercase">Infinite Visions AI</h3>
                  <p className="text-white/40 text-sm leading-relaxed">
                    Specialized CRM and operations platform with deep industry modules.
                    A direct alternative to legacy systems with massive cost efficiency.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {CRM_PLANS.map((plan) => (
                    <div 
                      key={plan.name}
                      className={`p-10 rounded-[40px] border flex flex-col transition-all duration-500 ${
                        isAesthetic 
                          ? 'bg-white/5 border-white/10 hover:border-[#00E0FF]/40' 
                          : 'bg-white/[0.01] border-white/5'
                      }`}
                    >
                      <div className="mb-8 flex justify-between items-start">
                        <div>
                          <h4 className="text-2xl font-bold tracking-tighter uppercase text-white mb-2">{plan.name}</h4>
                          <p className="text-sm text-white/40">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold">
                            {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
                          </div>
                          {typeof plan.price === 'number' && <span className="text-white/40 text-xs">/mo</span>}
                        </div>
                      </div>

                      {plan.savings && (
                        <div className="mb-8 p-4 rounded-2xl bg-[#00FF00]/10 border border-[#00FF00]/20 flex items-center gap-3">
                          <Coins className="text-[#00FF00]" size={20} />
                          <span className="text-xs font-bold text-[#00FF00] uppercase tracking-wider">{plan.savings}</span>
                        </div>
                      )}

                      <div className="space-y-4 flex-1">
                        <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest block">Core Inclusions</span>
                        <div className="grid grid-cols-1 gap-3">
                          {plan.features.map((f, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-white/70">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#00E0FF]" />
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => handleCheckout({ name: plan.name, price: plan.price, description: plan.description })}
                        disabled={!!checkoutLoading || typeof plan.price !== 'number' || currentTier === plan.name}
                        className={`mt-10 w-full py-5 rounded-3xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        currentTier === plan.name
                        ? 'bg-[#00FF00]/20 text-[#00FF00] border border-[#00FF00]/30'
                        : isAesthetic ? 'bg-white text-black hover:bg-[#00E0FF]' : 'bg-white/10 text-white hover:bg-white/20'
                      }`}>
                        {checkoutLoading === plan.name ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : currentTier === plan.name ? (
                          <>
                            Active Plan
                            <CheckCircle2 size={16} />
                          </>
                        ) : (
                          <>
                            Activate Vision
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'features' && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Intelligence & Analytics */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#00E0FF]">
                      <BarChart3 size={24} />
                      <h4 className="text-xl font-bold tracking-tighter uppercase">Intelligence & Analytics</h4>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: 'AI Sales Coach', desc: 'Win probability, deal risk, and competitive insights.' },
                        { title: 'AI Revenue Forecasting', desc: 'Conservative, expected, and optimistic projections.' },
                        { title: 'AI Voice Control Orb', desc: 'Hands-free CRM control using natural language.' },
                        { title: 'Token System', desc: 'Flexible pay-as-you-go packs (1K to 50K tokens).' }
                      ].map((item) => (
                        <div key={item.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                          <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Automation Capabilities */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#00FF00]">
                      <Zap size={24} />
                      <h4 className="text-xl font-bold tracking-tighter uppercase">Automation Capabilities</h4>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: 'Visual Workflow Builder', desc: 'Drag-and-drop with 37+ action types & custom JS.' },
                        { title: 'Multi-Channel Campaigns', desc: 'Email, SMS, AI Calls, and sentiment analysis.' },
                        { title: 'Multi-Platform Ad Management', desc: 'Unified dashboard for Google, Meta, LinkedIn, TikTok.' },
                        { title: 'AI Bid Optimization', desc: 'Maximize ROI across all advertising channels.' }
                      ].map((item) => (
                        <div key={item.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                          <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Infrastructure & Security */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-[#FFD700]">
                      <Shield size={24} />
                      <h4 className="text-xl font-bold tracking-tighter uppercase">Infrastructure & Security</h4>
                    </div>
                    <div className="space-y-4">
                      {[
                        { title: '80% Faster Performance', desc: 'Optimized through advanced API caching.' },
                        { title: 'Enterprise Security', desc: 'SOC2 readiness, bank-level encryption, SSO support.' },
                        { title: 'BYOK (Bring Your Own Key)', desc: 'Use your own Twilio credentials at-cost ($0.013/min).' },
                        { title: 'Role-Based Access', desc: 'Granular control over team permissions and data.' }
                      ].map((item) => (
                        <div key={item.title} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                          <div className="text-sm font-bold text-white mb-1">{item.title}</div>
                          <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Deployment Details */}
                <div className="pt-12 border-t border-white/10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/5 text-[#00E0FF]">
                        <Rocket size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Under 1 Hour Setup</div>
                        <p className="text-[10px] font-mono text-white/40 uppercase">Assisted by AI Guidance</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/5 text-[#00FF00]">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">14-Day Free Trial</div>
                        <p className="text-[10px] font-mono text-white/40 uppercase">No Credit Card Required</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-white/5 text-[#FFD700]">
                        <Eye size={24} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Dual Visual Modes</div>
                        <p className="text-[10px] font-mono text-white/40 uppercase">Professional vs Aesthetic</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className={`p-6 border-t transition-colors duration-700 ${isAesthetic ? 'border-white/10 bg-white/5' : 'border-white/5 bg-transparent'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isAesthetic ? 'bg-[#00E0FF]' : 'bg-white/40'}`} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">System Status: Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isAesthetic ? 'bg-[#00FF00]' : 'bg-white/20'}`} />
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Neural Link: Encrypted</span>
              </div>
            </div>
            <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
              © 2026 Infinite Visions AI • Neural Nexus Ecosystem
            </div>
            {stripeCustomerId && (
              <button 
                onClick={handlePortal}
                disabled={portalLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  isAesthetic ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black text-white/60 hover:text-white'
                }`}
              >
                {portalLoading ? <Loader2 size={12} className="animate-spin" /> : <Settings size={12} />}
                Manage Subscription
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
