import { Chapter } from "../model/Chapter"
import { Course } from "../model/Course"
import { Lecture } from "../model/Lecture"
import { Question } from "../model/Question"
import { User } from "../model/User"

export type CreateLectureModalState = {
    open: boolean,
    lecture: Lecture
}

export type CreateChapterModalState = {
    open: boolean,
    courseId: string,
    chapter?: Chapter
}

export type UserDetailModalState = {
    open: boolean,
    user: User
}

export type CompletedCoursePopupState = {
    open: boolean,
    courseId: string,
}

export type ReminderModalState = {
    open: boolean,
}

export type CourseDetailModalState = {
    open: boolean,
    course: Course,
}

export type ConfirmModalState = {
    open: boolean
    message: string
}

export type ExplanationModalState = {
    open: boolean,
    questionId: string,
    explanation: string
}

export type EditQuestionModalState = {
    open: boolean,
    question: Question
}

export type AboutModalState = {
    open: boolean
    prevAbout: string
}

export type AppStateSlice = {
    activeState?: string,
    sidebarExpand: boolean,
    workExperienceModalOpen: boolean,
    editQuestionModalOpen: EditQuestionModalState,
    aboutModalOpen: AboutModalState,
    changeAvatarModalOpen: boolean,
    createCategoryModalOpen: boolean,
    createChapterModalOpen: CreateChapterModalState,
    reminderModalOpen: ReminderModalState,
    createLectureModalOpen: CreateLectureModalState,
    sellerPaymentModalOpen: boolean,
    userDetailModalOpen: UserDetailModalState,
    courseDetailModalOpen: CourseDetailModalState,
    confirmModalOpen: ConfirmModalState,
    completedCoursePopupState: CompletedCoursePopupState,
    explanationModalState: ExplanationModalState
}