import { createPublicClient, http } from 'viem';
import { getCurrentConfig } from '../config';

const config = getCurrentConfig();

export const publicClient = createPublicClient({
  chain: config.chain,
  transport: http(config.rpcUrl)
});