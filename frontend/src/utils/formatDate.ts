export const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toDateString();
};
