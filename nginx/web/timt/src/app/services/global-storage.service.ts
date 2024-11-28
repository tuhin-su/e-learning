import { Injectable, OnDestroy, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root', // Makes this service available globally
})
export class GlobalStorageService implements OnDestroy, OnInit {
  
  private storage: Map<string, any> = new Map();

  /**
   * Stores a value associated with a key.
   * @param key The key to identify the value.
   * @param value The value to store.
   */
  ngOnInit(): void {
    if (localStorage.getItem('token')) {
      this.set('token', localStorage.getItem('token'));
    }

    if (localStorage.getItem('info')) {
      this.set('info', localStorage.getItem('info'));
    }

    if (localStorage.getItem('lable')) {
      this.set('lable', localStorage.getItem('lable'));
    }
  }

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
   * Clears all stored values.
   */
  clear(): void {
    this.storage.clear();
  }

  /**
   * Checks if a key exists in the storage.
   * @param key The key to check.
   * @returns `true` if the key exists, otherwise `false`.
   */
  has(key: string): boolean {
    return this.storage.has(key);
  }

  /**
   * Cleans up the storage on service destroy.
   */
  ngOnDestroy(): void {
    this.clear();
  }
}
