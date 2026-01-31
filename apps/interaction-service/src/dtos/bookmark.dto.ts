import { Expose } from "class-transformer";

export class BookmarkDto {
    @Expose({ name: '_id' }) id!: string;
    @Expose() userId!: string;
    @Expose() collectionId?: string;
    @Expose() itemId!: string;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;
}
