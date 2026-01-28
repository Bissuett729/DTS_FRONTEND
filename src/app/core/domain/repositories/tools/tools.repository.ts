import { Observable } from 'rxjs';
import { CreateToolDto, UpdateToolDto } from '../../dtos';
import { ITool, IToolGroupedByBusinessUnit } from '../../interfaces';

export abstract class ToolsRepository {
  abstract getTools(): Observable<ITool[]>;

  abstract createTool(tool: CreateToolDto): Observable<ITool>;

  abstract updateTool(toolId: string, tool: UpdateToolDto): Observable<ITool>;

  abstract deleteTool(toolId: string): Observable<ITool>;

  abstract getGroupedByBusinessUnit(): Observable<IToolGroupedByBusinessUnit[]>;
}
