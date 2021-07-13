import { Badge } from "antd";
import { ChatUserItemReducerInterface } from "../../store/chatUsers/model";

interface Props {
  user: ChatUserItemReducerInterface;
  newMessageCount: number;
  isSelected: boolean;
  onSelect: (item: any) => void;
  lastMessageText: string;
  lastMessageDate: string;
  online: boolean;
}

export const ChatUserListItem: React.FC<Props> = (props) => {
  const { id, name, profileImage } = props.user;
  const {
    lastMessageText,
    lastMessageDate,
    newMessageCount,
    onSelect,
    isSelected,
    online,
  } = props;
  const classContent = `chat-user-list-item ${
    isSelected ? "chat-user-list-item-selected" : ""
  }`;
  const classImage = `chat-user-list-item-img ${
    online ? "chat-user-list-item-online" : "chat-user-list-item-offline"
  }`;

  return (
    <div className={classContent} onClick={() => onSelect(props.user)}>
      <div className={classImage}>
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
