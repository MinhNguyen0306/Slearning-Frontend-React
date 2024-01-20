import { SidebarItem } from "./Sidebar";

export type TabbarItem = Required<Omit<SidebarItem, 'icon' | 'children'>>

export type LectureContentType = 'description' | 'comment' | 'note'

export type TabbarItemLectureContent = {
    display: string,
    type: LectureContentType
}

export type Tabbar = TabbarItem[]
