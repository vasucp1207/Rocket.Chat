import {
	MessageHeader as MessageHeaderTemplate,
	MessageName,
	MessageTimestamp,
	MessageUsername,
	MessageStatusPrivateIndicator,
} from '@rocket.chat/fuselage';
import React, { FC, memo } from 'react';

import { IMessage } from '../../../../../definition/IMessage';
import { useTranslation } from '../../../../contexts/TranslationContext';
import { useUserData } from '../../../../hooks/useUserData';
import { getUserDisplayName } from '../../../../lib/getUserDisplayName';
import { UserPresence } from '../../../../lib/presence';
import { useMessageActions } from '../../contexts/MessageContext';
import { useMessageListShowUsername, useMessageListShowRealName, useMessageListShowRoles } from '../contexts/MessageListContext';
import { useMessageRoles } from '../hooks/useMessageRoles';
import { MessageIndicators } from './MessageIndicators';
import RolesList from './MessageRolesList';

const MessageHeader: FC<{ message: IMessage }> = ({ message }) => {
	const t = useTranslation();
	const {
		actions: { openUserCard },
		formatters,
	} = useMessageActions();

	const showRealName = useMessageListShowRealName();
	const user: UserPresence = { ...message.u, roles: [], ...useUserData(message.u._id) };
	const usernameAndRealNameAreSame = !user.name || user.username === user.name;
	const showUsername = useMessageListShowUsername() && showRealName && !usernameAndRealNameAreSame;

	const showRoles = useMessageListShowRoles();
	const roles = useMessageRoles(message.u._id, message.rid, showRoles);
	const shouldShowRolesList = roles.length > 0;

	return (
		<MessageHeaderTemplate>
			<MessageName
				title={!showUsername && !usernameAndRealNameAreSame ? `@${user.username}` : undefined}
				data-username={user.username}
				onClick={user.username !== undefined ? openUserCard(user.username) : undefined}
			>
				{getUserDisplayName(user.name, user.username, showRealName)}
			</MessageName>
			{showUsername && (
				<MessageUsername data-username={user.username} onClick={user.username !== undefined ? openUserCard(user.username) : undefined}>
					@{user.username}
				</MessageUsername>
			)}

			{shouldShowRolesList && <RolesList roles={roles} isBot={message.bot} />}
			<MessageTimestamp title={formatters.dateAndTime(message.ts)}>{formatters.time(message.ts)}</MessageTimestamp>
			{message.private && (
				// The MessageStatusPrivateIndicator component should not have name prop, it should be fixed on fuselage
				<MessageStatusPrivateIndicator name='message'>{t('Only_you_can_see_this_message')}</MessageStatusPrivateIndicator>
			)}
			<MessageIndicators message={message} />
		</MessageHeaderTemplate>
	);
};

export default memo(MessageHeader);
