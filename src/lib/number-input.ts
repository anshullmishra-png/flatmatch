// Strips minus signs as the user types, so number fields that are never
// meant to go negative (rent, bedrooms, bathrooms, commute minutes, ...)
// can't have one entered even before form validation runs.
export function stripNegative(value: string): string {
  return value.replace(/-/g, '');
}
