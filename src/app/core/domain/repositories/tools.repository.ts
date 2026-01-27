import { Observable } from 'rxjs';
import { ITool } from '../interfaces/tool.interface';

export abstract class ToolsRepository {
  abstract getTools(): Observable<ITool[]>;
}
