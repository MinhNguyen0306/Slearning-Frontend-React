import { SubCategories } from "./SubCategory"

export type Category = {
    id: string,
    title: string,
    lock?: boolean,
    subCategories?: SubCategories
}

export type Categories = Category[]