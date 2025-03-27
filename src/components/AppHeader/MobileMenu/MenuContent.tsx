import clsx from 'clsx';
import { useIsWalletAccount } from '@/hooks';
import { MenuItem, Text, useDevice } from '@deriv-com/ui';
import { MobileMenuConfig } from './MobileMenuConfig';

export const MenuContent = () => {
    const { isDesktop } = useDevice();
    const textSize = isDesktop ? 'sm' : 'md';
    const isWalletAccount = useIsWalletAccount();

    return (
        <div className='flex flex-col h-full overflow-hidden'>
            <div className='relative h-full pt-4 overflow-scroll'>
                {MobileMenuConfig().map((item, index) => {
                    const removeBorderBottom = item.find(({ removeBorderBottom }) => removeBorderBottom);

                    return (
                        <div
                            className={clsx('pl-[4.8rem] pr-[1.6rem]', {
                                'border-b border-[#f2f3f4]': !removeBorderBottom,
                            })}
                            data-testid='dt_menu_item'
                            key={index}
                        >
                            {item.map(({ LeftComponent, RightComponent, as, href, label, name, onClick, target }) => {
                                if (isWalletAccount && name === 'Cashier') return null;

                                if (as === 'a') {
                                    return (
                                        <MenuItem
                                            as='a'
                                            className='h-[5.6rem]'
                                            disableHover
                                            href={href}
                                            key={label}
                                            leftComponent={
                                                <LeftComponent className='mr-[1.6rem]' height={16} width={16} />
                                            }
                                            target={target}
                                        >
                                            <Text size={textSize}>{label}</Text>
                                        </MenuItem>
                                    );
                                }
                                return (
                                    <MenuItem
                                        as='button'
                                        className='w-full h-[5.6rem]'
                                        disableHover
                                        key={label}
                                        leftComponent={<LeftComponent className='mr-[1.6rem]' iconSize='xs' />}
                                        onClick={onClick}
                                        rightComponent={RightComponent}
                                    >
                                        <Text className='mr-auto' size={textSize}>
                                            {label}
                                        </Text>
                                    </MenuItem>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
