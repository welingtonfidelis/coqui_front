import { maskTime } from "../../util";

interface Props {
  messageText: string;
  messageSentTime: Date | null;
  sended: boolean;
}

export const ChatMessageListItem: React.FC<Props> = (props) => {
  const { messageText, messageSentTime, sended } = props;
  const classContent = sended ? "chat-message-list-item-sended" : "chat-message-list-item-received";

  return (
    <div className={classContent}>
      <span>{messageText ? messageText : ''}</span>
      <p>{messageSentTime ? maskTime(messageSentTime) : ''}</p>
    </div>
  );
};
