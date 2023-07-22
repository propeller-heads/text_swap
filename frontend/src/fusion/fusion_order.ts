import { FusionSDK, NetworkEnum, getLimitOrderV3Domain } from '@1inch/fusion-sdk'
import {Web3ProviderConnector} from './provider'
import { getTokenDecimals } from '../web3';

export async function placeFusionOrder(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    walletAddress: string,
    provider: Web3ProviderConnector,
): Promise<any>{
    const sellAmountOnChain = +sellAmount * 10 ** await getTokenDecimals(sellToken);

    const blockchainProvider = new Web3ProviderConnector(provider)
    const sdk = new FusionSDK({
          url: 'https://fusion.1inch.io',
          network: 1,
          blockchainProvider: blockchainProvider,
    });
     console.log("input", {
        fromTokenAddress: sellToken,
        toTokenAddress: buyToken,
        amount: sellAmountOnChain.toString(),
        walletAddress: walletAddress,
      });
    sdk.placeOrder({
        fromTokenAddress: sellToken,
        toTokenAddress: buyToken,
        amount: sellAmountOnChain.toString(),
        walletAddress: walletAddress,
    }).then(console.log)
}