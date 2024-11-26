import { SetMetadata } from '@nestjs/common';

export const IS_OFF_JWT_ACCESS = 'IS_OFF_JWT_ACCESS';

export const OffJwtAccess = () => SetMetadata(IS_OFF_JWT_ACCESS, true);
