import { applyDecorators, UseGuards } from '@nestjs/common';
import { OnlyAdminGuard } from '../guards/admin.guard';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { Roles } from '../../shared/enums/roles.enum';

export const Auth = (role: Roles = Roles.User) =>
  applyDecorators(
    role === Roles.Admin
      ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
      : UseGuards(JwtAuthGuard)
  );
