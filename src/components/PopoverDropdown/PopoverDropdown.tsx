import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { useIsAdvertiserBarred } from '@/hooks/custom-hooks';
import { LabelPairedEllipsisVerticalMdRegularIcon } from '@deriv/quill-icons';
import { Button, Text, Tooltip, useDevice } from '@deriv-com/ui';
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
    const { isMobile } = useDevice();
    const isAdvertiserBarred = useIsAdvertiserBarred();

    return (
        <div className='popover-dropdown' ref={ref}>
            {isAdvertiserBarred ? (
                <LabelPairedEllipsisVerticalMdRegularIcon className='popover-dropdown__icon' fill='#999999' />
            ) : (
                <Tooltip message={tooltipMessage} position='bottom' triggerAction='hover'>
                    <LabelPairedEllipsisVerticalMdRegularIcon
                        className='popover-dropdown__icon'
                        data-testid='dt_popover_dropdown_icon'
                        onClick={() => setVisible(prevState => !prevState)}
                    />
                </Tooltip>
            )}
            {visible && (
                <div className='popover-dropdown__list'>
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
                                size={isMobile ? 'md' : 'sm'}
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
