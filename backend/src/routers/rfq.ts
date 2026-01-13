import { Elysia, t } from 'elysia';
import { rfqService } from '../services/rfq.service';

export const rfqRouter = new Elysia({ prefix: '/rfq' })
  .post('/quote', async ({ body }) => {
    return await rfqService.getQuote({
      underlying: body.underlying,
      strike: body.target_price,
      collateral: body.collateral,
      expiryDays: body.expiry_days
    });
  }, {
    body: t.Object({
      underlying: t.String({ default: 'ETH' }),
      target_price: t.Number(),
      collateral: t.Number(),
      expiry_days: t.Number({ default: 7 })
    })
  });
