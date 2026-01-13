import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const rpcUrl = process.env.BASE_RPC_URL;

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(rpcUrl)
});
