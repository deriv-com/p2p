import { MutableOption } from 'types';
import { TSortByValues } from '@/utils';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { Button, Dropdown, useDevice } from '@deriv-com/ui';
import SortIcon from '../../../../public/ic-cashier-sort.svg?react';
import './SortDropdown.scss';

type TSortDropdownProps = {
    list: readonly { text: string; value: string }[];
    onSelect: (value: TSortByValues) => void;
    setIsFilterModalOpen: (value: boolean) => void;
    value: TSortByValues;
};

const SortDropdown = ({ list, onSelect, setIsFilterModalOpen, value }: TSortDropdownProps) => {
    const { isMobile } = useDevice();

    if (isMobile) {
        return (
            <Button
                className='w-[3.2rem] !border-[#d6dadb] border-[1px]'
                color='black'
                icon={<SortIcon className='absolute' data-testid='dt_sort_dropdown_button' />}
                onClick={() => setIsFilterModalOpen(true)}
                variant='outlined'
            />
        );
    }

    return (
        <div className='sort-dropdown'>
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                label='Sort by'
                list={list as unknown as MutableOption[]}
                name='Sort by'
                onSelect={(value: string) => onSelect(value as TSortByValues)}
                value={value}
            />
        </div>
    );
};

export default SortDropdown;
