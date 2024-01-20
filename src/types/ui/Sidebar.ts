import { LucideIcon } from "lucide-react";

export type SidebarItem = {
    display: string,
    icon: LucideIcon,
    path?: string,
    state?: string,
    children?: Pick<SidebarItem, 'display' | 'path'>[]
}

export type SidebarList = SidebarItem[]