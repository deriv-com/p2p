/* utility functions */
type TUtmData = {
    [key: string]: string | undefined;
};

const getDomain = () => {
    const domain = location.hostname;
    const allowedDomains = ['deriv.com', 'binary.sx'];

    if (allowedDomains.includes(domain) && domain.includes('deriv.com')) {
        return 'deriv.com';
    }

    return allowedDomains.includes(domain) && domain.includes('binary.sx') ? 'binary.sx' : domain;
};

const eraseCookie = (name: string) => {
    document.cookie = `${name}=; Max-Age=-99999999; domain=${getDomain()}; path=/;`;
};

export const getCookie = (name: string) => {
    const dc = document.cookie;
    const prefix = `${name}=`;

    // check begin index
    let begin = dc.indexOf(`; ${prefix}`);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        // cookie not available
        if (begin != 0) return null;
    } else {
        begin += 2;
    }

    // check end index
    let end = document.cookie.indexOf(';', begin);
    if (end == -1) {
        end = dc.length;
    }

    return decodeURI(dc.substring(begin + prefix.length, end));
};

const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const toISOFormat = (date: Date) => {
    if (date instanceof Date) {
        const utcYear = date.getUTCFullYear();
        const utcMonth = (date.getUTCMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        const utcDate = (date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate();

        return `${utcYear}-${utcMonth}-${utcDate}`;
    }

    return '';
};

const shouldOverwrite = (newUtmData: TUtmData, currentUtmData: TUtmData) => {
    // If we don't have old utm data, the utm_source field is enough for new utm data
    const validNewUtmSource = newUtmData.utm_source && newUtmData.utm_source !== 'null';
    if (!currentUtmData && validNewUtmSource) {
        return true;
    }
    // If we have old utm data, 3 fields are required for new utm data to rewrite the old one
    const requiredFields = ['utm_source', 'utm_medium', 'utm_campaign'];
    const hasNewRequiredFields = requiredFields.every(field => newUtmData[field as keyof TUtmData]);
    if (hasNewRequiredFields) {
        return true;
    }

    // Otherwise we don't rewrite the old utm_data
    return false;
};
/* end utility functions */

export const initMarketingCookies = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const brandName = 'deriv';
    const appId = 11780;

    /* start handling UTMs */
    const utmFields = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'utm_ad_id',
        'utm_click_id',
        'utm_adgroup_id',
        'utm_campaign_id',
        'utm_msclk_id',
        // For cases where we need to map the query param to some different name e.g [name_from_query_param, mapped_name]
        ['fbclid', 'utm_fbcl_id'],
    ];

    let utmData: TUtmData = {};
    const currentUtmData = JSON.parse(decodeURIComponent(getCookie('utm_data') as string));

    // If the user comes to the site for the first time without any URL params
    // Only set the utm_source to referrer if the user does not have utm_data cookies stored
    if (!currentUtmData?.utm_source) {
        utmData = {
            utm_source: document.referrer ? document.referrer : 'null',
        };
    }

    // If the user has any new UTM params, store them
    utmFields.forEach(field => {
        if (Array.isArray(field)) {
            const [fieldKey, mappedFieldValue] = field;
            const fieldValue = searchParams.get(fieldKey);
            if (fieldValue) {
                utmData[mappedFieldValue as keyof TUtmData] = fieldValue.substring(0, 200); // Limit to 200 supported characters
            }
        } else if (searchParams.has(field)) {
            utmData[field] = searchParams.get(field)?.substring(0, 100); // Limit to 100 supported characters
        }
    });

    if (shouldOverwrite(utmData, currentUtmData)) {
        eraseCookie('affiliate_tracking');
        eraseCookie('utm_data');

        const utmDataCookie = encodeURIComponent(JSON.stringify(utmData))
            .replace(/%2C/g, ',')
            .replace(/%7B/g, '{')
            .replace(/%7D/g, '}');

        // Non-expiring cookie for utm_data
        // Max 400 days
        document.cookie = `utm_data=${utmDataCookie}; expires=Tue, 19 Jan 9999 03:14:07 UTC; domain=${getDomain()}; path=/; SameSite=None; Secure;`;
    }

    /* end handling UTMs */

    /* start handling affiliate tracking */
    if (searchParams.has('t')) {
        eraseCookie('affiliate_tracking');
        document.cookie = `affiliate_tracking=${searchParams.get(
            't'
        )}; expires=Tue, 19 Jan 9999 03:14:07 UTC;  domain=${getDomain()}; path=/; SameSite=None; Secure;`;
    }
    /* end handling affiliate tracking */

    /* start handling signup device */
    const signupDeviceCookieUnparsed = getCookie('signup_device') || '{}';
    const signupDeviceCookie = JSON.parse(decodeURI(signupDeviceCookieUnparsed).replace(/%2C/g, ','));
    if (!signupDeviceCookie.signup_device) {
        const signupData = {
            signup_device: isMobile() ? 'mobile' : 'desktop',
        };
        const signupDataCookie = encodeURI(JSON.stringify(signupData))
            .replace(/,/g, '%2C')
            .replace(/%7B/g, '{')
            .replace(/%7D/g, '}');

        document.cookie = `signup_device=${signupDataCookie};domain=${getDomain()}; path=/; SameSite=None; Secure;`;
    }
    /* end handling signup device */

    /* start handling date first contact */
    const dateFirstContactCookieUnparsed = getCookie('date_first_contact') || '{}';
    const dateFirstContactCookie = JSON.parse(decodeURI(dateFirstContactCookieUnparsed).replace(/%2C/g, ','));

    if (!dateFirstContactCookie.date_first_contact) {
        const ws = new WebSocket(`wss://green.binaryws.com/websockets/v3?app_id=${appId}&brand=${brandName}`);

        ws.onopen = function () {
            ws.send(JSON.stringify({ time: 1 }));
        };

        ws.onmessage = function (msg) {
            const dateFirstContactResponse = JSON.parse(msg.data);

            const dateFirstContactData = {
                date_first_contact: toISOFormat(new Date(dateFirstContactResponse.time * 1000)),
            };

            const dateFirstContactDataCookie = encodeURI(JSON.stringify(dateFirstContactData))
                .replace(/,/g, '%2C')
                .replace(/%7B/g, '{')
                .replace(/%7D/g, '}');

            document.cookie = `date_first_contact=${dateFirstContactDataCookie};domain=${getDomain()}; path=/; SameSite=None; Secure;`;

            ws.close();
        };
    }
    /* end handling date first contact */

    /* start handling gclid */
    if (searchParams.has('gclid')) {
        eraseCookie('gclid');
        document.cookie = `gclid=${searchParams.get('gclid')};domain=${getDomain()}; path=/; SameSite=None; Secure;`;
    }
    /* end handling gclid */
};
