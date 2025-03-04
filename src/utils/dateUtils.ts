
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const getRelativeTimeString = (dateString: string | undefined): string => {
  if (!dateString) return 'Never';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
};

export const calculateNextContactDate = (lastContactDate: string | undefined, frequencyInDays: number = 90): string => {
  if (!lastContactDate) return new Date().toISOString();
  
  const date = new Date(lastContactDate);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return new Date().toISOString();
  
  date.setDate(date.getDate() + frequencyInDays);
  return date.toISOString().split('T')[0];
};

export const isOverdue = (dateString: string | undefined): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  // Reset time to compare just the dates
  today.setHours(0, 0, 0, 0);
  
  return date < today;
};

export const sortContactsByDate = (contacts: any[], dateField: string = 'lastContactDate', ascending: boolean = false): any[] => {
  return [...contacts].sort((a, b) => {
    const dateA = a[dateField] ? new Date(a[dateField]).getTime() : 0;
    const dateB = b[dateField] ? new Date(b[dateField]).getTime() : 0;
    
    return ascending ? dateA - dateB : dateB - dateA;
  });
};
