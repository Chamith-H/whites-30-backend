import { UseGuards } from '@nestjs/common';
import { RbacRoleGuard } from '../guards/rbac-role.guard';

export const Access = (permission: number) => {
  return UseGuards(new RbacRoleGuard(permission));
};
