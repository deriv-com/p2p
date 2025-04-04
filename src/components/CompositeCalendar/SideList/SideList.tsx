import { toMoment } from '@/utils';
import { ListItem } from '../ListItem';

type TItem = {
    duration: number;
    label: string;
    onClick: () => void;
    value: string;
};

type TSideList = {
    from: number | null;
    items: TItem[];
    to: number;
};

const getIsActive = (from: number | null, to: number, flag: number) => {
    if (flag === 0) {
        return toMoment().endOf('day').unix() === to && from === null;
    }
    return Math.ceil(to / 86400) - Math.ceil(Number(from) / 86400) === flag;
};

const SideList = ({ from, items, to }: TSideList) => (
    <ul className='composite-calendar__prepopulated-list'>
        {items.map(item => {
            const { duration, label, onClick } = item;
            const isActive = getIsActive(from, to, duration);
            return <ListItem isActive={isActive} key={duration} label={label} onClick={onClick} />;
        })}
    </ul>
);

export default SideList;
