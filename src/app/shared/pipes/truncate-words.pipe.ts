import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncateWords',
    standalone: true,
    pure: true
})
export class TruncateWordsPipe implements PipeTransform {
    transform(
        value: string,
        maxWords: number | ((row: any) => number) = 10,
        row?: any,
        suffix: string = '...'
    ): string {
        if (!value || typeof value !== 'string') return value;

        const limit = typeof maxWords === 'function' ? maxWords(row) : maxWords;

        const words = value.trim().split(/\s+/);

        if (words.length > 1) {
            // texto con varias palabras
            if (words.length <= limit) return value;
            return words.slice(0, limit).join(' ') + suffix;
        } else {
            // texto sin espacios, truncar por caracteres
            if (value.length <= limit) return value;
            return value.slice(0, limit) + suffix;
        }
    }
}