import { ComponentProps } from 'react';
import { IconTypes } from '@deriv/quill-icons';
import { Text, useDevice } from '@deriv-com/ui';
import { BackButton } from './BackButton';
import { MobileMenuConfig, TSubmenuSection } from './MobileMenuConfig';

type TSubmenuContent = {
    onBackClick: () => void;
    renderContentFor: TSubmenuSection;
};

type TMenuItem = {
    Icon: IconTypes;
    fontWeight: ComponentProps<typeof Text>['weight'];
    label: string;
};

const MenuItem = ({ Icon, fontWeight, label }: TMenuItem) => {
    const { isMobile } = useDevice();

    return (
        <>
            <Icon iconSize='xs' />
            <Text className='ml-[1.6rem]' size={isMobile ? 'md' : 'sm'} weight={fontWeight}>
                {label}
            </Text>
        </>
    );
};

export const SubmenuContent = ({ onBackClick, renderContentFor }: TSubmenuContent) => {
    const data = MobileMenuConfig().submenuConfig[renderContentFor];
    const { isMobile } = useDevice();

    return (
        <div className='pb-14'>
            <BackButton buttonText={data.title} onClick={onBackClick} />

            <ul className='pl-[4.8rem] pr-[1.6rem]'>
                {data.items.map(({ Icon, href, label, subItems }) => {
                    const hasSubItems = subItems?.length;

                    if (hasSubItems) {
                        return (
                            <li className='pl-[0.8rem] pb-[3.3rem]' key={label}>
                                <div className='flex items-center'>
                                    <MenuItem Icon={Icon} fontWeight='bold' label={label} />
                                </div>

                                <ul className='pl-[4.8rem]'>
                                    {subItems.map(item => (
                                        <li className='mt-[1.7rem]' key={item.text}>
                                            <a href={item.href}>
                                                <Text size={isMobile ? 'md' : 'sm'}>{item.text}</Text>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        );
                    }
                    return (
                        <li key={label}>
                            <a className='flex items-center h-[5.6rem]' href={href}>
                                <MenuItem Icon={Icon} fontWeight='normal' label={label} />
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
