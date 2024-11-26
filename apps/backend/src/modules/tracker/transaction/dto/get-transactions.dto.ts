import { Transform, Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import ListDto from "src/common/dto/list.dto";

export default class GetTransactionsDto extends ListDto {
  @IsOptional()
  @IsString()
  address?: string;
}
