import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import initialState from "./appState.selector";
import { AboutModalState, CompletedCoursePopupState, ConfirmModalState, CourseDetailModalState, CreateChapterModalState, CreateLectureModalState, EditQuestionModalState, ReminderModalState, UserDetailModalState } from "../../../types/system/AppStateSlice";

const appStateSlice = createSlice({
    name: "appState",
    initialState: initialState,
    reducers: {
        setActiveState: (state, action: PayloadAction<string>) => {
            state.activeState = action.payload
        },
        setSidebarExpand: (state, action: PayloadAction<boolean>) => {
            state.sidebarExpand = action.payload
        },
        setWorkExperienceModalOpen: (state, action: PayloadAction<boolean>) => {
            state.workExperienceModalOpen = action.payload
        },
        setCreateCategoryModalOpen: (state, action: PayloadAction<boolean>) => {
            state.createCategoryModalOpen = action.payload
        },
        setCreateChapterModalOpen: (state, action: PayloadAction<CreateChapterModalState>) => {
            state.createChapterModalOpen = action.payload
        },
        setReminderModalOpen: (state, action: PayloadAction<ReminderModalState>) => {
            state.reminderModalOpen = action.payload
        },
        setSellerPaymentModalOpen: (state, action: PayloadAction<boolean>) => {
            state.sellerPaymentModalOpen = action.payload
        },
        setEditQuestionModal: (state, action: PayloadAction<EditQuestionModalState>) => {
            state.editQuestionModalOpen = action.payload
        },
        setAboutModalOpen: (state, action: PayloadAction<AboutModalState>) => {
            state.aboutModalOpen.open = action.payload.open
            state.aboutModalOpen.prevAbout = action.payload.prevAbout
        },
        setChangeAvatarModalOpen: (state, action: PayloadAction<boolean>) => {
            state.changeAvatarModalOpen = action.payload
        },
        setCreateLectureModalOpen: (state, action: PayloadAction<CreateLectureModalState>) => {
            state.createLectureModalOpen.open = action.payload.open,
            state.createLectureModalOpen.lecture = action.payload.lecture
        },
        setUserDetailModalOpen: (state, action: PayloadAction<UserDetailModalState>) => {
            state.userDetailModalOpen.open = action.payload.open,
            state.userDetailModalOpen.user = action.payload.user
        },
        setCompletedCoursePopupState: (state, action: PayloadAction<CompletedCoursePopupState>) => {
            state.completedCoursePopupState = action.payload
        },
        setCourseDetailModalOpen: (state, action: PayloadAction<CourseDetailModalState>) => {
            state.courseDetailModalOpen = action.payload
        },
        setConfirmModalOpen: (state, action: PayloadAction<ConfirmModalState>) => {
            state.confirmModalOpen.open = action.payload.open,
            state.confirmModalOpen.message = action.payload.message
        },
    }, 
})

export const {
    setActiveState,
    setSidebarExpand,
    setWorkExperienceModalOpen,
    setAboutModalOpen,
    setEditQuestionModal,
    setChangeAvatarModalOpen,
    setReminderModalOpen,
    setCreateLectureModalOpen,
    setSellerPaymentModalOpen,
    setCreateCategoryModalOpen,
    setCreateChapterModalOpen,
    setUserDetailModalOpen,
    setCourseDetailModalOpen,
    setConfirmModalOpen,
    setCompletedCoursePopupState
} = appStateSlice.actions

export default appStateSlice.reducer