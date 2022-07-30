import { BackRespons } from "./interfaces";
import { UserEntity } from "./user";

export enum workStatus {
    Recruit = "Recruit",
    Progressing = "Progressing",
    Finished = "Finished",
}

export interface WorkEntity {
    id: number;
    updatedAt: Date;
    title: string;
    description: string;
    address: string;
    coverImg: string;
    isSecret: boolean;
    state: workStatus;
    client?: UserEntity;
    participants?: UserEntity[];
}

export interface WorkAllWorks extends BackRespons {
    data: { totalCount: number; totalPages: number; works: WorkEntity[] };
}

export interface WorkFindWorkById extends BackRespons {
    data: WorkEntity;
}

export interface WorkManagement extends BackRespons {
    data: WorkEntity[];
}
