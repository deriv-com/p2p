import React from 'react';
import ContentLoader from 'react-content-loader';

type AccountsInfoLoaderProps = {
    is_logged_in: boolean;
    is_mobile: boolean;
    speed: number;
};

const LoggedInPreloader = ({ is_mobile }: Pick<AccountsInfoLoaderProps, 'is_mobile'>) => (
    <>
        {is_mobile ? (
            <React.Fragment>
                <circle cx='14' cy='22' r='13' />
                <rect height='7' rx='4' ry='4' width='76' x='35' y='19' />
                <rect height='32' rx='4' ry='4' width='82' x='120' y='6' />
            </React.Fragment>
        ) : (
            <React.Fragment>
                <circle cx='14' cy='22' r='12' />
                <circle cx='58' cy='22' r='12' />
                <rect height='7' rx='4' ry='4' width='76' x='150' y='20' />
                <circle cx='118' cy='24' r='13' />
                <rect height='30' rx='4' ry='4' width='1' x='87' y='8' />
                <rect height='32' rx='4' ry='4' width='82' x='250' y='8' />
            </React.Fragment>
        )}
    </>
);

export const AccountsInfoLoader = ({ is_mobile, speed }: AccountsInfoLoaderProps) => (
    <ContentLoader
        backgroundColor={'#f2f3f4'}
        foregroundColor={'#e6e9e9'}
        height={is_mobile ? 42 : 46}
        speed={speed}
        width={is_mobile ? 216 : 350}
    >
        <LoggedInPreloader is_mobile={is_mobile} />
    </ContentLoader>
);
