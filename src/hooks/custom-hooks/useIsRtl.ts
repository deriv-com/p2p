import React from 'react';
import { useTranslations } from '@deriv-com/translations';

const useIsRtl = () => {
    const { instance } = useTranslations();

    const checkRtl = React.useCallback(() => {
        return instance.dir(instance.language?.toLowerCase()) === 'rtl';
    }, [instance]);

    const [isRtl, setIsRtl] = React.useState<boolean>(() => checkRtl());

    React.useEffect(() => {
        setIsRtl(checkRtl());
    }, [checkRtl, instance.language]);

    return isRtl;
};

export default useIsRtl;
