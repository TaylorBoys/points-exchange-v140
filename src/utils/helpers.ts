export const formatDate = (date: string): string => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const formatDateTime = (date: string): string => {
  const d = new Date(date);
  return `${formatDate(date)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const getLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    bronze: 'text-amber-700',
    silver: 'text-gray-400',
    gold: 'text-yellow-500',
    platinum: 'text-purple-500',
    diamond: 'text-blue-500'
  };
  return colors[level] || 'text-gray-500';
};

export const getLevelBg = (level: string): string => {
  const colors: Record<string, string> = {
    bronze: 'bg-amber-100',
    silver: 'bg-gray-100',
    gold: 'bg-yellow-100',
    platinum: 'bg-purple-100',
    diamond: 'bg-blue-100'
  };
  return colors[level] || 'bg-gray-100';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-100',
    approved: 'text-blue-600 bg-blue-100',
    rejected: 'text-red-600 bg-red-100',
    completed: 'text-green-600 bg-green-100'
  };
  return colors[status] || 'text-gray-600 bg-gray-100';
};

export const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待处理',
    approved: '已通过',
    rejected: '已拒绝',
    completed: '已完成'
  };
  return texts[status] || status;
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
