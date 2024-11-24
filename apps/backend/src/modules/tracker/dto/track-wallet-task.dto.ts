import { IsNotEmpty, IsString } from "class-validator";

export default class TrackWalletTaskDto {
  @IsNotEmpty()
  @IsString()
  address: string;
}
