import React, { useState } from 'react';
import { Wrench, Plus, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const mockRecords = [
  { id: 1, machineName: 'CNC Machine Alpha', type: 0, scheduledDate: '2026-07-20T09:00:00Z', completedDate: null, notes: 'Quarterly bearing inspection and replacement' },
  { id: 2, machineName: 'Lathe Unit Beta', type: 1, scheduledDate: '2026-07-18T14:00:00Z', completedDate: '2026-07-18T16:30:00Z', notes: 'Emergency coolant system repair completed' },
  { id: 3, machineName: 'Assembly Line Gamma', type: 0, scheduledDate: '2026-07-22T08:00:00Z', completedDate: null, notes: 'Scheduled conveyor belt tension adjustment' },
  { id: 4, machineName: 'Milling Machine Epsilon', type: 2, scheduledDate: '2026-07-15T10:00:00Z', completedDate: '2026-07-15T11:00:00Z', notes: 'Firmware upgrade v3.2.1 applied successfully' },
  { id: 5, machineName: 'Inspection Unit Delta', type: 0, scheduledDate: '2026-07-25T07:00:00Z', completedDate: null, notes: 'Annual calibration due' },
];

const typeMap = { 0: 'Preventive', 1: 'Corrective', 2: 'Predictive' };
const typeColors = { 0: 'var(--color-info, #3B82F6)', 1: 'var(--color-danger, #EF4444)', 2: 'var(--color-accent-purple, #A855F7)' };

const Maintenance = () => {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockRecords
    : filter === 'pending' ? mockRecords.filter(r => !r.completedDate)
    : mockRecords.filter(r => r.completedDate);

  const pending = mockRecords.filter(r => !r.completedDate).length;
  const completed = mockRecords.filter(r => r.completedDate).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={20} color="#A855F7" />
            </div>
            Maintenance Records
          </h2>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', marginTop: '0.5rem' }}>Schedule and track machine maintenance activities</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Schedule Maintenance</button>
      </div>

      {/* Summary Cards */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ borderLeft: '3px solid var(--color-info, #3B82F6)' }}>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Total Records</p>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>{mockRecords.length}</h2>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--color-warning, #F59E0B)' }}>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Pending</p>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-warning, #F59E0B)' }}>{pending}</h2>
        </div>
        <div className="card" style={{ borderLeft: '3px solid var(--color-success, #10B981)' }}>
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Completed</p>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--color-success, #10B981)' }}>{completed}</h2>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[['all', 'All'], ['pending', 'Pending'], ['completed', 'Completed']].map(([key, label]) => (
          <button key={key} className={filter === key ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ fontSize: '0.85rem' }} onClick={() => setFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* Timeline Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((record, i) => (
          <div key={record.id} className="card" style={{
            display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center',
            borderLeft: `3px solid ${typeColors[record.type]}`,
            animation: `fadeIn 0.3s ease ${i * 0.05}s both`
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>{record.machineName}</h4>
                <span className="badge" style={{
                  background: `${typeColors[record.type]}20`, color: typeColors[record.type],
                  border: `1px solid ${typeColors[record.type]}40`
                }}>{typeMap[record.type]}</span>
              </div>
              <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.9rem', margin: '0.25rem 0' }}>{record.notes}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted, #64748B)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> Scheduled: {new Date(record.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
            <div>
              {record.completedDate ? (
                <span className="badge badge-success" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle size={14} /> Completed
                </span>
              ) : (
                <span className="badge badge-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Clock size={14} /> Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maintenance;
