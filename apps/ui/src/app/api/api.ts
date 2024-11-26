// TODO: Split by separated api files

import axiosInstance from "../utils/axiosInstance";

export type FetchWalletsDto = {
  active?: boolean;
}

export type WalletDto = {
  id: string;
  address: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;

  lastBlockNumber?: string;
}

export const fetchTransactions = async (address: string | undefined, page: number = 1, pageSize: number = 10) => {
  const res = await axiosInstance.get(`/transactions?address=${address}&page=${page}&pageSize=${pageSize}`, {
    headers: {
      'Content-Type': 'application/json',

    }
  })

  if (res.status >= 400) {
    throw new Error('Failed to fetch transactions');
  }

  return res.data;
};


export const createWallet = async (address: string) => {
  const res = await axiosInstance.post(`/tracker/address/${address}`, {})

  if (res.status >= 400) {
    throw new Error('Failed to create wallet for tracking');
  }

  return res.data;
};

export const fetchWallets = async (dto: FetchWalletsDto): Promise<WalletDto[] | never> => {

  const res = await axiosInstance.get(`/wallets`, {
    params: dto,
  })

  if (res.status >= 400) {
    throw new Error('Failed to fetch wallets');
  }

  return res.data;
};




export const login = async (email: string, password: string) => {
  try {
    const data = {
      email,
      password,
    }

    const response = await axiosInstance.post(`/auth/signin`, data);

    const { access_token } = response.data;

    localStorage.setItem('access_token', access_token);
    document.cookie = `access_token=${access_token}; path=/; max-age=86400`; // max-age=1 day

    return access_token;
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
};



export const untrackWallet = async (id: string) => {
  const res = await axiosInstance.post(`/tracker/stop/${id}`, {})

  if (res.status >= 400) {
    throw new Error(`Failed to stop tracking for ${id}`);
  }

  return res.data;
};
