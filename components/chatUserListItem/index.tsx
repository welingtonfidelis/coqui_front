import { Badge } from "antd";
import { ChatUserItemReducerInterface } from "../../store/chatUsers/model";

interface Props {
  user: ChatUserItemReducerInterface;
  newMessageCount: number;
  isSelected: boolean;
  onSelect: (item: any) => void;
  lastMessageText: string;
  lastMessageDate: string;
}

export const ChatUserListItem: React.FC<Props> = (props) => {
  const { id, name, profileImage } = props.user;
  const { lastMessageText, lastMessageDate, newMessageCount, onSelect, isSelected } = props;
  const classContent = `chat-user-list-item ${isSelected ? 'chat-user-list-item-selected' : ''}`;

  return (
    <div className={classContent} onClick={() => onSelect(props.user)}>
      <div className="chat-user-list-item-img">
        <Badge dot count={newMessageCount}>
          <img src={profileImage} alt="userProfile" />
        </Badge>
      </div>

      <div className="chat-user-list-item-name">
        <strong>{name}</strong>
        <span className="chat-user-list-item-last-message-text">
          {lastMessageText}
        </span>
      </div>

      <div className="chat-user-list-item-last-message-date">
        <span>{lastMessageDate}</span>
        <div />
      </div>
    </div>
  );
};
