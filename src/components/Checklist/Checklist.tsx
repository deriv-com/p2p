import { LabelPairedArrowRightLgBoldIcon, LabelPairedCheckMdBoldIcon } from '@deriv/quill-icons';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './Checklist.scss';

type TChecklistItem = {
    isDisabled?: boolean;
    onClick?: () => void;
    status: string;
    testId?: string;
    text: string;
};

const Checklist = ({ items }: { items: TChecklistItem[] }) => {
    const { isMobile } = useDevice();
    return (
        <div className='checklist'>
            {items.map(item => (
                <div className='checklist__item' key={item.text}>
                    <Text color={item.isDisabled ? 'less-prominent' : 'general'} size={isMobile ? 'md' : 'sm'}>
                        {item.text}
                    </Text>
                    {item.status === 'done' ? (
                        <div className='checklist__item-checkmark'>
                            <LabelPairedCheckMdBoldIcon className='checklist__item-checkmark-icon' />
                        </div>
                    ) : (
                        <Button
                            className='checklist__item-button'
                            disabled={item.isDisabled}
                            icon={
                                <LabelPairedArrowRightLgBoldIcon
                                    className='checklist__item-button-icon'
                                    {...(item.testId && { 'data-testid': item.testId })}
                                />
                            }
                            onClick={item.onClick}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default Checklist;
