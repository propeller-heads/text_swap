import React, { useState } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';
import { blockchainConfig } from './config'

interface MetaMaskProps {
  account: string | undefined;
  setAccount: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const MetaMaskComponent: React.FC<MetaMaskProps>= ({ account, setAccount }) => {
    const MMSDK = new MetaMaskSDK()
    const ethereum = window.ethereum;
    const [balance, setBalance] = React.useState<string>("0");
    const [chain, setChain] = React.useState<any>(null);

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
            if (Accounts && Accounts.length > 0) {
              console.log('Connected to MetaMask!', Accounts);

              const balanceRaw: string = await window.ethereum?.request({
                method: 'eth_getBalance',
                params: [Accounts[0], 'latest'],
              }) as string
              const balance = formatBalance(balanceRaw)

              const chainId: string = await window.ethereum?.request({
                method: 'eth_chainId',
              }) as string
              try {
                const chain = blockchainConfig[chainId];
                setChain(chain);
              } catch (error){
                console.log(error, "chain not supported")
              }
              setBalance(balance);
              setAccount(Accounts[0]); // Store the connected account in the state
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
      {account ? (
        <div className="wallet-info">
          {chain && <div className="connected-wallet">{chain.name}</div>}
          {chain && <div className="connected-wallet">{balance} {chain.symbol}</div>}
          {account && chain && <div className="connected-wallet">{account.slice(0,3)}..{account.slice(-3)}</div>}
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
