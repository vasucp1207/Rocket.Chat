import { Roles } from '../../models/server/raw';

export const hasRole = (userId: string, roleNames: string | string[], scope: string): Promise<boolean> => {
	return Roles.isUserInRoles(userId, [].concat(roleNames as []), scope);
};
