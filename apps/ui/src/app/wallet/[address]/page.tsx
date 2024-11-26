'use client';

import { useEffect, useState } from 'react';
import { fetchTransactions } from '@/app/api/api';
import CustomPagination from '@/app/components/ui/custom_pagination';
import TransactionList from '@/app/components/ui/transactions_list';
import Sidebar from '@/app/components/ui/sidebar';
import { Progress } from '@/app/components/ui/progress';
import { useParams, useRouter } from 'next/navigation';

const WalletPage = () => {
  const [transactions, setTransactions] = useState([]);
  const { address } = useParams<{ address: string | undefined }>()
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactions(address, currentPage, pageSize);
      setTransactions(data.transactions);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [address, currentPage]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4 bg-gray-100 text-gray-700">
        <h1 className="text-2xl font-semibold">Transactions for wallet: {address}</h1>

        {loading && <Progress value={50} className="w-full" />}

        {!loading && transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <>
            <TransactionList transactions={transactions} />
            <CustomPagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => {
                if (page > 0 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default WalletPage;
