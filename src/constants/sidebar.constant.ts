import { SidebarList } from "../types/ui/Sidebar";
import { 
    AreaChartIcon,
    UserIcon,
    GraduationCapIcon,
    VideoIcon,
    CreditCardIcon,
    MegaphoneIcon,
    ReceiptIcon,
    LogOutIcon,
    UsersIcon,
    LayersIcon,

} from "lucide-react";

const instructorSidebarList: SidebarList = [
    {
        display: "Thông tin cá nhân",
        icon: UserIcon,
        path: "/instructor/profile",
        state: "instructor.profile"
    },
    {
        display: "Thống kê",
        icon: AreaChartIcon,
        path: "/instructor/statistic",
        state: "instructor.statistic"
    },
    {
        display: "Khóa học",
        icon: GraduationCapIcon,
        path: "/instructor/courses/publishing",
        state: "instructor.courses"
    },
    {
        display: "Tạo khóa học",
        icon: VideoIcon,
        path: "/instructor/courses/create/draft",
        state: "courses.create"
    },
    {
        display: "Thanh toán",
        icon: CreditCardIcon,
        path: "/instructor/payments",
        state: "instructor.payments"
    },
    {
        display: "Quảng cáo",
        icon: MegaphoneIcon,
        path: "/instructor/advertisements/new",
        state: "instructor.advertisements"
    },
    {
        display: "Đơn mua khóa học",
        icon: ReceiptIcon,
        path: "/instructor/orders",
        state: "instructor.orders"
    },
    {
        display: "Đăng xuất",
        icon: LogOutIcon,
    }
]

const adminSidebarList: SidebarList = [
    {
        display: "Người dùng",
        icon: UsersIcon,
        path: "/admin/users",
        state: "admin.users"
    },
    {
        display: "Danh mục",
        icon: LayersIcon,
        path: "/admin/categories",
        state: "admin.categories"
    },
    {
        display: "Thống kê",
        icon: AreaChartIcon,
        path: "/admin/statistic",
        state: "admin.statistic"
    },
    {
        display: "Khóa học",
        icon: GraduationCapIcon,
        path: "/admin/courses",
        state: "admin.courses"
    },
    {
        display: "Thanh toán",
        icon: CreditCardIcon,
        path: "/admin/payments",
        state: "admin.payments"
    },
    {
        display: "Quảng cáo",
        icon: MegaphoneIcon,
        path: "/admin/ads",
        state: "admin.ads"
    },
    {
        display: "Dơn mua khóa học",
        icon: ReceiptIcon,
        path: "/admin/orders",
        state: "admin.orders"
    },
    {
        display: "Đăng xuất",
        icon: LogOutIcon,
    }
]

export const sidebarConstants = {instructorSidebarList, adminSidebarList};