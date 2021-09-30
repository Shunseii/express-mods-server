export const getRandomArrElement = <G>(arr: G[]): G => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const getRandomNumBetween = (from: number, to: number): number => {
  return Math.floor(Math.random() * (to - from + 1)) + from;
};
