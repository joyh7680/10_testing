// Jest 문법의 기본 구조 

import { divide, sum } from "./01_basic";

describe('더하기 함수 테스트', () => {

  test('2와 3을 더하면 5가 나와야된다.', () => {
    // given(준비)->when(수행)->then(검증) 패턴 
    const num1: number = 2;
    const num2: number = 3;

    const result = sum(num1, num2);

    expect(result).toBe(5);
  })

  test('-5와 3을 더하면 -2가 나와야된다.', () => {
    expect(sum(-5, 3)).toBe(-2);
  })

})

describe('나누기 함수 테스트', () => {
  test('10을 2로 나누면 5가 나와야된다.', () => {
    expect(divide(10, 2)).toBe(5);
  })

  test('10을 0으로 나누면 에러가 발생해야된다.', () => {
    expect(() => divide(10, 0)).toThrow();
  })
})