import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FullPageMobileWrapper, PageReturn } from '@/components';
import { api } from '@/hooks';
import { useBuySellFiltersStore } from '@/store';
import { LabelPairedChevronRightLgRegularIcon } from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { Modal, Text, ToggleSwitch, useDevice } from '@deriv-com/ui';
import { FilterModalContent } from './FilterModalContent';
import { FilterModalFooter } from './FilterModalFooter';
import './FilterModal.scss';

type TFilterModalProps = {
    isModalOpen: boolean;
    onRequestClose: () => void;
};

const FilterModal = ({ isModalOpen, onRequestClose }: TFilterModalProps) => {
    const { data } = api.paymentMethods.useGet();
    const { localize } = useTranslations();
    const { isMobile } = useDevice();
    const { selectedPaymentMethods, setSelectedPaymentMethods, setShouldUseClientLimits, shouldUseClientLimits } =
        useBuySellFiltersStore(
            useShallow(state => ({
                selectedPaymentMethods: state.selectedPaymentMethods,
                setSelectedPaymentMethods: state.setSelectedPaymentMethods,
                setShouldUseClientLimits: state.setShouldUseClientLimits,
                shouldUseClientLimits: state.shouldUseClientLimits,
            }))
        );

    const [showPaymentMethods, setShowPaymentMethods] = useState<boolean>(false);
    const [isMatching, setIsMatching] = useState<boolean>(shouldUseClientLimits);
    const [paymentMethods, setPaymentMethods] = useState<string[]>(selectedPaymentMethods);
    const [paymentMethodNames, setPaymentMethodNames] = useState<string>('All');

    const filterOptions = [
        {
            component: <LabelPairedChevronRightLgRegularIcon />,
            onClick: () => setShowPaymentMethods(true),
            subtext: paymentMethodNames,
            text: localize('Payment methods'),
        },
        {
            component: <ToggleSwitch onChange={event => setIsMatching(event.target.checked)} value={isMatching} />,
            subtext: localize('Ads that match your Deriv P2P balance and limit.'),
            text: localize('Matching ads'),
        },
    ];

    const sortedSelectedPaymentMethods = [...selectedPaymentMethods].sort((a, b) => a.localeCompare(b));
    const sortedPaymentMethods = [...paymentMethods].sort((a, b) => a.localeCompare(b));
    const hasSamePaymentMethods = JSON.stringify(sortedSelectedPaymentMethods) === JSON.stringify(sortedPaymentMethods);
    const hasSameMatching = shouldUseClientLimits === isMatching;
    const hasSameFilters = hasSamePaymentMethods && hasSameMatching;
    const headerText = showPaymentMethods ? localize('Payment methods') : localize('Filter');

    const onApplyConfirm = () => {
        if (showPaymentMethods) {
            setShowPaymentMethods(false);
        } else {
            setSelectedPaymentMethods(paymentMethods);
            setShouldUseClientLimits(isMatching);
            onRequestClose();
        }
    };

    const onResetClear = () => {
        setPaymentMethods([]);
        if (!showPaymentMethods) {
            setIsMatching(true);
        }
    };

    useEffect(() => {
        if (data && paymentMethods.length > 0) {
            const selectedPaymentMethodsDisplayName = data
                .filter(paymentMethod => paymentMethods.includes(paymentMethod.id))
                .map(paymentMethod => paymentMethod.display_name);

            setPaymentMethodNames(selectedPaymentMethodsDisplayName.join(', '));
        } else if (paymentMethods.length === 0) {
            setPaymentMethodNames('All');
        }
    }, [data, paymentMethods]);

    if (isMobile && isModalOpen) {
        return (
            <FullPageMobileWrapper
                className='filter-modal'
                onBack={showPaymentMethods ? () => setShowPaymentMethods(false) : onRequestClose}
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
            >
                <FilterModalContent
                    filterOptions={filterOptions}
                    paymentMethods={paymentMethods}
                    setPaymentMethods={setPaymentMethods}
                    showPaymentMethods={showPaymentMethods}
                />
            </FullPageMobileWrapper>
        );
    }

    return (
        <Modal ariaHideApp={false} className='filter-modal' isOpen={isModalOpen} onRequestClose={onRequestClose}>
            <Modal.Header onRequestClose={onRequestClose}>
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
    );
};

export default FilterModal;
