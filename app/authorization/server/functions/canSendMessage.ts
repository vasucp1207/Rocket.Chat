import { canAccessRoomAsync } from './canAccessRoom';
import { hasPermissionAsync } from './hasPermission';
import { Subscriptions, Rooms } from '../../../models/server/raw';
import { RoomMemberActions } from '../../../../definition/IRoomTypeConfig';
import { roomCoordinator } from '../../../../server/lib/rooms/roomCoordinator';
import { IRoom } from '../../../../definition/IRoom';
import { IUser } from '../../../../definition/IUser';

const subscriptionOptions = {
	projection: {
		blocked: 1,
		blocker: 1,
	},
};

export const validateRoomMessagePermissionsAsync = async (
	room: IRoom,
	{ uid, username, type }: { uid: string; username: string; type: string },
	extraData: Record<string, unknown> | undefined,
): Promise<void> => {
	if (!room) {
		throw new Error('error-invalid-room');
	}

	if (type !== 'app' && !(await canAccessRoomAsync(room, { _id: uid, username } as Pick<IUser, '_id'>, extraData))) {
		throw new Error('error-not-allowed');
	}

	if (roomCoordinator.getRoomDirectives(room.t)?.allowMemberAction(room, RoomMemberActions.BLOCK)) {
		const subscription = await Subscriptions.findOneByRoomIdAndUserId(room._id, uid, subscriptionOptions);
		if (subscription && (subscription.blocked || subscription.blocker)) {
			throw new Error('room_is_blocked');
		}
	}

	if (room.ro === true && !(await hasPermissionAsync(uid, 'post-readonly', room._id))) {
		// Unless the user was manually unmuted
		if (!(room.unmuted || []).includes(username)) {
			throw new Error("You can't send messages because the room is readonly.");
		}
	}

	if (room?.muted?.includes(username)) {
		throw new Error('You_have_been_muted');
	}
};

export const canSendMessageAsync = async (
	rid: string,
	{ uid, username, type }: { uid: string; username: string; type: string },
	extraData: Record<string, unknown> | undefined,
): Promise<unknown> => {
	const room = await Rooms.findOneById(rid);
	await validateRoomMessagePermissionsAsync(room, { uid, username, type }, extraData);
	return room;
};

export const canSendMessage = (
	rid: string,
	{ uid, username, type }: { uid: string; username: string; type: string },
	extraData: Record<string, unknown> | undefined,
): unknown => Promise.await(canSendMessageAsync(rid, { uid, username, type }, extraData));
export const validateRoomMessagePermissions = (
	room: IRoom,
	{ uid, username, type }: { uid: string; username: string; type: string },
	extraData: Record<string, unknown> | undefined,
): void => Promise.await(validateRoomMessagePermissionsAsync(room, { uid, username, type }, extraData));
