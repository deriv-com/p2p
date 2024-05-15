import { MutableOption } from 'types';
import { TSortByValues } from '@/utils';
import { LabelPairedChevronDownMdRegularIcon, LabelPairedSortCaptionRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Button, Dropdown, useDevice } from '@deriv-com/ui';
import './SortDropdown.scss';

type TSortDropdownProps = {
    list: readonly { text: string; value: string }[];
    onSelect: (value: TSortByValues) => void;
    setIsFilterModalOpen: () => void;
    value: TSortByValues;
};

const SortDropdown = ({ list, onSelect, setIsFilterModalOpen, value }: TSortDropdownProps) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();

    if (isMobile) {
        return (
            <Button
                className='w-[3.2rem] !border-[#d6dadb] border-[1px]'
                color='black'
                icon={
                    <LabelPairedSortCaptionRegularIcon
                        className='absolute'
                        data-testid='dt_sort_dropdown_button'
                        height={24}
                        width={24}
                    />
                }
                onClick={setIsFilterModalOpen}
                variant='outlined'
            />
        );
    }

    return (
        <div className='sort-dropdown'>
            <Dropdown
                dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                label={localize('Sort by')}
                list={list as unknown as MutableOption[]}
                name='Sort by'
                onSelect={value => onSelect(value as TSortByValues)}
                value={value}
            />
        </div>
    );
};

export default SortDropdown;
