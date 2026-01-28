import { Injectable } from '@angular/core';
import { LocalStorageRepository } from '../../../infrastructure';

@Injectable({
    providedIn: 'root',
})
export class StorageUseCase {
    constructor(private localStorageRepository: LocalStorageRepository) { }

    getItem(key: string): string | null {
        return this.localStorageRepository.getItem(key);
    }

    setItem(key: string, value: string): void {
        this.localStorageRepository.setItem(key, value);
    }

    removeItem(key: string): void {
        this.localStorageRepository.removeItem(key);
    }

    clear(): void {
        this.localStorageRepository.clear();
    }
}