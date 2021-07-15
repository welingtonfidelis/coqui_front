import { useDispatch, useSelector } from "react-redux";
import { ButtonPrimary } from "../../components/button";
import { Socket } from "socket.io-client";
import { Input, InputTextArea } from "../../components/input";
import { ChatUserListItem } from "../../components/chatUserListItem";
import { ChatMessageListItem } from "../../components/chatMessageListItem";
import {
  ChatUserItemReducerInterface,
  ChatUsersReducerInterface,
} from "../../store/chatUsers/model";
import {
  ConversationItemReducerInterface,
  ConversationReducerInterface,
  MessageItemReducerInterface,
} from "../../store/userConversation/model";
import { UserReducerInterface } from "../../store/user/model";
import { FaPaperPlane, FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { maskTime } from "../../util";
import { Form } from "antd";
import { OnlineUserListInterface } from "../../store/onlineUser/model";

interface Props {
  socket: Socket;
}

export default function Chat(props: Props) {
  const [selectedChatUser, setSelectedChatUser] =
    useState<ChatUserItemReducerInterface | null>(null);
  const [onlineUser, setOnlineUser] = useState<OnlineUserListInterface>({
    list: {},
  });

  const [form] = Form.useForm();

  const { socket } = props;
  const dispatch = useDispatch();
  const userOnReducer = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );
  const chatUsersOnReducer = useSelector(
    (state: { chatUsers: ChatUsersReducerInterface }) => state.chatUsers
  );
  const onlineUsersOnReducer = useSelector(
    (state: { onlineUser: OnlineUserListInterface }) => state.onlineUser
  );
  const conversationOnReducer = useSelector(
    (state: { conversation: ConversationReducerInterface }) =>
      state.conversation
  );

  useEffect(() => {
    setOnlineUser(onlineUsersOnReducer);
  }, [onlineUsersOnReducer]);

  const searchConversation = (chatUserName: string) => {
    // if (chatUserName.length === 0) {
    //   setChatUserList(chatUserObjectToList());
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
    //   setChatUserList(newChatUsersList);
    // }
  };

  const handleSendMessage = (values: any, receiverId: string) => {
    if (values && values.message && values.message.length) {
      const { message } = values;

      socket.emit("send_mesage_to_user", {
        to_user_id: receiverId,
        sent_time: new Date(),
        message,
      });

      form.setFieldsValue({
        message: "",
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
          const { id } = item;
          const newMessageCount = conversationOnReducer.list[id]
            ? conversationOnReducer.list[id].newMessage
              ? 1
              : 0
            : 0;

          let lastMessageText = "";
          let lastMessageDate = "";

          if (conversationOnReducer.list[id]) {
            const lengthList =
              conversationOnReducer.list[id].messages.length - 1;
            lastMessageText =
              conversationOnReducer.list[id].messages[lengthList].text;
            lastMessageDate = maskTime(
              conversationOnReducer.list[id].messages[lengthList].sentTime
            );
          }

          const props = {
            user: item,
            newMessageCount,
            onSelect: setSelectedChatUser,
            lastMessageText,
            isSelected: selectedChatUser?.id === id,
            lastMessageDate,
            online: onlineUser.list[item.id],
          };

          return <ChatUserListItem {...props} key={id} />;
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
                  (item: MessageItemReducerInterface, index) => {
                    const props = {
                      messageText: item.text,
                      messageSentTime: item.sentTime,
                      sended: item.senderId === userOnReducer.id,
                    };
                    return <ChatMessageListItem {...props} key={index + ""} />;
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
