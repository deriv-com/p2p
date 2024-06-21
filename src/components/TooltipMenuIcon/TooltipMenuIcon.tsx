import { ComponentProps, ElementType, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { extendTheme, ThemeProvider, Tooltip, TooltipProps } from '@chakra-ui/react';
import './TooltipMenuIcon.scss';

const theme = extendTheme({
    zIndices: {
        tooltip: 1800,
    },
});

type AsElement = 'a' | 'button' | 'div';
type TTooltipMenuIcon<T extends AsElement> = ComponentProps<T> & {
    as: T;
    disableHover?: boolean;
    tooltipContent: string;
    tooltipPosition?: TooltipProps['placement'];
};

// TODO replace this with deriv/ui
const TooltipMenuIcon = <T extends AsElement>({
    as,
    children,
    className,
    disableHover = false,
    tooltipContent,
    tooltipPosition = 'top',
    ...rest
}: PropsWithChildren<TTooltipMenuIcon<T>>) => {
    const Tag = as as ElementType;

    return (
        <ThemeProvider theme={theme}>
            <Tooltip
                bg='#D6DADB'
                borderRadius={4}
                color='#333333'
                fontSize={12}
                fontWeight='normal'
                hasArrow
                label={tooltipContent}
                margin={2}
                padding={4}
                placement={tooltipPosition}
            >
                <Tag className={clsx({ 'tooltip-menu-icon': !disableHover }, className)} {...rest}>
                    {children}
                </Tag>
            </Tooltip>
        </ThemeProvider>
    );
};

export default TooltipMenuIcon;
