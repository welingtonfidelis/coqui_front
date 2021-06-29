import { notification } from "antd";
import { handleUnauthorized } from "../../services/auth";

interface Props {
  message: string;
  description: string;
  type: "success" | "error" | "warning" | "info";
  statusCode?: number;
  validationToken: boolean;
}

export const Notification = (props: Props) => {
  let unauthorizedMessage = null;

  if (props.validationToken)
    unauthorizedMessage = handleUnauthorized(props.statusCode);

  return notification[props.type]({
    message: props.message,
    description: unauthorizedMessage || props.description,
    duration: 5,
  });
};
