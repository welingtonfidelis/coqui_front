import { Form } from "antd";
import { useEffect } from "react";
import { FaStoreAlt } from "react-icons/fa";

import { Input, InputMask } from "../input";
import { Modal } from "../modal";

interface Props {
  id?: string;
  name?: string;
  email?: string;
  cnpj?: string;
  logo?: string;
  active?: boolean;

  isVisible: boolean;
  loading: boolean;

  onOk: (item: any) => void;
  onCancel: () => void;
  onChangePassword?: (item: any) => void;
}

export const ModalCompany: React.FC<Props> = (props) => {
  const [formCompany] = Form.useForm();

  useEffect(() => {
    if (props.isVisible)
      formCompany.setFieldsValue({
        ...props
      });
  }, [props.isVisible]);

  const onCancelModal = () => {
    formCompany.setFieldsValue({
      id: null,
      name: null,
      email: null,
      cnpj: "",
      logo: null
    });

    props.onCancel();
  };

  return (
    <Modal
      className="modal-company"
      title="Empresa"
      isVisible={props.isVisible}
      onOk={() => {
        formCompany.submit();
      }}
      onCancel={onCancelModal}
      confirmLoading={props.loading}
    >
      <Form onFinish={props.onOk} form={formCompany}>
        <div className="company-header">
          {props.logo ? (
            <img src={props.logo} alt="" />
          ) : (
            <FaStoreAlt />
          )}

          <div className="col">
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Insira o nome da empresa" }]}
            >
              <Input
                placeholder="Nome"
                title="Nome"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[{ required: true, message: "Insira um email válido", type: "email" }]}
            >
              <Input
                placeholder="Email"
                title="Email"
              />
            </Form.Item>

            <Form.Item name="cnpj">
              <InputMask
                mask="99.999.999/9999-99"
                type="tel"
                placeholder="CNPJ"
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
