import clsx from 'clsx';
import { TGenericSizes } from '@/utils';
import { LabelPairedArrowLeftLgBoldIcon } from '@deriv/quill-icons';
import { Text } from '@deriv-com/ui';
import './PageReturn.scss';

type TPageReturnProps = {
    className?: string;
    hasBorder?: boolean;
    onClick: () => void;
    pageTitle: string;
    rightPlaceHolder?: JSX.Element;
    shouldHideBackButton?: boolean;
    size?: TGenericSizes;
    weight?: string;
};

const PageReturn = ({
    className = '',
    hasBorder = false,
    onClick,
    pageTitle,
    rightPlaceHolder,
    shouldHideBackButton = false,
    size = 'md',
    weight = 'normal',
}: TPageReturnProps) => {
    return (
        <div className={clsx('page-return', className, { 'page-return--border': hasBorder })}>
            <div className='flex items-center'>
                <LabelPairedArrowLeftLgBoldIcon
                    className={clsx('page-return__button', { hidden: shouldHideBackButton })}
                    data-testid='dt_page_return_btn'
                    onClick={onClick}
                />
                <Text size={size} weight={weight}>
                    {pageTitle}
                </Text>
            </div>
            {rightPlaceHolder}
        </div>
    );
};

export default PageReturn;
