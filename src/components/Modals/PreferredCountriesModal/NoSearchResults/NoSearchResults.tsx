import { Localize } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';

type TNoSearchResultsProps = {
    value: string;
};
const NoSearchResults = ({ value }: TNoSearchResultsProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='flex flex-col items-center justify-center mt-64 break-all'>
            <Text align='center' size={isMobile ? 'lg' : 'md'} weight='bold'>
                <Localize i18n_default_text='No results for “{{value}}”.' values={{ value }} />
            </Text>
            <Text align='center' size={isMobile ? 'md' : 'sm'}>
                <Localize i18n_default_text='Check your spelling or use a different term.' />
            </Text>
        </div>
    );
};

export default NoSearchResults;
