import React from 'react';

interface Props {
  total: number;
  available: number;
  sold: number;
  reserved: number;
  blocked: number;
}

const InventorySummary: React.FC<Props> = ({ total, available, sold, reserved, blocked }) => {
  const stats = [
    { label: 'Total', value: total, color: 'text-navy', bg: 'bg-navy/5 border-navy/10' },
    { label: 'Available', value: available, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
    { label: 'Sold', value: sold, color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
    { label: 'Reserved', value: reserved, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
    { label: 'Blocked', value: blocked, color: 'text-gray-500', bg: 'bg-gray-50 border-gray-100' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {stats.map(s => (
        <div key={s.label} className={`border rounded-xl md:rounded-2xl p-3 md:p-4 text-center ${s.bg}`}>
          <p className={`text-xl md:text-2xl font-black ${s.color}`}>{s.value}</p>
          <p className="text-[8px] font-bold uppercase tracking-widest text-navy-muted mt-0.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default InventorySummary;
