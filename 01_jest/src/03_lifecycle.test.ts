/*
describe('Lifecycle 동작 순서', () => {

  // 모든 테스트 케이스 시작 전에 한 번만 실행
  beforeAll(() => {
    console.log('==== beforeAll 동작 (최초 한번) ====')
  })

  afterAll(() => {
    console.log('==== afterAll 동작 (최종 한번) ====')
  })

  beforeEach(() => {
    console.log('---- beforeEach 동작 (각 테스트 케이스 실행전) ----')
  })

  afterEach(() => {
    console.log('---- afterEach 동작 (각 테스트 케이스 실행후) ----')
  })


  test('첫번째 테스트 케이스', () => {
    console.log('첫번째 테스트 실행');
  })

  test('두번째 테스트 케이스', () => {
    console.log('두번째 테스트 실행');
  })

  test('세번째 테스트 케이스', () => {
    console.log('세번째 테스트 실행');
  })

})
*/

import { addToCart, calculateCartTotal, clearCartFromLocalStorage, getCartFromLocalStorage, getCartItemCount, Product, removeFromCart } from "./03_lifecycle"

// localStorage (Node.js 환경에서는 존재하지 않음) => Mock 객체 생성 
const localStorageMock = (() => {
  let store: {[key: string]: string} = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => store[key] = value,
    removeItem: (key: string) => delete store[key],
    clear: () => store = {}
  }
})();

global.localStorage = localStorageMock as any;


describe('장바구니 기능 테스트', () => {

  const testProduct1: Product = {
    id: 1,
    name: '노트북',
    price: 1000000,
    imageUrl: '/images/laptop.jpg'
  }
  const testProduct2: Product = {
    id: 2,
    name: '마우스',
    price: 30000,
    imageUrl: '/images/mouse.jpg'
  }

  beforeEach(() => {
    localStorage.clear();
  })
  afterEach(() => {
    localStorage.clear();
  })

  test('장바구니에 상품 추가 테스트', () => {
    const cart = addToCart(testProduct1, 1) // [{CartItem}]

    // 검증
    expect(cart).toHaveLength(1);
    expect(cart[0].productName).toBe('노트북');
    expect(cart[0].quantity).toBe(1);
  })

  test('장바구니에 같은 상품 추가시 수량만 증가되는지 테스트', () => {
    addToCart(testProduct1, 1); // [{productName:'노트북', quantity: 1}]

    const cart = addToCart(testProduct1, 2); // [{productName:'노트북', quantity: 3}]

    expect(cart).toHaveLength(1);
    expect(cart[0].quantity).toBe(3);

  })

  test('장바구니 총 금액, 총 수량 계산 테스트', () => {
    addToCart(testProduct1, 1); // 1,000,000
    addToCart(testProduct2, 2); // 30,000 * 2 = 60,000

    const total = calculateCartTotal();
    const count = getCartItemCount();

    expect(total).toBe(1060000);
    expect(count).toBe(3);

  })

  test('장바구니에서 상품 제거 테스트', () => {
    addToCart(testProduct1);
    addToCart(testProduct2);
    // [{productId: 1}, {productId: 2}]

    const cart = removeFromCart(1); // [{productId: 2}]

    expect(cart).toHaveLength(1);
    expect(cart[0].productName).toBe('마우스');

  })

  test('장바구니 초기화 테스트', () => {
    addToCart(testProduct1);
    addToCart(testProduct2);

    clearCartFromLocalStorage();

    const cart = getCartFromLocalStorage();
    expect(cart).toHaveLength(0);

  })



})