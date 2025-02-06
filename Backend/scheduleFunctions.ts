import * as Models from "./Models";
import {Request, Response} from "express";

// 24 bits represented as values
// 0-33554431
export interface CodedSchedule{
    MONDAY: number;
    TUESDAY: number;
    WEDNESDAY: number;
    THURSDAY: number;
    FRIDAY: number;
    SATURDAY: number;
    SUNDAY: number;
}

// [0-1, 1-2, ..., 22-23, 23-24]
export interface DecodedSchedule{
    MONDAY: boolean[];
    TUEDAY: boolean[];
    WEDNESDAY: boolean[];
    THURSDAY: boolean[];
    FRIDAY: boolean[];
    SATURDAY: boolean[];
    SUNDAY: boolean[];
}
export function buildCodedSchedule(rawCodedSchedule : Record<string, any>) : CodedSchedule {
    const {SCHEDULE_ID, USER_ID, ...days} = rawCodedSchedule;

    let code = {} as CodedSchedule;
    code.MONDAY = days.MONDAY;
    code.TUESDAY = days.TUESDAY;
    code.WEDNESDAY = days.WEDNESDAY;
    code.THURSDAY = days.THURSDAY;
    code.FRIDAY = days.FRIDAY;
    code.SATURDAY = days.SATURDAY;
    code.SUNDAY = days.SUNDAY;

    return code;
}

export function decodeSchedule(codedSchedule: CodedSchedule) : DecodedSchedule{
    let  decodedSchedule = {} as DecodedSchedule;

    for (let key in codedSchedule) {
        let code = codedSchedule[key as keyof CodedSchedule];
        decodedSchedule[key as keyof DecodedSchedule] = code.toString(2).padStart(24, '0').split("").map(char => char === '1');
    }

    return decodedSchedule;
}

export function codeSchedule(decodedSchedule: DecodedSchedule) : CodedSchedule{
    let codedSchedule = {} as CodedSchedule;

    for(let key in decodedSchedule) {
        let decode = decodedSchedule[key as keyof DecodedSchedule].map(bool => (bool) ? '1' : '0').join("");
        codedSchedule[key as keyof CodedSchedule] = Number("0b".concat(decode));
    }

    return codedSchedule;
}

export interface ComparationResult {
    matches: number;
    commonSchedule: CodedSchedule;
}

export function compareSchedules(schedule1 : CodedSchedule, schedule2: CodedSchedule) : ComparationResult {
    let matchesNum = 0;
    let common = {} as CodedSchedule;

    common.MONDAY = schedule1.MONDAY & schedule2.MONDAY;
    matchesNum += (common.MONDAY.toString(2).match(/1/g) || []).length;

    common.TUESDAY = schedule1.TUESDAY & schedule2.TUESDAY;
    matchesNum += (common.TUESDAY.toString(2).match(/1/g) || []).length;

    common.WEDNESDAY = schedule1.WEDNESDAY & schedule2.WEDNESDAY;
    matchesNum += (common.WEDNESDAY.toString(2).match(/1/g) || []).length;

    common.THURSDAY = schedule1.THURSDAY & schedule2.THURSDAY;
    matchesNum += (common.THURSDAY.toString(2).match(/1/g) || []).length;

    common.FRIDAY = schedule1.FRIDAY & schedule2.FRIDAY;
    matchesNum += (common.FRIDAY.toString(2).match(/1/g) || []).length;

    common.SATURDAY = schedule1.SATURDAY & schedule2.SATURDAY;
    matchesNum += (common.SATURDAY.toString(2).match(/1/g) || []).length;

    common.SUNDAY = schedule1.SUNDAY & schedule2.SUNDAY;
    matchesNum += (common.SUNDAY.toString(2).match(/1/g) || []).length;

    return {matches: matchesNum, commonSchedule: common};
}

export interface SortedUser{
    matches: number;
    schedule: DecodedSchedule;
    commonSchedule: DecodedSchedule;
    user: Record<string, any>;
}

// The Parameters are users in JSON format
export function scheduleFilter(otherUsers: Array<Record<string, any>>, currUser: Record<string, any>) : Array<Record<string, any>>{
    let sortedArray : Array<SortedUser> = [];

    let currUserSchedule : CodedSchedule = buildCodedSchedule(currUser.USER_SCHEDULE);

    for(let user of otherUsers) {
        let tempSchedule : CodedSchedule = buildCodedSchedule(user.USER_SCHEDULE);
        let {matches, commonSchedule} = (compareSchedules(currUserSchedule, tempSchedule));

        if(matches > 0) {
            sortedArray.push({
                matches: matches,
                schedule: decodeSchedule(tempSchedule),
                commonSchedule: decodeSchedule(commonSchedule),
                user: user
            })
        }
    }

    sortedArray.sort((user1, user2) => user2.matches - user1.matches);

    return sortedArray;
}
