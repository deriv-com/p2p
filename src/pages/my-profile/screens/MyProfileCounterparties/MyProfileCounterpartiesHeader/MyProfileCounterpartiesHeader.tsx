import { MutableOption } from 'types';
import { Dropdown, Search } from '@/components';
import { COUNTERPARTIES_DROPDOWN_LIST } from '@/constants';
import { useDevice } from '@/hooks/custom-hooks';
import { LegacySort1pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text } from '@deriv-com/ui';
import './MyProfileCounterpartiesHeader.scss';

type MyProfileCounterpartiesHeaderProps = {
    dropdownValue: string;
    onClickFilter: () => void;
    setDropdownValue: (value: string) => void;
    setSearchValue: (value: string) => void;
};

const MyProfileCounterpartiesHeader = ({
    dropdownValue,
    onClickFilter,
    setDropdownValue,
    setSearchValue,
}: MyProfileCounterpartiesHeaderProps) => {
    const { isMobile } = useDevice();
    const { localize } = useTranslations();
    return (
        <div className='my-profile-counterparties__content-header'>
            <Text as='p' size='sm'>
                <Localize i18n_default_text='When you block someone, you won’t see their ads, and they can’t see yours. Your ads will be hidden from their search results, too.' />
            </Text>
            <div className='my-profile-counterparties-header'>
                {/* TODO: to be replaced by deriv-com/ui search component */}
                <Search name='counterparties-search' onSearch={setSearchValue} placeholder='Search by nickname' />
                {/* TODO: to be replaced by deriv-com/ui dropdown component */}
                {isMobile ? (
                    <Button
                        className='my-profile-counterparties-header__sort-icon'
                        color='black'
                        icon={<LegacySort1pxIcon iconSize='xs' />}
                        onClick={onClickFilter}
                        variant='outlined'
                    />
                ) : (
                    <Dropdown
                        label={localize('Filter by')}
                        list={COUNTERPARTIES_DROPDOWN_LIST as unknown as MutableOption[]}
                        listHeight='sm'
                        name='counterparty-filter'
                        onSelect={setDropdownValue}
                        value={dropdownValue}
                    />
                )}
            </div>
        </div>
    );
};
export default MyProfileCounterpartiesHeader;
