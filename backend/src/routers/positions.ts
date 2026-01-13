import { Elysia } from 'elysia';

export const positionsRouter = new Elysia({ prefix: '/positions' })
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
