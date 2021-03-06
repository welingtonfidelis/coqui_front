import { Form, Collapse } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FiSun, FiMoon } from "react-icons/fi";

import { Input, InputMask, InputPassword, InputTextArea } from "../input";
import { Select } from "../select";
import { DatePicker } from "../datePicker";
import { Modal } from "../modal";
import { ButtonPrimary } from "../button";
import { useEffect, useState } from "react";
import moment from "moment";
import { ROLES_ENUM_PTBR } from "../../enums/role";
import { getService } from "../../services/apiRequest";

interface Props {
  id?: string;
  user?: string;
  email?: string;
  name?: string;
  phone?: string;
  birth?: Date;
  address?: string;
  profileImage?: string;
  role?: string;

  isVisible: boolean;
  loading: boolean;

  disableFields?: string[];
  isLoggedUserProfile?: boolean;
  roleList?: { value: string; description: string }[];

  onOk: (item: any) => void;
  onCancel: () => void;
  onChangePassword?: (item: any) => void;
}

export const ModalProfile: React.FC<Props> = (props) => {
  const [lightMode, setLightMode] = useState(false);

  const [formProfile] = Form.useForm();
  const [formProfilePassword] = Form.useForm();
  const url = "/users";

  const roleList =
    props.roleList ||
    Object.entries(ROLES_ENUM_PTBR).map((item) => {
      const [key, value] = item;

      return {
        value: value,
        description: key,
      };
    });

  useEffect(() => {
    if (props.isVisible) {
      formProfile.setFieldsValue({
        ...props,
        birth: moment(props.birth || new Date()),
      });

      if (props.isLoggedUserProfile) {
        const modeIsLight = localStorage.getItem(`coqui_theme_light`) || false;

        setLightMode(modeIsLight && modeIsLight === "true");
      }
    } else clearFormValues();
  }, [props.isVisible]);

  const clearFormValues = () => {
    formProfile.setFieldsValue({
      id: null,
      user: null,
      email: null,
      name: null,
      phone: "",
      birth: null,
      address: null,
      role: null,
      profileImage: null,
    });

    formProfilePassword.setFieldsValue({
      old_password: null,
      new_password: null,
      confirm_password: null,
    });
  };

  const handleChangeTheme = () => {
    setLightMode(!lightMode);

    localStorage.setItem(`coqui_theme_light`, !lightMode + "");

    const bodyRef = document.querySelector("body");
    bodyRef.classList.toggle("light-mode");
  };

  const validateEmailAlreadyInUse = async (event) => {
    if (formProfile.getFieldValue("email") && !formProfile.getFieldError("email").length) {
      const email = event.target.value;
      const requestProps = {
        url: `${url}/email/${email}`,
        id: props.id || null
      }

      const { ok, data } = await getService(requestProps);

      if (ok && data) {
        formProfile.setFields([
          {
            name: "email",
            errors: [...formProfile.getFieldError("email"), "Email j?? em uso"],
          },
        ]);
      }
    }
  };

  const validateUserAlreadyInUse = async (event) => {
    if (formProfile.getFieldValue("user") && !formProfile.getFieldError("user").length) {
      const user = event.target.value;
      const requestProps = {
        url: `${url}/user/${user}`,
        id: props.id || null
      }

      const { ok, data } = await getService(requestProps);

      if (ok && data) {
        formProfile.setFields([
          {
            name: "user",
            errors: [...formProfile.getFieldError("user"), "Usu??rio j?? em uso"],
          },
        ]);
      }
    }
  };

  return (
    <Modal
      className="modal-profile"
      title="Perfil"
      isVisible={props.isVisible}
      onOk={() => {
        formProfile.submit();
      }}
      onCancel={props.onCancel}
      confirmLoading={props.loading}
    >
      <Form onFinish={props.onOk} form={formProfile}>
        <div className="profile-header">
          {props.profileImage ? (
            <img src={props.profileImage} alt="" />
          ) : (
            <UserOutlined />
          )}

          <div className="col">
            <Form.Item
              name="user"
              rules={[{ required: true, message: "Insira um usu??rio" }]}
            >
              <Input
                disabled={
                  props.disableFields && props.disableFields.includes("user")
                }
                placeholder="Usu??rio"
                title="Usu??rio"
                onBlur={validateUserAlreadyInUse}
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Insira um email v??lido",
                  type: "email",
                },
              ]}
            >
              <Input
                disabled={
                  props.disableFields && props.disableFields.includes("email")
                }
                placeholder="Email"
                title="Email"
                onBlur={validateEmailAlreadyInUse}
              />
            </Form.Item>

            <Form.Item
              name="role"
              rules={[{ required: true, message: "Escolha um perfil" }]}
            >
              <Select
                disabled={
                  props.disableFields && props.disableFields.includes("role")
                }
                placeholder="Perfil"
                loading={false}
                list={roleList}
              />
            </Form.Item>
          </div>
        </div>

        <div className="profile-main">
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Insira um nome" }]}
          >
            <Input
              disabled={
                props.disableFields && props.disableFields.includes("name")
              }
              placeholder="Seu nome"
              title="Seu nome"
            />
          </Form.Item>

          <div className="col">
            <Form.Item name="phone">
              <InputMask
                disabled={
                  props.disableFields && props.disableFields.includes("phone")
                }
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
            <InputTextArea
              disabled={
                props.disableFields && props.disableFields.includes("birth")
              }
              placeholder="Seu endere??o"
              title="Seu endere??o"
            />
          </Form.Item>
        </div>
      </Form>

      {props.onChangePassword && (
        <div className="profile-password">
          <Collapse accordion>
            <Collapse.Panel header="Alterar Senha" key="1">
              <Form
                onFinish={props.onChangePassword}
                form={formProfilePassword}
              >
                <Form.Item
                  name="old_password"
                  rules={[
                    { required: true, message: "Insira sua senha atual" },
                  ]}
                >
                  <InputPassword
                    disabled={
                      props.disableFields &&
                      props.disableFields.includes("old_password")
                    }
                    placeholder="Senha atual"
                  />
                </Form.Item>

                <Form.Item
                  name="new_password"
                  rules={[{ required: true, message: "Insira sua nova senha" }]}
                >
                  <InputPassword
                    disabled={
                      props.disableFields &&
                      props.disableFields.includes("new_password")
                    }
                    placeholder="Senha"
                    allowClear
                  />
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
                  <InputPassword
                    disabled={
                      props.disableFields &&
                      props.disableFields.includes("confirm_password")
                    }
                    placeholder="Confirmar senha"
                    allowClear
                  />
                </Form.Item>

                <ButtonPrimary
                  onClick={() => formProfilePassword.submit()}
                  loading={props.loading}
                >
                  Atualizar
                </ButtonPrimary>
              </Form>
            </Collapse.Panel>
          </Collapse>

          {props.isLoggedUserProfile && (
            <div className="profile-mode-theme" onClick={handleChangeTheme}>
              {lightMode ? <FiMoon /> : <FiSun />}
              <span>
                Alterar para o{" "}
                <strong>modo {lightMode ? "escuro" : "claro"}</strong>
              </span>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};
