import * as THREE from "three";

export const titleCaseToCamelCase = (str: string) => {  
  // Split the string by spaces
  const words: string[] = str.split('_');

  // Lowercase the first word and capitalize the first letter of the remaining words
  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower; // first word is all lowercase
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
};

export const camelToTitleUnderscore = (str: string): string => {
  return str
    // insert space before capital letters
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    // capitalize first letter of each word
    .replace(/\b\w/g, (c) => c.toUpperCase())
    // replace spaces with underscores
    .replace(/\s+/g, "_");
};