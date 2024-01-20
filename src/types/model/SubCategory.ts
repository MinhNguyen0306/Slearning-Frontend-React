import { Category } from "./Category";
import { Topics } from "./Topic";

export interface SubCategory {
    id: string,
    title: string,
    lock?: boolean,
    category: Category
    topics?: Topics
}

export type SubCategories = SubCategory[]