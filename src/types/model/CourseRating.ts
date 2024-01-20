
export interface CourseRating {
    id: {
        courseID: string,
        userID: string,
    },
    rating: number,
    comment?: string,
    createAt?: string,
    updateAt?: string
}

export type CourseRatings = CourseRating[]