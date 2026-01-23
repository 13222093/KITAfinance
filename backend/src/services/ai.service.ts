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
    // Base premium rate (e.g., 1.5% for ATM)
    const basePremiumRate = 0.015;
    
    // Risk multipliers
    const multipliers: Record<string, number> = {
        low: 0.6,   // Safer = Lower Premium
        medium: 1.0,
        high: 1.6   // Riskier = Higher Premium
    };

    const selectedRisk = (risk || 'medium') as 'low' | 'medium' | 'high';
    const multiplier = multipliers[selectedRisk] || 1.0;
    
    const premium = budget * basePremiumRate * multiplier;

    let reasoning = "Mode Seimbang: Pilihan paling pas buat kamu. Cashbacknya lumayan, tapi harganya juga nggak terlalu mepet pasar. Aman dan nyaman!";
    if (risk === 'high') {
        reasoning = "Mode Agresif: Cashback GEDE BANGET! Tapi hati-hati ya, karena harganya deket sama harga pasar, kemungkinan kamu beli asetnya jadi lebih besar.";
    } else if (risk === 'low') {
        reasoning = "Mode Santai: Pilihan paling aman. Cashbacknya emang lebih kecil, tapi kemungkinan kamu 'kepaksa' beli asetnya kecil banget. Cocok buat yang cuma mau parkir dana.";
    }

    return {
      suggested_strike: suggestedStrike,
      expected_premium: premium,
      risk_profile: selectedRisk,
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