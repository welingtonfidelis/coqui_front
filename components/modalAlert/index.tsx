import { Modal, ModalProps } from "antd";
import { FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";

interface Props {
  title: string;
  subtitle: string;
  isVisible: boolean;
  type: "success" | "warning" | "error";
  onOk: (item: any) => void;
  // onCancel: (item: any) => void;
}

const iconList = {
  success: <FiCheckCircle className="icon-success"/>,
  warning: <FiAlertCircle className="icon-warning"/>,
  error: <FiXCircle className="icon-error"/>,
};

export const ModalAlert: React.FC<Props> = (props) => {
  return (
    <Modal
      centered
      visible={props.isVisible}
      closable={false}
      cancelButtonProps={{ hidden: true }}
      onOk={props.onOk}
    >
      <div id="modal-alert">
        {iconList[props.type]}
        <h2>{props.title}</h2>
        <h3>{props.subtitle}</h3>

        <main>{props.children}</main>
      </div>
    </Modal>
  );
};
