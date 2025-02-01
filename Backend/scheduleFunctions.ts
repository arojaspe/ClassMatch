import * as Models from "./Models";

interface CodedSchedule{
    Monday: number;
    Tueday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
}

// [0-1, 1-2, ..., 22-23, 23-24]
interface DecodedSchedule{
    Monday: boolean[];
    Tueday: boolean[];
    Wednesday: boolean[];
    Thursday: boolean[];
    Friday: boolean[];
    Saturday: boolean[];
    Sunday: boolean[];
}

function decodeSchedule(){}
function codeSchedule(){}
function scheduleFilter(){}
