/**
 * WAYFARER AI — Currency Formatting & Indian Rupee (INR) Support
 * 
 * Implements strict en-IN number formatting according to Indian numbering system (lakhs & crores).
 * Keeps formatting purely presentation-side; arithmetic is always performed on numeric types.
 */

export const DEFAULT_CURRENCY = 'INR';

export const SUPPORTED_CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)', locale: 'en-IN' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)', locale: 'en-US' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen (¥)', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar (CA$)', locale: 'en-CA' }
] as const;

export type SupportedCurrencyCode = typeof SUPPORTED_CURRENCIES[number]['code'];

/**
 * Format a numeric amount using the specified currency code and proper locale standards.
 * Defaults to INR with Indian numbering format (e.g. ₹1,25,000).
 */
export function formatCurrency(amount: number | undefined | null, currency: string = DEFAULT_CURRENCY): string {
  const numericAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const currCode = (currency || DEFAULT_CURRENCY).toUpperCase();

  try {
    if (currCode === 'INR') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
      }).format(numericAmount);
    }

    const matched = SUPPORTED_CURRENCIES.find(c => c.code === currCode);
    const locale = matched ? matched.locale : 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currCode,
      maximumFractionDigits: 0
    }).format(numericAmount);
  } catch {
    // Fallback in case of invalid currency code
    return `₹${Math.round(numericAmount).toLocaleString('en-IN')}`;
  }
}

/**
 * Format a number using Indian grouping without the currency symbol (e.g. 1,25,000).
 */
export function formatIndianNumber(num: number | undefined | null): string {
  const val = typeof num === 'number' && !isNaN(num) ? num : 0;
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(val);
}

/**
 * Safely parse a user-entered budget or cost string to a clean positive number.
 */
export function parseCurrencyInput(value: string | number): number {
  if (typeof value === 'number') return Math.max(0, isNaN(value) ? 0 : value);
  if (!value) return 0;
  // Remove currency symbols, commas, whitespace
  const sanitized = value.toString().replace(/[^\d.-]/g, '');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : Math.max(0, parsed);
}

/**
 * Calculate realistic default budget in INR based on destination, duration, style, and party size.
 */
export function calculateDefaultBudgetINR(
  durationDays: number,
  travelerCount: number,
  style: 'economy' | 'comfortable' | 'luxury' = 'comfortable'
): number {
  // Base daily cost per traveler in INR:
  // Economy: ~₹8,000/day
  // Comfortable: ~₹16,000/day
  // Luxury: ~₹32,000/day
  const dailyPerPerson = style === 'luxury' ? 32000 : style === 'economy' ? 8000 : 16000;
  const duration = Math.max(1, durationDays);
  const party = Math.max(1, travelerCount);
  
  // Total trip estimate with base transit cushion
  const total = duration * dailyPerPerson * party;
  // Round to nearest 5,000 INR
  return Math.round(total / 5000) * 5000;
}
