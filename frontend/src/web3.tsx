import { ethers } from 'ethers';

const INFURA_ETH_ENDPOINT = 'https://eth.public-rpc.com/';
const provider = new ethers.JsonRpcProvider(INFURA_ETH_ENDPOINT);


export async function getTokenDecimals(contractAddress: string) {
    const erc20AbiFragment = [
        {
            constant: true,
            inputs: [],
            name: 'decimals',
            outputs: [
                {
                    name: '',
                    type: 'uint8',
                },
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function',
        },
    ];

    const tokenContract = new ethers.Contract(contractAddress, erc20AbiFragment, provider);
    const decimals = await tokenContract.decimals();
    return decimals;
}