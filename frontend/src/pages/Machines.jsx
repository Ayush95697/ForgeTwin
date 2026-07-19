import React, { useEffect, useState } from 'react';
import { fetchMachines } from '../services/api';
import { Cpu, Plus, Search, Filter, Circle } from 'lucide-react';

const Machines = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchMachines();
        setMachines(data || []);
      } catch (error) {
        console.error("Failed to fetch machines:", error);
        setMachines([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const MACHINE_TYPES = {
    0: 'CNC Machine',
    1: 'Lathe',
    2: 'Milling',
    3: 'Assembly',
    4: 'Inspection'
  };

  const getStatusInfo = (status) => {
    if (status === 0) return { label: 'Online', colorClass: 'online', dotClass: 'dot-online', badgeClass: 'badge-0' };
    if (status === 1) return { label: 'Offline', colorClass: 'offline', dotClass: 'dot-offline', badgeClass: 'badge-1' };
    if (status === 2) return { label: 'Maintenance', colorClass: 'maintenance', dotClass: 'dot-maintenance', badgeClass: 'badge-2' };
    return { label: 'Unknown', colorClass: 'unknown', dotClass: '', badgeClass: '' };
  };

  const filteredMachines = machines.filter(m => {
    if (activeFilter === 'All') return true;
    return getStatusInfo(m.status).label === activeFilter;
  });

  const getCount = (filterName) => {
    if (filterName === 'All') return machines.length;
    return machines.filter(m => getStatusInfo(m.status).label === filterName).length;
  };

  return (
    <div className="machines-container">
      <style>{`
        .machines-container {
          animation: fadeIn 0.4s ease-out;
          font-family: 'Inter', system-ui, sans-serif;
          color: #E2E8F0;
        }
        
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 2rem;
        }
        
        .header-titles h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0 0 0.25rem 0;
          letter-spacing: -0.02em;
        }
        
        .header-titles p {
          color: #94A3B8;
          margin: 0;
          font-size: 1rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #FF6B2C 0%, #E65013 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(255, 107, 44, 0.3);
          transition: all 0.2s ease;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 107, 44, 0.4);
        }

        .btn-primary:active {
          transform: translateY(1px);
        }

        .filter-bar {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          padding: 0.5rem;
          background: #111B2E;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          width: max-content;
        }
        
        .filter-btn {
          background: transparent;
          border: none;
          color: #94A3B8;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-btn:hover {
          color: #FFFFFF;
          background: rgba(255, 255, 255, 0.05);
        }

        .filter-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .filter-count {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.1rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        
        .filter-btn.active .filter-count {
          background: #FF6B2C;
          color: white;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .dot-online { background: #10B981; box-shadow: 0 0 8px #10B981; }
        .dot-offline { background: #EF4444; box-shadow: 0 0 8px #EF4444; }
        .dot-maintenance { background: #F59E0B; box-shadow: 0 0 8px #F59E0B; }

        .machines-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .machine-card {
          background: linear-gradient(180deg, #182338 0%, #131C2D 100%);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          position: relative;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        
        .machine-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 16px;
          box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          transition: all 0.3s;
          pointer-events: none;
        }
        
        .machine-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .machine-card.status-0 { border-bottom: 3px solid #10B981; }
        .machine-card.status-0:hover::before { box-shadow: inset 0 0 30px rgba(16, 185, 129, 0.05); }
        
        .machine-card.status-1 { border-bottom: 3px solid #EF4444; }
        .machine-card.status-1:hover::before { box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.05); }
        
        .machine-card.status-2 { border-bottom: 3px solid #F59E0B; }
        .machine-card.status-2:hover::before { box-shadow: inset 0 0 30px rgba(245, 158, 11, 0.05); }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .icon-wrapper {
          background: rgba(255, 255, 255, 0.05);
          padding: 0.75rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94A3B8;
        }

        .status-indicator {
          display: flex;
          align-items: center;
        }

        .card-body h3 {
          margin: 0 0 0.25rem 0;
          color: #FFFFFF;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .card-body p.type {
          color: #94A3B8;
          margin: 0 0 1.5rem 0;
          font-size: 0.875rem;
        }
        
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .installed-date {
          font-size: 0.75rem;
          color: #64748B;
        }

        .status-badge-inline {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
        }
        .badge-0 { background: rgba(16, 185, 129, 0.1); color: #10B981; }
        .badge-1 { background: rgba(239, 68, 68, 0.1); color: #EF4444; }
        .badge-2 { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }

        /* Skeletons */
        .skeleton-card {
          background: #182338;
          border-radius: 16px;
          height: 200px;
          position: relative;
          overflow: hidden;
        }
        
        .skeleton-card::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.04), transparent);
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          100% { left: 100%; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .empty-state {
          grid-column: span 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          background: #111B2E;
          border-radius: 16px;
          border: 1px dashed rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          text-align: center;
        }
        
        .empty-state svg {
          color: #475569;
          margin-bottom: 1rem;
        }
        
        .empty-state h3 {
          color: #FFFFFF;
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }
      `}</style>

      <div className="page-header">
        <div className="header-titles">
          <h1>Machine Fleet</h1>
          <p>Monitor and manage all factory machines</p>
        </div>
        <button className="btn-primary">
          <Plus size={18} />
          Add Machine
        </button>
      </div>

      <div className="filter-bar">
        {['All', 'Online', 'Offline', 'Maintenance'].map(filterOption => {
          let dotClass = '';
          if (filterOption === 'Online') dotClass = 'dot-online';
          if (filterOption === 'Offline') dotClass = 'dot-offline';
          if (filterOption === 'Maintenance') dotClass = 'dot-maintenance';
          
          return (
            <button 
              key={filterOption}
              className={`filter-btn ${activeFilter === filterOption ? 'active' : ''}`}
              onClick={() => setActiveFilter(filterOption)}
            >
              {dotClass && <div className={`dot ${dotClass}`} />}
              {filterOption}
              <span className="filter-count">{getCount(filterOption)}</span>
            </button>
          )
        })}
      </div>

      <div className="machines-grid">
        {loading ? (
          // Loading Skeletons
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))
        ) : filteredMachines.length === 0 ? (
          // Empty State
          <div className="empty-state">
            <Filter size={48} />
            <h3>No machines found</h3>
            <p>Try adjusting your filters or add a new machine.</p>
          </div>
        ) : (
          // Machine Cards
          filteredMachines.map(m => {
            const info = getStatusInfo(m.status);
            return (
              <div key={m.id} className={`machine-card status-${m.status}`}>
                <div className="card-header">
                  <div className="icon-wrapper">
                    <Cpu size={24} />
                  </div>
                  <div className="status-indicator">
                    <div className={`dot ${info.dotClass}`} title={info.label} />
                  </div>
                </div>
                
                <div className="card-body">
                  <h3>{m.name}</h3>
                  <p className="type">{MACHINE_TYPES[m.type] || 'Unknown Type'}</p>
                </div>
                
                <div className="card-footer">
                  <div className={`status-badge-inline ${info.badgeClass}`}>
                    {info.label}
                  </div>
                  <div className="installed-date">
                    Installed: {new Date(m.installedOn).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Machines;
