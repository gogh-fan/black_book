export interface CommentEntity {
    id: number;
    updatedAt: Date;
    content: string;
    workId: number;
    writer: { nick: string };
}
