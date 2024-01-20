import { twMerge } from "tailwind-merge";
import { clsx, ClassValue } from "clsx";
import axios, { AxiosError } from "axios";
import { Course } from "../types/model/Course";

const FileURL = "http://localhost:9090/api/v1/files"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImage(imageUrl: string) {
    return `${FileURL}/download/${imageUrl}`
}

export function getFileAttach(fileUrl: string) {
    return `${FileURL}/download/file-attach/${fileUrl}`
}

export function getVideo(videoUrl: string) {
    return `${FileURL}/show/video/${videoUrl}`
}

export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
    return axios.isAxiosError(error);
}

export function calculateCourseRating(course: Course) {
    if(!course.ratings || course.ratings.length < 1) {
        return 0;
    } else {
        return course.ratings.reduce((i, r) => i + r.rating, 0) / course.ratings.length;
    }
}

export function getYearsForm(from: number) {
    const currentYear = new Date().getFullYear()
    const years = []
    while(from <= currentYear) {
        years.push(from++)
    }

    return years;
}

export function getMonths() {
    const months = Array(12).fill(0).map((_, index) => `Tháng ${index + 1}`)
    return months
}

export function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getFileExtension(fileName: string) {
    const fileSplit = fileName.trim().split(".")
    return fileSplit[fileSplit.length - 1]
}

export function formatFileSize(fileSize: number) {
    if(fileSize >= 1024 && fileSize < 1024 * 1024) {
        return `${Math.ceil(fileSize / 1024)} KB`
    } else if(fileSize >= 1024 * 1024 && fileSize < 1024 * 1024 * 1024) {
        return `${Math.ceil(fileSize / 1024)} MB`
    }
}