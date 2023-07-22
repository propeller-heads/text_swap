import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MetaMaskComponent, WalletState } from './metamask';

const RootComponent: React.FC = () => {
    const disconnectedState: WalletState = { account: '', balance: '', chain: '' }
    const [wallet, setWallet] = React.useState<WalletState | undefined>(disconnectedState);


  return (
    <React.StrictMode>
      <MetaMaskComponent wallet={wallet} setWallet={setWallet} />
      <App wallet={wallet}/>
    </React.StrictMode>
  );
};

ReactDOM.render(<RootComponent />, document.getElementById('root'));
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
