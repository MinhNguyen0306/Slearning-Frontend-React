import { AdminPaymentStatus } from "../payload/enums/AdminPaymentStatus";
import { User } from "./User";

export interface AdminPayment {
    id: string,
    user: User,
    adminPaymentStatus: AdminPaymentStatus,
    monthOfYear: string,
    amount: number,
    paymentAt?: string,
}