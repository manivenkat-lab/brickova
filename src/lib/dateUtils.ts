import { format } from 'date-fns';

export const safeFormatDate = (date: any, pattern: string = 'MMM dd'): string => {
  if (!date) return 'N/A';
  
  let d: Date;
  
  if (date instanceof Date) {
    d = date;
  } else if (typeof date.toDate === 'function') {
    d = date.toDate();
  } else if (typeof date === 'string' || typeof date === 'number') {
    d = new Date(date);
  } else {
    return 'N/A';
  }
  
  if (isNaN(d.getTime())) {
    return 'N/A';
  }
  
  return format(d, pattern);
};
