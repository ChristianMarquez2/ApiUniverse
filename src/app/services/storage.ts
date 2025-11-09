// src/app/services/storage.service.ts
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({ providedIn: 'root' })
export class StorageService {
  private ready = this.storage.create();
  constructor(private storage: Storage) {}
  async set(key: string, val: any) { await this.ready; return this.storage.set(key, val); }
  async get<T>(key: string): Promise<T> { await this.ready; return this.storage.get(key); }
  async pushToArray(key: string, item: any) {
    await this.ready;
    const arr = (await this.storage.get(key)) ?? [];
    arr.unshift(item);
    return this.storage.set(key, arr);
  }
}
