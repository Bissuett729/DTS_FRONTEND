export interface ILine {
    _id:            string;
    name:           string;
    standardOutput: number;
    stages:         IStage[];
    active:         boolean;
    createdAt:      Date;
    updatedAt:      Date;
    __v:            number;
}

export interface IStage {
    name:            string;
    hourlyStandards: IHourlyStandard[];
    _id:             string;
}

export interface IHourlyStandard {
    label:     string;
    startHour: number;
    endHour:   number;
    standard:  number;
}