import { Button as ButtonAntd, ButtonProps } from "antd";

interface Props extends ButtonProps {}

export const ButtonPrimary: React.FC<Props> = (props) => (
  <ButtonAntd type="primary" className="button-simple" {...props} />
);
