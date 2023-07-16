import { UseGuards, applyDecorators } from '@nestjs/common';

import { Roles } from '../../shared/enums/roles.enum';
import { OnlyAdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';

export const Auth = (role: Roles = Roles.User) =>
  applyDecorators(
    role === Roles.Admin
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard)
  );
