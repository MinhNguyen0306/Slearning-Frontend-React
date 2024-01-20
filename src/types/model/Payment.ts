import { PaymentStatus } from "../payload/enums/PaymentStatus";
import { Course } from "./Course";
import { User } from "./User";

export interface Payment {
    id: string, 
    amount: number,
    paymentStatus: PaymentStatus
    course: Course,
    user: User,
    createAt?: string,
    updateAt?: string
}

export type Payments = Payment[]