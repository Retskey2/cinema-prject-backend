import { TypeRole } from '../auth.interface'
import { applyDecorators, UseGuards } from '@nestjs/common'
import { JwtAuthGuards } from '../guards/jwt.guards'
import { OnlyAdminGuard } from '../guards/admin.guards'

export const Auth = (role: TypeRole = 'user') =>
  applyDecorators(role === 'admin'
    ? UseGuards(JwtAuthGuards, OnlyAdminGuard)
    : UseGuards(JwtAuthGuards),
  )