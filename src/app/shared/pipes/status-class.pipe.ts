import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'statusClass', standalone: true })
export class StatusClassPipe implements PipeTransform {
    transform(status: string): string {
        switch ((status || '').toLowerCase()) {
            case 'pass': return 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-white';
            case 'pending': return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-500 dark:text-black';
            case 'running': return 'bg-[#8ac3fe] text-[#0e1e85] dark:bg-[#5185f9] dark:text-white';
            case 'fail': return 'bg-red-200 text-red-800 dark:bg-red-600 dark:text-white';
            case 'connected': return 'bg-green-200 text-green-800 dark:bg-green-600 dark:text-white';
            case 'notconnect': return 'bg-orange-200 text-orange-800 dark:bg-orange-600 dark:text-white';
            case 'none': return 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-white';
            default: return 'bg-red-200 text-red-800 dark:bg-red-600 dark:text-white';
        }
    }
}