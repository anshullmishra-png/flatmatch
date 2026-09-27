import { normalizeArea, normalizeTag } from './normalize';

export interface FieldErrors {
  [field: string]: string;
}

export interface ProfileFormData {
  maxRent: string | number;
  excludedAreas: string[];
  preferredAreas: string[];
  needsLift: boolean;
  needsParking: boolean;
  minBedrooms: string | number;
  minBathrooms: string | number;
  petFriendlyRequired: boolean;
  maxCommuteMinutes: string | number;
  commuteReference: string;
  softPreferences: string[];
}

function isPositiveNumber(value: string | number): boolean {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && n > 0;
}

function isNonNegativeInt(value: string | number): boolean {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) && Number.isInteger(n) && n >= 0;
}

export function validateProfile(data: ProfileFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!isPositiveNumber(data.maxRent)) {
    errors.maxRent = 'Enter a rent budget greater than 0.';
  }

  if (data.minBedrooms !== '' && !isNonNegativeInt(data.minBedrooms)) {
    errors.minBedrooms = 'Minimum bedrooms must be 0 or a positive whole number.';
  }

  if (data.minBathrooms !== '' && !isNonNegativeInt(data.minBathrooms)) {
    errors.minBathrooms = 'Minimum bathrooms must be 0 or a positive whole number.';
  }

  const hasCommuteMinutes =
    data.maxCommuteMinutes !== '' && data.maxCommuteMinutes !== null && data.maxCommuteMinutes !== undefined;
  const hasCommuteReference = data.commuteReference.trim().length > 0;

  if (hasCommuteMinutes && !isPositiveNumber(data.maxCommuteMinutes)) {
    errors.maxCommuteMinutes = 'Max commute must be a positive number of minutes.';
  }
  if (hasCommuteMinutes && !hasCommuteReference) {
    errors.commuteReference =
      'Tell us what this commute is measured from (e.g. "office in Hinjewadi") since you set a max commute time.';
  }
  if (hasCommuteReference && !hasCommuteMinutes) {
    errors.maxCommuteMinutes =
      'Set a max commute time in minutes since you described a commute reference.';
  }

  const excludedKeys = new Set(data.excludedAreas.map(normalizeArea));
  const areaConflict = data.preferredAreas.find((p) => excludedKeys.has(normalizeArea(p)));
  if (areaConflict) {
    errors.preferredAreas = `"${areaConflict}" is already in your excluded areas — remove it there first if you want it as a preferred area instead.`;
  }

  return errors;
}

// Live check used while typing a new excluded-area or preferred-area tag.
export function checkAreaConflict(
  candidate: string,
  excludedAreas: string[],
  preferredAreas: string[],
  target: 'excluded' | 'preferred'
): string | null {
  const key = normalizeArea(candidate);
  if (!key) return null;

  if (target === 'preferred' && excludedAreas.some((a) => normalizeArea(a) === key)) {
    return `You've already excluded "${candidate.trim()}" — remove it from your excluded areas first if you want to list it as preferred instead.`;
  }
  if (target === 'excluded' && preferredAreas.some((p) => normalizeArea(p) === key)) {
    return `"${candidate.trim()}" is already one of your preferred areas — remove it there first if you want to exclude it instead.`;
  }
  return null;
}

export function checkDuplicateTag(candidate: string, existing: string[]): string | null {
  const key = normalizeTag(candidate);
  if (!key) return null;
  if (existing.some((e) => normalizeTag(e) === key)) {
    return `"${candidate.trim()}" is already on your list.`;
  }
  return null;
}

export interface ListingFormData {
  title: string;
  area: string;
  rent: string | number;
  floor: string | number;
  bedrooms: string | number;
  bathrooms: string | number;
}

export function validateListing(data: ListingFormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Give this listing a short name so people can recognize it.';
  }
  if (!data.area.trim()) {
    errors.area = 'Area is required.';
  }
  if (!isPositiveNumber(data.rent)) {
    errors.rent = 'Rent must be a positive number.';
  }
  if (!isNonNegativeInt(data.floor)) {
    errors.floor = 'Floor must be 0 or a positive whole number.';
  }
  if (!isNonNegativeInt(data.bedrooms)) {
    errors.bedrooms = 'Bedrooms must be 0 or a positive whole number.';
  }
  if (!isNonNegativeInt(data.bathrooms)) {
    errors.bathrooms = 'Bathrooms must be 0 or a positive whole number.';
  }

  return errors;
}
