export const funcPlaceholder = () => {
  return;
};

export const capitalizeString = (string: string) => {
  const lowerCaseString = string.toLowerCase().trim();
  return lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
};
