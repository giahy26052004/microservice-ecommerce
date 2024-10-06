import { SetMetadata } from '@nestjs/common';
import { UserType } from '../schema/users';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => {
  return SetMetadata(ROLES_KEY, roles);
};
