import { Form } from "antd";
import Router from "next/router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventEmitter } from "stream";
import { postService } from "../../services/apiRequest";
import {
  userLogin,
  userStartLoginLoading,
  userStopLoginLoading,
} from "../../store/user/actions";
import { UserReducerInterface } from "../../store/user/model";

import { InputPassword } from "../input";
import { Modal } from "../modal";

interface Props {
  isVisible: boolean;

  onOk: () => void;
  onCancel: () => void;
  eventEmitter: EventEmitter;
}

export const ModalRefreshToken: React.FC<Props> = (props) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const userInfo = useSelector(
    (state: { user: UserReducerInterface }) => state.user
  );

  useEffect(() => {
    if (!props.isVisible) clearFormValues();
  }, [props.isVisible]);

  const clearFormValues = () => {
    form.setFieldsValue({
      password: null,
    });
  };

  const handleRefreshToken = async () => {
    dispatch(userStartLoginLoading());

    const requestProps = {
      url: "users/login/refresh-token",
      values: { password: form.getFieldValue("password") },
      errorMessage: {
        title: "Falha!",
        message:
          "Houve um erro ao efetuar o login. Por favor, " +
          "confirme se sua senha está correta.",
      },
      successMessage: {
        title: "Sucesso!",
        message: "Sua sessão foi renovada.",
      },
      validationToken: false,
    };

    const { ok, data } = await postService(requestProps);

    if(ok) {
      dispatch(userLogin({ ...data }));

      props.onOk();
    }
 
    dispatch(userStopLoginLoading());
  };

  const handleToLoginPage = () => {
    props.onCancel();

    if (props.eventEmitter) {
      props.eventEmitter.emit("socket:disconnect", {});
    }

    Router.replace("/");
  };

  return (
    <Modal
      className="modal-refresh-token"
      title="Sessão expirada"
      okText="Logar"
      cancelText="Sair do sistema"
      isVisible={props.isVisible}
      onOk={() => {
        form.submit();
      }}
      onCancel={handleToLoginPage}
      confirmLoading={userInfo.loadingLogin}
    >
      <Form onFinish={handleRefreshToken} form={form}>
          <h3>
            Sua sessão expirou, para conitnuar utilizando o sistema, por favor,
            insira sua senha abaixo.
          </h3>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Insira sua senha" }]}
          >
            <InputPassword placeholder="Senha" allowClear />
          </Form.Item>
      </Form>
    </Modal>
  );
};
