export function maxSubArray(a: number[], k: number): { max: number; bestSlice: number[] } {
  const l = a.length;
  if (k > l) {
    return { max: -1, bestSlice: [] };
  }

  // Compute first window sum
  let firstSum = 0;
  for (let i = 0; i < k; i++) {
    firstSum += a[i];
  }

  let max = firstSum;
  let bestSlice = a.slice(0, k);

  // Sliding window
  let currentSum = firstSum;
  for (let j = k; j < l; j++) {
    currentSum = currentSum + a[j] - a[j - k];

    if (currentSum > max) {
      max = currentSum;
      bestSlice = a.slice(j - k + 1, j + 1);
    }
  }

  return { max, bestSlice };
}

