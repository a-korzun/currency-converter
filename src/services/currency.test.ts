import { Currency } from './currency';

describe('currency', () => {
  test('parse', () => {
    expect(new Currency(0.99, 2).valueOf()).toEqual(0.99);
    expect(new Currency(0.9999, 2).valueOf()).toEqual(1);
    expect(new Currency(0.9999, 4).valueOf()).toEqual(0.9999);
    expect(new Currency(23.99, 2).valueOf()).toEqual(23.99);
    expect(new Currency(23.9999, 4).valueOf()).toEqual(23.9999);
  });

  test('add', () => {
    expect((new Currency(0.1, 1)).add(new Currency(0.2, 1)).valueOf()).toEqual(0.3);
    expect((new Currency(99.1, 1)).add(new Currency(101.2, 1)).valueOf()).toEqual(200.3);
    expect((new Currency(99.14, 2)).add(new Currency(101.24, 2)).valueOf()).toEqual(200.38);
  });

  test('multiply', () => {
    expect((new Currency(0.99, 2)).multiply(new Currency(0.994, 3)).valueOf()).toEqual(0.984); // not 0.9840599999999999
    expect((new Currency(0.0005, 4)).multiply(new Currency(2, 0)).valueOf()).toEqual(0.0010);
    expect((new Currency(100000000, 0)).multiply(new Currency(0.5, 1)).valueOf()).toEqual(50000000);
  });

  test('divide', () => {
    expect((new Currency(0.99, 2)).divide(new Currency(3, 0)).valueOf()).toEqual(0.33);
  });
});
