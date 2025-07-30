import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';

@Injectable()
export class RbacRoleGuard implements CanActivate {
  constructor(private requiredPermission: number) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (this.requiredPermission === 0) {
      return true;
    }

    if (!user || !user.permissions) {
      throw new NotAcceptableException('Permissions denied!');
    }

    const hasPermission = user.permissions.some(
      (permission) => permission === this.requiredPermission,
    );

    if (!hasPermission) {
      throw new NotAcceptableException('Permissions denied!');
    }

    return true;
  }
}
