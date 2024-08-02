import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { LabelPairedEllipsisVerticalLgBoldIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { TooltipMenuIcon } from '../TooltipMenuIcon';
import './PopoverDropdown.scss';

type TItem = {
    label: string;
    value: string;
};

type TPopoverDropdownProps = {
    dropdownList: TItem[];
    onClick: (value: string) => void;
    tooltipMessage: string;
};

const PopoverDropdown = ({ dropdownList, onClick, tooltipMessage }: TPopoverDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setVisible(false));
    const { isDesktop } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();

    return (
        <div className='popover-dropdown' data-testid='dt_popover_dropdown' ref={ref}>
            {isAdvertiserBarred ? (
                <LabelPairedEllipsisVerticalLgBoldIcon data-testid='dt_popover_dropdown_icon' fill='#999999' />
            ) : (
                <TooltipMenuIcon
                    as='button'
                    onClick={() => setVisible(prevState => !prevState)}
                    tooltipContent={tooltipMessage}
                >
                    <LabelPairedEllipsisVerticalLgBoldIcon data-testid='dt_popover_dropdown_icon' />
                </TooltipMenuIcon>
            )}
            {visible && (
                <div className='popover-dropdown__list' data-testid='dt_popover_dropdown_list'>
                    {dropdownList.map(item => (
                        <Button
                            className='popover-dropdown__list-item'
                            color='black'
                            disabled={isAdvertiserBarred}
                            key={item.value}
                            onClick={() => {
                                onClick(item.value);
                                setVisible(false);
                            }}
                            variant='ghost'
                        >
                            <Text
                                className='popover-dropdown__list-item__label'
                                key={item.value}
                                size={isDesktop ? 'sm' : 'md'}
                            >
                                {item.label}
                            </Text>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PopoverDropdown;
