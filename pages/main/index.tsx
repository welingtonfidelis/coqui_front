import React, { useEffect, useState } from "react";
import { Dropdown, Badge } from "antd";
import { Socket } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined } from "@ant-design/icons";
import {
  FaCommentDots,
  FaBullhorn,
  FaRegUserCircle,
  FaQuestion,
  FaUser,
  FaRegUser,
  FaPowerOff,
  FaRegNewspaper,
} from "react-icons/fa";

import NewsPage from "../news";
import NewsEditPage from "../news-edit";
import ChatPage from "../chat";
import SystemUserPage from "../system-user";
import Router from "next/router";
import { Modal } from "../../components/modal";
import { ModalProfile } from "../../components/modalProfile";
import { Menu } from "../../components/menu";
import {
  userLogout,
  userStartProfileLoading,
  userStopProfileLoading,
  userUpdateProfile,
} from "../../store/user/actions";
import { getService, patchService } from "../../services/apiRequest";
import { socket as SocketInstance } from "../../services/socket";
import { UserReducerInterface } from "../../store/user/model";
import {
  conversationInsertNewMessages,
  conversationStartListLoading,
  conversationUpdateId,
  conversationUpdateList,
} from "../../store/userConversation/actions";
import {
  addChatUser,
  chatUsersStartListLoading,
  chatUsersStopListLoading,
  chatUsersUpdateList,
  removeChatUser,
} from "../../store/chatUsers/actions";
import { ConversationReducerInterface } from "../../store/userConversation/model";
import { ROLES_ENUM } from "../../enums/role";
import {
  addOnlineUser,
  removeOnlineUser,
  updateOnlineUserList,
} from "../../store/onlineUser/actions";
import { EventEmitter } from "events";
import { startEventEmitter } from "../../services/auth";
import { conversationStopListLoading } from "../../store/groupConversation/actions";

let socket: Socket = null;

