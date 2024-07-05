import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { TAdConditionTypes, TCountryListItem } from 'types';
import { PreferredCountriesModal } from '@/components/Modals';
import { LabelPairedChevronRightSmRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { AdConditionContentHeader } from '../AdConditionContentHeader';
import './PreferredCountriesSelector.scss';

type TPreferredCountriesSelectorProps = {
    countryList: TCountryListItem;
    type: TAdConditionTypes;
};

const PreferredCountriesSelector = ({ countryList, type }: TPreferredCountriesSelectorProps) => {
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const { getValues, setValue } = useFormContext();
    const countries = Object.keys(countryList).map(key => ({
        text: countryList[key]?.country_name,
        value: key,
    }));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedValues, setSelectedValues] = useState<string[]>(
        getValues('preferred-countries') ? getValues('preferred-countries') : countries.map(country => country.value)
    );

    const getSelectedCountriesText = () => {
        const selectedCountries = getValues('preferred-countries');
        if (selectedCountries?.length === countries.length) {
            return localize('All countries');
        }
        return selectedCountries?.map((value: string) => countryList[value]?.country_name).join(', ');
    };

    return (
        <div className='preferred-countries-selector'>
            <AdConditionContentHeader type={type} />
            <div className='preferred-countries-selector__field' onClick={() => setIsModalOpen(true)}>
                <Text
                    className='preferred-countries-selector__field__text'
                    color='less-prominent'
                    size={isDesktop ? 'sm' : 'md'}
                >
                    {getSelectedCountriesText()}
                </Text>
                <LabelPairedChevronRightSmRegularIcon />
            </div>
            {isModalOpen && (
                <PreferredCountriesModal
                    countryList={countries}
                    isModalOpen={isModalOpen}
                    onClickApply={() => {
                        setValue('preferred-countries', selectedValues);
                        setIsModalOpen(false);
                    }}
                    onRequestClose={() => setIsModalOpen(false)}
                    selectedCountries={selectedValues}
                    setSelectedCountries={setSelectedValues}
                />
            )}
        </div>
    );
};

export default PreferredCountriesSelector;
