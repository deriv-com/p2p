import { RadioGroup } from '@/components';
import { Modal } from '@deriv-com/ui';
import './RadioGroupFilterModal.scss';

type TRadioGroupFilterModalProps = {
    isModalOpen: boolean;
    list: readonly { text: string; value: string }[];
    onRequestClose: () => void;
    onToggle: (value: string) => void;
    selected?: string;
};

const RadioGroupFilterModal = ({
    isModalOpen,
    list,
    onRequestClose,
    onToggle,
    selected,
}: TRadioGroupFilterModalProps) => {
    return (
        <Modal
            ariaHideApp={false}
            className='radio-group-filter-modal'
            isOpen={isModalOpen}
            onRequestClose={onRequestClose}
        >
            <RadioGroup
                className='sort-radiogroup'
                name='block-user-filter-modal'
                onToggle={event => onToggle(event.target.value)}
                required
                selected={selected}
            >
                {list.map(listItem => {
                    return <RadioGroup.Item key={listItem.value} label={listItem.text} value={listItem.value} />;
                })}
            </RadioGroup>
        </Modal>
    );
};

export default RadioGroupFilterModal;
