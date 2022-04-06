import { BaseRaw, IndexSpecification } from './BaseRaw';
import { IIntegrationHistory } from '../../../../definition/IIntegrationHistory';

export class IntegrationHistoryRaw extends BaseRaw<IIntegrationHistory> {
	protected indexes: IndexSpecification[] = [{ key: { _updatedAt: 1 }, expireAfterSeconds: 30 * 24 * 60 * 60 }]; // 30 days

	removeByIntegrationId(integrationId: string): ReturnType<BaseRaw<IIntegrationHistory>['deleteMany']> {
		return this.deleteMany({ 'integration._id': integrationId });
	}

	findOneByIntegrationIdAndHistoryId(integrationId: string, historyId: string): Promise<IIntegrationHistory | null> {
		return this.findOne({ 'integration._id': integrationId, '_id': historyId });
	}
}
