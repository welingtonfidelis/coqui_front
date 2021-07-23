import Router from "next/router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "antd";
import { InputPassword } from "../../components/input";
import { ButtonPrimary } from "../../components/button";
import {
  userStartLoginLoading,
  userStopLoginLoading,
} from "../../store/user/actions";
import { UserReducerInterface } from "../../store/user/model";
import { patchService } from "../../services/apiRequest";

export default function ResetPassword() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const loginInfo = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );

  const handleChangePassword = async (values: any) => {
    dispatch(userStartLoginLoading());

    const authorizationToken = Router.query.token as string;

    console.log(Router.query.token);
    
    const { ok } = await patchService({
      url: "/users/profile/update-reseted-password",
      id: "",
      values: { new_password: values.new_password },
      authorizationToken,
      errorMessage: {
        title: "Falha!",
        message:
          "Houve um problema ao atualizar sua senha. Por favor, " +
          "confirme se a nova possui mínimo de 4 dígitos e tente novamente.",
      },
      successMessage: {
        title: "Sucesso!",
        message: "Sua senha foi atualizada.",
      },
      validationToken: false,
    });

    dispatch(userStopLoginLoading());

    if (!ok) {
      return;
    }

    Router.push("/");
  };

  return (
    <div id="change-password-page">
      <main>
        <img src="/assets/images/logo_transparent.png" alt="Logo" />

        <strong>
          Vamos trocar sua senha.
          <br />
          Insira sua nova senha e confirme-a abaixo.
        </strong>

        <Form onFinish={handleChangePassword} form={form}>
          <Form.Item
            name="new_password"
            rules={[{ required: true, message: "Insira sua nova senha" }]}
          >
            <InputPassword placeholder="Senha" allowClear />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["new_password"]}
            rules={[
              { required: true, message: "Confirme sua nova senha" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Confirme sua nova senha"));
                },
              }),
            ]}
          >
            <InputPassword placeholder="Confirmar senha" allowClear />
          </Form.Item>

          <ButtonPrimary htmlType="submit" loading={loginInfo.loadingLogin}>
            Enviar
          </ButtonPrimary>
        </Form>

        <a onClick={() => Router.replace("/")}>Voltar para o login</a>
      </main>
    </div>
  );
}
