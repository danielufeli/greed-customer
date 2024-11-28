export interface User {
  id: string;
  bio: {
    name: {
      first: string;
      last: string;
      full: string;
    };
    username: string;
    photo: {
      link: string;
    };
  };
  roles: {
    isAdmin: boolean;
    isActive: boolean;
    isCustomer: boolean;
  };
  publicName: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  banner: {
    name: string;
    type: string;
    size: number;
    duration: number;
    path: string;
    timestamp: number;
    link: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  inStock: boolean;
  data: {
    type: string;
  };
  user: User;
  createdAt: number;
  updatedAt: number;
  quantity?: number;
}

export interface ApiResponse {
  results: Product[];
  pages: {
    start: number;
    last: number;
    next: string | null;
    previous: string | null;
    current: number;
  };
  docs: {
    limit: number;
    total: number;
    count: number;
  };
}
