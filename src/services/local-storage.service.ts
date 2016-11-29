import { Injectable } from '@angular/core';

/**
 * @ngModule LocalStorageModule
 *
 * This service allow to interact with localStorage and handle serialization and deserialization.
 * It also provide method to determine if the localStorage exist (IE issue) and enabled (private navigation)
 *
 *
 * ## Example
 *
 * ### Example configuration
 *
 * ```typescript
 * import { LocalStorageModule, LocalStorageService} from '@nordnet/local-storage';
 *
 * @NgModule({
 *   declarations: [],
 *   imports: [
 *     LocalStorageModule
 *   ],
 *   providers: []
 * });
 * export class MyModule { }
 * ```
 *
 * ### Usage
 *
 * ```typescript
 * import { LocalStorageService as LocalStorage } from '@nordnet/local-storage';
 *
 * let test: any = {
 *    'key': 'test',
 *    'value': 'value'
 * };
 * if (LocalStorage.isAvailable()) {
 *   LocalStorage.set('test', test);
 * } else {
 *   console.warn('localStorage is not accessible, it means that you\'re in private navigation, put cookies/data is impossible or you navigator just don\'t support it');
 * }
 * // ...
 * if (LocalStorage.isAvailable()) {
 *   LocalStorage.get('test');
 * }
 * ```
 *
 * ## State
 * @experimental
 *
 */
@Injectable()
export class LocalStorageService {

  /**
   * Determine if the localStorage is enabled (private navigation)
   */
  private isLocalStorageEnabled: boolean;

  /**
   * Represent the fact that the localStorage exist on the current navigator (old browser issue)
   */
  private isLocalStoragePresent: boolean;

  constructor() {
    this.checkSupport();
  }

  /**
   * Can we use the localStorage ?
   *
   * @returns {boolean}
   */
  isAvailable(): boolean {
    return this.isLocalStoragePresent && this.isLocalStorageEnabled;
  }

  /**
   * This method allow to get a value deserialized in the localstorage.
   *
   * @param key string The key of the wanted stored value
   * @returns {any} Returns the stored object, deserialized.
   */
  get(key: string): any {
    return this.deserialize(window.localStorage.getItem(key));
  };

  /**
   * This method allow to get a value deserialized in the localstorage.
   *
   * @param key string The key to which associate the value
   * @param value any The value to serialize and to store in the localStorage
   *
   * @return {any}
   */
  set(key: string, value: any): any {
    if (value === undefined) {
      return window.localStorage.removeItem(key);
    }
    window.localStorage.setItem(key, this.serialize(value));
    return value;
  };

  /**
   * This method will remove all the data stored in localStorage except those list on the var 'persistentData'
   *
   * @param keyToDelete Array the list of index to delete
   */
  flush(keyToDelete: Array<string>): void {
    for (let i: number = 0; i < keyToDelete.length; ++i) {
      window.localStorage.removeItem(keyToDelete[i]);
    }
  };

  /**
   * This method will remove all the data stored in localStorage
   */
  clear(): void {
    window.localStorage.clear();
  };

  /**
   * This method will remove  the data stored in localStorage at the given index
   *
   * @param key string The index we wanted to delete
   */
  remove(key: string): void {
    window.localStorage.removeItem(key);
  };

  /**
   * Serialize value into JSON
   *
   * @param value
   * @returns string
   */
  private serialize = (value: any): string => {
    return JSON.stringify(value);
  };

  /**
   * Deserialize JSON data
   *
   * @param value
   * @returns any
   */
  private deserialize = (value: string): any => {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn(`The value provided is not a valid JSON ${value}`);
      return null;
    }
  };

  /**
   * Check if localStorage exist and is authorize
   */
  private checkSupport() {
    try {
      this.isLocalStoragePresent = window.localStorage != null;
      this.isLocalStorageEnabled = true;
    } catch (e) {
      console.info('Your navigator does not accept data storage (private mode)');
      this.isLocalStoragePresent = true;
      this.isLocalStorageEnabled = false;
    }
  }

}