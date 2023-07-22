import { FusionSDK } from '@1inch/fusion-sdk'
import {Web3ProviderConnector} from './provider'

export async function placeFusionOrder(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    wallet: string,
    provider: Web3ProviderConnector,
): Promise<any>{
    const blockchainProvider = new Web3ProviderConnector(provider)
    const sdk = new FusionSDK({
        url: 'https://fusion.1inch.io',
        network: 1,
        blockchainProvider: blockchainProvider,
    });

    const params = {
        fromTokenAddress: sellToken,
        toTokenAddress: buyToken,
        amount: sellAmount,
        walletAddress:wallet
    };

    sdk.placeOrder({
        fromTokenAddress: sellToken,
        toTokenAddress: buyToken,
        amount: sellAmount,
        walletAddress: wallet
    }).then(console.log)
}


