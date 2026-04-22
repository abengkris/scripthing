/**
 * TODO: Prisma layer is currently disabled due to architecture incompatibility
 * with Prisma's pre-compiled binaries on Termux ARM64.
 * This service layer should eventually integrate with Prisma ORM.
 */
export interface BaseService {
  [key: string]: unknown;
}
