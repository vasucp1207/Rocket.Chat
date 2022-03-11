import { Meteor } from 'meteor/meteor';

import { hasPermission } from '../../../../authorization/server';
import { IntegrationHistory, Integrations } from '../../../../models/server/raw';

Meteor.methods({
	async deleteOutgoingIntegration(integrationId) {
		let integration;

		const uid = this.userId;
		if (!uid) return;

		if (hasPermission(uid, 'manage-outgoing-integrations') || hasPermission(uid, 'manage-outgoing-integrations', 'bot')) {
			integration = Integrations.findOneById(integrationId);
		} else if (hasPermission(uid, 'manage-own-outgoing-integrations') || hasPermission(uid, 'manage-own-outgoing-integrations', 'bot')) {
			integration = Integrations.findOne({
				'_id': integrationId,
				'_createdBy._id': this.userId,
			});
		} else {
			throw new Meteor.Error('not_authorized', 'Unauthorized', {
				method: 'deleteOutgoingIntegration',
			});
		}

		if (!integration) {
			throw new Meteor.Error('error-invalid-integration', 'Invalid integration', {
				method: 'deleteOutgoingIntegration',
			});
		}

		await Integrations.removeById(integrationId);
		await IntegrationHistory.removeByIntegrationId(integrationId);

		return true;
	},
});
