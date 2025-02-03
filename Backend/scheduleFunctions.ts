import * as Models from "./Models";

// 24 bits represented as values
// 0-33554431
export interface CodedSchedule{
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
    Sunday: number;
}

// [0-1, 1-2, ..., 22-23, 23-24]
export interface DecodedSchedule{
    Monday: boolean[];
    Tuesday: boolean[];
    Wednesday: boolean[];
    Thursday: boolean[];
    Friday: boolean[];
    Saturday: boolean[];
    Sunday: boolean[];
}
export function buildCodedSchedule(rawCodedSchedule : Record<string, any>) : CodedSchedule {
    const {SCHEDULE_ID, USER_ID, ...days} = rawCodedSchedule;

    let code = {} as CodedSchedule;
    code.Monday = days.MONDAY;
    code.Tuesday = days.TUESDAY;
    code.Wednesday = days.WEDNESDAY;
    code.Thursday = days.THURSDAY;
    code.Friday = days.FRIDAY;
    code.Saturday = days.SATURDAY;
    code.Sunday = days.SUNDAY;

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

    common.Monday = schedule1.Monday & schedule2.Monday;
    matchesNum += (common.Monday.toString(2).match(/1/g) || []).length;

    common.Tuesday = schedule1.Tuesday & schedule2.Tuesday;
    matchesNum += (common.Tuesday.toString(2).match(/1/g) || []).length;

    common.Wednesday = schedule1.Wednesday & schedule2.Wednesday;
    matchesNum += (common.Wednesday.toString(2).match(/1/g) || []).length;

    common.Thursday = schedule1.Thursday & schedule2.Thursday;
    matchesNum += (common.Thursday.toString(2).match(/1/g) || []).length;

    common.Friday = schedule1.Friday & schedule2.Friday;
    matchesNum += (common.Friday.toString(2).match(/1/g) || []).length;

    common.Saturday = schedule1.Saturday & schedule2.Saturday;
    matchesNum += (common.Saturday.toString(2).match(/1/g) || []).length;

    common.Sunday = schedule1.Sunday & schedule2.Sunday;
    matchesNum += (common.Sunday.toString(2).match(/1/g) || []).length;

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
