import { LoadingOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { FaBan, FaCheckCircle, FaPen, FaTrash } from "react-icons/fa";

interface Props {
  title: string;
  subtitle?: any;
  icon?: any;
  activeItem?: boolean;
  onEdit?: (item: any) => void;
  onChangeStatus?: (item: any) => void;
  onDelete?: (item: any) => void;
  onActionLoad?: boolean;
}

export const ListItem: React.FC<Props> = (props) => (
  <div className="list-item-card">
    <div className="list-item-img">{props.icon}</div>

    <div className="list-item-content">
      <strong className="list-item-content-title">{props.title}</strong>

      <div className="list-item-content-sub-title">{props.subtitle}</div>
    </div>

    <div className="list-item-action">
      {props.onEdit &&
        (props.onActionLoad ? (
          <LoadingOutlined />
        ) : (
          <FaPen
            onClick={props.onEdit}
            title="Editar"
            className="icon-success"
          />
        ))}

      {props.onChangeStatus &&
        (props.onActionLoad ? (
          <LoadingOutlined />
        ) : props.activeItem ? (
          <FaBan
            onClick={props.onChangeStatus}
            title="Desativar"
            className="icon-warning"
          />
        ) : (
          <FaCheckCircle
            onClick={props.onChangeStatus}
            title="Ativar"
            className="icon-warning"
          />
        ))}

      {props.onDelete && (
        <Popconfirm
          placement="left"
          title={"Deseja realmente excluir esta informação?"}
          onConfirm={props.onDelete}
          okText="Sim"
          cancelText="Não"
        >
          {props.onActionLoad ? (
            <LoadingOutlined />
          ) : (
            <FaTrash title="Excluir" className="icon-error" />
          )}
        </Popconfirm>
      )}
    </div>
  </div>
);
