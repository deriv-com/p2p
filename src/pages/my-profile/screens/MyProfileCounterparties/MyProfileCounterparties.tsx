import { PropsWithChildren, useState } from 'react';
import { FullPageMobileWrapper } from '@/components';
import { RadioGroupFilterModal } from '@/components/Modals';
import { getCounterpartiesDropdownList } from '@/constants';
import { useQueryString } from '@/hooks/custom-hooks';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { MyProfileCounterpartiesHeader } from './MyProfileCounterpartiesHeader';
import { MyProfileCounterpartiesTable } from './MyProfileCounterpartiesTable';
import './MyProfileCounterparties.scss';

const MyProfileCounterpartiesDisplayWrapper = ({ children }: PropsWithChildren<unknown>) => {
    const { setQueryString } = useQueryString();
    const { isDesktop } = useDevice();

    if (!isDesktop) {
        return (
            <FullPageMobileWrapper
                className='absolute top-0'
                onBack={() =>
                    setQueryString({
                        tab: 'default',
                    })
                }
                renderHeader={() => (
                    <Text className='my-profile-counterparties__header' size='md' weight='bold'>
                        <Localize i18n_default_text='My counterparties' />
                    </Text>
                )}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }
    return children;
};

const MyProfileCounterparties = () => {
    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(false);
    const { localize } = useTranslations();

    const onClickFilter = () => {
        setIsFilterModalOpen(true);
    };

    const onToggle = (value: string) => {
        setDropdownValue(value);
        setIsFilterModalOpen(false);
    };

    return (
        <MyProfileCounterpartiesDisplayWrapper>
            <div className='my-profile-counterparties'>
                {showHeader && (
                    <MyProfileCounterpartiesHeader
                        dropdownValue={dropdownValue}
                        onClickFilter={onClickFilter}
                        setDropdownValue={setDropdownValue}
                        setSearchValue={setSearchValue}
                    />
                )}
                <div className='my-profile-counterparties__content'>
                    <MyProfileCounterpartiesTable
                        dropdownValue={dropdownValue}
                        searchValue={searchValue}
                        setShowHeader={setShowHeader}
                    />
                </div>
                <RadioGroupFilterModal
                    isModalOpen={isFilterModalOpen}
                    list={getCounterpartiesDropdownList(localize)}
                    onRequestClose={() => setIsFilterModalOpen(false)}
                    onToggle={onToggle}
                    selected={dropdownValue}
                />
            </div>
        </MyProfileCounterpartiesDisplayWrapper>
    );
};

export default MyProfileCounterparties;
