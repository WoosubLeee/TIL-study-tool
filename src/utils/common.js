export const getDate = timestamp => {
  const date = new Date(timestamp);
  return [date.getFullYear(), date.getMonth()+1, date.getDate()].join('/');
};