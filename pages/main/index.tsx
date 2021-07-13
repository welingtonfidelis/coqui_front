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
  conversationUpdateList,
} from "../../store/conversation/actions";
import {
  chatUsersStartListLoading,
  chatUsersUpdateList,
} from "../../store/chatUsers/actions";
import { ConversationReducerInterface } from "../../store/conversation/model";
import { ROLES_ENUM } from "../../enums/role";
import { addOnlineUser, removeOnlineUser, updateOnlineUserList } from "../../store/onlineUser/actions";

let socket: Socket = null;

export default function Home() {
  const [selectedPage, setSelectedPage] = useState(<NewsPage />);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

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
      action: () => setSelectedPage(<ChatPage socket={socket}/>),
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
        action: () => setSelectedPage(<SystemUserPage />),
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

  useEffect(() => {
    const bodyRef = document.querySelector("body");
    const lightMode = localStorage.getItem(`coqui_theme_light`);
    if (lightMode && lightMode === "true")
      bodyRef.classList.toggle("light-mode");

    socketConnect();

    getUserProfile();

    getChatUsers();
    // if (userOnReducer.name) {
    //   getConversations();
    // }
  }, []);

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
          list: data.rows.map(item => ({ ...item, profileImage: item.profile_image })),
        })
      );
    }
  };

  const getConversations = async () => {
    dispatch(conversationStartListLoading());

    dispatch(
      conversationUpdateList({
        userId: userOnReducer.id,
        conversationList: {
          loadingList: false,
          list: [
            {
              id: 1,
              userIdA: "1",
              userIdB: "2",
              newMessage: true,
              messages: [
                {
                  id: 1,
                  conversationId: 1,
                  senderId: "2",
                  receiverId: "1",
                  sentTime: new Date(),
                  text: "Oi",
                },
                {
                  id: 2,
                  conversationId: 1,
                  senderId: "2",
                  receiverId: "1",
                  sentTime: new Date(),
                  text: "Me passa o bang lá",
                },
                {
                  id: 3,
                  conversationId: 1,
                  senderId: "1",
                  receiverId: "2",
                  sentTime: new Date(),
                  text: "Ta bem, segura ai",
                },
              ],
            },
            {
              id: 2,
              userIdA: "3",
              userIdB: "1",
              newMessage: true,
              messages: [
                {
                  id: 4,
                  conversationId: 2,
                  senderId: "3",
                  receiverId: "1",
                  sentTime: new Date(),
                  text: "Fala doido",
                },
                {
                  id: 5,
                  conversationId: 2,
                  senderId: "3",
                  receiverId: "1",
                  sentTime: new Date(),
                  text: "Eae maluco",
                },
                {
                  id: 6,
                  conversationId: 2,
                  senderId: "1",
                  receiverId: "3",
                  sentTime: new Date(),
                  text: "Vamos sair hoje? Pessoal falou que vai lá no bar do tiagão, podemos ir também",
                },
              ],
            },
          ],
        },
      })
    );
  };

  const getUserProfile = async () => {
    dispatch(userStartProfileLoading());

    const props = {
      url: "/users/profile",
    };

    const { ok, data } = await getService(props);
    
    if (ok) {
      dispatch(
        userUpdateProfile(data)
      );
    }
    dispatch(userStopProfileLoading());
  };

  let countMessageId = 0;
  const socketConnect = () => {
    socket = SocketInstance.connect(userOnReducer.token);

    socket.on("connect", () => {
      console.log("connected in socket", socket);
    });
    
    socket.on("online_user_list", data => {
      dispatch(updateOnlineUserList(data));
    });

    socket.on("online_user", data => {
      dispatch(addOnlineUser(data));
    });

    socket.on("offline_user", data => {
      dispatch(removeOnlineUser(data));
    });

    socket.on("receive_message_from_user", data => {
      const { from_user_id, to_user_id, message, sent_time } = data;

      dispatch(
        conversationInsertNewMessages({
          userId: userOnReducer.id,
          message: {
            id: countMessageId,
            conversationId: 1,
            receiverId: to_user_id,
            senderId: from_user_id,
            sentTime: new Date(sent_time),
            text: message,
          },
        })
      );

      countMessageId += 1;
    });
    
    socket.on("new_room", data => {
      console.log('new room', data);
    });

  };

  const handleLogout = () => {
    setShowModal(false);
    dispatch(userLogout());

    if(socket) socket.disconnect();

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
        disableFields={["user", "email"]}
        isLoggedUserProfile={true}
        {...userOnReducer}
      />
    </div>
  );
}
