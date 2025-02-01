import * as Models from "./Models";

// 24 bits represented as values
// 0-33554431
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

function decodeSchedule(codedSchedule: CodedSchedule) : DecodedSchedule{
    let  decodedSchedule = {} as DecodedSchedule;

     

    for (let key in codedSchedule) {
        let code = codedSchedule[key as keyof CodedSchedule];
        decodedSchedule[key as keyof DecodedSchedule] = code.toString(2).padStart(4, '0').split("").map(char => char === '1');
    }

    return decodedSchedule;
}

function codeSchedule(){}
function scheduleFilter(){}
