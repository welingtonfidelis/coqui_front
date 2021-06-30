import { useDispatch, useSelector } from "react-redux";
import { Select } from "../../components/select";
import { ButtonPrimary } from "../../components/button";
import { Input } from "../../components/input";
import { ChatUsersReducerInterface } from "../../store/chatUsers/model";
import {
  ConversationItemReducerInterface,
  ConversationReducerInterface,
} from "../../store/conversation/model";
import { UserReducerInterface } from "../../store/user/model";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { maskTime } from "../../util";

interface ConversationIterface extends ConversationItemReducerInterface {
  userName: string;
  userProfile: string;
}

export default function Chat() {
  const [conversationList, setConversationList] = useState<
    ConversationItemReducerInterface[]
  >([]);
  const [conversationSelected, setConversationSelected] =
    useState<ConversationIterface | null>(null);

  const dispatch = useDispatch();
  const userOnReducer = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );
  const chatUsersOnReducer = useSelector(
    (state: { chatUsers: ChatUsersReducerInterface }) => state.chatUsers
  );
  const conversationOnReducer = useSelector(
    (state: { conversation: ConversationReducerInterface }) =>
      state.conversation
  );

  useEffect(() => {
    setConversationList(conversationOnReducer.list);
  }, [conversationOnReducer]);

  const selectChatUserById = (id: string) => {
    const index = chatUsersOnReducer?.chatUserIdIndex[id];
    const chatUser = chatUsersOnReducer?.list[index];

    return chatUser;
  };

  const searchConversation = (chatUserName: string) => {
    if (chatUserName.length === 0) {
      setConversationList(conversationOnReducer.list);
    } else if (chatUserName.length > 2) {
      const searchChatUsers = chatUsersOnReducer.list.filter((item) =>
        item.name.toLocaleLowerCase().includes(chatUserName.toLocaleLowerCase())
      );

      const newChatUsersList = [];
      searchChatUsers.forEach((item) => {
        const index = conversationOnReducer.conversationIdIndex[item.id];
        if (conversationOnReducer.list[index]) {
          newChatUsersList.push(conversationOnReducer.list[index]);
        } else {
          console.log(":>", item.name);
        }
      });

      setConversationList(newChatUsersList);
    }
  };

  const handleSelectUserChatConversation = (id: string) => {
    const conversationIndex = conversationOnReducer.conversationIdIndex[id];
    const userIndex = chatUsersOnReducer.chatUserIdIndex[id];

    const userName = chatUsersOnReducer.list[userIndex]?.name || "";
    const userProfile = chatUsersOnReducer.list[userIndex]?.profileImage || "";
    setConversationSelected(
      {
        userName,
        userProfile,
        ...conversationOnReducer.list[conversationIndex],
      } || null
    );
  };

  return (
    <div id="chat-page">
      <div className="card-conversation-list">
        <div className="chat-user-search">
          <Input
            placeholder="Usuário"
            onChange={(e) => searchConversation(e.target.value)}
          />
        </div>

        {conversationList.length &&
          conversationList.map((item, index) => {
            const receiverId =
              item.userIdA !== userOnReducer.id ? item.userIdA : item.userIdB;

            const { id, name, profileImage } = selectChatUserById(receiverId);
            let lastMessage = "";
            let lastMessageDate = "";

            if (item.messages.length) {
              lastMessage = item.messages[item.messages.length - 1].text;
              lastMessageDate = maskTime(
                item.messages[item.messages.length - 1].sentTime
              );
            }

            return (
              <div
                className="chat-user-item"
                key={index + ""}
                onClick={() => handleSelectUserChatConversation(receiverId)}
              >
                <div className="chat-user-item-img">
                  <img src={profileImage} alt="userProfile" />
                </div>

                <div className="chat-user-item-name">
                  <strong>{name}</strong>
                  <span className="chat-user-item-last-message-text">
                    {lastMessage}
                  </span>
                </div>

                <div className="chat-user-item-last-message-date">
                  <span>{lastMessageDate}</span>
                  <div />
                </div>
              </div>
            );
          })}
      </div>

      <div className="card-conversation-chat">
        {conversationSelected && (
          <>
            <div className="chat-header">
              <div>
                <img src={conversationSelected.userProfile} alt="userProfile" />
              </div>
              <h3>{conversationSelected.userName}</h3>
            </div>

            <div className="chat-messages">
              {conversationSelected &&
                conversationSelected.messages.map((item, index) => {
                  const className =
                    item.senderId === userOnReducer.id
                      ? "chat-message-sended"
                      : "chat-message-received";
                  return (
                    <div className={className} key={index + ""}>
                      <span>{item.text}</span>
                      <p>{maskTime(item.sentTime)}</p>
                    </div>
                  );
                })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
