'use client';

import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import Sidebar from "../components/ui/sidebar";
import { Alert, AlertTitle, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Card, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { createWallet, fetchWallets, untrackWallet, WalletDto } from "../api/api";

const Dashboard = () => {
  const [walletAddress, setWalletAddress] = useState("0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5"); // for demo purpose
  const [trackedWallets, setTrackedWallets] = useState<WalletDto[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  // Fetch wallets on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const wallets = await fetchWallets({});
        setTrackedWallets(wallets);
      } catch (error) {
        console.error('Error fetching wallets:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (walletAddress.length === 42 && walletAddress.startsWith("0x")) {
      const createdWallet = await createWallet(walletAddress);
      setTrackedWallets((prev) => [...prev, createdWallet]);
      setWalletAddress("");
      setIsSuccess(true);
      setIsError(false);
      setTimeout(() => setIsSuccess(false), 3000); // 3 seconds to turn off alert
    } else {
      setIsError(true);
      setIsSuccess(false);
    }
  };

  const handleStopTracking = async (walletId: string) => {
    try {
      await untrackWallet(walletId);

      setTrackedWallets((prevWallets) =>
        prevWallets.filter((w) => w.id !== walletId)
      );

      console.log(`Successfully stopped tracking wallet: ${walletId}`);
    } catch (error: any) {
      console.error(`Error stopping tracking for wallet ${walletId}:`, error.message);
      alert(`Failed to stop tracking the wallet. Please try again.`);
    }
  };


  const handleDetailsClick = (wallet: WalletDto) => {
    router.push(`/wallet/${wallet.address}`);
  };

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4 text-gray-700">Welcome to the Dashboard</h1>

        {/* Success and Error Alerts */}
        {isSuccess && (
          <Alert variant="default" className="mb-4 text-gray-700">
            <AlertTitle>Success!</AlertTitle>
            <AlertDescription>Wallet address submitted successfully!</AlertDescription>
          </Alert>
        )}
        {isError && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>Please enter a valid wallet address (e.g., 0x...).</AlertDescription>
          </Alert>
        )}

        {/* Wallet Address Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
              Track Wallet Address
            </label>
            <Input
              id="wallet"
              name="wallet"
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="mt-1 w-full text-gray-700"
              placeholder="Enter wallet address"
            />
          </div>
          <Button type="submit" className="mt-4 w-full bg-blue-600 text-white">
            Add Wallet
          </Button>
        </form>

        {/* Display tracked wallets */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tracked Wallets</h2>
        {trackedWallets.length > 0 ? (
          <div className="space-y-4">
            {trackedWallets.map((wallet: any, index) => (
              <Card key={index} className="p-4 shadow-sm bg-white rounded-md text-gray-700">
                <CardTitle className="text-lg font-semibold">{wallet?.address}</CardTitle>
                <CardContent className="flex justify-between items-center">
                  <span></span>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDetailsClick(wallet)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStopTracking(wallet.id)}
                    >
                      Stop Tracking
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-600">No wallets tracked yet.</p>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
