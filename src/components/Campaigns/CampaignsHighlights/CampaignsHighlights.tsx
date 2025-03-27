import { CHART, COLABORATORS, CONTRIBUITED, LAUNCHED, USER, USERS } from '@/utils/constants/images';
import Image from 'next/image';
import styles from './CampaignsHighlights.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { formatMoneyByADAOrDollar, useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignsStatus_Code_Ids_For_Investors } from '@/utils/constants/status/status';

export default function CampaignHighlights() {
    const { campaignStatus, campaignCategories, wallet } = useGeneralStore();
    const [launchedCampaigns, setLaunchedCampaigns] = useState<number>(0);
    const [contribuitedADA, setContribuitedADA] = useState<number>(0);
    const [colaborators, setColaborators] = useState<number>(0);

    const fetchCampaignsEX = useCallback(async () => {
        let filterConditions: any[] = [];
        const campaignStatusIdsForInvestors = campaignStatus.filter((status) => CampaignsStatus_Code_Ids_For_Investors.includes(status.code_id)).map((status) => status._DB_id);
        if (campaignStatusIdsForInvestors.length > 0) {
            filterConditions.push({ campaign_status_id: { $in: campaignStatusIdsForInvestors } });
        }
        const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};
        const {count: launchedCampaigns} = await CampaignApi.getCountApi_(filter);
        const campaigns: CampaignEntity[] = await CampaignApi.getByParamsApi_(filter, { fieldsForSelect: { cdFundedADA: true, investors: true } });
        setLaunchedCampaigns(launchedCampaigns);
        const contribuitedADA = campaigns.reduce((acc, campaign) => acc + (campaign.cdFundedADA ?? 0n), 0n);
        setContribuitedADA(Number(contribuitedADA));
        const colaborators = campaigns.reduce((acc, campaign) => acc + (campaign.investors ?? 0), 0);
        setColaborators(colaborators);
    }, [campaignStatus]);

    useEffect(() => {
        fetchCampaignsEX();
    }, [fetchCampaignsEX]);
    return (
        <div className={styles.cardSection}>
            <div className={styles.card}>
                <svg width="18" height="18" className={styles.icon}>
                    <use href={USERS}></use>
                </svg>
                <div className={styles.dataCard}>
                    <p className={styles.data}>{launchedCampaigns}</p>
                    <p className={styles.text}>Launched campaigns</p>
                </div>
                <div className={styles.pictureContainer}>
                    <Image layout="fill" objectFit="contain" src={LAUNCHED} alt="launched-campaigns" className={styles.imageCard} objectPosition={'bottom right'} />
                </div>
            </div>
            <div className={styles.card}>
                <svg width="18" height="18" className={styles.icon}>
                    <use href={CHART}></use>
                </svg>
                <div className={styles.dataCard}>
                    <p className={styles.data}>{formatMoneyByADAOrDollar(contribuitedADA)}</p>
                    <p className={styles.text}>Contribuited</p>
                </div>
                <div className={styles.pictureContainer}>
                    <Image layout="fill" objectFit="contain" src={CONTRIBUITED} alt="ADA-contribuited" className={styles.imageCard} objectPosition={'bottom right'} />
                </div>
            </div>
            <div className={styles.card}>
                <svg width="18" height="18" className={styles.icon}>
                    <use href={USER}></use>
                </svg>
                <div className={styles.dataCard}>
                    <p className={styles.data}>{colaborators}</p>
                    <p className={styles.text}>Colaborators</p>
                </div>
                <div className={styles.pictureContainer}>
                    <Image layout="fill" objectFit="contain" src={COLABORATORS} alt="colaborators" className={styles.imageCard} objectPosition={'bottom right'} />
                </div>
            </div>
        </div>
    );
}
