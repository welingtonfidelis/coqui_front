import { Modal as ModalAntd, ModalProps } from "antd";

interface Props extends ModalProps {
  title: string;
  isVisible: boolean;
  onOk: (item: any) => void;
  onCancel: (item: any) => void;
}

export const Modal: React.FC<Props> = (props) => (
  <ModalAntd
    centered
    title={props.title}
    okText="Salvar"
    cancelText="Cancelar"
    visible={props.isVisible}
    onOk={props.onOk}
    onCancel={props.onCancel}
    {...props}
  >
    {props.children}
  </ModalAntd>
);
