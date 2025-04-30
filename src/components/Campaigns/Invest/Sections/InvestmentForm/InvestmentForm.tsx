import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import LoaderDots from '@/components/GeneralOK/LoadingPage/LoaderDots';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import styles from './InvestmentForm.module.scss';
import { useCampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { ADA_ICON } from '@/utils/constants/images';
import { formatWeekOfMonth } from '@/utils/formats';
import { hexToStr, useAppStore } from 'smart-db';
import { CampaignTabEnum, PageViewEnums, ROUTES } from '@/utils/constants/routes';
import { useCampaignDetails } from '@/hooks/useCampaingDetails';
import { HandlesEnums, ModalsEnums } from '@/utils/constants/constants';

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

export const getRectangles = (cdCampaignToken_TN: string, amountInTokens: number | string, amountInADA: number | string): Rectangle[] => [
    {
        label: `Total ${hexToStr(cdCampaignToken_TN)} purchased`,
        information: amountInTokens,
        img: '/img/logo/logo.png',
    },
    {
        label: 'Total ADA Paid',
        information: amountInADA,
        img: ADA_ICON,
    },
];

const InvestmentForm: React.FC = () => {
    const propsCampaignIdStoreSafe = useCampaignIdStoreSafe();
    const propsCampaignDetails = useCampaignDetails({
        campaign: propsCampaignIdStoreSafe.campaign,
        pageView: PageViewEnums.INVEST,
        isEditMode: propsCampaignIdStoreSafe.isEditMode,
        isValidEdit: propsCampaignIdStoreSafe.isValidEdit,
        setIsValidEdit: propsCampaignIdStoreSafe.setIsValidEdit,
        setCampaignEX: propsCampaignIdStoreSafe.setCampaignEX,
        setCampaign: propsCampaignIdStoreSafe.setCampaign,
    });

    const { campaign, isLoading, setIsLoading, setIsEditMode, fetchCampaignById, setCampaignTab } = propsCampaignIdStoreSafe;

    const handles = propsCampaignDetails.handles;

    const appStore = useAppStore();

    const [amountInTokens, setAmountInTokens] = useState<number | string>(0);
    const [amountInADA, setAmountInADA] = useState<number | string>(0);

    const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tokens = parseFloat(e.target.value) || 0;
        setAmountInTokens(tokens);
        setAmountInADA((tokens * Number(campaign.campaign.cdCampaignToken_PriceADA.toString())) / 1000000);
    };

    const handleADAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const ada = parseFloat(e.target.value) || 0;
        setAmountInADA(ada);
        setAmountInTokens(Number(campaign.campaign.cdCampaignToken_PriceADA.toString()) ? (ada * 1000000) / Number(campaign.campaign.cdCampaignToken_PriceADA.toString()) : 0);
    };

    const inputFields = getInputFields(
        hexToStr(campaign.campaign.cdCampaignToken_TN),
        Number(campaign.campaign.cdCampaignToken_PriceADA.toString()),
        amountInTokens,
        handleTokenChange,
        Number(campaign.campaign.cdCampaignToken_PriceADA.toString()),
        amountInADA,
        handleADAChange
    );

    return (
        <article className={styles.formContainer}>
            <div className={styles.inputContainer}>
                {inputFields.map(
                    (field: {
                        id: string;
                        label:
                            | string
                            | number
                            | boolean
                            | React.ReactElement<any, string | React.JSXElementConstructor<any>>
                            | Iterable<React.ReactNode>
                            | React.ReactPortal
                            | null
                            | undefined;
                        placeholder: string | undefined;
                        value: string | number | readonly string[] | undefined;
                        onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
                    }) => (
                        <div key={field.id} className={styles.inputContainer}>
                            <label htmlFor={field.id} className={styles.label}>
                                {field.label}
                            </label>
                            <input
                                type="number"
                                id={field.id}
                                placeholder={field.placeholder}
                                className={styles.input}
                                value={field.value === 0 ? '' : field.value}
                                onChange={field.onChange}
                            />
                        </div>
                    )
                )}
                <div className={styles.buttonContainer}>
                    <Link href={`${ROUTES.campaignViewTab(campaign.campaign._DB_id, CampaignTabEnum.DETAILS)}`}>
                        <BtnGeneral onClick={() => {}} classNameStyle="outlineb" text="Cancel" />
                    </Link>
                    <BtnGeneral
                        text="Confirm Invest"
                        onClick={() => {
                            if (handles[HandlesEnums.INVEST]) handles[HandlesEnums.INVEST]({ amount: amountInTokens });
                        }}
                        classNameStyle="invest"
                    />
                </div>
            </div>
            {appStore.isProcessingTx === true && <LoaderDots />}
        </article>
    );
};

export default InvestmentForm;

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{message}</p>
        </div>
    );
};

const RectangleWithInformation: React.FC<{ label: string; img?: string; information: number | string; isDate?: boolean; children?: React.ReactNode }> = ({
    label,
    img,
    information,
    children,
    isDate,
}) => {
    return (
        <div className={styles.rectangleContainer}>
            <label htmlFor="">{label}</label>
            <div className={styles.rectangle}>
                {img && <Image src={img} alt="icon" width={50} height={50} />}
                <h3 className={isDate ? styles.date : undefined}>{information}</h3>
            </div>
            {children}
        </div>
    );
};

const SuccessMessage: React.FC<{ message: string; id: number }> = ({ message, id }) => {
    return (
        <div className={styles.successContainer}>
            <p className={styles.successMessage}>{message}</p>
            <div className={styles.buttonContainerMessage}>
                <Link href={`campaign/${id}`}>
                    <BtnGeneral text="Back to project" classNameStyle="outlineb" onClick={() => {}} />
                </Link>
            </div>
        </div>
    );
};
