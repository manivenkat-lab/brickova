import React from 'react';
import { UnitStatus } from '../../types';

const STATUS_STYLES: Record<UnitStatus, string> = {
  'Available':    'bg-green-100 text-green-700 border-green-200',
  'Sold':         'bg-red-100 text-red-600 border-red-200',
  'Reserved':     'bg-amber-100 text-amber-700 border-amber-200',
  'Blocked':      'bg-gray-100 text-gray-500 border-gray-200',
  'Coming Soon':  'bg-blue-100 text-blue-600 border-blue-200',
};

const STATUS_DOT: Record<UnitStatus, string> = {
  'Available':   'bg-green-500',
  'Sold':        'bg-red-500',
  'Reserved':    'bg-amber-500',
  'Blocked':     'bg-gray-400',
  'Coming Soon': 'bg-blue-500',
};

interface Props {
  status: UnitStatus;
  size?: 'sm' | 'md';
}

const StatusBadge: React.FC<Props> = ({ status, size = 'md' }) => (
  <span className={`inline-flex items-center gap-1.5 border rounded-full font-bold uppercase tracking-widest ${size === 'sm' ? 'text-[7px] px-2 py-0.5' : 'text-[8px] px-2.5 py-1'} ${STATUS_STYLES[status]}`}>
    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${STATUS_DOT[status]}`} />
    {status}
  </span>
);

export default StatusBadge;
