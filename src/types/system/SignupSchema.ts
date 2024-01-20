import { z } from 'zod';

export const signupSchema = z.object({
    fullName: z
        .string()
        .min(5, "Tên ít nhất 5 ký tự")
        .max(25, "Tên dài nhất 25 ký tự"),
    email: z
        .string()
        .email("Email không hợp lệ"),
    password: z
        .string()
        .min(5, "Password ít nhất 5 ký tự")
        .max(25, "Password nhieu nhất 25 ký tự"),
        // .refine((val) => {
        //     const format:RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; 
        //     val.charAt(0) === val.charAt(0).toUpperCase() || format.test(val.charAt(0))
            
        // }, "Ký tự đầu không được là ký tự đặc biệt")
        // .refine((val) => {
        //     const format:RegExp = /[0-9]/
        //     format.test(val)
        // }, "Chứa ít nhất một ký tự số"),
    confirmPassword: z
        .string()
        .min(5, "Confirm password")
        .max(25, "Confirm password")
        // .refine((val) => {
        //     const format:RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        //     val.charAt(0) === val.charAt(0).toUpperCase() || format.test(val.charAt(0))
        // }, "Ký tự đầu không được là ký tự đặc biệt")
        // .refine((val) => {
        //     const format:RegExp = /[0-9]/
        //     format.test(val)
        // }, "Chứa ít nhất một ký tự số"),
}).refine((val) => val.password === val.confirmPassword, {
    message: "Mat khau khong khop",
    path: ['confirmPassword']
})

export type SignupSchema = z.infer<typeof signupSchema>;