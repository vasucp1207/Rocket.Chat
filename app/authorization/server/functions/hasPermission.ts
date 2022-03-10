import { Authorization } from '../../../../server/sdk';

export const hasAllPermissionAsync = async (userId: string, permissions: string[], scope: string): Promise<boolean> =>
	Authorization.hasAllPermission(userId, permissions, scope);
export const hasPermissionAsync = async (userId: string, permissionId: string, scope: string): Promise<boolean> =>
	Authorization.hasPermission(userId, permissionId, scope);
export const hasAtLeastOnePermissionAsync = async (userId: string, permissions: string[], scope: string): Promise<boolean> =>
	Authorization.hasAtLeastOnePermission(userId, permissions, scope);

export const hasAllPermission = (userId: string, permissions: string[], scope: string): boolean =>
	Promise.await(hasAllPermissionAsync(userId, permissions, scope));
export const hasPermission = (userId: string, permissionId: string, scope: string): boolean =>
	Promise.await(hasPermissionAsync(userId, permissionId, scope));
export const hasAtLeastOnePermission = (userId: string, permissions: string[], scope: string): boolean =>
	Promise.await(hasAtLeastOnePermissionAsync(userId, permissions, scope));
