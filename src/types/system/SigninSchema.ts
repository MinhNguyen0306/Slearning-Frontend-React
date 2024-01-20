import { z } from "zod";

export const signinSchema = z.object({
    email: z
        .string()
        .min(5, "Email ít nhất 5 ký tự")
        .email("Email không hợp lệ"),
        // .refine(async (val) => {
        //     const emails = "minhadadadadad"
        //     return emails.includes(val)
        // }, "Chưa đăng ký tài khoản với email này"),
    password: z
        .string()
        .min(5, "Password ít nhất 5 ký tự")
        .max(25, "Password nhieu nhất 25 ký tự")
        // .refine((val) => {
        //     const firstCharFormat:RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; 
        //     firstCharFormat.test(val.charAt(0))
        // }, "Ký tự đầu không được là ký tự đặc biệt")
        // .refine((val) => {
        //     const format:RegExp = /[A-Z]/ 
        //     format.test(val)
        // }, "Có ít nhất một chữ in hoa")
        // .refine((val) => {
        //     const atLeastNumberFormat:RegExp = /[0-9]/
        //     atLeastNumberFormat.test(val)
        // }, "Chứa ít nhất một ký tự số"), 
});

export type SigninSchema = z.infer<typeof signinSchema>