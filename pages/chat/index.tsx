import { useDispatch, useSelector } from "react-redux";
import { ButtonPrimary } from "../../components/button";
import { Input, InputTextArea } from "../../components/input";
import {
  ChatUserItemReducerInterface,
  ChatUsersReducerInterface,
} from "../../store/chatUsers/model";
import {
  ConversationItemReducerInterface,
  ConversationReducerInterface,
  MessageItemReducerInterface,
} from "../../store/conversation/model";
import { UserReducerInterface } from "../../store/user/model";
import { FaPaperPlane, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { maskTime } from "../../util";
import { Form } from "antd";
import { conversationInsertNewMessages } from "../../store/conversation/actions";

interface ConversationIterface {
  userName: string;
  userProfile: string;
  conversationIndex: number;
}

interface ConversationItem {
  receiverId: string;
  conversationId: number;
  messages: MessageItemReducerInterface[];
}

export default function Chat() {
  const [selectedChatUser, setSelectedChatUser] =
    useState<ChatUserItemReducerInterface | null>(null);

  const [form] = Form.useForm();
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

  const searchConversation = (chatUserName: string) => {
    // if (chatUserName.length === 0) {
    //   setConversationList(conversationOnReducer.list);
    // } else if (chatUserName.length > 2) {
    //   const searchChatUsers = chatUsersOnReducer.list.filter((item) =>
    //     item.name.toLocaleLowerCase().includes(chatUserName.toLocaleLowerCase())
    //   );
    //   const newChatUsersList = [];
    //   searchChatUsers.forEach((item) => {
    //     const index = conversationOnReducer.conversationIdIndex[item.id];
    //     if (conversationOnReducer.list[index]) {
    //       newChatUsersList.push(conversationOnReducer.list[index]);
    //     } else {
    //       console.log(":>", item.name);
    //     }
    //   });
    //   setConversationList(newChatUsersList);
    // }
  };

  const handleSendMessage = (values: any, receiverId: string) => {
    if (values && values.message && values.message.length) {
      const { message } = values;
      const senderId = userOnReducer.id;

      let messageId = 0;
      let conversationId = new Date().getTime();
      if (conversationOnReducer.list[receiverId]) {
        messageId = conversationOnReducer.list[receiverId].messages.length;
        conversationId = conversationOnReducer.list[receiverId].id;
      }
      dispatch(
        conversationInsertNewMessages({
          userId: senderId,
          message: {
            id: messageId,
            conversationId,
            receiverId,
            senderId,
            sentTime: new Date(),
            text: message,
          },
        })
      );

      form.setFieldsValue({
        message: ""
      });
    }
  };

  const handleSpecialKeySendMessage = (event: any) => {
    if (event.key === "Enter" && event.ctrlKey) {
      form.submit();
    }
  };

  const chatUserObjectToList = () => {
    const resp: ChatUserItemReducerInterface[] = [];

    Object.entries(chatUsersOnReducer.list).map((item) => {
      const userInfo = item[1] as ChatUserItemReducerInterface;

      resp.push(userInfo);
    });

    return resp;
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

        {chatUserObjectToList().map((item, index) => {
          const { id, name, profileImage } = item;
          return (
            <div
              className="chat-user-item"
              key={index + ""}
              onClick={() => setSelectedChatUser(item)}
            >
              <div className="chat-user-item-img">
                <img src={profileImage} alt="userProfile" />
              </div>

              <div className="chat-user-item-name">
                <strong>{name}</strong>
                <span className="chat-user-item-last-message-text">
                  {"lastMessage"}
                </span>
              </div>

              <div className="chat-user-item-last-message-date">
                <span>{"lastMessageDate"}</span>
                <div />
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-conversation-chat">
        {selectedChatUser && (
          <>
            <div className="chat-header">
              <div>
                <img src={selectedChatUser.profileImage} alt="userProfile" />
              </div>
              <h3>{selectedChatUser.name}</h3>
            </div>

            <div className="chat-messages">
              {conversationOnReducer.list[selectedChatUser.id] &&
                conversationOnReducer.list[selectedChatUser.id].messages.map(
                  (item: MessageItemReducerInterface, index) =>
                  {
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
                  }
                )}

              <Form
                onFinish={(e) => handleSendMessage(e, selectedChatUser.id)}
                form={form}
              >
                <Form.Item name="message">
                  <InputTextArea
                    placeholder="Digite sua mensagem"
                    allowClear
                    rows={2}
                    onKeyPress={handleSpecialKeySendMessage}
                  />
                </Form.Item>

                <ButtonPrimary htmlType="submit" loading={false}>
                  <FaPaperPlane />
                </ButtonPrimary>
              </Form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
