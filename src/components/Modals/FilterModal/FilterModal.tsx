import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { useShallow } from 'zustand/react/shallow';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { api, useModalManager } from '@/hooks';
import { useBuySellFiltersStore } from '@/stores';
import { LabelPairedChevronRightLgRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Modal, Text, ToggleSwitch, useDevice } from '@deriv-com/ui';
import { LeaveFilterModal } from '../LeaveFilterModal';
import { FilterModalContent } from './FilterModalContent';
import { FilterModalFooter } from './FilterModalFooter';
import './FilterModal.scss';

type TFilterModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const FilterModal = ({ isModalOpen, onRequestClose }: TFilterModalProps) => {
    const { hideModal, isModalOpenFor, showModal } = useModalManager();
    const { data } = api.paymentMethods.useGet();
    const { data: accountData } = api.account.useActiveAccount();
    const { localize } = useTranslations();
    const { isDesktop } = useDevice();
    const {
        selectedPaymentMethods,
        setSelectedPaymentMethods,
        setShouldUseClientLimits,
        setShowFollowedUsers,
        shouldUseClientLimits,
        showFollowedUsers,
    } = useBuySellFiltersStore(
        useShallow(state => ({
            selectedPaymentMethods: state.selectedPaymentMethods,
            setSelectedPaymentMethods: state.setSelectedPaymentMethods,
            setShouldUseClientLimits: state.setShouldUseClientLimits,
            setShowFollowedUsers: state.setShowFollowedUsers,
            shouldUseClientLimits: state.shouldUseClientLimits,
            showFollowedUsers: state.showFollowedUsers,
        }))
    );

    const [showPaymentMethods, setShowPaymentMethods] = useState(false);
    const [showFollowed, setShowFollowed] = useState(showFollowedUsers);
    const [isMatching, setIsMatching] = useState(shouldUseClientLimits);
    const [paymentMethods, setPaymentMethods] = useState<string[]>(selectedPaymentMethods);
    const [paymentMethodNames, setPaymentMethodNames] = useState('');
    const [isHidden, setIsHidden] = useState(false);

    const filterOptions = [
        {
            component: <LabelPairedChevronRightLgRegularIcon />,
            onClick: () => setShowPaymentMethods(true),
            subtext: paymentMethodNames || localize('All'),
            text: localize('Payment methods'),
        },
        {
            component: <ToggleSwitch onChange={event => setIsMatching(event.target.checked)} value={isMatching} />,
            subtext: localize('Ads that match your Deriv P2P balance and limit.'),
            text: localize('Matching ads'),
        },
        {
            component: <ToggleSwitch onChange={event => setShowFollowed(event.target.checked)} value={showFollowed} />,
            subtext: localize('View ads only from advertisers you follow.'),
            text: localize('Followed advertisers only'),
        },
    ];

    const sortedSelectedPaymentMethods = [...selectedPaymentMethods].sort((a, b) => a.localeCompare(b));
    const sortedPaymentMethods = [...paymentMethods].sort((a, b) => a.localeCompare(b));
    const hasSamePaymentMethods = JSON.stringify(sortedSelectedPaymentMethods) === JSON.stringify(sortedPaymentMethods);
    const hasSameMatching = shouldUseClientLimits === isMatching;
    const hasSameFollowed = showFollowedUsers === showFollowed;
    const hasSameFilters = hasSamePaymentMethods && hasSameMatching && hasSameFollowed;
    const headerText = showPaymentMethods ? localize('Payment methods') : localize('Filter');
    const isAwarenessBannerHidden = localStorage.getItem(`p2p_${accountData?.loginid}_is_awareness_banner_hidden`);

    const onApplyConfirm = () => {
        if (showPaymentMethods) {
            setShowPaymentMethods(false);
        } else {
            setSelectedPaymentMethods(paymentMethods);
            setShouldUseClientLimits(isMatching);
            setShowFollowedUsers(showFollowed);
            onRequestClose();
        }
    };

    const onResetClear = () => {
        setPaymentMethods([]);
        if (!showPaymentMethods) {
            setIsMatching(true);
            setShowFollowed(false);
        }
    };

    useEffect(() => {
        if (data && paymentMethods.length > 0 && data?.length !== paymentMethods.length) {
            const selectedPaymentMethodsDisplayName = data
                .filter(paymentMethod => paymentMethods.includes(paymentMethod.id))
                .map(paymentMethod => paymentMethod.display_name);

            setPaymentMethodNames(selectedPaymentMethodsDisplayName.join(', '));
        } else if (paymentMethods.length === data?.length) {
            setPaymentMethodNames(localize('All'));
        } else {
            setPaymentMethodNames('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, paymentMethods]);

    const closeCancelModal = (hideAll = false) => {
        hideModal({ shouldHideAllModals: hideAll });
        if (!hideAll) {
            setIsHidden(false);
        }
    };

    const onClickClose = () => {
        const isValid = (showPaymentMethods && hasSamePaymentMethods) || (!showPaymentMethods && hasSameFilters);
        if (isValid) {
            onRequestClose();
        } else {
            setIsHidden(true);
            showModal('LeaveFilterModal');
        }
    };

    if (!isDesktop && isModalOpen) {
        return (
            <FullPageMobileWrapper
                className={clsx('filter-modal', {
                    'filter-modal--has-no-banner': isAwarenessBannerHidden === 'true',
                })}
                onBack={showPaymentMethods ? () => setShowPaymentMethods(false) : onClickClose}
                renderFooter={() => (
                    <FilterModalFooter
                        hasSameFilters={hasSameFilters}
                        hasSamePaymentMethods={hasSamePaymentMethods}
                        onApplyConfirm={onApplyConfirm}
                        onResetClear={onResetClear}
                        paymentMethods={paymentMethods}
                        showPaymentMethods={showPaymentMethods}
                    />
                )}
                renderHeader={() => (
                    <Text size='lg' weight='bold'>
                        {headerText}
                    </Text>
                )}
                shouldShowBackIcon={showPaymentMethods}
                shouldShowCloseIcon
            >
                <FilterModalContent
                    filterOptions={filterOptions}
                    paymentMethods={paymentMethods}
                    setPaymentMethods={setPaymentMethods}
                    showPaymentMethods={showPaymentMethods}
                />
                {isModalOpenFor('LeaveFilterModal') && (
                    <LeaveFilterModal isModalOpen onRequestClose={closeCancelModal} />
                )}
            </FullPageMobileWrapper>
        );
    }

    return (
        <>
            <Modal
                ariaHideApp={false}
                className={clsx('filter-modal', { hidden: isHidden })}
                isOpen={isModalOpen}
                onRequestClose={onClickClose}
                style={{ overlay: { background: isHidden ? 'transparent' : 'rgba(0, 0, 0, 0.72)', zIndex: 9999 } }}
            >
                <Modal.Header onRequestClose={onClickClose}>
                    <PageReturn
                        onClick={() => setShowPaymentMethods(false)}
                        pageTitle={headerText}
                        shouldHideBackButton={!showPaymentMethods}
                        weight='bold'
                    />
                </Modal.Header>
                <Modal.Body>
                    <FilterModalContent
                        filterOptions={filterOptions}
                        paymentMethods={paymentMethods}
                        setPaymentMethods={setPaymentMethods}
                        showPaymentMethods={showPaymentMethods}
                    />
                </Modal.Body>
                <Modal.Footer className='p-0'>
                    <FilterModalFooter
                        hasSameFilters={hasSameFilters}
                        hasSamePaymentMethods={hasSamePaymentMethods}
                        onApplyConfirm={onApplyConfirm}
                        onResetClear={onResetClear}
                        paymentMethods={paymentMethods}
                        showPaymentMethods={showPaymentMethods}
                    />
                </Modal.Footer>
            </Modal>
            {isModalOpenFor('LeaveFilterModal') && <LeaveFilterModal isModalOpen onRequestClose={closeCancelModal} />}
        </>
    );
};

export default FilterModal;
