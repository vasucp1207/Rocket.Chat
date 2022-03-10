export const getSettingPermissionId = function (settingId: string): string {
	// setting-based permissions
	return `change-setting-${settingId}`;
};

export const CONSTANTS = {
	SETTINGS_LEVEL: 'settings',
};

export { AuthorizationUtils } from './AuthorizationUtils';
