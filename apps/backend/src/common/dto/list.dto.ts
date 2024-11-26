// import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export type Pagination = {
  take: number;
  skip: number;
};

// export type Sorting = Record<string, boolean | Record<string, boolean>>;

// export const MAX_PER_PAGE = Number(process.env.PAGINATION_MAX_PER_PAGE) || 200;
// export const MAX_ALLOWED_PER_PAGE =
//   Number(process.env.PAGINATION_MAX_ALLOWED_PER_PAGE) || 200;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default class ListDto<SortByEnum = undefined> {
  // @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  page: number;

  // @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  pageSize: number;

  // @ApiHideProperty()
  // @IsOptional()
  // @IsBoolean()
  // ignoreMaxAllowedPageSize?: boolean;

  // @ApiPropertyOptional({ example: '2023-06-21' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  // @ApiPropertyOptional({ example: '2023-06-23' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  static getPagination(dto: ListDto): Pagination {
    const pagination: Pagination = {
      skip: dto.page ? (dto.page - 1) * dto.pageSize : 0,
      take: dto.pageSize ? dto.pageSize : 100,
    };

    // if (!dto.ignoreMaxAllowedPageSize && dto.pageSize > MAX_ALLOWED_PER_PAGE) {
    //   pagination.take = MAX_ALLOWED_PER_PAGE;
    // }

    return pagination;
  }

}
