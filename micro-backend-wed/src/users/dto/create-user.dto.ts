import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserType } from 'src/shared/schema/users';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn([UserType.ADMIN, UserType.CUSTOMER])
  type: string;

  @IsNotEmpty()
  @IsOptional()
  secretToken?: string | null;

  isVerified?: boolean;
}
