import { Observable } from 'rxjs';
import { Tool } from '../interfaces/tool.interface';

export abstract class ToolsRepository {
  abstract getTools(): Observable<Tool[]>;
}
