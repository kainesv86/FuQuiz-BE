import * as joi from 'joi';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateBlogCategoryDTO {
    @ApiProperty({ description: 'Name', example: 'Blog category 1' })
    name: string;

    @ApiProperty({ description: 'Order', example: '1' })
    order: number;
}

export const vUpdateBlogCategoryDTO = joi.object<UpdateBlogCategoryDTO>({
    name: joi.string().min(1).max(255).failover(''),
    order: joi.number().min(1).required().failover(''),
});
