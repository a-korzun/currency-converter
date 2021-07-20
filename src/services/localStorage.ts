const cache = Symbol('localStorageCache');

class LocalStorage {
  [cache]: Record<string, string> = {};

  getItem(key: string): unknown {
    if (this[cache][key]) {
      return JSON.parse(this[cache][key]);
    }

    let value = window.localStorage.getItem(key) || undefined;

    if (value === undefined) {
      return;
    }

    try {
      value = JSON.parse(value);
    } catch (e) { /* nothing to do */ }

    return value;
  }

  setItem(key: string, value: unknown) {
    const val = JSON.stringify(value);

    window.localStorage.setItem(key, val);
    this[cache][key] = val;
  }

  removeItem(key: string) {
    if (this[cache][key]) {
      delete this[cache][key];
    }

    window.localStorage.removeItem(key);
  }
}

export const localStorage = new LocalStorage();
