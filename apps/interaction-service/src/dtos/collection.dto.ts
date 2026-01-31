import { Expose } from "class-transformer";

export class CollectionDto {
    @Expose({ name: '_id' }) id!: string;
    @Expose() userId!: string;
    @Expose() name!: string;
    @Expose() description?: string;
    @Expose() itemCount?: number;
    @Expose() isPublic?: boolean;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;

    
}
