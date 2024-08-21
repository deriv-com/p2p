import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { LabelPairedEllipsisVerticalLgBoldIcon } from '@deriv/quill-icons';
import { Button, Text, Tooltip, useDevice } from '@deriv-com/ui';
import './PopoverDropdown.scss';

type TItem = {
    label: string;
    value: string;
};

type TPopoverDropdownProps = {
    dropdownList: TItem[];
    isBarred: boolean;
    onClick: (value: string) => void;
    tooltipMessage: string;
};

const PopoverDropdown = ({ dropdownList, isBarred, onClick, tooltipMessage }: TPopoverDropdownProps) => {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useOnClickOutside(ref, () => setVisible(false));
    const { isDesktop } = useDevice();

    return (
        <div className='popover-dropdown' data-testid='dt_popover_dropdown' ref={ref}>
            {isBarred ? (
                <LabelPairedEllipsisVerticalLgBoldIcon data-testid='dt_popover_dropdown_icon' fill='#999999' />
            ) : (
                <Tooltip
                    as='button'
                    onClick={() => setVisible(prevState => !prevState)}
                    tooltipContent={tooltipMessage}
                    tooltipPosition='top'
                >
                    <LabelPairedEllipsisVerticalLgBoldIcon data-testid='dt_popover_dropdown_icon' />
                </Tooltip>
            )}
            {visible && (
                <div className='popover-dropdown__list' data-testid='dt_popover_dropdown_list'>
                    {dropdownList.map(item => (
                        <Button
                            className='popover-dropdown__list-item'
                            color='black'
                            disabled={isBarred}
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
