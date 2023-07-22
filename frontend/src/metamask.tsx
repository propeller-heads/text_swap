import React, { useState } from 'react';
import { MetaMaskSDK } from '@metamask/sdk';

const MetaMaskComponent: React.FC = () => {
    const [connectedToMetaMask, setConnectedToMetaMask] = useState(false);
    const [account, setAccount] = useState<string | undefined >("");;

    const MMSDK = new MetaMaskSDK() // TODO: USE REAL SDK

    const ethereum = window.ethereum;

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
              setConnectedToMetaMask(true);
              console.log(Accounts);
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
    <div className="connectBtns">
      {connectedToMetaMask ? (
        <div>
          {account && <p>Connected Account: {account}</p>}
        </div>
      ) : (
        <button className="btn" onClick={ConnectToMetaMask}>
          Connect To MetaMask
        </button>
      )}
    </div>
  );
};

export default MetaMaskComponent;
