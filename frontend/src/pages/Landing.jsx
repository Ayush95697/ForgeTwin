import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Wrench, Package, ShieldCheck, Zap, BarChart3 } from 'lucide-react';
import './Landing.css';

const MarqueeItem = ({ children }) => (
  <span className="marquee-item text-muted">
    <ShieldCheck size={18} className="text-primary opacity-50" style={{ display: 'inline', marginRight: '6px' }} />
    {children}
  </span>
);

const FeatureCard = ({ icon: Icon, title, description, delay, className = "" }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.5, delay }}
    className={`bento-card glass-panel ${className}`}
  >
    <div className="icon-wrapper">
      <Icon size={28} />
    </div>
    <h3 className="bento-title">{title}</h3>
    <p className="bento-desc">{description}</p>
    <div className="glow-effect"></div>
  </motion.div>
);

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Dynamic Background Gradients */}
      <div className="bg-glow top-left"></div>
      <div className="bg-glow bottom-right"></div>
      
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-content">
          <div className="logo">
            <Activity className="text-primary" />
            <span>ForgeTwin</span>
          </div>
          <div className="nav-actions">
            <a href="#features" className="text-muted hover-white transition">Features</a>
            <Link to="/dashboard" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              Launch Dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            The Central Nervous System <br/>
            <span className="text-gradient">For Your Factory Floor</span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Digitalize manufacturing with real-time machine telemetry, predictive maintenance, and seamless inventory orchestration—all in one unified command center.
          </motion.p>

          <motion.div 
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Experience the Platform
            </Link>
            <a href="#demo" className="btn btn-secondary btn-lg">
              Book a Demo
            </a>
          </motion.div>
        </div>

      </section>

      {/* Trusted By Marquee (Infinite Scroll) */}
      <section className="trusted-section">
        <motion.p 
          className="trusted-label"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
        >
          TRUSTED BY INDUSTRY LEADERS WORLDWIDE
        </motion.p>
        <motion.div 
          className="marquee-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="marquee-content">
            <MarqueeItem>Nexus Heavy Industries</MarqueeItem>
            <MarqueeItem>Apex Robotics</MarqueeItem>
            <MarqueeItem>Stark Automation</MarqueeItem>
            <MarqueeItem>OmniCorp Manufacturing</MarqueeItem>
            <MarqueeItem>Global Forge Systems</MarqueeItem>
            {/* Duplicate for seamless looping */}
            <MarqueeItem>Nexus Heavy Industries</MarqueeItem>
            <MarqueeItem>Apex Robotics</MarqueeItem>
            <MarqueeItem>Stark Automation</MarqueeItem>
            <MarqueeItem>OmniCorp Manufacturing</MarqueeItem>
            <MarqueeItem>Global Forge Systems</MarqueeItem>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Features */}
      <section id="features" className="features-section">
        <div className="section-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Everything you need to run <span className="text-white">lights-out</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted"
          >
            Powerful tools engineered to eliminate downtime and maximize OEE.
          </motion.p>
        </div>

        <div className="bento-grid">
          <FeatureCard 
            icon={Activity} 
            title="Real-Time Telemetry" 
            description="Monitor live statuses, temperature, and performance metrics across your entire fleet instantly."
            delay={0.1}
            className="bento-large"
          />
          <FeatureCard 
            icon={Zap} 
            title="Predictive Alerts" 
            description="AI-driven algorithms detect anomalies before catastrophic failure occurs."
            delay={0.2}
          />
          <FeatureCard 
            icon={Wrench} 
            title="Work Order Sync" 
            description="Assign and track maintenance tasks with direct ties to inventory."
            delay={0.3}
          />
          <FeatureCard 
            icon={Package} 
            title="Smart Inventory" 
            description="Automated reorder thresholds ensure you never run out of critical parts."
            delay={0.4}
            className="bento-wide"
          />
          <FeatureCard 
            icon={BarChart3} 
            title="Production Analytics" 
            description="Deep dive into your factory's yield, defect rates, and total output over time."
            delay={0.5}
          />
        </div>
      </section>

      {/* Footer CTA */}
      <section className="cta-section">
        <motion.div 
          className="cta-container glass-panel"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2>Ready to transform your production?</h2>
          <p>Join the future of manufacturing today. Deploy ForgeTwin in under 24 hours.</p>
          <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            Get Started Now <ArrowRight size={18} />
          </Link>
          <div className="cta-glow"></div>
        </motion.div>
      </section>
      
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="logo" style={{ opacity: 0.5 }}>
            <Activity size={18} /> ForgeTwin
          </div>
          <div className="footer-links">
            <span className="text-muted">© 2026 ForgeTwin Systems. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
