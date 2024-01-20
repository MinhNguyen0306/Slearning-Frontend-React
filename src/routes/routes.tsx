import HomePage from "../pages/HomePage";
import CourseDetailPage from "../pages/CourseDetailPage";
import SearchPage from "../pages/SearchPage";
import LearnerLayout from "../layouts/LearnerLayout";
import NotHeaderLayout from "../layouts/NotHeaderLayout";
import ErrorPage from "../pages/ErrorPage";
import InfomationPage from "../pages/InfomationPage";
import ProfilePage from "../pages/ProfilePage";
import InstructorProfilePage from "../pages/instructor/ProfilePage"; 
import MyLearningPage from "../pages/MyLearningPage";
import PurchasesPage from "../pages/PurchasesPage";
import InstructorLayout from "../layouts/InstructorLayout";
import CoursesPage from "../pages/instructor/CoursePage";
import PaymentPage from "../pages/instructor/PaymentPage";
import AdvertisementPage from "../pages/instructor/AdvertisementPage";
import OrderPage from "../pages/instructor/OrderPage";
import StatisticPage from "../pages/instructor/StatisticPage";
import CreateCoursePage from "../pages/instructor/CreateCoursePage";
import CoursesPublishingPage from "../components/Instructor/CoursesPublishing";
import CoursesPendingPage from "../components/Instructor/CoursesPending";
import CoursesUncompletedPage from "../components/Instructor/CoursesUncompleted";
import CoursesDiscountingPage from "../components/Instructor/CoursesDiscounting";
import CreateCourseStep1Page from "../components/Instructor/CreateCourseStep1";
import CreateCourseStep2Page from "../components/Instructor/CreateCourseStep2";
import CreateCourseStep3Page from "../components/Instructor/CreateCourseStep3";
import CreateCourseStep4Page from "../components/Instructor/CreateCourseStep4";
import AdvertisementNewPage from "../components/Instructor/AdvertisementNew";
import AdvertisementPendingPage from "../components/Instructor/AdvertisementPending";
import AdvertisementAcceptedPage from "../components/Instructor/AdvertisementAccepted";
import AdvertisementHistoryPage from "../components/Instructor/AdvertisementHistory";
import AdvertisementPackagePage from "../pages/instructor/AdvertisementPackagePage";
import AddInfoAdsPage from "../pages/instructor/AddInfoAdsPage";
import SigninPage from "../components/auth/SigninForm";
import SignupPage from "../components/auth/SignupForm";
import AuthPage from "../pages/auth/AuthPage";
import AdminLayout from "../layouts/AdminLayout";
import UsersPage from "../pages/admin/users/UsersPage";
import LearningLayout from "../layouts/LearningLayout";
import LearningPage from "../pages/LearningPage";
import ProtectedPage from "./ProtectedPage";
import ROLES from "../constants/role.constant";
import AUTHSTATE from "../constants/authState.constant";
import CreateCourseDraft from "../components/Instructor/CreateCourseDraft";
import CategoryManagePage from "../pages/admin/category/CategoryManagePage";
import ManageCoursePage from "../pages/admin/course/ManageCoursePage";
import CheckoutPage from "../pages/main/CheckoutPage";
import ResponseCheckoutPage from "../pages/main/ResponseCheckoutPage";
import ReminderPage from "../pages/main/ReminderPage";
import VideoContent from "../components/common/VideoContent";
import TestContent from "../components/common/TestContent";
import AdminPaymentPage from "../pages/admin/payments/AdminPaymentPage";
import AdminStatisticPage from "../pages/admin/statistic/AdminStatisticPage";

type Route = {
    path: string,
    layout?: JSX.Element,
    element: JSX.Element,
    state?: string,
    children? : Route[]
    index?: boolean
}

