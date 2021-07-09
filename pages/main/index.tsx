import React, { useEffect, useState } from "react";
import { Dropdown, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LoadingOutlined, RollbackOutlined } from "@ant-design/icons";
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
import { UserReducerInterface } from "../../store/user/model";
import {
  conversationStartListLoading,
  conversationUpdateList,
} from "../../store/conversation/actions";
import {
  chatUsersStartListLoading,
  chatUsersUpdateList,
} from "../../store/chatUsers/actions";
import { ConversationReducerInterface } from "../../store/conversation/model";
import { ROLES_ENUM } from "../../enums/role";

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
      action: () => setSelectedPage(<ChatPage />),
    },
  ];

  if (userOnReducer.role === ROLES_ENUM.MANAGER || userOnReducer.role === ROLES_ENUM.ADMIN) {
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
    const bodyRef = document.querySelector('body');
    const lightMode = localStorage.getItem(`coqui_theme_light`);
    if(lightMode && lightMode === 'true') bodyRef.classList.toggle('light-mode');

    getUserProfile();
  }, []);

  useEffect(() => {
    if (userOnReducer.id) {
      getConversations();
      getChatUsers();
    }
  }, [userOnReducer]);

  const list = [];
  for (let i = 1; i <= 20; i += 1) {
    list.push({
      id: i,
      name: `Usuário ${i}`,
      profileImage:
        "https://conversa-aqui.s3.sa-east-1.amazonaws.com/user-images/beaver.png",
    });
  }

  const getChatUsers = async () => {
    dispatch(chatUsersStartListLoading());

    dispatch(
      chatUsersUpdateList({
        loadingList: false,
        list,
      })
    );
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

    // const props = {
    //   url: "/users/profile",
    // };

    // const { ok, data } = await getService(props);

    // if (ok) {
    //   dispatch(
    //     userUpdateProfile({
    //       ...data,
    //       ongName: data.ong_name,
    //     })
    //   );
    // }
    //dispatch(userStopProfileLoading());

    setTimeout(() => {
      dispatch(
        userUpdateProfile({
          id: "1",
          name: "Fulaninho Junior Silva Silva",
          email: "fulanojunior@tofu.com.br",
          user: "fulaninhojunior",
          birth: new Date("1990/07/28"),
          companyName: "Tofu Queijos Litd",
          phone: "35999269999",
          address: "Rua central, nº455 bairro fim, Brasília - DF",
          profileImage:
            "https://conversa-aqui.s3.sa-east-1.amazonaws.com/user-images/dog_1.png",
          loadingLogin: false,
          loadingProfile: false,
        })
      );
    }, 2000);
  };

  const handleLogout = () => {
    setShowModal(false);
    dispatch(userLogout());

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
