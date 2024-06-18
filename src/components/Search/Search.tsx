import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { LabelPairedSearchMdRegularIcon, LegacyCloseCircle1pxIcon } from '@deriv/quill-icons';
import { Input } from '@deriv-com/ui';
import './Search.scss';

type TSearchProps = {
    delayTimer?: number;
    hideBorder?: boolean;
    name: string;
    onSearch: (value: string) => void;
    placeholder: string;
};

//TODO: replace the component with deriv shared component
const Search = ({ delayTimer = 500, hideBorder = false, name, onSearch, placeholder }: TSearchProps) => {
    const [searchValue, setSearchValue] = useState('');

    const debounce = (func: (value: string) => void, delay: number) => {
        let timer: ReturnType<typeof setTimeout>;
        return (value: string) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(value), delay);
        };
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedOnSearch = useCallback(debounce(onSearch, delayTimer), [onSearch]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        debouncedOnSearch(value);
    };

    const clearSearch = () => {
        setSearchValue('');
        debouncedOnSearch('');
    };

    return (
        <div className='search'>
            <Input
                className={clsx({ 'border-none': hideBorder })}
                label={placeholder}
                leftPlaceholder={<LabelPairedSearchMdRegularIcon />}
                name={name}
                onChange={handleInputChange}
                rightPlaceholder={
                    searchValue && (
                        <LegacyCloseCircle1pxIcon className='cursor-pointer' iconSize='xs' onClick={clearSearch} />
                    )
                }
                type='search'
                value={searchValue}
            />
        </div>
    );
};

export default Search;
