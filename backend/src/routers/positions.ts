import { Elysia } from 'elysia';
import { recentPositions, recentGroupEvents } from '../services/listener';

export const positionsRouter = new Elysia({ prefix: '/positions' })
  // Get recent on-chain activity (for "Live Feed" feature)
  .get('/activity', () => {
    // Merge positions and group events
    const allEvents = [...recentPositions, ...recentGroupEvents];
    
    // Sort by timestamp descending (newest first)
    return allEvents.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  })

  .get('/', () => {
    // Mock positions for now
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
