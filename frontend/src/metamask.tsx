import React, { useState } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';
import { blockchainConfig } from './config'

export interface WalletState {
  account: string | undefined,
  balance: string,
  chain: any,
}


interface MetaMaskProps {
  wallet: WalletState | undefined;
  setWallet: React.Dispatch<React.SetStateAction<WalletState | undefined>>;
}

export const MetaMaskComponent: React.FC<MetaMaskProps>= ({ wallet, setWallet }) => {
    const MMSDK = new MetaMaskSDK()
    const ethereum = window.ethereum;

    const formatBalance = (rawBalance: string) => {
      const balance = (parseInt(rawBalance) / 1000000000000000000).toFixed(2)
      return balance
    }

    const ConnectToMetaMask = async () => {
        try {
          // Check if MetaMask is installed
          if (ethereum) {
            // Request account access
            const Accounts = await ethereum.request<string[]>({
              method: 'eth_requestAccounts',
            });
            console.log("RWJFVKJWV", Accounts)
            if (Accounts && Accounts.length > 0) {
              console.log('Connected to MetaMask!', Accounts);

              const balanceRaw: string = await window.ethereum?.request({
                method: 'eth_getBalance',
                params: [Accounts[0], 'latest'],
              }) as string
              console.log("NOT formatted balance", balanceRaw)

              const balance = formatBalance(balanceRaw)
              console.log("formatted balance", balance)

              const chainId: string = await window.ethereum?.request({
                method: 'eth_chainId',
              }) as string
              console.log("chainID", chainId)

              try {
                const chain = blockchainConfig[chainId];
                setWallet(
                  { account: Accounts[0], balance: balance, chain: chain }
                );
                console.log("chainID", chain);
              } catch (error){
                console.log(error, "chain not supported")
              }
            } else {
              console.error('No accounts found in MetaMask.');
            }
          } else {
            console.error(
              'MetaMask not found. Please install MetaMask to use this application.',
            );
          }
        } catch (error) {
          console.error(error);
        }
      }

    return (
  <header>
    <div className="connectBtns">
      {wallet && wallet.account ? (
        <div className="wallet-info">
          {wallet && wallet.chain && <div className="connected-wallet">{wallet.chain.name}</div>}
          {wallet && wallet.balance && <div className="connected-wallet">{wallet.balance} {wallet.chain.symbol}</div>}
          {wallet && wallet.account && <div className="connected-wallet">{wallet.account.slice(0,3)}..{wallet.account.slice(-3)}</div>}
        </div>
      ) : (
        <button className="connect-wallet-button" onClick={ConnectToMetaMask}>
          Connect To MetaMask
        </button>
      )}
    </div>
  </header>
  );
};

export default MetaMaskComponent;
