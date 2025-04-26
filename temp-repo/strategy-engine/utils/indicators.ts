import { OHLCV } from '../types';

export function calculateATR(data: OHLCV[], period: number): number[] {
  const tr: number[] = [];
  
  // Calculate True Range
  for (let i = 1; i < data.length; i++) {
    const high = data[i].high;
    const low = data[i].low;
    const prevClose = data[i - 1].close;
    
    const tr1 = high - low;
    const tr2 = Math.abs(high - prevClose);
    const tr3 = Math.abs(low - prevClose);
    
    tr.push(Math.max(tr1, tr2, tr3));
  }
  
  // Calculate ATR
  const atr: number[] = [];
  let sum = 0;
  
  for (let i = 0; i < period; i++) {
    sum += tr[i];
  }
  
  atr.push(sum / period);
  
  for (let i = period; i < tr.length; i++) {
    atr.push((atr[atr.length - 1] * (period - 1) + tr[i]) / period);
  }
  
  return atr;
}

export function calculateSuperTrend(
  data: OHLCV[],
  atr: number[],
  multiplier: number
): { upper: number; lower: number; trend: 'up' | 'down' }[] {
  const result: { upper: number; lower: number; trend: 'up' | 'down' }[] = [];
  
  // Start from the period index to ensure we have enough data
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    const currentAtr = atr[i];
    
    // Calculate basic upper and lower bands
    const basicUpper = (current.high + current.low) / 2 + multiplier * currentAtr;
    const basicLower = (current.high + current.low) / 2 - multiplier * currentAtr;
    
    if (i === 0) {
      // For the first value, use basic bands
      result.push({
        upper: basicUpper,
        lower: basicLower,
        trend: 'up'
      });
    } else {
      const prev = result[i - 1];
      
      // Calculate final upper and lower bands
      const finalUpper = basicUpper < prev.upper || current.close > prev.upper
        ? basicUpper
        : prev.upper;
      
      const finalLower = basicLower > prev.lower || current.close < prev.lower
        ? basicLower
        : prev.lower;
      
      // Determine trend
      const trend = current.close > finalUpper
        ? 'up'
        : current.close < finalLower
          ? 'down'
          : prev.trend;
      
      result.push({
        upper: finalUpper,
        lower: finalLower,
        trend
      });
    }
  }
  
  return result;
} 