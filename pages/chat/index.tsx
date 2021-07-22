import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
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
import { FaPaperPlane, FaChevronDown } from "react-icons/fa";
import { useState } from "react";
import { useEffect } from "react";
import { maskTime } from "../../util";
import { Form } from "antd";
import { OnlineUserListInterface } from "../../store/onlineUser/model";
import { useRef } from "react";
import { getService } from "../../services/apiRequest";
import {
  conversationInsertNewMessagesStartLoading,
  conversationInsertNewMessagesStopLoading,
  conversationInsertOldMessages,
} from "../../store/userConversation/actions";

interface Props {
  socket: Socket;
}

export default function Chat(props: Props) {
  const [scrollToBottom, setScrollToBottom] = useState(false);
  const [selectedChatUser, setSelectedChatUser] =
    useState<ChatUserItemReducerInterface | null>(null);
  const [onlineUser, setOnlineUser] = useState<OnlineUserListInterface>({
    list: {},
  });

  const [form] = Form.useForm();
  const inputRef = useRef<HTMLTextAreaElement>();
  let chatMessageElement: HTMLElement = null;

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

  useEffect(() => {
    if (hasChatMessageElementRef()) {
      setScrollToBottom(false);

      if (chatMessageElement.scrollHeight > chatMessageElement.clientHeight) {
        setScrollToBottom(true);
      }
    }
  }, [
    conversationOnReducer.list[selectedChatUser?.id]?.messages.length,
    chatMessageElement?.scrollHeight,
  ]);

  useEffect(() => {
    if (selectedChatUser) {
      inputRef?.current?.focus();
      form.setFieldsValue({ message: "" });
      handleScrollToBottomChat(false);
    }
  }, [selectedChatUser]);

  const hasChatMessageElementRef = () => {
    if (!chatMessageElement)
      chatMessageElement = document.getElementById("chat-messages");

    return chatMessageElement;
  };

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

      if (socket) {
        socket.emit("send_mesage_to_user", {
          to_user_id: receiverId,
          sent_time: new Date(),
          text: message,
          conversation_id: conversationOnReducer.list[receiverId]?.id,
        });

        form.setFieldsValue({
          message: "",
        });

        setTimeout(() => {
          handleScrollToBottomChat();
        }, 100);
      }

      inputRef?.current?.focus();
    }
  };

  const handleLoadMoreMessage = async (receiverId: string) => {
    dispatch(conversationInsertNewMessagesStartLoading({ receiverId }));

    const { id, pageMessages } = conversationOnReducer.list[receiverId];

    const props = {
      url: `/messages/by-conversation/${id}`,
      page: pageMessages + 1,
      limit: 15,
    };

    const { ok, data } = await getService(props);

    if (ok) {
      const { rows } = data;
      dispatch(
        conversationInsertOldMessages({
          messages: rows.map((message) => ({
            id: message.id,
            conversationId: message.conversation_id,
            fromUserId: message.from_user_id,
            toUserId: message.to_user_id,
            text: message.text,
            sentTime: new Date(message.sent_time),
          })),
          receiverId,
          hasMoreMessages: rows.length > 0,
          pageMessages: pageMessages + 1,
        })
      );
    }

    dispatch(conversationInsertNewMessagesStopLoading({ receiverId }));
  };

  const handleSpecialKeySendMessage = (event: any) => {
    if (event.key === "Enter" && event.ctrlKey) {
      form.submit();
    }
  };

  const handleScrollToBottomChat = (useSmooth: boolean = true) => {
    if (hasChatMessageElementRef()) {
      const config: any = {
        top: chatMessageElement.scrollHeight,
      };

      if (useSmooth) config.behavior = "smooth";

      chatMessageElement.scrollTo(config);

      setScrollToBottom(false);
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

            <div id="chat-messages">
              {conversationOnReducer.list[selectedChatUser.id]
                ?.hasMoreMessages &&
                (conversationOnReducer.list[selectedChatUser.id]
                  .loadingMoreMessages ? (
                  <LoadingOutlined />
                ) : (
                  <div
                    className="chat-messages-load-more"
                    onClick={() => handleLoadMoreMessage(selectedChatUser.id)}
                  >
                    <strong>Carregar mais mensagens</strong>
                  </div>
                ))}

              {conversationOnReducer.list[selectedChatUser.id] &&
                conversationOnReducer.list[selectedChatUser.id].messages.map(
                  (item: MessageItemReducerInterface, index) => {
                    const props = {
                      messageText: item.text,
                      messageSentTime: item.sentTime,
                      sended: item.fromUserId === userOnReducer.id,
                    };
                    return <ChatMessageListItem {...props} key={index + ""} />;
                  }
                )}

              {scrollToBottom && (
                <div
                  className="button-scroll-bottom-chat"
                  title="Novas mensagens"
                  onClick={() => handleScrollToBottomChat()}
                >
                  <FaChevronDown />
                </div>
              )}

              <Form
                onFinish={(e) => handleSendMessage(e, selectedChatUser.id)}
                form={form}
              >
                <Form.Item name="message">
                  <textarea
                    rows={2}
                    placeholder="Digite sua mensagem"
                    ref={inputRef}
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
