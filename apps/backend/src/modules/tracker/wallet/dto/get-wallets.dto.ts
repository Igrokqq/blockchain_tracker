import { Transform, Type } from "class-transformer";
import { IsOptional } from "class-validator";
import ListDto from "src/common/dto/list.dto";

export default class GetWalletsDto extends ListDto {
  @IsOptional()
  @Type(() => String)
  @Transform(({ value }) => {
    return value === 'true';
  })
  active?: boolean;
}
