import Router from "next/router";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Form } from "antd";
import { Input } from "../../components/input";
import { UserOutlined } from "@ant-design/icons";
import { ButtonPrimary } from "../../components/button";
import {
  userStartLoginLoading,
  userStopLoginLoading,
} from "../../store/user/actions";
import { UserReducerInterface } from "../../store/user/model";
import { postService } from "../../services/apiRequest";

export default function ResetPassword() {
  const [errorMessage, setErrorMessage] = useState("");

  const dispatch = useDispatch();
  const loginInfo = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );

  const [form] = Form.useForm();

  const handleResetPassword = async (values: any) => {
    dispatch(userStartLoginLoading());

    const { ok } = await postService({
      url: "/users/profile/reset-password",
      values,
      errorMessage: {
        title: "Falha!",
        message:
          "Houve um erro ao efetuar o resete da senha. Por favor, " +
          "confirme se seu usuário ou email estão corretos.",
      },
      successMessage: {
        title: "Sucesso!",
        message:
          "Enviamos um email pra você proseguir com a recuperação de senha. Confira sua caixa de entrada ou spam.",
      },
    });

    dispatch(userStopLoginLoading());

    if (!ok) {
      setErrorMessage("Usuário ou email incorretos");

      return;
    }

    Router.back();
  };

  return (
    <div id="reset-password-page">
      <main>
        <img src="/assets/images/logo_transparent.png" alt="Logo" />

        <strong>
          Vamos recuperar sua senha.
          <br />
          Insira seu usuário ou email abaixo.
        </strong>

        <Form onFinish={handleResetPassword} form={form}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Insira seu usário ou email" }]}
          >
            <Input
              placeholder="Usuário ou email"
              suffix={<UserOutlined />}
              allowClear
            />
          </Form.Item>

          <div className="reset-password-error-message">
            <span>{errorMessage}</span>
          </div>

          <ButtonPrimary htmlType="submit" loading={loginInfo.loadingLogin}>
            Enviar
          </ButtonPrimary>
        </Form>

        <a onClick={() => Router.back()}>Voltar para o login</a>
      </main>
    </div>
  );
}
