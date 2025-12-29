import { calculateDiscountPrice, createUser, filterByPriceRange, filterProductsByCategory, getAgeCategory, Product, searchProducts, validateEmail } from "./02_matcher"

describe('Matcher 함수 연습', () => {

  // 임의의 상품 목록 데이터
  const products: Product[] = [
    { id: 1, name: '노트북', price: 1000000, category: '전자기기', tags: ['전자', '컴퓨터'], stock: 10 },
    { id: 2, name: '마우스', price: 30000, category: '전자기기', tags: ['전자', '주변기기'], stock: 50 },
    { id: 3, name: '책상', price: 50000, category: '가구', tags: ['사무용', '가구'], stock: 20 },
  ]

  test('기본 비교 테스트', () => {
    // toBe() : 원시값(primitive) 비교 (===와 동일)
    const num = 10;
    expect(num).toBe(10);
    const str = 'hello';
    expect(str).toBe('hello');

    // toEqual() : 객체나 배열의 값 비교 
    const newUser = createUser('김철수', 'kim@test.com', 25);
    //expect(newUser).toBe({
    expect(newUser).toEqual({
      id: expect.any(Number),
      name: '김철수',
      email: 'kim@test.com',
      age: 25,
      isActive: true
    })

    const filtered = filterProductsByCategory(products, '가구');
    expect(filtered).toEqual([
      { id: 3, name: '책상', price: 50000, category: '가구', tags: ['사무용', '가구'], stock: 20 },
    ])

  })

  test('진리값 비교 테스트', () => {

    const isValidEmail = validateEmail('test@email.com');
    expect(isValidEmail).toBeTruthy();

    const ageCategory = getAgeCategory(-5);
    expect(ageCategory).toBeNull();

    const user = createUser('홍길동', 'hong@test.com');
    expect(user.name).toBeDefined();
    expect(user.age).toBeUndefined();

  })

  test('숫자 비교 테스트', () => {
    const discountPrice = calculateDiscountPrice(10000, 10); // 9000원
    expect(discountPrice).toBeLessThan(10000);
    expect(discountPrice).toBeGreaterThanOrEqual(9000);
    // toBeLessThanOrEqual, toBeGreaterThan
  })

  test('문자열 비교 테스트', () => {
    const email = 'test@email.com';
    expect(email).toMatch(/@/); // 정규식 매칭

    const productName = '삼성 갤럭시 노트북';
    expect(productName).toContain('노트북');
  })

  test('배열 관련 비교 테스트', () => {
    const searchedProducts = searchProducts(products, '노트북');
    expect(searchedProducts).toHaveLength(1);

    const filteredByPriceProducts = filterByPriceRange(products, 50000, 1000000);
    expect(filteredByPriceProducts).toHaveLength(2);
    // 상품에 노트북/책상이 포함되어있는지

    const filteredByPriceProductsName = filteredByPriceProducts.map((product) => product.name) // ['노트북', '책상']
    expect(filteredByPriceProductsName).toContain('노트북');
    expect(filteredByPriceProductsName).toContain('책상');
  })

  test('객체 관련 비교 테스트', () => {
    const user = createUser('박민수', 'park@email.com', 28);
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');

    expect(user).toHaveProperty('email', 'park@email.com'); // 속성값도 같이 검증

    // 객체의 일부 속성만 검증
    expect(user).toMatchObject({
      age: 28,
      isActive: true
    })

  })

  test('예외 처리 관련 테스트', () => { // toThrow([메시지])

    // 할인율이 범위를 벗어나면 에러가 발생해야된다.
    expect(() => calculateDiscountPrice(10000, -10)).toThrow();

    expect(() => calculateDiscountPrice(10000, 150)).toThrow('할인율은 0~100 사이여야합니다.')

  })

  test('부정 테스트', () => {
    const price = 10000;
    expect(price).not.toBe(20000);

    expect(() => calculateDiscountPrice(10000, 10)).not.toThrow();
  })

})


describe('종합 실전 예제', () => {

  test('사용자 가입 검증 시나리오', () => {
    // given: 사용자 데이터 준비
    const name = '김철수';
    const email = 'test@email.com';

    // when: 테스트용 함수 실행 
    const isValidEmail = validateEmail(email);
    const user = createUser(name, email);

    // then: 검증 
    expect(isValidEmail).toBeTruthy();
    expect(user).toMatchObject({
      name: '김철수',
      email: 'test@email.com',
      isActive: true
    });
    expect(user).toHaveProperty('id');
    expect(user.age).toBeUndefined();

  })

})
