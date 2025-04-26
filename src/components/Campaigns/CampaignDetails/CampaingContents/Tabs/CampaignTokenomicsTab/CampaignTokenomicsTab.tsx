import { ICampaignDetails } from '@/hooks/useCampaingDetails';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import React, { useEffect } from 'react';
import EmptyState from '../EmpyState/EmptyState';
import styles from './CampaignTokenomicsTab.module.scss';
import { formatMoneyByADAOrDollar } from '@/store/generalStore/useGeneralStore';
import { PageViewEnums } from '@/utils/constants/routes';
import { isNullOrBlank } from 'smart-db';
import TextEditor from '@/components/GeneralOK/Controls/TextEditor/TextEditor';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import Checkbox from '@/components/General/Buttons/Checkbox/Checkbox';
import Slider from '@/components/General/Slider/Slider/Slider';
import { formatMoney } from '@/utils/formats';
import { REQUESTED_MAX_ADA, REQUESTED_MIN_ADA } from '@/utils/constants/constants';

interface IInputField {
    id: string;
    label: string;
    type: string;
    placeholder: string;
    transformFrom: (value: string) => any;
    transformTo: (value: any) => string;
}

const CampaignTokenomicsTab: React.FC<ICampaignIdStoreSafe & ICampaignDetails> = (props) => {
    const { setCampaignEX, setCampaign, campaign, setIsValidEdit, isValidEdit } = props;
    const {
        mint_CampaignToken,
        requestedMaxADA,
        requestedMinADA,
        campaignToken_CS,
        campaignToken_TN,
        campaignToken_PriceADA,
        tokenomics_max_supply,
        tokenomics_for_campaign,
        tokenomics_description,
    } = campaign.campaign;

    const conditionsToPrompForEdit =
        requestedMaxADA === 0n &&
        requestedMinADA === 0n &&
        tokenomics_max_supply === 0n &&
        tokenomics_for_campaign === 0n &&
        isNullOrBlank(campaignToken_TN) &&
        isNullOrBlank(campaignToken_CS) &&
        isNullOrBlank(tokenomics_description);

    const isEditing = props.pageView === PageViewEnums.MANAGE && props.isEditMode === true;

    useEffect(() => {
        if (requestedMinADA > requestedMaxADA) {
            setCampaign(
                new CampaignEntity({
                    ...campaign.campaign,
                    requestedMinADA: requestedMaxADA,
                })
            );
        }
    }, [requestedMaxADA]);

    useEffect(() => {
        if (tokenomics_for_campaign > tokenomics_max_supply) {
            setCampaign(
                new CampaignEntity({
                    ...campaign.campaign,
                    tokenomics_for_campaign: tokenomics_max_supply,
                })
            );
        }
    }, [tokenomics_max_supply]);

    useEffect(() => {
        setCampaign(
            new CampaignEntity({
                ...campaign.campaign,
                tokenomics_max_supply: tokenomics_for_campaign,
            })
        );
    }, [mint_CampaignToken]);

    useEffect(() => {
        let newPrice = 0;
        let validPrice = false;
        if (requestedMaxADA > 0n && tokenomics_for_campaign > 0n) {
            newPrice = Number(requestedMaxADA * 1000000n) / Number(tokenomics_for_campaign);
            validPrice = Number(requestedMaxADA * 1000000n) % Number(tokenomics_for_campaign) === 0;
        } else {
            newPrice = 0;
        }

        // const conditionsToValidate = !isNullOrBlank(campaignToken_TN) && !isNullOrBlank(campaignToken_CS) 
        // && conditionsToValidate
        if (validPrice ) {
            setIsValidEdit(true);
        } else {
            setIsValidEdit(false);
        }
        setCampaign(
            new CampaignEntity({
                ...campaign.campaign,
                campaignToken_PriceADA: BigInt(Math.round(newPrice)),
            })
        );
    }, [tokenomics_for_campaign]);

    const handleInputChange = (id: string, value: string, transform: (value: string) => any) => {
        setCampaign(
            new CampaignEntity({
                ...campaign.campaign,
                [id]: transform(value),
            })
        );
    };

    const handleBigIntChange = (id: string, value: bigint) => {
        setCampaign(
            new CampaignEntity({
                ...campaign.campaign,
                [id]: value,
            })
        );
    };

    const inputFieldsTokenWhenProviding = (campaign: CampaignEntity): IInputField[] => [
        {
            id: 'campaignToken_CS',
            label: 'Token Currency Symbol',
            type: 'text',
            placeholder: 'Currency Policy Hex',
            transformFrom: (value: string) => value,
            transformTo: (value: string) => value,
        },
        {
            id: 'campaignToken_TN',
            label: 'Token Tick Name',
            type: 'text',
            placeholder: 'Token Name Hex',
            transformFrom: (value: string) => value,
            transformTo: (value: string) => value,
        },
    ];

    const inputFieldsTokenWhenMinting = (campaign: CampaignEntity): IInputField[] => [
        {
            id: 'campaignToken_TN',
            label: 'Token Currency Symbol',
            type: 'text',
            placeholder: 'Token Name Hex',
            transformFrom: (value: string) => value,
            transformTo: (value: string) => value,
        },
    ];

    const fields = mint_CampaignToken ? inputFieldsTokenWhenMinting(campaign.campaign) : inputFieldsTokenWhenProviding(campaign.campaign);

    if (conditionsToPrompForEdit && props.pageView === PageViewEnums.MANAGE && props.isEditMode === false) {
        return <EmptyState {...props} />;
    }

    if (isEditing) {
        return (
            <div className={styles.layout}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>Explain your tokenomics:</h2>
                    <div className={`${styles.singleInputContainer}`}>
                        <label className={styles.label}>Token Supply for This Campaign</label>
                        <Checkbox
                            checked={mint_CampaignToken || false}
                            onChange={(e) => handleInputChange('mint_CampaignToken', e === true ? 'Y' : 'N', (v) => v === 'Y')}
                            label="This campaign will mint its own tokens"
                        />
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className={`${styles.singleInputContainer} ${index === 0 ? styles.fullWidth : ''}`}>
                            <label className={styles.label}>{field.label}</label>
                            <input
                                className={styles.input}
                                type={field.type}
                                value={field.transformTo((campaign.campaign as any)[field.id]) || ''}
                                placeholder={field.placeholder}
                                onChange={(e) => handleInputChange(field.id, e.target.value, field.transformFrom)}
                            />
                        </div>
                    ))}
                    <div className={`${styles.singleInputContainer}`}>
                        <label className={styles.label}>Target Amount ADA (Fundraise Goal)</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={requestedMaxADA?.toString() || ''}
                            placeholder={'Target Amount ADA'}
                            onChange={(e) => handleInputChange('requestedMaxADA', e.target.value, (s) => BigInt(s))}
                        />
                        <Slider value={requestedMaxADA} setValue={(v) => handleBigIntChange('requestedMaxADA', v)} min={REQUESTED_MIN_ADA} max={REQUESTED_MAX_ADA} step={1000} />
                    </div>
                    <div className={`${styles.singleInputContainer}`}>
                        <label className={styles.label}>Minimum Requested ADA</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={requestedMinADA?.toString() || ''}
                            placeholder={'Minimum Requested ADA'}
                            onChange={(e) => handleInputChange('requestedMinADA', e.target.value, (s) => BigInt(s))}
                        />
                        <Slider value={requestedMinADA} setValue={(v) => handleBigIntChange('requestedMinADA', v)} min={REQUESTED_MIN_ADA} max={requestedMaxADA} step={1000} />
                    </div>
                    {mint_CampaignToken === false && (
                        <div className={`${styles.singleInputContainer}`}>
                            <label className={styles.label}>Total Token Supply</label>
                            <input
                                className={styles.input}
                                type="number"
                                value={tokenomics_max_supply?.toString() || ''}
                                placeholder={'Total Token Supply'}
                                onChange={(e) => handleInputChange('tokenomics_max_supply', e.target.value, (s) => BigInt(s))}
                            />
                            <Slider
                                value={tokenomics_max_supply}
                                setValue={(v) => handleBigIntChange('tokenomics_max_supply', v)}
                                min={REQUESTED_MIN_ADA}
                                max={REQUESTED_MAX_ADA}
                                step={1000}
                            />
                        </div>
                    )}
                    <div className={`${styles.singleInputContainer}`}>
                        <label className={styles.label}>{mint_CampaignToken ? 'Total Tokens to Mint' : 'Tokens Allocated to Campaign'}</label>
                        <input
                            className={styles.input}
                            type="number"
                            value={tokenomics_for_campaign?.toString() || ''}
                            placeholder={mint_CampaignToken ? 'Total Tokens to Mint' : 'Tokens Allocated to Campaign'}
                            onChange={(e) => handleInputChange('tokenomics_for_campaign', e.target.value, (s) => BigInt(s))}
                        />
                        <Slider
                            value={tokenomics_for_campaign ?? 0n}
                            setValue={(v) => handleBigIntChange('tokenomics_for_campaign', v)}
                            min={0n}
                            max={mint_CampaignToken ? 1000000n : tokenomics_max_supply}
                            step={1000}
                        />
                    </div>
                    <div className={`${styles.singleInputContainer}`}>
                        <label className={styles.label}>Token Price</label>
                        <span className={styles.strong}>{formatMoney(Number(campaignToken_PriceADA) / 1000000, 'ADA')}</span>

                        {/* <input
                            className={styles.input}
                            type="number"
                            value={campaignToken_PriceADA?.toString() || ''}
                            placeholder={'Token Price ADA'}
                            onChange={(e) => handleInputChange('campaignToken_PriceADA', e.target.value, (s) => BigInt(s))}
                        />
                        <Slider value={campaignToken_PriceADA ?? 0n} setValue={(v) => handleBigIntChange('campaignToken_PriceADA', v)} min={0n} max={1000000n} step={1000} /> */}
                    </div>
                    <div className={styles.textEditorContainer}>
                        <TextEditor
                            styleOption="quillEditorB"
                            content={campaign.campaign.tokenomics_description || ''}
                            onChange={(content) => handleInputChange('tokenomics_description', content, (value) => value)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.layout}>
            <div className={styles.tokenomicsContainer}>
                <div className={styles.row}>
                    <div className={styles.container}>
                        <span className={styles.title}>Token Policy:</span>
                        <span className={styles.strong}>{campaignToken_CS}</span>
                    </div>
                    <div className={styles.container}>
                        <span className={styles.title}>Token Tick Name:</span>
                        <span className={styles.strong}>{campaignToken_TN}</span>
                    </div>
                </div>
                <div className={styles.container}>
                    <span className={styles.title}>Token Supply for This Campaign:</span>
                    <span className={styles.strong}>{mint_CampaignToken === true ? 'This campaign will mint its own tokens' : 'This campaign will use an existing token'}</span>
                </div>
                {mint_CampaignToken ? (
                    <div className={styles.container}>
                        <span className={styles.title}>Total Tokens to Mint:</span>
                        <span className={styles.strong}>{tokenomics_for_campaign.toLocaleString()}</span>
                    </div>
                ) : (
                    <>
                        <div className={styles.row}>
                            <div className={styles.container}>
                                <span className={styles.title}>Total Token Supply:</span>
                                <span className={styles.strong}>{tokenomics_max_supply.toLocaleString()}</span>
                            </div>
                            <div className={styles.container}>
                                <span className={styles.title}>Tokens Allocated to Campaign:</span>
                                <span className={styles.strong}>{tokenomics_for_campaign.toLocaleString()}</span>
                            </div>
                        </div>
                    </>
                )}
                <div className={styles.row}>
                    <div className={styles.container}>
                        <span className={styles.title}>Target Amount ADA (Fundraise Goal):</span>
                        <span className={styles.strong}>{requestedMaxADA.toLocaleString()}</span>
                    </div>
                    <div className={styles.container}>
                        <span className={styles.title}>Minimum Requested ADA:</span>
                        <span className={styles.strong}>{requestedMinADA.toLocaleString()}</span>
                    </div>
                </div>
                <div className={styles.container}>
                    <span className={styles.title}>Token Price:</span>
                    <span className={styles.strong}>{formatMoneyByADAOrDollar(Number(campaignToken_PriceADA) / 1000000)}</span>
                </div>
            </div>
            <div className={styles.description} dangerouslySetInnerHTML={tokenomics_description ? { __html: tokenomics_description } : undefined} />
        </div>
    );
};

export default CampaignTokenomicsTab;
