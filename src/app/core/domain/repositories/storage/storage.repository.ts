export abstract class StorageRepository {
  abstract getItem(key: string): string | null;
  abstract setItem(key: string, value: string): void;
  abstract removeItem(key: string): void;
  abstract clear(): void;
}
