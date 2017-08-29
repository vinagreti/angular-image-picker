import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

class StorageSubscription{
  key: string;
  value: BehaviorSubject<any>;

  constructor(key: string, value: BehaviorSubject<any>){
    this.key = key;
    this.value = value;
  }
}

@Injectable()
export class JsonStorageService {

  private subscriptions: Array<StorageSubscription>;

  constructor(){
    console.info('JsonStorageService STARTED');
    this.checkIflocalStorageIsAvailable();
    this.subscriptions = Array<StorageSubscription>();
  }

  private checkIflocalStorageIsAvailable = () => {
    let type = '';
    try {
      let testKey = '__np_storage_test__' + Date.now();
      type = 'localStorage';
      localStorage.setItem(testKey, 'work');
      localStorage.removeItem(testKey);
      type = 'sessionStorage';
      sessionStorage.setItem(testKey, 'work');
      sessionStorage.removeItem(testKey);
      return true;
    }
    catch(e) {
      console.error('jsonStorageService => Cannot find ' + type + ' on this browser.');
      return false;
    }
  }

  object = (key?: string): BehaviorSubject<any> => {
    return this.getSubscription(key);
  }

  get = (key?: string): Promise<any> => {
    let value = this.getFromLocalStorage(key);
    return new Promise((rs, rj) => {
      rs(value)
    });
  }

  set = (key: string, value: any): Promise<any> => {
    let subscription = this.getSubscription(key);
    localStorage.setItem(key, JSON.stringify(value));
    subscription.next(value);
    return new Promise((resolve, rj) => {
      resolve(value);
    });
  }

  remove = (key: string) => {
    return localStorage.removeItem(key);
  }

  private getSubscription(key): BehaviorSubject<any> {
    let value = this.getFromLocalStorage(key);
    let storageSubscription = this.subscriptions.find(subscription => subscription.key === key);
    if(!storageSubscription){
      storageSubscription = new StorageSubscription(key, new BehaviorSubject<any>(value));
      this.subscriptions.push(storageSubscription);
    }
    return storageSubscription.value;
  }

  private getFromLocalStorage(key){
    let value = localStorage.getItem(key);
    if(value === null){
      return undefined;
    } else {
      return JSON.parse(value);
    }
  }

}