/**
 * Removes undefined values from an object recursively.
 * Firestore does not support undefined values in documents.
 */
export const cleanObject = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(cleanObject);
  }

  const cleaned: any = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== undefined) {
      cleaned[key] = cleanObject(value);
    }
  });

  return cleaned;
};
