import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const mockLogs = [
  { id: 1, machineName: 'CNC Machine Alpha', unitsProduced: 450, defectCount: 3, loggedAt: '2026-07-19T08:00:00Z' },
  { id: 2, machineName: 'Lathe Unit Beta', unitsProduced: 320, defectCount: 12, loggedAt: '2026-07-19T07:30:00Z' },
  { id: 3, machineName: 'Assembly Line Gamma', unitsProduced: 890, defectCount: 5, loggedAt: '2026-07-18T16:00:00Z' },
  { id: 4, machineName: 'Milling Machine Epsilon', unitsProduced: 210, defectCount: 1, loggedAt: '2026-07-18T14:00:00Z' },
  { id: 5, machineName: 'CNC Machine Alpha', unitsProduced: 480, defectCount: 2, loggedAt: '2026-07-18T08:00:00Z' },
  { id: 6, machineName: 'Inspection Unit Delta', unitsProduced: 150, defectCount: 0, loggedAt: '2026-07-17T10:00:00Z' },
  { id: 7, machineName: 'Lathe Unit Beta', unitsProduced: 290, defectCount: 8, loggedAt: '2026-07-17T08:00:00Z' },
  { id: 8, machineName: 'Assembly Line Gamma', unitsProduced: 920, defectCount: 4, loggedAt: '2026-07-16T15:00:00Z' },
];

const ProductionLogs = () => {
  const [sortBy, setSortBy] = useState('date');

  const totalUnits = mockLogs.reduce((s, l) => s + l.unitsProduced, 0);
  const totalDefects = mockLogs.reduce((s, l) => s + l.defectCount, 0);
  const defectRate = totalUnits > 0 ? ((totalDefects / totalUnits) * 100).toFixed(2) : 0;
  const avgOutput = Math.round(totalUnits / mockLogs.length);

  const sorted = [...mockLogs].sort((a, b) => {
    if (sortBy === 'date') return new Date(b.loggedAt) - new Date(a.loggedAt);
    if (sortBy === 'units') return b.unitsProduced - a.unitsProduced;
    if (sortBy === 'defects') return b.defectCount - a.defectCount;
    return 0;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart3 size={20} color="#3B82F6" />
            </div>
            Production Logs
          </h2>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', marginTop: '0.5rem' }}>Track output metrics and quality across all machines</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '3px solid var(--color-success, #10B981)' }}>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Total Units Produced</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{totalUnits.toLocaleString()}</h2>
            <span style={{ color: 'var(--color-success, #10B981)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}><ArrowUpRight size={14} /> +8.2%</span>
          </div>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--color-danger, #EF4444)' }}>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Total Defects</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '2rem', margin: 0 }}>{totalDefects}</h2>
            <span style={{ color: 'var(--color-danger, #EF4444)', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}><ArrowDownRight size={14} /> -2.1%</span>
          </div>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--color-warning, #F59E0B)' }}>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Defect Rate</p>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{defectRate}%</h2>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--color-info, #3B82F6)' }}>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Avg Output / Log</p>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{avgOutput}</h2>
        </div>
      </div>

      {/* Sort Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[['date', 'By Date'], ['units', 'By Output'], ['defects', 'By Defects']].map(([key, label]) => (
          <button key={key} className={sortBy === key ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.85rem' }} onClick={() => setSortBy(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* Production Logs Table */}
      <div className="glass-panel table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Machine</th>
              <th>Units Produced</th>
              <th>Defects</th>
              <th>Yield Rate</th>
              <th>Logged At</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((log, i) => {
              const yieldRate = ((log.unitsProduced - log.defectCount) / log.unitsProduced * 100).toFixed(1);
              const yieldColor = yieldRate >= 99 ? 'var(--color-success, #10B981)' : yieldRate >= 95 ? 'var(--color-warning, #F59E0B)' : 'var(--color-danger, #EF4444)';
              return (
                <tr key={log.id} style={{ animation: `fadeIn 0.3s ease ${i * 0.03}s both` }}>
                  <td style={{ fontWeight: 500, color: '#fff' }}>{log.machineName}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{log.unitsProduced.toLocaleString()}</span>
                      {/* Mini bar */}
                      <div style={{ width: 60, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(100, (log.unitsProduced / 1000) * 100)}%`, height: '100%', borderRadius: 3, background: 'var(--color-success, #10B981)', transition: 'width 0.5s ease' }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    {log.defectCount === 0 ? (
                      <span className="badge badge-success">0 — Perfect</span>
                    ) : (
                      <span className="badge badge-danger">{log.defectCount}</span>
                    )}
                  </td>
                  <td style={{ color: yieldColor, fontWeight: 600 }}>{yieldRate}%</td>
                  <td style={{ color: 'var(--text-muted, #64748B)', fontSize: '0.9rem' }}>
                    {new Date(log.loggedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductionLogs;
