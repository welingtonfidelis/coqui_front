import { useDispatch, useSelector } from "react-redux";
import { Select } from "../../components/select";
import { ButtonPrimary } from "../../components/button";
import { Input } from "../../components/input";
import { ChatUsersReducerInterface } from "../../store/chatUsers/model";
import { ConversationItemReducerInterface, ConversationReducerInterface } from "../../store/conversation/model";
import { UserReducerInterface } from "../../store/user/model";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";

export default function Chat() {
  const [conversationList, setConversationList] = useState<ConversationItemReducerInterface[]>([]);
  const [conversationSelected, setConversationSelected] = useState<ConversationItemReducerInterface | null>(null);

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
    const index = conversationOnReducer.conversationIdIndex[id];

    setConversationSelected(conversationOnReducer.list[index] || null)
  }

  return (
    <div id="chat-page">
      <div className="card-conversation-list">
        <div className="chat-user-search">
          <Input
            placeholder="Usuário"
            onChange={(e) => searchConversation(e.target.value)}
          />
        </div>

        {conversationList.length && conversationList.map((item, index) => {
          
          const receiverId =
          item.userIdA !== userOnReducer.id ? item.userIdA : item.userIdB;

          const { id, name, profileImage } = selectChatUserById(receiverId);
          const lastMessage = item.messages[0]?.text;
          const lastMessageDate = item.messages[0].sentTime;

          return (
            <div className="chat-user-item" key={index + ''} onClick={() => handleSelectUserChatConversation(receiverId)}>
              <div className="chat-user-item-img">
                <img src={profileImage} alt="" />
              </div>
              
              <div className="chat-user-item-name">
                <strong>{name}</strong>
                <span className="chat-user-item-last-message-text">Nova conversa</span>
              </div>

              <div className="chat-user-item-last-message-date">
                <span>09:25</span>
                <div/>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-conversation-chat">
        {conversationSelected && conversationSelected.messages.map((item, index) => {
          return <div key={index + ''}>
            {item.text}
          </div>
        })}
      </div>
    </div>
  );
}
