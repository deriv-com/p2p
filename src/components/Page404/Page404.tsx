import { useHistory } from 'react-router-dom';
import Icon404 from '@/assets/404.png';
import { BUY_SELL_URL } from '@/constants';
import { Localize } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import './Page404.scss';

const Page404 = () => {
    const { isDesktop } = useDevice();
    const history = useHistory();
    const descriptionSize = isDesktop ? 'md' : 'sm';
    return (
        <div className='page-404'>
            {/* TODO: to be replaced with quill icons */}
            <div>
                <img alt='Page not found' src={Icon404} />
            </div>
            <div className='page-404__text'>
                <Text size={isDesktop ? '2xl' : 'lg'} weight='bold'>
                    <Localize i18n_default_text='We couldn’t find that page' />
                </Text>
                <Text align={isDesktop ? 'left' : 'center'} className='my-[1.6rem]' size={descriptionSize}>
                    <Localize i18n_default_text='You may have followed a broken link, or the page has moved to a new address.' />
                </Text>
                <Text className='mb-[1.6rem]' size={descriptionSize}>
                    <Localize i18n_default_text='Error code: 404 page not found' />
                </Text>
                <Button
                    className='w-fit m-[1rem]'
                    onClick={() => history.replace({ pathname: BUY_SELL_URL, search: '' })}
                    size='lg'
                    textSize='sm'
                >
                    <Localize i18n_default_text='Return to Home' />
                </Button>
            </div>
        </div>
    );
};

export default Page404;
