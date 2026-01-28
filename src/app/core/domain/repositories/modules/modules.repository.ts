import { Observable } from 'rxjs';

export abstract class ModulesRepository {
  abstract getAll(): Observable<any[]>;
  abstract getById(id: string): Observable<any>;
  abstract create(module: Partial<any>): Observable<any>;
  abstract update(id: string, module: Partial<any>): Observable<any>;
  abstract delete(id: string): Observable<void>;
  abstract getByUser(userId: string): Observable<any[]>;
}