export default function Home() {
  const [selectedPage, setSelectedPage] = useState(<NewsPage />);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [socketStatusClass, setSocketStatusClass] = useState(
    "socket-disconnected"
  );

  const eventEmitter = new EventEmitter();
  const dispatch = useDispatch();
  const userOnReducer = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );
  const conversationOnReducer = useSelector(
    (state: { conversation: ConversationReducerInterface }) =>
      state.conversation
  );

  const menuOptions = [
    {
      title: "Notícias",
      icon: <FaBullhorn />,
      action: () => setSelectedPage(<NewsPage />),
    },
    {
      title: "Chat",
      icon: (
        <Badge
          count={conversationOnReducer.countNewMessages}
          dot
          offset={[5, 10]}
        >
          <FaCommentDots />
        </Badge>
      ),
      action: () => setSelectedPage(<ChatPage socket={socket} />),
    },
  ];

  if (
    userOnReducer.role === ROLES_ENUM.MANAGER ||
    userOnReducer.role === ROLES_ENUM.ADMIN
  ) {
    menuOptions.push(
      {
        title: "Usuários",
        icon: <FaRegUser />,
        action: () => setSelectedPage(<SystemUserPage socket={socket} />),
      },
      {
        title: "Editar Notícias",
        icon: <FaRegNewspaper />,
        action: () => setSelectedPage(<NewsEditPage />),
      }
    );
  }

  const userMenuOptions = [
    {
      title: "Perfil",
      icon: <FaUser />,
      action: () => handleOpenProfile(),
    },
    {
      title: "Suporte",
      icon: <FaQuestion />,
      action: () => Router.push("/contact"),
    },
    {
      title: "Sair do sistema",
      icon: <FaPowerOff />,
      action: () => setShowModal(true),
      danger: true,
    },
  ];

  eventEmitter.on("socket:disconnect", () => {
    if (socket) socket.disconnect();
  });

  useEffect(() => {
    const bodyRef = document.querySelector("body");
    const lightMode = localStorage.getItem(`coqui_theme_light`);
    if (lightMode && lightMode === "true")
      bodyRef.classList.toggle("light-mode");

    startEventEmitter(eventEmitter);

    socketConnect();

    getUserProfile();

    getChatUsers();
  }, []);

  useEffect(() => {
    getConversations();
  }, [userOnReducer.id]);

  const getChatUsers = async () => {
    dispatch(chatUsersStartListLoading());

    const props = {
      url: "/users/chat",
    };

    const { ok, data } = await getService(props);

    if (ok) {
      dispatch(
        chatUsersUpdateList({
          loadingList: false,
          list: data.rows.map((item) => ({
            ...item,
            profileImage: item.profile_image,
          })),
        })
      );
    }

    dispatch(chatUsersStopListLoading());
  };

  const getConversations = async () => {
    dispatch(conversationStartListLoading());

    const props = {
      url: "/conversations/by-token",
      message_page: 1,
      message_limit: 15,
    };

    const { ok, data } = await getService(props);

    if (ok) {
      dispatch(
        conversationUpdateList({
          userId: userOnReducer.id,
          conversationList: {
            loadingList: false,
            list: data.rows.map((item) => ({
              id: item.id,
              userIdA: item.user_id_a,
              userIdB: item.user_id_b,
              hasMoreMessages: item.messages.count > item.messages.rows.length,
              loadingMoreMessages: false,
              pageMessages: 1,
              limitPerPageMessages: 10,
              messages: item.messages.rows.map((message) => ({
                id: message.id,
                conversationId: message.conversation_id,
                fromUserId: message.from_user_id,
                toUserId: message.to_user_id,
                text: message.text,
                sentTime: new Date(message.sent_time),
              })),
              createdAt: new Date(item.created_at),
            })),
          },
        })
      );
    }

    dispatch(conversationStopListLoading());
  };

  const getUserProfile = async () => {
    dispatch(userStartProfileLoading());

    const props = {
      url: "/users/profile",
    };

    const { ok, data } = await getService(props);

    if (ok) {
      dispatch(
        userUpdateProfile({ ...data, profileImage: data.profile_image })
      );
    }
    dispatch(userStopProfileLoading());
  };

  let countMessageId = 0;
  const socketConnect = () => {
    socket = SocketInstance.connect();

    socket.on("connect", () => {
      setSocketStatusClass("socket-connected");
    });

    socket.on("disconnect", function () {
      setSocketStatusClass("socket-disconnected");
    });

    socket.on("online_user_list", (data) => {
      dispatch(updateOnlineUserList(data));
    });

    socket.on("online_user", (data) => {
      dispatch(addOnlineUser(data));
    });

    socket.on("offline_user", (data) => {
      dispatch(removeOnlineUser(data));
    });

    socket.on("new_user", (data) => {
      dispatch(addChatUser({ ...data, profileImage: data.profile_image }));
    });

    socket.on("deleted_user", (data) => {
      if (data.id === userOnReducer.id) handleLogout();

      dispatch(removeChatUser(data));
    });

    socket.on("receive_message_from_user", (data) => {
      const { conversation_id, from_user_id, to_user_id, text, sent_time } =
        data;

      const receiverId =
        from_user_id !== userOnReducer.id ? from_user_id : to_user_id;

      if (!conversationOnReducer.list[receiverId]?.id && conversation_id) {
        dispatch(
          conversationUpdateId({
            receiverId,
            conversationId: conversation_id,
          })
        );
      }

      dispatch(
        conversationInsertNewMessages({
          userId: userOnReducer.id,
          message: {
            id: countMessageId,
            conversationId: conversation_id,
            toUserId: to_user_id,
            fromUserId: from_user_id,
            sentTime: new Date(sent_time),
            text,
          },
        })
      );

      countMessageId += 1;
    });

    socket.on("new_conversation", (data) => {
      const { id, user_id_a, user_id_b } = data;

      const receiverId =
        user_id_a !== userOnReducer.id ? user_id_a : user_id_b;

      dispatch(
        conversationUpdateId({
          receiverId,
          conversationId: id,
        })
      );
    });
  };

  const handleLogout = () => {
    setShowModal(false);
    dispatch(userLogout());

    if (socket) socket.disconnect();

    Router.replace("/");
  };

  const handleOpenProfile = () => {
    setShowProfileModal(true);
  };

  const handleSaveProfile = async (values: any) => {
    dispatch(userStartProfileLoading());

    const { ok } = await patchService({
      url: "users/profile",
      id: "",
      values: {
        birth: new Date(values.birth),
        name: values.name,
        phone: values.phone,
        address: values.address,
      },
    });

    if (ok) dispatch(userUpdateProfile({ loadingProfile: false, ...values }));

    dispatch(userStopProfileLoading());
  };

  const handleSavePassword = async (values: any) => {
    dispatch(userStartProfileLoading());

    const { ok } = await patchService({
      url: "users/profile/update-password",
      id: "",
      values: {
        old_password: values.old_password,
        new_password: values.new_password,
      },
      successMessage: {
        title: "Sucesso!",
        message: "Sua senha foi atualizada com sucesso.",
      },
      errorMessage: {
        title: "Falha!",
        message:
          "Houve um problema ao atualizar sua senha. Por favor, " +
          "confirme se sua senha atual está correta, se a nova possui mínimo de " +
          "4 dígitos e tente novamente.",
      },
      validationToken: false,
    });

    if (ok) {
    }

    dispatch(userStopProfileLoading());
  };

  return (
    <div id="main-page">
      <nav>
        <img src="/assets/images/logo_transparent.png" alt="Logo" />

        <Menu
          defaultSelectedKeys={["1"]}
          mode="inline"
          inlineCollapsed={true}
          items={menuOptions}
        />
      </nav>

      <main>
        <div className="page-header">
          <div className={`outer-circle-profile ${socketStatusClass}`}>
            <div className="inner-circle-profile">
              <Dropdown
                disabled={userOnReducer.loadingProfile}
                trigger={["click"]}
                overlay={<Menu items={userMenuOptions} />}
              >
                {userOnReducer.loadingProfile ? (
                  <LoadingOutlined />
                ) : (
                  <FaRegUserCircle />
                )}
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="page-container">{selectedPage}</div>
      </main>

      <Modal
        title="Sair do sistema"
        okText="Sim"
        cancelText="Não"
        isVisible={showModal}
        onOk={handleLogout}
        onCancel={() => setShowModal(false)}
      >
        Deseja realmente sair do sistema?
      </Modal>

      <ModalProfile
        isVisible={showProfileModal}
        loading={userOnReducer.loadingProfile}
        onCancel={() => setShowProfileModal(false)}
        onOk={handleSaveProfile}
        onChangePassword={handleSavePassword}
        disableFields={["user", "email", "role"]}
        isLoggedUserProfile={true}
        {...userOnReducer}
      />
    </div>
  );
}
