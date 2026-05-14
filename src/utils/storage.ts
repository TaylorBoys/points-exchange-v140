import type { AppData, User, Gift, Exchange, Task } from '../types';

const STORAGE_KEY = 'points-exchange-data';

const defaultData: AppData = {
  users: [
    {
      id: '1',
      username: '张三',
      phone: '13800138000',
      points: 2560,
      level: 'gold',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      username: '李四',
      phone: '13900139000',
      points: 1200,
      level: 'silver',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisi',
      createdAt: '2024-02-20'
    },
    {
      id: '3',
      username: '王五',
      phone: '13700137000',
      points: 5200,
      level: 'platinum',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu',
      createdAt: '2024-01-05'
    }
  ],
  gifts: [
    {
      id: '1',
      name: '100元话费充值卡',
      description: '全国通用，三大运营商可选',
      points: 1000,
      stock: 50,
      image: 'https://picsum.photos/200/200?random=1',
      category: '充值卡'
    },
    {
      id: '2',
      name: '爱奇艺月度会员',
      description: 'VIP会员特权，免广告观看',
      points: 500,
      stock: 100,
      image: 'https://picsum.photos/200/200?random=2',
      category: '视频会员'
    },
    {
      id: '3',
      name: '50元京东E卡',
      description: '京东自营商品通用',
      points: 600,
      stock: 30,
      image: 'https://picsum.photos/200/200?random=3',
      category: '购物卡'
    },
    {
      id: '4',
      name: '腾讯视频季度会员',
      description: 'VIP会员特权，免广告观看',
      points: 1200,
      stock: 40,
      image: 'https://picsum.photos/200/200?random=4',
      category: '视频会员'
    },
    {
      id: '5',
      name: '200元加油卡',
      description: '中石化、中石油通用',
      points: 1800,
      stock: 20,
      image: 'https://picsum.photos/200/200?random=5',
      category: '加油卡'
    },
    {
      id: '6',
      name: '星巴克礼品卡',
      description: '全国星巴克门店通用',
      points: 400,
      stock: 60,
      image: 'https://picsum.photos/200/200?random=6',
      category: '餐饮卡'
    }
  ],
  exchanges: [
    {
      id: '1',
      userId: '1',
      giftId: '1',
      giftName: '100元话费充值卡',
      points: 1000,
      status: 'completed',
      createdAt: '2024-03-01',
      processedAt: '2024-03-02'
    },
    {
      id: '2',
      userId: '2',
      giftId: '2',
      giftName: '爱奇艺月度会员',
      points: 500,
      status: 'approved',
      createdAt: '2024-03-05',
      processedAt: '2024-03-06'
    },
    {
      id: '3',
      userId: '3',
      giftId: '3',
      giftName: '50元京东E卡',
      points: 600,
      status: 'pending',
      createdAt: '2024-03-10'
    }
  ],
  tasks: [
    {
      id: '1',
      name: '每日签到',
      description: '每天签到即可获得积分',
      points: 10,
      type: 'daily',
      completed: false,
      createdAt: '2024-01-01'
    },
    {
      id: '2',
      name: '分享APP',
      description: '分享APP给好友',
      points: 50,
      type: 'once',
      completed: true,
      createdAt: '2024-01-01'
    },
    {
      id: '3',
      name: '观看广告',
      description: '每观看一个广告获得积分',
      points: 5,
      type: 'continuous',
      completed: false,
      createdAt: '2024-01-01'
    },
    {
      id: '4',
      name: '完善资料',
      description: '完善个人资料',
      points: 100,
      type: 'once',
      completed: true,
      createdAt: '2024-01-01'
    },
    {
      id: '5',
      name: '邀请好友注册',
      description: '每邀请一个好友注册',
      points: 200,
      type: 'continuous',
      completed: false,
      createdAt: '2024-01-01'
    }
  ]
};

export const getData = (): AppData => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  saveData(defaultData);
  return defaultData;
};

export const saveData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getUsers = (): User[] => getData().users;
export const getGifts = (): Gift[] => getData().gifts;
export const getExchanges = (): Exchange[] => getData().exchanges;
export const getTasks = (): Task[] => getData().tasks;

export const addUser = (user: User): void => {
  const data = getData();
  data.users.push(user);
  saveData(data);
};

export const updateUser = (user: User): void => {
  const data = getData();
  const index = data.users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    data.users[index] = user;
    saveData(data);
  }
};

export const deleteUser = (id: string): void => {
  const data = getData();
  data.users = data.users.filter(u => u.id !== id);
  saveData(data);
};

export const addExchange = (exchange: Exchange): void => {
  const data = getData();
  data.exchanges.push(exchange);
  saveData(data);
};

export const updateExchange = (exchange: Exchange): void => {
  const data = getData();
  const index = data.exchanges.findIndex(e => e.id === exchange.id);
  if (index !== -1) {
    data.exchanges[index] = exchange;
    saveData(data);
  }
};

export const updateGiftStock = (giftId: string, delta: number): void => {
  const data = getData();
  const gift = data.gifts.find(g => g.id === giftId);
  if (gift) {
    gift.stock += delta;
    saveData(data);
  }
};

export const updateTask = (task: Task): void => {
  const data = getData();
  const index = data.tasks.findIndex(t => t.id === task.id);
  if (index !== -1) {
    data.tasks[index] = task;
    saveData(data);
  }
};

export const addGift = (gift: Gift): void => {
  const data = getData();
  data.gifts.push(gift);
  saveData(data);
};

export const updateGift = (gift: Gift): void => {
  const data = getData();
  const index = data.gifts.findIndex(g => g.id === gift.id);
  if (index !== -1) {
    data.gifts[index] = gift;
    saveData(data);
  }
};

export const deleteGift = (id: string): void => {
  const data = getData();
  data.gifts = data.gifts.filter(g => g.id !== id);
  saveData(data);
};
