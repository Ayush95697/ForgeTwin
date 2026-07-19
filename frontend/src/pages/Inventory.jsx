import React from 'react';
import { Package, Plus, DollarSign, AlertTriangle, CheckCircle, TrendingDown, BarChart3 } from 'lucide-react';

const mockInventory = [
  { id: 1, sku: 'BRG-608ZZ', name: 'Spindle Bearing 608ZZ', quantityOnHand: 12, reorderThreshold: 20, unitCost: 14.50 },
  { id: 2, sku: 'LUB-IND-5L', name: 'Industrial Lubricant 5L', quantityOnHand: 45, reorderThreshold: 10, unitCost: 48.00 },
  { id: 3, sku: 'BLT-CVY-01', name: 'Conveyor Belt Standard', quantityOnHand: 2, reorderThreshold: 5, unitCost: 125.00 },
  { id: 4, sku: 'FLT-HYD-A', name: 'Hydraulic Filter Type A', quantityOnHand: 30, reorderThreshold: 15, unitCost: 22.75 },
  { id: 5, sku: 'MTR-SRV-3P', name: '3-Phase Servo Motor', quantityOnHand: 3, reorderThreshold: 4, unitCost: 890.00 },
  { id: 6, sku: 'SNS-TEMP-K', name: 'K-Type Thermocouple Sensor', quantityOnHand: 18, reorderThreshold: 10, unitCost: 35.50 },
];

const Inventory = () => {
  const totalItems = mockInventory.reduce((acc, i) => acc + i.quantityOnHand, 0);
  const totalValue = mockInventory.reduce((acc, i) => acc + (i.quantityOnHand * i.unitCost), 0);
  const lowStock = mockInventory.filter(i => i.quantityOnHand < i.reorderThreshold);
  const inStock = mockInventory.filter(i => i.quantityOnHand >= i.reorderThreshold);

  const stats = [
    { label: 'Total Items (Units)', value: totalItems.toLocaleString(), color: '#3B82F6', Icon: Package },
    { label: 'Total Value', value: '$' + totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 }), color: '#10B981', Icon: DollarSign },
    { label: 'Low Stock', value: lowStock.length, color: '#EF4444', Icon: TrendingDown },
    { label: 'In Stock', value: inStock.length, color: '#10B981', Icon: CheckCircle },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem', fontWeight: 700 }}>
            <div style={{ padding: 10, background: '#111B2E', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', display: 'flex' }}>
              <Package size={24} color="#FF6B2C" />
            </div>
            Inventory Management
          </h2>
          <p style={{ color: '#94A3B8', marginTop: '0.5rem' }}>Track parts, supplies, and asset levels in real-time</p>
        </div>
        <button className="btn btn-primary"><Plus size={18} /> Add Item</button>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {stats.map((s, i) => {
          const SIcon = s.Icon;
          return (
            <div key={i} className="card" style={{ animation: 'fadeIn 0.4s ease ' + (i * 0.1) + 's both' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{s.label}</p>
                  <h2 style={{ fontSize: '2rem', margin: 0, color: '#fff' }}>{s.value}</h2>
                </div>
                <div style={{ padding: 12, borderRadius: 12, background: '#182338', border: '1px solid rgba(255,255,255,0.05)', color: s.color }}>
                  <SIcon size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: '#111B2E', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '1rem 1.5rem', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(24,35,56,0.3)' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={20} color="#94A3B8" /> Current Stock Levels
          </h3>
        </div>
        <div className="table-container" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th><th>Name</th><th style={{ textAlign: 'right' }}>Qty On Hand</th><th style={{ textAlign: 'right' }}>Reorder Threshold</th><th>Stock Level</th><th style={{ textAlign: 'right' }}>Unit Cost</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockInventory.map((item, i) => {
                const isLow = item.quantityOnHand < item.reorderThreshold;
                const fillPct = Math.min((item.quantityOnHand / (item.reorderThreshold * 2)) * 100, 100);
                const barColor = isLow ? '#EF4444' : '#10B981';
                return (
                  <tr key={item.id} style={{ animation: 'fadeIn 0.3s ease ' + (i * 0.03) + 's both' }}>
                    <td><span style={{ fontFamily: 'monospace', fontSize: '0.85rem', background: '#182338', padding: '0.2rem 0.5rem', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', color: '#94A3B8' }}>{item.sku}</span></td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{item.name}</td>
                    <td style={{ textAlign: 'right', fontWeight: 600, color: isLow ? '#EF4444' : '#E2E8F0' }}>{item.quantityOnHand}</td>
                    <td style={{ textAlign: 'right', color: '#94A3B8' }}>{item.reorderThreshold}</td>
                    <td style={{ width: 180 }}>
                      <div style={{ width: '100%', height: 8, background: '#182338', borderRadius: 9999, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', borderRadius: 9999, width: fillPct + '%', background: barColor, boxShadow: '0 0 10px ' + barColor + '80', transition: 'width 1s ease' }} />
                      </div>
                    </td>
                    <td style={{ textAlign: 'right', color: '#CBD5E1' }}>${item.unitCost.toFixed(2)}</td>
                    <td>
                      {isLow ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.15rem 0.7rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}><AlertTriangle size={12} /> LOW STOCK</span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '0.15rem 0.7rem', borderRadius: 9999, fontSize: '0.75rem', fontWeight: 600, background: 'rgba(16,185,129,0.15)', color: '#10B981', border: '1px solid rgba(16,185,129,0.3)' }}><CheckCircle size={12} /> IN STOCK</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
