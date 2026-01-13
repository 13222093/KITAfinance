import { Elysia, t } from 'elysia';
import { aiService } from '../services/ai.service';

export const aiRouter = new Elysia({ prefix: '/ai' })
  .get('/optimize', ({ query }) => {
    const currentPrice = Number(query.current_price);
    const budget = Number(query.budget);
    const risk = query.risk;

    // Delegate business logic to the service
    return aiService.getOptimizationSuggestion({
        currentPrice,
        budget,
        risk
    });
  }, {
    query: t.Object({
      current_price: t.Numeric(),
      budget: t.Numeric(),
      risk: t.Optional(t.String())
    })
  });