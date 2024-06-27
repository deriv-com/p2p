import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PageReturn } from '@/components';
import { BUY_SELL_URL } from '@/constants';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text, useDevice } from '@deriv-com/ui';
import { LocalStorageUtils } from '@deriv-com/utils';
import { Awareness } from '../Awareness';
import { Blog } from '../Blog';
import { FAQs } from '../FAQs';
import { GettingStarted } from '../GettingStarted';
import { Videos } from '../Videos';
import './Guide.scss';

const Guide = () => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();

    useEffect(() => {
        LocalStorageUtils.setValue<boolean>('should_show_p2p_guide', false);
    }, []);

    return (
        <div className='guide'>
            <PageReturn
                className='lg:mt-0'
                data-testid='dt_page_return_btn'
                hasBorder={!isDesktop}
                onClick={() => history.push(BUY_SELL_URL)}
                pageTitle={localize('P2P Guide')}
                size={isDesktop ? 'md' : 'lg'}
                weight='bold'
            />
            <div className='guide__content'>
                <Text as='div' size={isDesktop ? 'lg' : 'md'} weight='bold'>
                    <Localize i18n_default_text='Get started with P2P' />
                </Text>
                <div className='guide__content-section p-[2.4rem]'>
                    <GettingStarted />
                </div>
                <div className='guide__content-section p-[2.4rem]'>
                    <Awareness />
                </div>
                <div className='guide__content-section'>
                    <Videos />
                </div>
                <div className='guide__content-section'>
                    <Blog />
                </div>
                <div className='guide__content-section'>
                    <FAQs />
                </div>
            </div>
        </div>
    );
};

export default Guide;
