import { Elysia } from 'elysia';
import { recentPositions, recentGroupEvents } from '../services/listener';

export const positionsRouter = new Elysia({ prefix: '/positions' })
  // Get recent on-chain activity (for "Live Feed" feature)
  .get('/activity', () => {
    // Merge positions and group events from listener
    const allEvents = [...recentPositions, ...recentGroupEvents];

    // Sort by timestamp descending (newest first)
    return allEvents.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  })

  .get('/', () => {
    // Return real positions from listener if available, else mock
    if (recentPositions.length > 0) {
      return recentPositions.map((p: any, idx: number) => ({
        id: String(idx + 1),
        user: p.user || "0x???",
        asset: "ETH",
        collateral: Number(p.collateral || 0) / 1e6,
        premium: Number(p.premium || 0) / 1e6,
        status: "active",
        txHash: p.txHash
      }));
    }

    // Mock positions for demo
    return [
      {
        id: "1",
        user: "0x123...abc",
        asset: "ETH",
        collateral: 1.5,
        premium: 0.05,
        status: "active"
      },
      {
        id: "2",
        user: "0x456...def",
        asset: "BTC",
        collateral: 0.1,
        premium: 0.002,
        status: "settled"
      }
    ];
  })
  .get('/:id', ({ params }) => {
    // Try to find from listener data
    const position = recentPositions.find((_: any, idx: number) => String(idx + 1) === params.id);

    if (position) {
      return {
        id: params.id,
        user: position.user,
        asset: "ETH",
        collateral: Number(position.collateral || 0) / 1e6,
        premium: Number(position.premium || 0) / 1e6,
        status: "active",
        txHash: position.txHash,
        details: `Position from on-chain event`
      };
    }

    return {
      id: params.id,
      user: "0x123...abc",
      asset: "ETH",
      collateral: 1.5,
      premium: 0.05,
      status: "active",
      details: "Mock details for position"
    };
  });
