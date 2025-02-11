/* eslint-disable complexity */
import { Message as MessageTemplate, MessageLeftContainer, MessageContainer, MessageBody, CheckBox } from '@rocket.chat/fuselage';
import { useToggle } from '@rocket.chat/fuselage-hooks';
import React, { FC, memo } from 'react';

import { IMessage } from '../../../../../definition/IMessage';
import { ISubscription } from '../../../../../definition/ISubscription';
import UserAvatar from '../../../../components/avatar/UserAvatar';
import { useIsMessageHighlight } from '../contexts/MessageHighlightContext';
import { useIsSelecting, useToggleSelect, useIsSelectedMessage, useCountSelected } from '../contexts/SelectedMessagesContext';
import MessageContent from './MessageContent';
import MessageContentIgnored from './MessageContentIgnored';
import MessageHeader from './MessageHeader';
import { MessageIndicators } from './MessageIndicators';
import Toolbox from './Toolbox';

const Message: FC<{ message: IMessage; sequential: boolean; subscription?: ISubscription; id: IMessage['_id'] }> = ({
	message,
	sequential,
	subscription,
	...props
}) => {
	const isMessageHighlight = useIsMessageHighlight(message._id);
	const [isMessageIgnored, toggleMessageIgnored] = useToggle(message.ignored);

	const isSelecting = useIsSelecting();
	const toggleSelected = useToggleSelect(message._id);
	const isSelected = useIsSelectedMessage(message._id);
	useCountSelected();

	return (
		<MessageTemplate
			{...props}
			onClick={isSelecting ? toggleSelected : undefined}
			isSelected={isSelected}
			isEditing={isMessageHighlight}
			// highlight={isMessageHighlight}
			data-qa-editing={isMessageHighlight}
			data-qa-selected={isSelected}
		>
			<MessageLeftContainer>
				{!sequential && message.u.username && !isSelecting && <UserAvatar username={message.u.username} size={'x36'} />}
				{isSelecting && <CheckBox checked={isSelected} onChange={toggleSelected} />}
				{sequential && <MessageIndicators message={message} />}
			</MessageLeftContainer>

			<MessageContainer>
				{!sequential && <MessageHeader message={message} />}

				{!isMessageIgnored && <MessageContent id={message._id} message={message} subscription={subscription} sequential={sequential} />}
				{isMessageIgnored && (
					<MessageBody data-qa-type='message-body'>
						<MessageContentIgnored onShowMessageIgnored={toggleMessageIgnored} />
					</MessageBody>
				)}
			</MessageContainer>
			{!message.private && <Toolbox message={message} />}
		</MessageTemplate>
	);
};

export default memo(Message);
