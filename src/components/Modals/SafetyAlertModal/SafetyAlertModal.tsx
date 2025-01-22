import { useEffect, useState } from 'react';
import moment from 'moment';
import { useLocalStorage } from 'usehooks-ts';
import { api } from '@/hooks';
import { DerivLightIcWarningIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv-com/translations';
import { Button, Modal, Text } from '@deriv-com/ui';
import './SafetyAlertModal.scss';

const SafetyAlertModal = () => {
    const { data } = api.account.useActiveAccount();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [safetyModalTimestamp, setSafetyModalTimestamp] = useLocalStorage(
        `p2p_${data?.loginid}_disclaimer_shown`,
        ''
    );

    const onClickOK = () => {
        const currentTimestamp = moment().valueOf();
        const timestamp = currentTimestamp.toString();
        setSafetyModalTimestamp(timestamp);
        setIsModalOpen(false);
    };

    useEffect(() => {
        if (data?.loginid) {
            if (safetyModalTimestamp) {
                const now = moment();
                const savedTime = moment(parseInt(safetyModalTimestamp));

                // Calculate the difference in days
                const daysPassed = now.diff(savedTime, 'days');

                if (daysPassed >= 1) {
                    localStorage.removeItem(`p2p_${data?.loginid}_disclaimer_shown`);
                }
            } else {
                setIsModalOpen(true);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data?.loginid, safetyModalTimestamp]);

    if (!isModalOpen) return null;

    return (
        <Modal ariaHideApp={false} className='safety-alert-modal' isOpen={isModalOpen}>
            <Modal.Body className='px-10 pt-20 pb-5 flex flex-col gap-[1.5rem]'>
                <div className='flex flex-col items-center gap-[1.5rem]'>
                    <DerivLightIcWarningIcon height='64px' width='64px' />
                    <Text align='start' weight='bold'>
                        Stay safe from phishing scams
                    </Text>
                </div>
                <div className='flex flex-col gap-[1.5rem]'>
                    <Text size='sm'>
                        <Localize i18n_default_text='Deriv will NEVER ask for your login details.' />
                    </Text>
                    <div className='flex flex-col gap-2'>
                        <Text size='sm'>
                            <Localize i18n_default_text='Protect your account:' />
                        </Text>
                        <ul className='flex flex-col gap-2 list-disc pl-10'>
                            <li>
                                <Text size='sm'>
                                    <Localize i18n_default_text='Never share verification codes or their screenshots.' />
                                </Text>
                            </li>
                            <li>
                                <Text size='sm'>
                                    <Localize i18n_default_text='Always check the website URL.' />
                                </Text>
                            </li>
                            <li>
                                <Text size='sm'>
                                    <Localize i18n_default_text='Only communicate with Deriv through live chat.' />
                                </Text>
                            </li>
                        </ul>
                    </div>
                    <Text size='sm'>
                        <Localize i18n_default_text='If you spot anything suspicious, let us know via live chat.' />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer hideBorder>
                <Button onClick={onClickOK} size='lg' textSize='sm'>
                    <Localize i18n_default_text='OK' />
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SafetyAlertModal;
