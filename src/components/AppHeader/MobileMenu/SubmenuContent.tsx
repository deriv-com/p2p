import { BackButton } from './BackButton';
import { MobileMenuConfig, TSubmenuSection } from './MobileMenuConfig';

type TSubmenuContent = {
    onBackClick: () => void;
    renderContentFor: TSubmenuSection;
};

export const SubmenuContent = ({ onBackClick, renderContentFor }: TSubmenuContent) => {
    const data = MobileMenuConfig().submenuConfig[renderContentFor];

    return (
        <div className='pb-[32px]'>
            <BackButton buttonText={data.title} onClick={onBackClick} />

            {/* <div className='flex items-center pt-[20px] pl-[32px]'>
                <LegacyChevronLeft1pxIcon iconSize='xs' />
                <Text className='text-[16px] ml-[16px]' weight='bold'>
                    {localize('Cashier')}
                </Text>
            </div>

            <ul className='pl-[48px] pr-[16px] pt-[32px]'>
                <li className='flex items-center h-[56px]'>
                    <LegacyDepositIcon iconSize='xs' />
                    <Text className='text-[14px] ml-[16px]'>{localize('Deposit')}</Text>
                </li>

                <li className='flex items-center h-[56px]'>
                    <LegacyWithdrawalIcon iconSize='xs' />
                    <Text className='text-[14px] ml-[16px]'>{localize('Withdrawal')}</Text>
                </li>

                <li className='flex items-center h-[56px]'>
                    <LegacyTransferIcon iconSize='xs' />
                    <Text className='text-[14px] ml-[16px]'>{localize('Transfer')}</Text>
                </li>

                <li className='flex items-center h-[56px]'>
                    <LegacyDerivP2pIcon iconSize='xs' />
                    <Text className='text-[14px] ml-[16px]'>{localize('Deriv P2P')}</Text>
                </li>
            </ul>

            <div className='flex items-center pt-[20px] pl-[32px]'>
                <LegacyChevronLeft1pxIcon iconSize='xs' />
                <Text className='text-[16px] ml-[16px]' weight='bold'>
                    {localize('Account Settings')}
                </Text>
            </div>

            <ul className='pl-[56px]'>
                <li className='pt-[32px]'>
                    <div className='flex items-center'>
                        <LegacyProfileSmIcon iconSize='xs' />
                        <Text className='text-[14px] ml-[16px]' weight='bold'>
                            {localize('Profile')}
                        </Text>
                    </div>

                    <ul className='pl-[48px]'>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Personal details')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Languages')}</Text>
                        </li>
                    </ul>
                </li>

                <li className='pt-[32px]'>
                    <div className='flex items-center'>
                        <LegacyAssessmentIcon iconSize='xs' />
                        <Text className='text-[14px] ml-[16px]' weight='bold'>
                            {localize('Assessments')}
                        </Text>
                    </div>

                    <ul className='pl-[48px]'>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Trading assessment')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Financial assessment')}</Text>
                        </li>
                    </ul>
                </li>

                <li className='pt-[32px]'>
                    <div className='flex items-center'>
                        <LegacyVerificationIcon iconSize='xs' />
                        <Text className='text-[14px] ml-[16px]' weight='bold'>
                            {localize('Verification')}
                        </Text>
                    </div>

                    <ul className='pl-[48px]'>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Proof of identity')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Proof of address')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Proof of ownership')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Proof of income')}</Text>
                        </li>
                    </ul>
                </li>

                <li className='pt-[32px]'>
                    <div className='flex items-center'>
                        <LegacySecurityIcon iconSize='xs' />
                        <Text className='text-[14px] ml-[16px]' weight='bold'>
                            {localize('Security and safety')}
                        </Text>
                    </div>

                    <ul className='pl-[48px]'>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Email and passwords')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Self exclusion')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Account limits')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Login history')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('API token')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Connected apps')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Two-factor authentication')}</Text>
                        </li>
                        <li className='mt-[16px]'>
                            <Text className='text-[14px]'>{localize('Close your account')}</Text>
                        </li>
                    </ul>
                </li>
            </ul> */}
        </div>
    );
};
