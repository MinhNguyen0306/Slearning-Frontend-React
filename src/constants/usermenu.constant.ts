import { 
    LucideIcon,
    UserIcon,
    BookOpenIcon,
    ReceiptIcon,
    BookmarkIcon,
    LogOutIcon,
} from "lucide-react";
import { UserMenu } from "../types/ui/UserMenu";

const learnerMenu: UserMenu = [
    {
        path: "/learner/profile",
        display: "Tài khoản",
        icon: UserIcon
    }, 
    {
        path: "/learner/my-learning",
        display: "Khóa học đang học",
        icon: BookOpenIcon
    }, 
    {
        path: "/",
        display: "Khóa học yêu thích",
        icon: BookmarkIcon
    }, 
    {
        path: "/learner/my-purchases",
        display: "Lịch sử thanh toán",
        icon: ReceiptIcon
    },  
] 

export {learnerMenu}