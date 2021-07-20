export class Currency {
  value: number = 0;
  precision: number;

  static parse(value: string | number, precision: number): number {
    let val: number = 0;

    if (typeof value === 'number') {
      val = value;
    }

    if (typeof value === 'string') {
      val = parseFloat(value);
    }

    return +val.toFixed(precision) * (10 ** precision);
  }

  constructor(value: string | number, precision = 3) {
    this.value = Currency.parse(value, precision);

    this.precision = precision;
  }

  format(precision: number) {
    return (this.value / (10 ** this.precision)).toFixed(precision);
  }

  valueOf() {
    return this.value / (10 ** this.precision);
  }

  toJSON() {
    return this.value / (10 ** this.precision);
  }

  add(currency: Currency) {
    return new Currency(this.valueOf() + currency.valueOf(), Math.max(this.precision, currency.precision));
  }

  multiply(currency: Currency) {
    return new Currency(this.valueOf() * currency.valueOf(), Math.max(this.precision, currency.precision));
  }

  divide(currency: Currency) {
    return new Currency(this.valueOf() / currency.valueOf(), Math.max(this.precision, currency.precision));
  }
}