export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const camelCaseToTitleCase = (camel: string): string => {
  // Insert a space before all uppercase letters and capitalize the first letter
  const result = camel
    .replace(/([A-Z])/g, ' $1') // insert space before uppercase
    .replace(/^./, str => str.toUpperCase()); // capitalize first letter
  return result;
};

export const dashCaseToTitleCase = (str: string): string => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getModifierClasses = (baseClass: string, modifier?: string | string[]) => {
  const modifierClasses = Array.isArray(modifier)
    ? modifier.map((m) => `${baseClass}--${m}`).join(' ')
    : modifier
    ? `${baseClass}--${modifier}`
    : '';
  return modifierClasses;
};