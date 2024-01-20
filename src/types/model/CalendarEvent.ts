import { RecurrenceEvent } from "../payload/enums/RecurrenceEvent";

export type DateOfWeek = 'MO' | "TU" | 'WE' | 'TH' | 'FI' | 'SA' | 'SU';

export interface CalendarEvent {
    eventId?: string,
    title: string,
    description: string,
    duration: number,
    recurrenceEvent: RecurrenceEvent,
    dateOfWeeks?: DateOfWeek[],
    timeBefore: number,
    timeUnitBefore: 'minutes' | 'hours' | 'days',
    reminderMethod: string,
    startDate?: string,
    startTime: string,
    untilDate?: string,
    createAt?: string,
    updateAt?: string,
}