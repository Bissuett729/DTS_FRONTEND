import { Observable } from 'rxjs';
import { IToolTemplate } from '../../interfaces';

export abstract class ToolsTemplatesRepository {
  abstract getTemplateTools(): Observable<IToolTemplate[]>;
}
