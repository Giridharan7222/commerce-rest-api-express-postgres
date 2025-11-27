/*
✅ Sample 1

Input: [1, 2, 3, 4, 5, 6], k = 3
Output: max = 15, slice = [4, 5, 6]

✅ Sample 2

Input: [-2, -1, -3, -4], k = 2
Output: max = -3, slice = [-2, -1]

✅ Sample 3

Input: [5, 2, -1, 0, 3], k = 2
Output: max = 7, slice = [5, 2]

✅ Sample 4

Input: [3, 8, 1, 7, 9, 2], k = 4
Output: max = 25, slice = [1, 7, 9, 2]
*/

import { maxSubArray } from "./sample";

describe("maxSubArray",()=>{

test("should return correct max sum and slice for normal case", () => {
    const res = maxSubArray([1, 2, 3, 4, 5], 3);
    expect(res.max).toBe(12);                 // 3+4+5
    expect(res.bestSlice).toEqual([3, 4, 5]);
  });

  test("should return first window if it is the max", () => {
    const res = maxSubArray([10, 1, 1, 1], 2);
    expect(res.max).toBe(11);                 // 10+1
    expect(res.bestSlice).toEqual([10, 1]);
  });

  test("should return -1 and empty slice when k > array length", () => {
    const res = maxSubArray([1, 2], 3);
    expect(res.max).toBe(-1);
    expect(res.bestSlice).toEqual([]);
  });

  test("should handle array with negative numbers", () => {
    const res = maxSubArray([-5, -2, -1, -7], 2);
    expect(res.max).toBe(-3);                 // -2 + -1
    expect(res.bestSlice).toEqual([-2, -1]);
  });

  test("should handle array where max occurs in middle", () => {
    const res = maxSubArray([2, 1, 5, 2, 1], 2);
    expect(res.max).toBe(7);                  // 5 + 2
    expect(res.bestSlice).toEqual([5, 2]);
  });

  test("should handle k = 1 (pick largest element)", () => {
    const res = maxSubArray([3, 9, 1, 4], 1);
    expect(res.max).toBe(9);
    expect(res.bestSlice).toEqual([9]);
  });

  test("should work for k = array length", () => {
    const res = maxSubArray([4, 5, 6], 3);
    expect(res.max).toBe(15);
    expect(res.bestSlice).toEqual([4, 5, 6]);
  });

})