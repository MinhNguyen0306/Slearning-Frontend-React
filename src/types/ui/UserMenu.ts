import { LucideIcon } from "lucide-react";

export type UserMenuItem = {
    path?: string,
    display: string,
    icon: LucideIcon
}

export type UserMenu = UserMenuItem[]