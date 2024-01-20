import { PublishStatus } from "../../../types/payload/enums/PublishStatus";
import { AppStateSlice } from "../../../types/system/AppStateSlice"

const initialState: AppStateSlice = {
    activeState: "",
    sidebarExpand: false,
    workExperienceModalOpen: false,
    createCategoryModalOpen: false,
    completedCoursePopupState: {
        open: false,
        courseId: ""
    },
    sellerPaymentModalOpen: false,
    editQuestionModalOpen: {
        open: false,
        question: {
            id: "",
            question: "",
            chapter: {
                id: "",
                title: "",
                description: "",
                position: 1,
                publishStatus: PublishStatus.PUBLISHING,
                completed: false,
                lectures: [],
                questions: []

            },
            answers: [],
        }
    },
    reminderModalOpen: {
        open: false,
    },
    createChapterModalOpen: {
        open: false,
        chapter: {
            id: "",
            title: "",
            description: "",
            position: 1,
            publishStatus: PublishStatus.PUBLISHING,
            completed: false,
            lectures: [],
            questions: []
        },
        courseId: ""
    },
    aboutModalOpen: {
        open: false,
        prevAbout: ""
    },
    changeAvatarModalOpen: false,
    createLectureModalOpen: {
        open: false,
        lecture: {
            id: "",
            title: "",
            description: "",
            videoStorage: {
                id: "",
                url: "",
                size: 0,
                extension: "",
                name: "",
                posterUrl: ""
            },
            position: 1,
            previewed: false,
            publishStatus: PublishStatus.UN_PUBLISHING,
        }
    },
    userDetailModalOpen: {
        open: false,
        user: {
            id: "",
            fullName: "",
            email: "",
            phone: "",
            age: 0,
            instructor: false,
            lock: false,
            workExperiences: [],
            userStatus: 'ACTIVE',
            monthlyPayments: [],
            deviceTokens: {
                id: 0,
                deviceType: ""
            },
            roles: [
                {
                    id: 0,
                    role: ""
                }
            ]
        }
    },
    courseDetailModalOpen: {
        open: false,
        course: {
            id: "",
            title: "",
            description: "",
            introduce: "",
            requirement: "",
            achievement: "",
            chapters: [],
            level: {
                id: "",
                title: ""
            },
            topic: {
                id: "",
                title: "",
                subCategory: {
                    id: "",
                    title: "",
                    category: {
                        id: "",
                        title: "",
                    }
                }
            },
            price: 0,
            ratings: []
        }
    },
    confirmModalOpen: {
        open: false,
        message: ""
    }
}

export default initialState;