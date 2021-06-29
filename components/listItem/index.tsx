import { LoadingOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";
interface Props {
  key: number;
  title: string;
  subtitle?: string;
  detail1?: string;
  detail2?: string;
  icon?: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onDeleteLoad: boolean;
}

export const ListItem: React.FC<Props> = (props) => (
  <div className="list-item">
    <div className="list-item-icon">{props.icon}</div>

    <div className="list-item-col1">
      <strong>{props.title}</strong>
      <span>{props.subtitle}</span>
    </div>

    <div className="list-item-col2">
      <span>{props.detail1}</span>
      <span>{props.detail2}</span>
    </div>

    <div className="list-item-action">
      <FaPencilAlt title="Editar" onClick={props.onEdit} />

      <Popconfirm
        placement="left"
        title={"Deseja realmente excluir esta informação?"}
        onConfirm={props.onDelete}
        okText="Sim"
        cancelText="Não"
      >
        {props.onDeleteLoad ? (
          <LoadingOutlined />
        ) : (
          <FaTrashAlt title="Excluir" />
        )}
      </Popconfirm>
    </div>
  </div>
);