const routes: Route[] = [
    // {
    //     path: "*",
    //     layout: <NotHeaderLayout />,
    //     element:  <ErrorPage code={404} />,
    // },
    {
        path: "/unauthorize",
        layout: <NotHeaderLayout />,
        element:  <ErrorPage code={401} />,
    },
    {
        path: "/",
        layout: <LearnerLayout />,
        element:  <HomePage />,
        state: "home",
    },
    {
        path: "/auth",
        layout: <LearnerLayout />,
        element: <AuthPage authState={AUTHSTATE.LOGIN_USER}/>,
        // children: [
        //     {
        //         path: "signin",
        //         element: <SigninPage switchAuthState={} />
        //     }, 
        //     {
        //         path: "signup",
        //         element: <SignupPage />
        //     }
        // ]
    },
    {
        path: "search",
        layout: <LearnerLayout />,
        element: <SearchPage />,
        state: "search"
    },
    {
        path: "/courses/:id",
        layout: <LearnerLayout />,
        element: <CourseDetailPage />,
        state: "courses.detail",
    },
    {
        path: "/payment/checkout",
        layout: <LearnerLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.ADMIN, ROLES.MENTOR, ROLES.USER]}>
                <CheckoutPage />
            </ProtectedPage>,
        state: "courses.detail",
    },
    {
        path: "/payment/checkout/response",
        layout: <LearnerLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.ADMIN, ROLES.MENTOR, ROLES.USER]}>
                <ResponseCheckoutPage />
            </ProtectedPage>,
        state: "courses.detail",
    },
    {
        path: "/learning",
        layout: <LearningLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.USER, ROLES.MENTOR, ROLES.ADMIN]}>
                <LearningPage />
            </ProtectedPage>,
        children: [
            {
                path: ":courseId/lecture/:lectureId",
                element: <VideoContent />,
                index: true
            },
            {
                path: ":courseId/test/chapter/:chapterId",
                element: <TestContent />
            }
        ]
    },
    {
        path: "/learner",
        layout: <LearnerLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.USER, ROLES.MENTOR]}>
                <InfomationPage />
            </ProtectedPage>,
        children: [
           {
            path: "profile",
            element: <ProfilePage />,
            state: "learner.profile",
            index: true
           },
           {
            path: "my-learning",
            element: <MyLearningPage />,
            state: "learner.myLearning"
           },
           {
            path: "reminders",
            element: <ReminderPage />,
            state: "learner.reminder"
           },
           {
            path: "my-purchases",
            element: <PurchasesPage />,
            state: "learner.purchases"
           }
        ]
    },
    {
        path: "/instructor/courses",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR, ROLES.USER]}>
                <CoursesPage />
            </ProtectedPage>,
        children: [
            {
                path: "publishing",
                element: <CoursesPublishingPage />,
                state: "instructor.courses.publishing",
                index: true
            },
            {
                path: "pending",
                element: <CoursesPendingPage />,
                state: "instructor.courses.pending"
            },
            {
                path: "uncompleted",
                element: <CoursesUncompletedPage />,
                state: "instructor.courses.uncompleted"
            },
            {
                path: "discounting",
                element: <CoursesDiscountingPage />,
                state: "instructor.courses.discounting"
            },
        ]
    },
    {
        path: "/instructor/payments",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR]}>
                <PaymentPage />
            </ProtectedPage>,
        state: "instructor.payments",
    },
    {
        path: "/instructor/packages",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR, ROLES.ADMIN]}>
                <AdvertisementPackagePage />
            </ProtectedPage>,
        state: "instructor.advertisements",
    },
    {
        path: "/instructor/advertisements/:id/apply",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR, ROLES.ADMIN]}>
                <AddInfoAdsPage />
            </ProtectedPage>,
        state: "instructor.advertisements",
    },
    {
        path: "/instructor/advertisements",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR, ROLES.ADMIN]}>
                <AdvertisementPage />
            </ProtectedPage>,
        children: [
            {
                path: "new",
                element: <AdvertisementNewPage />,
                state: "instructor.advertisements.new",
                index: true
            },
            {
                path: "pending",
                element: <AdvertisementPendingPage />,
                state: "instructor.advertisements.pending"
            },
            {
                path: "Accepted",
                element: <AdvertisementAcceptedPage />,
                state: "instructor.advertisements.accepted"
            },
            {
                path: "history",
                element: <AdvertisementHistoryPage />,
                state: "instructor.advertisements.history"
            },
        ]
    },
    {
        path: "/instructor/profile",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR]}>
                <InstructorProfilePage />
            </ProtectedPage>,
        state: "instructor.profile",
    },
    {
        path: "/instructor/orders",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR]}>
                <OrderPage />
            </ProtectedPage>,
        state: "instructor.orders",
    },
    {
        path: "/instructor/statistic",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR]}>
                <StatisticPage />
            </ProtectedPage>,
        state: "instructor.statistic",
    },
    {
        path: "/instructor/courses/:id/create",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR]}>
                <CreateCoursePage />
            </ProtectedPage>,
        children: [
            {
                path: "step/1",
                element: <CreateCourseStep1Page />,
                state: "courses.create.1",
                index: true
            },
            {
                path: "step/2",
                element: <CreateCourseStep2Page />,
                state: "courses.create.2"
            },
            {
                path: "step/3",
                element: <CreateCourseStep3Page />,
                state: "courses.create.3"
            },
            {
                path: "step/4",
                element: <CreateCourseStep4Page />,
                state: "courses.create.4"
            },
        ]
    },
    {
        path: "/instructor/courses/create/draft",
        layout: <InstructorLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.MENTOR]}>
                <CreateCourseDraft />
            </ProtectedPage>,
        state: "courses.create.draft"
    },
    {
        path: "/admin/users",
        layout: <AdminLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.ADMIN]}>
                <UsersPage />
            </ProtectedPage>,
        state: "admin.users"
    },
    {
        path: "/admin/categories",
        layout: <AdminLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.ADMIN]}>
                <CategoryManagePage />
            </ProtectedPage>,
        state: "admin.categories"
    },
    {
        path: "/admin/courses",
        layout: <AdminLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.ADMIN]}>
                <ManageCoursePage />
            </ProtectedPage>,
        state: "admin.courses"
    },
    {
        path: "/admin/payments",
        layout: <AdminLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.ADMIN]}>
                <AdminPaymentPage />
            </ProtectedPage>,
        state: "admin.payments"
    },
    {
        path: "/admin/statistic",
        layout: <AdminLayout />,
        element: 
            <ProtectedPage allowedRoles={[ROLES.ADMIN]}>
                <AdminStatisticPage />
            </ProtectedPage>,
        state: "admin.statistic"
    },
]

export default routes;