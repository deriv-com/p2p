import { ComponentProps, forwardRef, ReactNode } from 'react';
import { TextArea } from '@deriv-com/ui';
import './TextAreaWithIcon.scss';

type TTextAreaWithIconProps = Omit<ComponentProps<typeof TextArea>, 'textSize'> & {
    icon: ReactNode;
};

const TextAreaWithIcon = forwardRef<HTMLTextAreaElement, TTextAreaWithIconProps>(({ icon, ...rest }, ref) => {
    return (
        <div className='text-area-with-icon'>
            <TextArea {...rest} className='text-area-with-icon__textarea' ref={ref} textSize='sm' />
            {
                <div className='text-area-with-icon__icon' data-testid='dt_text_area_with_icon'>
                    {icon}
                </div>
            }
        </div>
    );
});

TextAreaWithIcon.displayName = 'TextAreaWithIcon';
export default TextAreaWithIcon;
