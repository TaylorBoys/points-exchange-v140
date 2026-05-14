export interface User {
  id: string;
  username: string;
  phone: string;
  points: number;
  level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  avatar: string;
  createdAt: string;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  points: number;
  stock: number;
  image: string;
  category: string;
}

export interface Exchange {
  id: string;
  userId: string;
  giftId: string;
  giftName: string;
  points: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  processedAt?: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  points: number;
  type: 'daily' | 'once' | 'continuous';
  completed: boolean;
  createdAt: string;
}

export interface AppData {
  users: User[];
  gifts: Gift[];
  exchanges: Exchange[];
  tasks: Task[];
}
