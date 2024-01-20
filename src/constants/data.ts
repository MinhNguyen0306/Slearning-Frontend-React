type ReminderMethod = {
    id: string,
    method: string
}

type ReminderTimeUnitBefore = {
    id: string,
    unit: string
}

const reminderMethods: ReminderMethod[] = [
    {
        id: "email",
        method: 'Email'
    },
    {
        id: 'notification',
        method: 'Thông báo'
    }
]

const reminderTimeUnitBefores: ReminderTimeUnitBefore[] = [
    {
        id: 'minutes',
        unit: 'phút'
    },
    {
        id: 'hours',
        unit: 'giờ'
    },
    {
        id: 'days',
        unit: 'ngày'
    },
]

export const data = { reminderMethods, reminderTimeUnitBefores }