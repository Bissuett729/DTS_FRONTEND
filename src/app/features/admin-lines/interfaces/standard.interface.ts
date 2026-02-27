import { FormControl } from "@angular/forms";

export interface IStandard {
    startTime: string; 
    finishTime: string; 
    line: string; 
    standard: number; 
    standardControl?: FormControl<number>
}