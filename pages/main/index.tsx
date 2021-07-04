import React, { useEffect, useState } from "react";
import { Button, Collapse, Dropdown, Form, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { UserOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  FaCommentDots,
  FaBullhorn,
  FaRegUserCircle,
  FaQuestion,
  FaUser,
  FaPowerOff,
} from "react-icons/fa";

import NewsPage from "../news";
import ChatPage from "../chat";
import Router from "next/router";
import { Modal } from "../../components/modal";
import { Menu } from "../../components/menu";
import {
  userLogout,
  userStartProfileLoading,
  userStopProfileLoading,
  userUpdateProfile,
} from "../../store/user/actions";
import { DatePicker } from "../../components/datePicker";
import {
  Input,
  InputMask,
  InputPassword,
  InputTextArea,
} from "../../components/input";
import { getService, patchService } from "../../services/apiRequest";
import { UserReducerInterface } from "../../store/user/model";
import moment from "moment";
import { ButtonPrimary } from "../../components/button";
import {
  conversationStartListLoading,
  conversationUpdateList,
} from "../../store/conversation/actions";
import {
  chatUsersStartListLoading,
  chatUsersUpdateList,
} from "../../store/chatUsers/actions";
import { ConversationItemReducerInterface, ConversationReducerInterface } from "../../store/conversation/model";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState(<NewsPage />);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [formProfile] = Form.useForm();
  const [formProfilePassword] = Form.useForm();

  const dispatch = useDispatch();
  const userInfo = useSelector(
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
      icon: <Badge
        count={conversationOnReducer.countNewMessages} 
        dot
        offset={[5, 10]}
      >
        <FaCommentDots />
      </Badge>,
      action: () => setSelectedPage(<ChatPage />),
    },
  ];

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
    getUserProfile();

  }, []);
  
  useEffect(() => {
    if(userInfo.id) {
      getConversations();
      getChatUsers();
    }
  
  }, [userInfo])

  const list = [];
  for(let i = 1; i <= 20; i += 1) {
    list.push({
      id: i,
      name: `Usuário ${i}`,
      profileImage:
        "https://conversa-aqui.s3.sa-east-1.amazonaws.com/user-images/beaver.png",
    })
  }

  const getChatUsers = async () => {
    dispatch(chatUsersStartListLoading());

    dispatch(
      chatUsersUpdateList({
        loadingList: false,
        list
      })
    );
  };

  const getConversations = async () => {
    dispatch(conversationStartListLoading());

    dispatch(
      conversationUpdateList({
        userId: userInfo.id,
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
                  receiverId: '1',
                  sentTime: new Date(),
                  text: "Oi",
                },
                {
                  id: 2,
                  conversationId: 1,
                  senderId: "2",
                  receiverId: '1',
                  sentTime: new Date(),
                  text: "Me passa o bang lá",
                },
                {
                  id: 3,
                  conversationId: 1,
                  senderId: "1",
                  receiverId: '2',
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
                  receiverId: '1',
                  sentTime: new Date(),
                  text: "Fala doido",
                },
                {
                  id: 5,
                  conversationId: 2,
                  senderId: "3",
                  receiverId: '1',
                  sentTime: new Date(),
                  text: "Eae maluco",
                },
                {
                  id: 6,
                  conversationId: 2,
                  senderId: "1",
                  receiverId: '3',
                  sentTime: new Date(),
                  text: "Vamos sair hoje? Pessoal falou que vai lá no bar do tiagão, podemos ir também",
                },
              ],
            },
          ],
        }

        }
      )
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
    console.log(userInfo);

    formProfile.setFieldsValue({
      ...userInfo,
      birth: moment(userInfo.birth),
    });

    formProfilePassword.setFieldsValue({
      old_password: null,
      new_password: null,
      confirm_password: null,
    });

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
      formProfilePassword.setFieldsValue({
        old_password: null,
        new_password: null,
        confirm_password: null,
      });
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
            trigger={["click"]}
            overlay={<Menu items={userMenuOptions} />}
          >
            {userInfo.loadingProfile ? (
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

      <Modal
        className="modal-profile"
        title="Perfil"
        isVisible={showProfileModal}
        onOk={() => {
          formProfile.submit();
        }}
        onCancel={() => setShowProfileModal(false)}
        confirmLoading={userInfo.loadingProfile}
      >
        <Form onFinish={handleSaveProfile} form={formProfile}>
          <div className="profile-header">
            {userInfo.profileImage ? (
              <img src={userInfo.profileImage} alt="" />
            ) : (
              <UserOutlined />
            )}

            <div className="col">
              <Form.Item name="user">
                <Input disabled title="Usuário" />
              </Form.Item>

              <Form.Item name="email">
                <Input disabled title="Email" />
              </Form.Item>

              <Form.Item name="companyName">
                <Input disabled title="Nome da Empresa" />
              </Form.Item>
            </div>
          </div>

          <div className="profile-main">
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Insira um nome" }]}
            >
              <Input placeholder="Seu nome" title="Seu nome" />
            </Form.Item>

            <div className="col">
              <Form.Item name="phone">
                <InputMask
                  mask="(99) 9 9999-9999"
                  type="tel"
                  placeholder="Seu telefone"
                />
              </Form.Item>

              <Form.Item
                name="birth"
                rules={[{ required: true, message: "Escolha uma data" }]}
              >
                <DatePicker placeholder="Data de nascimento" />
              </Form.Item>
            </div>

            <Form.Item name="address">
              <InputTextArea placeholder="Seu endereço" title="Seu endereço" />
            </Form.Item>
          </div>
        </Form>

        <div className="profile-password">
          <Collapse accordion>
            <Collapse.Panel header="Alterar Senha" key="1">
              <Form onFinish={handleSavePassword} form={formProfilePassword}>
                <Form.Item
                  name="old_password"
                  rules={[
                    { required: true, message: "Insira sua senha atual" },
                  ]}
                >
                  <InputPassword placeholder="Senha atual" />
                </Form.Item>

                <Form.Item
                  name="new_password"
                  rules={[{ required: true, message: "Insira sua nova senha" }]}
                >
                  <InputPassword placeholder="Senha" allowClear />
                </Form.Item>

                <Form.Item
                  name="confirm_password"
                  dependencies={["new_password"]}
                  rules={[
                    { required: true, message: "Confirme sua nova senha" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("new_password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Confirme sua nova senha")
                        );
                      },
                    }),
                  ]}
                >
                  <InputPassword placeholder="Confirmar senha" allowClear />
                </Form.Item>

                <ButtonPrimary
                  onClick={() => formProfilePassword.submit()}
                  loading={userInfo.loadingProfile}
                >
                  Atualizar
                </ButtonPrimary>
              </Form>
            </Collapse.Panel>
          </Collapse>
        </div>
      </Modal>
    </div>
  );
}
