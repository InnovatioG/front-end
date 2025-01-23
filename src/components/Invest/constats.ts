import { formatWeekOfMonth } from '@/utils/formats';
import { ADAIC } from '@/utils/images';

export interface InputField {
    id: string;
    label: string;
    placeholder: string;
    value: number | string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const getInputFields = (
    cdCampaignToken_TN: string,
    cdRequestedMaxADA: number | null,
    amountInTokens: number | string,
    handleTokenChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
    goal: number,
    amountInADA: number | string,
    handleADAChange: (event: React.ChangeEvent<HTMLInputElement>) => void
): InputField[] => [
    {
        id: 'tokens',
        label: `Total Token ${cdCampaignToken_TN}`,
        placeholder: `${cdRequestedMaxADA} ${cdCampaignToken_TN}`,
        value: amountInTokens,
        onChange: handleTokenChange,
    },
    {
        id: 'ada',
        label: 'Total ADA',
        placeholder: `${goal.toString()} $ADA`,
        value: amountInADA,
        onChange: handleADAChange,
    },
];

export interface Rectangle {
    label: string;
    information: number | string;
    img?: string;
    isDate?: boolean;
}

export const getRectangles = (cdCampaignToken_TN: string, amountInTokens: number | string, amountInADA: number | string, deliveryDate: string): Rectangle[] => [
    {
        label: `Total ${cdCampaignToken_TN} purchased`,
        information: amountInTokens,
        img: '/img/logo/logo.png',
    },
    {
        label: 'Total ADA Paid',
        information: amountInADA,
        img: ADAIC,
    },
    {
        label: 'Delivery date',
        information: formatWeekOfMonth(deliveryDate),
        isDate: true,
    },
];
