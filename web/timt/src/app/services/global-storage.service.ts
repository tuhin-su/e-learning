import { Injectable } from '@angular/core';
import { debug } from '../utility/function';

@Injectable({
  providedIn: 'root', // Makes this service available globally
})
export class GlobalStorageService {
  private storage: Map<string, any> = new Map();

  constructor() {
    // restore localstorage to storage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          this.storage.set(key, JSON.parse(value));
        }
      }
    }
  }

  /**
   * Stores a value associated with a key.
   * @param key The key to identify the value.
   * @param value The value to store.
   */
  set(key: string, value: any, permanent: boolean = false): void {
    this.storage.set(key, value);

    if (permanent) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  /**
   * Retrieves a value associated with a key.
   * @param key The key to identify the value.
   * @returns The value, or `undefined` if the key does not exist.
   */
  get<T>(key: string): T | undefined {
    return this.storage.get(key);
  }

  /**
   * Deletes a value associated with a key.
   * @param key The key to identify the value.
   */
  delete(key: string, permanent: boolean = false): void {
    this.storage.delete(key);

    if (permanent) {
      localStorage.removeItem(key);
    }
  }


  /**
   * Checks if a key exists in the storage.
   * @param key The key to check.
   * @returns `true` if the key exists, otherwise `false`.
   */
  has(key: string): boolean {
    return this.storage.has(key);
  }
}
