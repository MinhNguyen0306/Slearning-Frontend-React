import { Courses } from "./Course";
import { User } from "./User";

export interface ImageStorage {
    id: string,
    name: string,
    size: number,
    url: string,
    extension: string;
    courses: Courses;
    user: User;
}

export type ImageStorages = ImageStorage[]