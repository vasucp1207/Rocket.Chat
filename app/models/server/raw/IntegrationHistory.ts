import { Collection } from 'mongodb';
import { BaseRaw, IndexSpecification } from './BaseRaw';
import { IIntegrationHistory } from '../../../../definition/IIntegrationHistory';

type T = IIntegrationHistory;

export class IntegrationHistoryRaw extends BaseRaw<IIntegrationHistory> {
	protected indexes: IndexSpecification[] = [{ key: { _updatedAt: 1 }, expireAfterSeconds: 30 * 24 * 60 * 60 }]; // 30 days

	constructor(public readonly col: Collection<T>, trash?: Collection<T>) {
		super(col, trash);

		this.col.createIndexes(this.indexes);
	}

	removeByIntegrationId(integrationId: string): ReturnType<BaseRaw<IIntegrationHistory>['deleteMany']> {
		return this.deleteMany({ 'integration._id': integrationId });
	}

	findOneByIntegrationIdAndHistoryId(integrationId: string, historyId: string): Promise<IIntegrationHistory | null> {
		return this.findOne({ 'integration._id': integrationId, '_id': historyId });
	}
}
