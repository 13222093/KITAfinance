export class AIService {
  /**
   * Generates optimization suggestions based on market data and user budget.
   * Currently uses heuristic logic for MVP, but designed to be replaced by actual AI/ML model.
   */
  getOptimizationSuggestion(params: {
    currentPrice: number;
    budget: number;
    risk?: string;
  }) {
    const { currentPrice, budget, risk } = params;

    // Default heuristic: suggest strike 5% below current price (safer entry)
    let strikePercentage = 0.95; 

    if (risk === 'high') {
        strikePercentage = 0.97; // Closer to money, higher risk/reward
    } else if (risk === 'low') {
        strikePercentage = 0.93; // Further out, safer
    }

    const suggestedStrike = currentPrice * strikePercentage;
    
    // Mock premium calculation (approx 1.5% of budget for MVP)
    // In reality, this should come from Black-Scholes or Thetanuts API
    const premium = budget * (risk === 'high' ? 0.025 : risk === 'low' ? 0.010 : 0.015);

    let reasoning = "Mode Seimbang: Titik optimal antara cashback dan keamanan.";
    if (risk === 'high') {
        reasoning = "Mode Agresif: Strike dekat harga pasar. Cashback maksimal (Gede!), tapi siap-siap beli asetnya kalau harga turun dikit.";
    } else if (risk === 'low') {
        reasoning = "Mode Santai: Strike jauh di bawah harga sekarang. Kemungkinan kecil tereksekusi, cashback lebih kecil tapi aman buat yang cuma mau parkir dana.";
    }

    return {
      suggested_strike: suggestedStrike,
      expected_premium: premium,
      risk_profile: risk || 'medium',
      reasoning: reasoning,
      alternatives: [
        { 
            strike: currentPrice * 0.93, 
            premium: budget * 0.010, 
            risk: "low",
            description: "Mode Santai (Low Risk)"
        },
        { 
            strike: currentPrice * 0.95, 
            premium: budget * 0.015, 
            risk: "medium",
            description: "Mode Seimbang (Medium Risk)"
        },
        { 
            strike: currentPrice * 0.97, 
            premium: budget * 0.025, 
            risk: "high",
            description: "Mode Agresif (High Risk)"
        }
      ]
    };
  }
}

export const aiService = new AIService();