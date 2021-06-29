import { Select as SelectAntd, SelectProps } from "antd";

interface Item {
  value: string;
  description: string;
}

interface Props extends SelectProps<any> {
  loading: boolean;
  onChange?: (item: any) => void;
  list: Item[];
}

export const Select: React.FC<Props> = (props) => (
  <SelectAntd
    size="large"
    showSearch
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
    placeholder={props.placeholder}
    allowClear
    loading={props.loading}
    onChange={(e) => props.onChange(e)}
    {...props}
  >
    {props.list.map((item, index) => (
      <SelectAntd.Option key={index} value={item.value}>
        {item.description}
      </SelectAntd.Option>
    ))}
  </SelectAntd>
);
