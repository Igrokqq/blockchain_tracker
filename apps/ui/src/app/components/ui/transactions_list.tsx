'use client'

import { useState } from "react";
import { Input } from "./input";

interface Transaction {
  id: string;
  hash: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  timestamp: string;
  blockNumber: string;
  status: string;
}

interface TransactionListProps {
  transactions: Transaction[];
}

const parseTimestamp = (timestamp: string): Date => {
  const numericTimestamp = parseInt(timestamp.replace(/,/g, ""), 10);
  return new Date(numericTimestamp);
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.hash.toLowerCase().includes(search.toLowerCase()) ||
      transaction.fromAddress.toLowerCase().includes(search.toLowerCase()) ||
      transaction.toAddress.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search transactions... (hash, fromAddress, toAddress)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md"
      />

      <div className="overflow-x-auto">
        <table className="table-auto border-collapse border border-gray-300 w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">Hash</th>
              <th className="border border-gray-300 px-4 py-2 text-left">From</th>
              <th className="border border-gray-300 px-4 py-2 text-left">To</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Value</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Timestamp</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Block</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td
                  className="border border-gray-300 px-4 py-2"
                  title={transaction.hash}
                >
                  {transaction.hash}
                </td>
                <td className="border border-gray-300 px-4 py-2">{transaction.fromAddress}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.toAddress}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.value}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {parseTimestamp(transaction.timestamp).toLocaleString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">{transaction.blockNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{transaction.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredTransactions.length === 0 && (
          <p className="text-center mt-4">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
