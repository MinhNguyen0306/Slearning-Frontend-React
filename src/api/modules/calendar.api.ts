import { CalendarEvent } from "../../types/model/CalendarEvent";
import { ApiErrorResponse } from "../../types/payload/ApiErrorResponse";
import { isAxiosError } from "../../util/utils";
import privateClient from "../config/private.client";

const calendarEndpoints = {
    createCalendar: "/calendar/event/create"
};

const calendarApi = {
    createCalendar : async (calendarEvent: CalendarEvent, userId: string, am: boolean) => {
        try {
            const response = await privateClient.post(
                calendarEndpoints.createCalendar,
                calendarEvent, {
                    params: {
                        userId,
                        am
                    }
                }
            )

            return { response }
        } catch (error) {
            if(isAxiosError<ApiErrorResponse>(error)) {
                return { error }
            } else {
                throw new Error("Loi he thong")
            }
        }
    }
}

export default calendarApi;