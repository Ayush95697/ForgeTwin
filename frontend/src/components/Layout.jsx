import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  Activity,
  LayoutDashboard,
  Cpu,
  ClipboardList,
  Wrench,
  Package,
  BarChart3,
  Bell
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/machines', label: 'Machines', icon: Cpu },
  { path: '/work-orders', label: 'Work Orders', icon: ClipboardList },
  { path: '/maintenance', label: 'Maintenance', icon: Wrench },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/production', label: 'Production Logs', icon: BarChart3 },
];

const getPageTitle = (pathname) => {
  const item = navItems.find(nav => nav.path === pathname);
  return item ? item.label : 'Overview';
};

const Layout = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  
  // Animation state for route changes
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  const colors = {
    bg: '#0B1120',
    panel: '#111B2E',
    card: '#182338',
    primary: '#FF6B2C',
    text: '#E2E8F0',
    textMuted: '#94A3B8',
    border: 'rgba(255, 255, 255, 0.08)',
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: colors.bg, color: colors.text, overflow: 'hidden', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Sidebar */}
      <div className="glass-panel" style={{ 
        width: '260px', 
        backgroundColor: colors.panel, 
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)'
      }}>
        {/* Logo Area */}
        <div style={{ 
          height: '64px', 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 24px',
          borderBottom: `1px solid ${colors.border}`,
          gap: '12px'
        }}>
          <Activity size={24} color={colors.primary} />
          <span style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '0.5px' }}>ForgeTwin</span>
        </div>

        {/* Navigation */}
        <div style={{ flex: 1, padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  color: isActive ? colors.primary : colors.textMuted,
                  backgroundColor: isActive ? 'rgba(255, 107, 44, 0.1)' : 'transparent',
                  borderLeft: isActive ? `4px solid ${colors.primary}` : '4px solid transparent',
                  transition: 'all 0.2s ease',
                  fontWeight: isActive ? 500 : 400,
                  textShadow: isActive ? '0 0 10px rgba(255, 107, 44, 0.3)' : 'none'
                })}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '24px', borderTop: `1px solid ${colors.border}`, fontSize: '0.75rem', color: colors.textMuted, textAlign: 'center' }}>
          v1.0.0 — Digital Factory
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* Topbar */}
        <div className="glass-panel" style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          backgroundColor: 'rgba(17, 27, 46, 0.7)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${colors.border}`,
          zIndex: 5
        }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0 }}>{pageTitle}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={20} color={colors.textMuted} style={{ transition: 'color 0.2s' }} />
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                backgroundColor: 'red',
                borderRadius: '50%',
                border: `2px solid ${colors.panel}`
              }} />
            </div>

            {/* User Avatar */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: colors.card,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontWeight: 500,
              color: colors.primary,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              NT
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
          backgroundColor: colors.bg,
          opacity: animate ? 0.8 : 1,
          transform: animate ? 'translateY(10px)' : 'translateY(0)',
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
