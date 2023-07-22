export const blockchainConfig: Record<string, {
  name: string;
  contractAddress: string;
  symbol: string;
  blockExplorer: string;
  rpcUrl: string;
}> = {
  '0x13881': {
    name: 'Mumbai',
    contractAddress: '',
    symbol: 'MATIC',
    blockExplorer: 'https://mumbai.polygonscan.com',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
  },
  '0xe704': {
    name: 'Linea',
    contractAddress: '0x721f8754B213dfE26160caab435618f2C6606041',
    symbol: 'LineaETH',
    blockExplorer: 'https://explorer.goerli.linea.build',
    rpcUrl: 'https://rpc.goerli.linea.build',
  },
  '0x5': {
    name: 'Goerli',
    contractAddress: '',
    symbol: 'ETH',
    blockExplorer: 'https://goerli.etherscan.io',
    rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  },
  '0x1': {
    name: 'Ethereum',
    contractAddress: '',
    symbol: 'ETH',
    blockExplorer: 'https://etherscan.io',
    rpcUrl: 'https://ethereum.publicnode.com',
  },
};
