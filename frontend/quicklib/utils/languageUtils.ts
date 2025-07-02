/**
 * Maps language codes to their display names
 */
export const languageMap: Record<string, string> = {
  'en': 'English',
  'no': 'Bokmål',
  'nn': 'Nynorsk',
  'da': 'Dansk',
  'it': 'Italiano',
};

/**
 * Gets the display name for a language code
 * @param languageCode The language code (e.g., 'en', 'no', 'nn', 'da', 'it')
 * @returns The display name for the language, or the original code if not found
 */
export const getLanguageDisplayName = (languageCode: string): string => {
  return languageMap[languageCode] || languageCode;
};

/**
 * Gets all available language options for dropdowns/pickers
 * @returns Array of objects with code and display name
 */
export const getLanguageOptions = () => {
  return Object.entries(languageMap).map(([code, name]) => ({
    code,
    name,
  }));
};
