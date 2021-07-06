import { Input as InputAntd, InputProps } from "antd";
import { FaSearch } from "react-icons/fa";
import { SearchProps, TextAreaProps } from "antd/lib/input";
import InputMaskAntd from "react-input-mask";

interface Props extends InputProps {}
interface InputSearchProps extends SearchProps {}
interface InputTextArea extends TextAreaProps {}
interface PropsMask extends InputProps {
  mask: string;
}

export const Input: React.FC<Props> = (props) => (
  <InputAntd size="large" allowClear className="input-simple" {...props} />
);

export const InputPassword: React.FC<Props> = (props) => (
  <InputAntd.Password
    size="large"
    allowClear
    className="input-simple"
    {...props}
  />
);

export const InputSearch: React.FC<InputSearchProps> = (props) => (
  <InputAntd.Search
    size="large"
    allowClear
    enterButton={<FaSearch />}
    className="input-simple"
    {...props}
  />
);

export const InputTextArea: React.FC<InputTextArea> = (props) => (
  <InputAntd.TextArea
    size="large"
    allowClear
    rows={5}
    className="input-simple"
    {...props}
  />
);

export const InputMask: React.FC<PropsMask> = (props) => (
  <InputMaskAntd mask={props.mask} {...props}>
    {(inputProps) => <Input {...inputProps} />}
  </InputMaskAntd>
);
