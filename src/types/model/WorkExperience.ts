import { User } from "./User";

export interface WorkExperience {
    id: number;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    user: User;
}

export type WorkExperienceRequest = Omit<WorkExperience, 'id' | 'user'>

export type WorkExperiences = WorkExperience[]