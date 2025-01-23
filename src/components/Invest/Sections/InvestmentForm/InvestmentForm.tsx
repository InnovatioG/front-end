import useInvestmentForm from '@/components/Invest/Sections/InvestmentForm/useInvestmentForm';
import Link from 'next/link';
import React from 'react';
import LoaderDots from '../../../LoadingPage/LoaderDots';
import GeneralButtonUI from '../../../UI/Buttons/UI/Button';
import styles from './InvestmentForm.module.scss';

interface InvestmentFormProps {
    cdCampaignToken_PriceADA: number | null;
    cdCampaignToken_TN: string;
    cdRequestedMaxADA: number | null;
    goal: number;
    id: number;
    deliveryDate: string;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({ cdCampaignToken_PriceADA, cdCampaignToken_TN, cdRequestedMaxADA, goal, id, deliveryDate }) => {
    const { amountInTokens, amountInADA, apiCall, isLoading, error, success, handleTokenChange, handleADAChange, handleInvest, inputFields, rectangles } = useInvestmentForm({
        cdCampaignToken_PriceADA,
        cdCampaignToken_TN,
        cdRequestedMaxADA,
        goal,
        id,
        deliveryDate,
    });

    return (
        <article className={styles.formContainer}>
            {!apiCall ? (
                <div className={styles.inputContainer}>
                    {inputFields.map((field) => (
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
                    ))}
                    <div className={styles.buttonContainer}>
                        <Link href={`/campaign/${id}`}>
                            <GeneralButtonUI text="Back" classNameStyle="outlineb" onClick={() => { }} />
                        </Link>
                        <GeneralButtonUI text="Confirm Invest" onClick={handleInvest} classNameStyle="invest" />
                    </div>
                </div>
            ) : (
                <div className={styles.apiCallContainer}>
                    {rectangles.map((rect, index) => (
                        <RectangleWithInformation key={index} label={rect.label} information={rect.information} img={rect.img} isDate={rect.isDate} />
                    ))}
                </div>
            )}
            {isLoading && <LoaderDots />}
            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} id={id} />}
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
                {img && <img src={img} alt="icon" />}
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
                    <GeneralButtonUI text="Back to project" classNameStyle="outlineb" onClick={() => { }} />
                </Link>
            </div>
        </div>
    );
};
