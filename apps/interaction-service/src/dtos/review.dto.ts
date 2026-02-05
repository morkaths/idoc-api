import { Expose, Type } from "class-transformer";

export class ReviewUserDto {
    @Expose() id!: string;
    @Expose() email!: string;
    @Expose() username!: string;
}

export class ReviewDto {
    @Expose({ name: '_id' }) id!: string;
    @Expose() userId!: string;
    @Expose() itemId!: string;
    @Expose() rating!: number;
    @Expose() content?: string;
    @Expose() isHidden?: boolean;
    @Expose() createdAt?: Date;
    @Expose() updatedAt?: Date;

    @Expose()
    @Type(() => ReviewUserDto)
    user?: ReviewUserDto;
}
