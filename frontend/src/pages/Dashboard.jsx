import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../services/api';
import { TrendingUp, AlertTriangle, Clock, PackageX, Activity, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const data = await fetchDashboardStats();
        if (mounted) { setStats(data); setLoading(false); }
      } catch (e) {
        if (mounted) { setError(true); setLoading(false); }
      }
    };
    loadData();
    return () => { mounted = false; };
  }, []);

  const statCards = [
    { label: 'Units Produced (7d)', key: 'totalUnitsProducedLast7Days', icon: TrendingUp, color: '#10B981', bg: 'rgba(16,185,129,0.15)' },
    { label: 'Defects (7d)', key: 'totalDefectCountLast7Days', icon: AlertTriangle, color: '#EF4444', bg: 'rgba(239,68,68,0.15)' },
    { label: 'Upcoming Maintenance', key: 'upcomingMaintenanceCount', icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Low Stock Items', key: 'lowStockItems', icon: PackageX, color: '#3B82F6', bg: 'rgba(59,130,246,0.15)' },
  ];

  if (loading) {
    return (
      <div>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Dashboard Overview</h2>
        <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Loading real-time factory metrics...</p>
        <div className="grid-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="card skeleton" style={{ height: 140 }} />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <AlertCircle size={48} color="#FF6B2C" />
        <h2 style={{ marginTop: '1rem', color: '#F8FAFC' }}>Failed to load dashboard data</h2>
        <p style={{ color: '#94A3B8' }}>Please ensure your backend API server is running and try again.</p>
      </div>
    );
  }

  const totalMachines = stats.machineStatusCounts ? Object.values(stats.machineStatusCounts).reduce((a, b) => a + b, 0) : 0;

  return (
    <div>
      <div style={{ marginBottom: '2rem', animation: 'slideUp 0.5s ease both' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Dashboard Overview</h2>
        <p style={{ color: '#94A3B8' }}>Real-time factory metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          const value = card.key === 'lowStockItems' ? (stats.lowStockItems?.length || 0) : (stats[card.key] ?? 0);
          return (
            <div key={idx} className="card" style={{ borderLeft: '4px solid ' + card.color, animation: 'fadeIn 0.5s ease ' + (idx * 0.1) + 's both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '3rem', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: '0.5rem' }}>{value}</div>
                  <div style={{ fontSize: '0.875rem', color: '#94A3B8', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                </div>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={28} color={card.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Machine Status */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Activity size={20} color="#FF6B2C" />
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Machine Status</h3>
          </div>
          {stats.machineStatusCounts && Object.entries(stats.machineStatusCounts).map(([status, count], idx) => {
            const pct = totalMachines > 0 ? (count / totalMachines) * 100 : 0;
            let sc = '#3B82F6';
            if (status.toLowerCase().includes('running') || status.toLowerCase().includes('online')) sc = '#10B981';
            if (status.toLowerCase().includes('down') || status.toLowerCase().includes('offline')) sc = '#EF4444';
            if (status.toLowerCase().includes('idle') || status.toLowerCase().includes('maintenance')) sc = '#F59E0B';
            return (
              <div key={idx} style={{ marginBottom: idx < Object.keys(stats.machineStatusCounts).length - 1 ? '1.25rem' : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', color: '#CBD5E1', fontWeight: 500 }}>{status}</span>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 700, background: sc + '33', color: sc }}>{count}</span>
                </div>
                <div style={{ background: '#0B1120', height: 6, borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 4, width: pct + '%', background: sc, transition: 'width 1s ease-in-out' }} />
                </div>
              </div>
            );
          })}
          {(!stats.machineStatusCounts || Object.keys(stats.machineStatusCounts).length === 0) && (
            <p style={{ color: '#64748B', fontStyle: 'italic' }}>No machine status data available.</p>
          )}
        </div>

        {/* Work Orders by Priority */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Clock size={20} color="#FF6B2C" />
            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>Open Work Orders by Priority</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {['High', 'Medium', 'Low'].map(priority => {
              const count = stats.openWorkOrderPriorityCounts?.[priority] || 0;
              let pc = '#3B82F6', bg = '#3B82F633';
              if (priority === 'High') { pc = '#EF4444'; bg = '#EF444433'; }
              else if (priority === 'Medium') { pc = '#F59E0B'; bg = '#F59E0B33'; }
              return (
                <div key={priority} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', borderRadius: 12, borderLeft: '4px solid ' + pc, background: bg, transition: 'transform 0.2s', cursor: 'pointer' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateX(4px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'translateX(0)'}>
                  <span style={{ fontWeight: 600, color: pc }}>{priority} Priority</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#fff' }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems && stats.lowStockItems.length > 0 && (
        <div style={{ animation: 'fadeIn 0.5s ease 0.5s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(245,158,11,0.1)', borderLeft: '4px solid #F59E0B', padding: '1rem 1.5rem', borderRadius: 8, marginBottom: '1.5rem', color: '#FCD34D', fontWeight: 500, gap: '1rem' }}>
            <AlertTriangle size={20} color="#F59E0B" />
            <span>Warning: {stats.lowStockItems.length} items are critically low in stock. Restock immediately.</span>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>SKU</th>
                  <th>Current Qty</th>
                  <th>Threshold</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStockItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.name}</td>
                    <td>{item.sku}</td>
                    <td style={{ color: '#EF4444', fontWeight: 700 }}>{item.quantityOnHand}</td>
                    <td>{item.reorderThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
