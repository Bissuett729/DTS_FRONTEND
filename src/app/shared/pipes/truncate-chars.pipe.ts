import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateChars',
    standalone: true,
    pure: true
})
export class TruncateCharsPipe implements PipeTransform {
    transform(
        value: string | null | undefined,
        maxChars: number = 50, // cantidad máxima de caracteres
        suffix: string = '...'
    ): string {
        // Si no hay texto o no es una cadena, devolver tal cual
        if (!value || typeof value !== 'string') return value || '';

        const trimmed = value.trim();

        // Si el texto es más corto o igual al límite, devolverlo completo
        if (trimmed.length <= maxChars) return trimmed;

        // Si excede, truncar y agregar el sufijo
        return trimmed.slice(0, maxChars) + suffix;
    }
}