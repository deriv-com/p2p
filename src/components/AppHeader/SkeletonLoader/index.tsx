import React from 'react';
import ContentLoader from 'react-content-loader';

const AccountsInfoLoader = ({ is_logged_in, is_mobile, speed }) => (
    <ContentLoader
        backgroundColor={'var(--general-section-1)'}
        foregroundColor={'var(--general-hover)'}
        height={is_mobile ? 42 : 46}
        speed={speed}
        width={is_mobile ? 216 : 350}
    >
        {is_logged_in ? <LoggedInPreloader is_mobile={is_mobile} /> : <LoggedOutPreloader is_mobile={is_mobile} />}
    </ContentLoader>
);

const LoggedOutPreloader = ({ is_mobile }) => (
    <React.Fragment>
        <rect height='32' rx='4' ry='4' width='66' x={is_mobile ? 42 : 166} y='8' />
        <rect height='32' rx='4' ry='4' width='80' x={is_mobile ? 120 : 250} y='8' />
    </React.Fragment>
);

const LoggedInPreloader = ({ is_mobile }) => (
    <>
        {is_mobile ? (
            <React.Fragment>
                <circle cx='97' cy='22' r='13' />
                <circle cx='59' cy='22' r='13' />
                <rect height='7' rx='4' ry='4' width='76' x='128' y='19' />
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

// AccountsInfoLoader.propTypes = {
//     speed: PropTypes.number,
//     is_mobile: PropTypes.bool,
//     is_logged_in: PropTypes.bool,
// };

export { AccountsInfoLoader };
