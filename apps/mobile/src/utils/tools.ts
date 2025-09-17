export const normalizeFloatingPoint = (price: string) => {
  if (!price) return 0;
  return parseFloat(price.replace(",", "."));
};
