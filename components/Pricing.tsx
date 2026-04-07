
import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Check } from 'lucide-react';
import { MembershipTier } from '../types';

interface PricingProps {
  onSelectPlan?: (plan: MembershipTier) => Promise<void>;
  currentPlan?: MembershipTier;
}

const TiltCard = ({ children, isRecommended, index, currentPlanId, planId }: { children: React.ReactNode, isRecommended: boolean, index: number, currentPlanId?: MembershipTier, planId: MembershipTier }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-7deg", "7deg"]);

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;
    const xPct = (mouseXPos / width) - 0.5;
    const yPct = (mouseYPos / height) - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative perspective-1000"
    >
      <motion.div
        whileHover={{ scale: isRecommended ? 1.05 : 1.03, translateZ: 20 }}
        className={`relative flex flex-col p-8 rounded-[3rem] border-2 transition-all duration-300 group cursor-default h-full ${
          isRecommended
            ? 'bg-navy border-navy text-white shadow-2xl scale-105 z-10'
            : 'bg-white border-beige-200 text-navy hover:border-gold/50 shadow-soft'
        } ${currentPlanId === planId ? 'ring-4 ring-gold ring-offset-4' : ''}`}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

const Pricing: React.FC<PricingProps> = ({ onSelectPlan, currentPlan }) => {
  const [loadingPlan, setLoadingPlan] = React.useState<MembershipTier | null>(null);

  const handleSelect = async (planId: MembershipTier) => {
    setLoadingPlan(planId);
    
    // Safety timeout: If it takes more than 10 seconds, reset the loading state
    // so the user isn't stuck forever if Razorpay fails to open/dismiss.
    const timeout = setTimeout(() => {
      setLoadingPlan(null);
    }, 10000);

    try {
      await onSelectPlan?.(planId);
    } finally {
      clearTimeout(timeout);
      setLoadingPlan(null);
      // Force restore scroll just in case an external modal (like Razorpay)
      // locked it and then crashed/failed silently.
      document.body.style.overflow = 'auto';
    }
  };
  const plans = [
    {
      id: MembershipTier.FREE,
      name: 'Free Plan',
      price: '₹0',
      period: '/ month',
      description: 'Perfect for individuals starting their real estate journey.',
      features: [
        'Post up to 3 properties',
        'Basic listing visibility',
        'Limited access',
        'No CRM access',
      ],
      recommended: false,
      buttonText: 'Get Started',
    },
    {
      id: MembershipTier.BASIC,
      name: 'Basic Agent',
      price: '₹1999',
      period: '/ month',
      description: 'Best for active agents with growing inventory.',
      features: [
        'Post up to 10 properties',
        'Manage leads',
        'Full CRM access',
        'Property dashboard',
      ],
      recommended: false,
      buttonText: 'Choose Plan',
    },
    {
      id: MembershipTier.PRO,
      name: 'Pro Agent',
      price: '₹2999',
      period: '/ month',
      description: 'Most popular plan for high-volume agents.',
      features: [
        'Post up to 50 properties',
        'Full CRM access',
        'Track leads easily',
        'Performance insights',
        'Featured listings',
      ],
      recommended: true,
      buttonText: 'Choose Plan',
    },
    {
      id: MembershipTier.AGENCY,
      name: 'Agency Plan',
      price: '₹5999',
      period: '/ month',
      description: 'Built for agencies managing multiple agents.',
      features: [
        'Unlimited property listings',
        'Team management',
        'Shared agency dashboard',
        'Performance insights',
        'Priority support',
      ],
      recommended: false,
      buttonText: 'Choose Plan',
    },
  ];

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-6xl font-[900] text-navy uppercase tracking-tighter">
          Strategic <span className="text-gold">Growth</span> Plans
        </h2>
        <p className="text-navy-muted font-bold uppercase tracking-wider text-[10px] md:text-[12px] max-w-2xl mx-auto">
          Choose the professional tier that aligns with your asset management goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <TiltCard
            key={plan.name}
            index={index}
            isRecommended={plan.recommended}
            currentPlanId={currentPlan}
            planId={plan.id}
          >
            {plan.recommended && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gold text-navy text-[9px] font-bold uppercase tracking-widest px-6 py-2 rounded-full shadow-soft">
                Most Popular
              </div>
            )}

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <h3 className={`text-lg font-bold uppercase tracking-tight ${plan.recommended ? 'text-gold' : 'text-navy'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-[900] tracking-tighter">{plan.price}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest opacity-60`}>
                    {plan.period}
                  </span>
                </div>
                <p className={`text-[10px] font-medium leading-relaxed ${plan.recommended ? 'text-white/60' : 'text-navy-muted'}`}>
                  {plan.description}
                </p>
              </div>

              <div className={`h-px w-full ${plan.recommended ? 'bg-white/10' : 'bg-beige-100'}`}></div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.recommended ? 'bg-gold/20 text-gold' : 'bg-navy/5 text-navy'}`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSelect(plan.id)}
              disabled={loadingPlan !== null}
              className={`mt-10 w-full py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                plan.recommended
                  ? 'bg-gold text-navy hover:bg-white shadow-soft'
                  : currentPlan === plan.id 
                    ? 'bg-success text-white cursor-default'
                    : 'bg-navy text-white hover:bg-navy-ultra shadow-navy'
              } ${loadingPlan !== null && loadingPlan !== plan.id ? 'opacity-50' : ''}`}
            >
              {loadingPlan === plan.id ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                  />
                  Processing...
                </>
              ) : currentPlan === plan.id ? 'Current Plan' : plan.buttonText}
            </button>
          </TiltCard>
        ))}
      </div>

      <div className="text-center pt-10">
        <p className="text-[10px] font-bold text-navy-muted uppercase tracking-wider">
          All plans include access to our verified property network and standard support.
        </p>
      </div>
    </div>
  );
};

export default Pricing;
