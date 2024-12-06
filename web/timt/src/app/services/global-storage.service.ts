import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes this service available globally
})
export class GlobalStorageService {
  private storage: Map<string, any> = new Map();

  constructor() {
    // Initialize storage with values from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      this.set('token', token);
    }

    const info = localStorage.getItem('info');
    if (info) {
      this.set('info', JSON.parse(info));
    }

    const label = localStorage.getItem('lable');
    if (label) {
      this.set('lable', label);
    }
  }

  /**
   * Stores a value associated with a key.
   * @param key The key to identify the value.
   * @param value The value to store.
   */
  set(key: string, value: any): void {
    this.storage.set(key, value);
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
  delete(key: string): void {
    this.storage.delete(key);
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
