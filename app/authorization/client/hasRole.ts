import { Roles } from '../../models/server/raw';

export const hasRole = (userId: string, roleNames: string | string[], scope: string): Promise<boolean> => {
	roleNames = [].concat(roleNames as []);
	return Roles.isUserInRoles(userId, roleNames, scope);
};
