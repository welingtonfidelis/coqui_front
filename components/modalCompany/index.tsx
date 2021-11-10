import { Form } from "antd";
import { useEffect } from "react";
import { FaStoreAlt } from "react-icons/fa";
import { getService } from "../../services/apiRequest";
import { removeSpecialCharacters } from "../../util";

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
  const url = "/companies";

  useEffect(() => {
    if (props.isVisible) {
      formCompany.setFieldsValue({
        ...props,
      });
    } else clearFormValues();
  }, [props.isVisible]);

  const clearFormValues = () => {
    formCompany.setFieldsValue({
      id: null,
      name: null,
      email: null,
      cnpj: "",
      logo: null,
    });
  };

  const validateEmailAlreadyInUse = async (event) => {
    if (!formCompany.getFieldError("email").length) {
      const requestProps = {
        url: `${url}/email/${event.target.value}`,
        id: props.id || null
      }

      const { ok, data } = await getService(requestProps);

      if (ok && data) {
        formCompany.setFields([
          {
            name: "email",
            errors: [...formCompany.getFieldError("email"), "Email já em uso"],
          },
        ]);
      }
    }
  };

  const validateCnpjAlreadyInUse = async (event) => {
    if (!formCompany.getFieldError("cnpj").length) {
      const cnpj = removeSpecialCharacters(event.target.value);
      const requestProps = {
        url: `${url}/cnpj/${cnpj}`,
        id: props.id || null
      }

      const { ok, data } = await getService(requestProps);

      if (ok && data) {
        formCompany.setFields([
          {
            name: "cnpj",
            errors: [...formCompany.getFieldError("cnpj"), "Cnpj já em uso"],
          },
        ]);
      }
    }
  };

  return (
    <Modal
      className="modal-company"
      title="Empresa"
      isVisible={props.isVisible}
      onOk={() => {
        formCompany.submit();
      }}
      onCancel={props.onCancel}
      confirmLoading={props.loading}
    >
      <Form onFinish={props.onOk} form={formCompany}>
        <div className="company-header">
          {props.logo ? <img src={props.logo} alt="" /> : <FaStoreAlt />}

          <div className="col">
            <Form.Item
              name="name"
              rules={[{ required: true, message: "Insira o nome da empresa" }]}
            >
              <Input placeholder="Nome" title="Nome" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: "Insira um email válido",
                  type: "email",
                },
              ]}
            >
              <Input
                placeholder="Email"
                title="Email"
                onBlur={validateEmailAlreadyInUse}
              />
            </Form.Item>

            <Form.Item
              name="cnpj"
              rules={[
                {
                  required: true,
                  message: "Insira um CPNJ",
                },
              ]}
            >
              <InputMask
                mask="99.999.999/9999-99"
                type="tel"
                placeholder="CNPJ"
                onBlur={validateCnpjAlreadyInUse}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};
