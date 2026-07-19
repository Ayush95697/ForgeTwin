import React, { useState } from 'react';
import { ClipboardList, Plus, AlertCircle, Clock, CheckCircle, BarChart3, MoreHorizontal } from 'lucide-react';

const mockWorkOrders = [
  { id: 1, title: 'Fix Spindle Bearing', machineName: 'CNC Machine Alpha', priority: 2, status: 0, assignedTo: 'John Doe', createdAt: '2026-07-15T10:30:00Z' },
  { id: 2, title: 'Routine Lubrication', machineName: 'Lathe Unit Beta', priority: 0, status: 1, assignedTo: 'Jane Smith', createdAt: '2026-07-16T14:00:00Z' },
  { id: 3, title: 'Replace Conveyor Belt', machineName: 'Assembly Line Gamma', priority: 1, status: 0, assignedTo: 'Mike Chen', createdAt: '2026-07-17T09:15:00Z' },
  { id: 4, title: 'Calibrate Sensors', machineName: 'Inspection Unit Delta', priority: 0, status: 2, assignedTo: 'Sarah Lee', createdAt: '2026-07-14T16:45:00Z' },
  { id: 5, title: 'Motor Replacement', machineName: 'Milling Machine Epsilon', priority: 2, status: 0, assignedTo: 'Tom Wilson', createdAt: '2026-07-18T08:00:00Z' },
];

const priorityMap = { 0: { label: 'Low', color: '#94A3B8' }, 1: { label: 'Medium', color: '#F59E0B' }, 2: { label: 'High', color: '#EF4444' } };
const statusMap = { 0: { label: 'Open', color: '#FF6B2C', Icon: AlertCircle }, 1: { label: 'In Progress', color: '#3B82F6', Icon: Clock }, 2: { label: 'Completed', color: '#10B981', Icon: CheckCircle } };

const WorkOrders = () => {
  const [activeTab, setActiveTab] = useState('All');

  const filtered = mockWorkOrders.filter(o => {
    if (activeTab === 'Open') return o.status === 0;
    if (activeTab === 'In Progress') return o.status === 1;
    if (activeTab === 'Completed') return o.status === 2;
    return true;
  });

  const stats = [
    { label: 'Total Orders', value: mockWorkOrders.length, color: '#94A3B8' },
    { label: 'Open', value: mockWorkOrders.filter(o => o.status === 0).length, color: '#FF6B2C' },
    { label: 'In Progress', value: mockWorkOrders.filter(o => o.status === 1).length, color: '#3B82F6' },
    { label: 'Completed', value: mockWorkOrders.filter(o => o.status === 2).length, color: '#10B981' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem', fontWeight: 700 }}>
            <div style={{ padding: 10, background: '#111B2E', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', display: 'flex' }}>
              <ClipboardList size={24} color="#FF6B2C" />
            </div>
            Work Orders
          </h2>
          <p style={{ color: '#94A3B8', marginTop: '0.5rem' }}>Track and manage maintenance tasks across the facility</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> New Work Order</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ borderLeft: '3px solid ' + s.color, animation: 'fadeIn 0.4s ease ' + (i * 0.1) + 's both' }}>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{s.label}</p>
            <h2 style={{ fontSize: '2rem', margin: 0, color: '#fff' }}>{s.value}</h2>
          </div>
        ))}
      </div>

      {/* Tabs + Table */}
      <div style={{ background: '#111B2E', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1rem 1.5rem 0', gap: '1.5rem' }}>
          {['All', 'Open', 'In Progress', 'Completed'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ background: 'none', border: 'none', color: activeTab === tab ? '#fff' : '#94A3B8', paddingBottom: '1rem', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer', position: 'relative', transition: 'color 0.2s' }}>
              {tab}
              {activeTab === tab && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, background: '#FF6B2C', borderRadius: '2px 2px 0 0', boxShadow: '0 -2px 10px rgba(255,107,44,0.5)' }} />}
            </button>
          ))}
        </div>

        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Title</th><th>Machine</th><th>Priority</th><th>Status</th><th>Assigned To</th><th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map((o, i) => {
                const p = priorityMap[o.priority];
                const s = statusMap[o.status];
                const SIcon = s.Icon;
                return (
                  <tr key={o.id} style={{ animation: 'fadeIn 0.3s ease ' + (i * 0.03) + 's both' }}>
                    <td style={{ fontFamily: 'monospace', color: '#94A3B8' }}>#{String(o.id).padStart(4, '0')}</td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{o.title}</td>
                    <td style={{ color: '#CBD5E1' }}>{o.machineName}</td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.15rem 0.6rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: p.color + '20', color: p.color, border: '1px solid ' + p.color + '40' }}>{p.label}</span></td>
                    <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.15rem 0.7rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: s.color + '20', color: s.color, border: '1px solid ' + s.color + '40' }}><SIcon size={12} />{s.label}</span></td>
                    <td style={{ color: '#CBD5E1' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#182338', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#94A3B8' }}>{o.assignedTo.charAt(0)}</div>
                        {o.assignedTo}
                      </div>
                    </td>
                    <td style={{ color: '#64748B', fontSize: '0.9rem' }}>{new Date(o.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: '#94A3B8' }}>
                  <BarChart3 size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p style={{ fontSize: '1.1rem', fontWeight: 500, color: '#fff', marginBottom: '0.25rem' }}>No work orders found</p>
                  <p>There are no work orders matching the current filter.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WorkOrders;
