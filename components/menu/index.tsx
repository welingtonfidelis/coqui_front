import { Menu as MenuAntd, MenuProps } from 'antd';
import { ReactNode } from 'react';

interface ItemList {
    title: string;
    action: (item: any) => void;
    icon: ReactNode;
    danger?: boolean;
}

interface Props extends MenuProps {
    items: ItemList[]
}

export const Menu: React.FC<Props> = (props) => (
    <MenuAntd
        {...props}
    >
        {
            props.items.map((item, index) => (
                <MenuAntd.Item
                    key={index + 1}
                    onClick={item.action}
                    icon={item.icon}
                    danger={item.danger}
                >
                    {item.title}
                </MenuAntd.Item>
            ))
        }
    </MenuAntd>
)