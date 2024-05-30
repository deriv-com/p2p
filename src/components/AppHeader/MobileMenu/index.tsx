import { useState } from 'react';
import { LegacyMenuHamburger2pxIcon } from '@deriv/quill-icons';
import { Drawer, useDevice } from '@deriv-com/ui';

export const MobileMenu = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { isDesktop } = useDevice();

    if (isDesktop) return null;
    return (
        <>
            <div className='flex items-center justify-center py-2 px-4 h-full' onClick={() => setIsDrawerOpen(true)}>
                <LegacyMenuHamburger2pxIcon iconSize='xs' />
            </div>
            <Drawer
                isOpen={isDrawerOpen}
                onCloseDrawer={() => {
                    setIsDrawerOpen(false);
                }}
                width='300px'
            >
                aaa
            </Drawer>
        </>
    );
};
