import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from '@deriv-com/translations';

const useIsRtl = () => {
    const { instance } = useTranslations();

    const checkRtl = useCallback(() => instance.dir(instance.language?.toLowerCase()) === 'rtl', [instance]);

    const [isRtl, setIsRtl] = useState<boolean>(() => checkRtl());

    useEffect(() => {
        setIsRtl(checkRtl());
    }, [checkRtl, instance.language]);

    return isRtl;
};

export default useIsRtl;
