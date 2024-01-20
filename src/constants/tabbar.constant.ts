import { AdminFetchCourseState } from "../types/payload/enums/AdminFetchCourseState";
import { AdminFetchUserState } from "../types/payload/enums/AdminFetchUserState";
import { Tabbar, TabbarItemLectureContent } from "../types/ui/Tabbar";

const learnerInfoTabbar: Tabbar = [
    {
        path: "/learner/profile",
        display: "Thông tin chi tiết",
        state: "learner.profile" 
    },
    {
        path: "/learner/my-learning",
        display: "Khóa học của tôi",
        state: "learner.myLearning"
    },
    {
        path: "/learner/reminders",
        display: "Cài đặt lịch học",
        state: "learner.reminder"
    },
    {
        path: "/learner/my-purchases",
        display: "Đơn mua",
        state: "learner.purchases"
    },
]

const mentorManageCoursesTabbar: Tabbar = [
    {
        path: "/instructor/courses/publishing",
        display: "Đang xuất bản",
        state: "instructor.courses.publishing"
    },
    {
        path: "/instructor/courses/pending",
        display: "Chờ duyệt",
        state: "instructor.courses.pending"
    },
    {
        path: "/instructor/courses/uncompleted",
        display: "Chưa hoàn thành",
        state: "instructor.courses.uncompleted"
    },
    {
        path: "/instructor/courses/discounting",
        display: "Giảm giá",
        state: "instructor.courses.discounting"
    },
]

const mentorAdsTabbar: Tabbar = [
    {
        path: "/instructor/advertisements/new",
        display: "Mới",
        state: "instructor.advertisements.new"
    },
    {
        path: "/instructor/advertisements/accepted",
        display: "Đã duyệt",
        state: "instructor.advertisements.accepted"
    },
    {
        path: "/instructor/advertisements/pending",
        display: "Chờ duyệt",
        state: "instructor.advertisements.pending"
    },
    {
        path: "/instructor/advertisements/history",
        display: "Lịch sử",
        state: "instructor.advertisements.history"
    },
]

const lectureContentTabs: TabbarItemLectureContent[] = [
    {
        display: "Mô tả",
        type: "description"
    },
    {
        display: "Hỏi đáp",
        type: "comment"
    },
    {
        display: "Ghi chú",
        type: "note"
    },
]

const adminManageUsers: {display: string, state: AdminFetchUserState}[] = [
    {
        display: "Người dạy",
        state: AdminFetchUserState.INSTRUCTOR
    },
    {
        display: "Chờ duyệt người dạy",
        state: AdminFetchUserState.PENDING
    },
    {
        display: "Đang hoạt động",
        state: AdminFetchUserState.ACTIVE
    }, 
    {
        display: "Bị khóa",
        state: AdminFetchUserState.LOCK
    },
]

const adminManageCourses: {display: string, state: AdminFetchCourseState}[] = [
    {
        display: "Đã có ghi danh",
        state: AdminFetchCourseState.HAS_ENROLL
    },
    {
        display: "Đang chờ duyệt",
        state: AdminFetchCourseState.PENDING
    },
    {
        display: "Đang xuất bản",
        state: AdminFetchCourseState.PUBLISHING
    }, 
    {
        display: "Bị khóa",
        state: AdminFetchCourseState.LOCKED
    },
]

const adminManagePayment: { display: string, state: 'pending' | 'success' | 'waiting' }[] = [
    {
        display: "Đang chờ thanh toán",
        state: "pending"
    },
    {
        display: "Đã thanh toán",
        state: "success"
    },
    {
        display: "Chờ xử lý",
        state: "waiting"
    },
]

export const tabbar = {
    learnerInfoTabbar, 
    mentorManageCoursesTabbar, 
    mentorAdsTabbar, 
    lectureContentTabs, 
    adminManageUsers, 
    adminManageCourses,
    adminManagePayment
}