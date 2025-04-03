import { ReactElement } from 'react';
import clsx from 'clsx';

type TListItem = {
    isActive: boolean;
    label: ReactElement | string[] | string;
    onClick: () => void;
};

const ListItem = ({ isActive, label, onClick }: TListItem) => (
    <li
        className={clsx({
            'composite-calendar__prepopulated-list--is-active': isActive,
        })}
        onClick={onClick}
    >
        {label}
    </li>
);

export default ListItem;
