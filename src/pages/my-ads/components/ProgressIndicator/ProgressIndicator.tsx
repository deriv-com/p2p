import React, { CSSProperties } from 'react';
import clsx from 'clsx';

import './ProgressIndicator.scss';

type TProgressIndicator = {
    className?: string;
    style?: CSSProperties;
    total: number;
    value: number;
};

const ProgressIndicator = ({ className, style, total, value }: TProgressIndicator) => {
    return (
        <div
            className={clsx('p2p-progress-indicator__container', className)}
            data-testid='dt_progress_indicator'
            style={style}
        >
            <div className='p2p-progress-indicator__bar' style={{ width: `${(value / total) * 100}%` }} />
            <div className='p2p-progress-indicator__empty' />
        </div>
    );
};

export default ProgressIndicator;
