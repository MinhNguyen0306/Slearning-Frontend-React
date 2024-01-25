import { AccountBalance } from "./AccountBalance"
import { Courses } from "./Course"
import { ImageStorage } from "./ImageStorage"
import { AdminPayment } from "./AdminPayment"
import { Payments } from "./Payment"
import { Progress } from "./Progress"
import { Roles } from "./Role"
import { WorkExperiences } from "./WorkExperience"

export type UserStatus = 'PENDING' | 'LOCK' | 'ACTIVE'

export type User = {
    id: string,
    fullName?: string,
    email: string,
    phone?: string,
    age?: number,
    about?: string,
    education?: string,
    avatar?: ImageStorage,
    lastLogin?: Date,
    lock: boolean,
    instructor: boolean,
    workExperiences: WorkExperiences
    userStatus: UserStatus,
    courses?: Courses,
    accountBalance: AccountBalance,
    payments?: Payments,
    adminPayments: AdminPayment[],
    progresses?: Progress[],
    create_at?: Date,
    update_at?: Date,
    deviceTokens: {
        id: number,
        deviceType: string
    },
    roles: Roles
}

export type users = User[]