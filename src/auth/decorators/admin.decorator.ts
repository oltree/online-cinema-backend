import { UseGuards, applyDecorators } from '@nestjs/common';

import { Roles } from '@/shared/enums/roles.enum';

import { JwtAuthGuard, OnlyAdminGuard } from '../guards';

export const Auth = (role: Roles = Roles.User) =>
  applyDecorators(
    role === Roles.Admin
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard)
  );
