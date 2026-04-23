/**
 * Calculates an estimate for the lowest EMI starting price.
 * Matches backend's fallback logic for consistency.
 * 
 * @param amount The total price of the tour
 * @returns The estimated lowest monthly EMI amount
 */
export const calculateEstimatedEMI = (amount: number): number | null => {
    if (!amount || amount <= 0) return null;

    // Use conservative fallback values: 14% interest for 12 months
    const annualInterestRate = 14; 
    const months = 12;
    
    const monthlyInterestRate = (annualInterestRate / 12) / 100;
    
    // EMI Formula: P * i * (1 + i)^n / ((1 + i)^n - 1)
    const emi = amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, months) / (Math.pow(1 + monthlyInterestRate, months) - 1);
    
    return Math.round(emi);
};
