export const FOOD   = 'food';
export const DRINKS = 'drinks';
export const HEALTHCARE = 'healthcare';
export const SPORTS = 'sports';
export const SETTINGS = 'settings';

export const IND = {
  [FOOD]: 'EAP',
  [HEALTHCARE]: 'DSC',
  [DRINKS]: 'GRO',
  [SPORTS]: 'SGS'
};

export const MAX_BUFFER = 512; //max buffer size in bytes

export function getIndKeyByValue(value) {
  return Object.keys(IND).find(key => IND[key] === value);
}
