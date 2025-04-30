import React, { useEffect, useMemo } from 'react';
import styles from './FormStep02.module.scss';
import { ICampaignIdStoreSafe } from '@/store/campaignId/useCampaignIdStoreSafe';
import { isNullOrBlank } from 'smart-db';
import { REQUESTED_MAX_ADA, REQUESTED_MIN_ADA, REQUESTED_MIN_PERCENTAGE_FROM_MAX } from '@/utils/constants/constants';
import { isBlobURL } from '@/utils/utils';
import Avatar from '@/components/GeneralOK/Avatar/Avatar';
import CommonsBtn from '@/components/General/Buttons/CommonsBtn/CommonsBtn';
import BannerCampaign from '@/components/GeneralOK/BannerCampaign/BannerCampaign';
import FundrasingSlider from './FundrasingSlider/FundrasingSlider';
import MinCollectorSlider from './MinCollectorSlider/MinCollectorSlider';
import { CampaignEntity, MilestoneEntity } from '@/lib/SmartDB/Entities';
import { MilestoneEX } from '@/types/types';
import { getMilestoneStatus_Db_Id_By_Code_Id } from '@/utils/campaignHelpers';
import { MilestoneStatus_Code_Id_Enums } from '@/utils/constants/status/status';

interface FormStep02Props {
    step: number;
    setStep: (step: number) => void;
}
const FormStep02: React.FC<FormStep02Props & ICampaignIdStoreSafe> = (props: FormStep02Props & ICampaignIdStoreSafe) => {
    const { campaign, setCampaignEX, setCampaign, step, setStep, isValidEdit, setIsValidEdit } = props;
    const { banner_url, logo_url, requestedMaxADA, requestedMinADA } = campaign.campaign;
    const milestones = useMemo(() => [...(campaign.milestones ?? [])].sort((a, b) => a.milestone.order - b.milestone.order), [campaign]);

    useEffect(() => {
        let isValidEdit = false;
        if (
            !isNullOrBlank(banner_url) &&
            !isNullOrBlank(logo_url) &&
            (milestones?.length ?? 0) > 0 &&
            (requestedMaxADA ?? 0n) >= REQUESTED_MIN_ADA &&
            (requestedMaxADA ?? 0n) <= REQUESTED_MAX_ADA &&
            (requestedMinADA ?? 0n) >= REQUESTED_MIN_ADA &&
            Number(requestedMinADA ?? 0n) >= Number(requestedMaxADA) * REQUESTED_MIN_PERCENTAGE_FROM_MAX &&
            (requestedMinADA ?? 0n) <= requestedMaxADA
        ) {
            isValidEdit = true;
        }
        setIsValidEdit(isValidEdit);
    }, [campaign]);

    const handleChangeAvatar = (picture: string) => {
        // Me aseguro de que si el member tenia imagen cargada en s3, la voy a eliminar
        let files_to_delete: string[] = [...(campaign.files_to_delete || [])];
        if (!isNullOrBlank(campaign.campaign.logo_url) && !isBlobURL(campaign.campaign.logo_url)) {
            files_to_delete.push(campaign.campaign.logo_url!);
        }
        campaign.campaign.logo_url = picture;
        setCampaignEX({
            ...campaign,
            files_to_delete,
        });
    };

    const handleChangeBanner = (picture: string) => {
        let files_to_delete: string[] = [...(campaign.files_to_delete || [])];
        if (!isNullOrBlank(campaign.campaign.banner_url) && !isBlobURL(campaign.campaign.banner_url)) {
            files_to_delete.push(campaign.campaign.banner_url!);
        }
        campaign.campaign.banner_url = picture;
        setCampaignEX({
            ...campaign,
            files_to_delete,
        });
    };

    const handleBigIntChange = (id: string, value: bigint) => {
        setCampaign(
            new CampaignEntity({
                ...campaign.campaign,
                [id]: value,
            })
        );
    };

    const handleChangeRequestedMaxADA = (value: bigint) => {
        handleBigIntChange('requestedMaxADA', value);
    };
    const handleChangeRequestedMinADA = (value: bigint) => {
        handleBigIntChange('requestedMinADA', value);
    };

    const handleSetNumOfMilestones = (numMilestones: number) => {
        if (numMilestones < 1) return; // Ensure at least one milestone

        const basePercentage = Math.floor(100 / numMilestones); // Round down
        let remainingPercentage = 100 - basePercentage * numMilestones; // Calculate leftover

        // Create an array of new milestones
        const newMilestones: MilestoneEX[] = Array.from({ length: numMilestones }, (_, index) => {
            const newMilestone = new MilestoneEntity();
            newMilestone.campaign_id = campaign.campaign._DB_id;
            newMilestone.milestone_status_id = getMilestoneStatus_Db_Id_By_Code_Id(MilestoneStatus_Code_Id_Enums.NOT_STARTED);
            newMilestone.percentage = basePercentage;
            newMilestone.estimate_delivery_days = 28;
            newMilestone.order = index + 1;
            // Add remaining percentage to the last milestone
            if (index === numMilestones - 1) {
                newMilestone.percentage += remainingPercentage;
            }
            return { milestone: newMilestone } as MilestoneEX;
        });

        // Update campaign milestones
        setCampaignEX({
            ...campaign,
            milestones: newMilestones, // ✅ Replace old milestones with new ones
        });
    };

    return (
        <article className={styles.articleContainer}>
            <h2 className={styles.title}>Add Company logo</h2>
            <section className={styles.imagenContainer}>
                <Avatar name={campaign.campaign.name} picture={campaign.campaign.logo_url || ''} setPicture={(picture) => handleChangeAvatar(picture)} isEditing={true} />
                <div className={styles.spanContainer}>
                    <span className={styles.span}>The image shoud be 600x600 píxeles.t must be a JPG, PNG, GIF, TIFF or BMP file, no larger than 5 MB.</span>
                </div>
            </section>
            <h2 className={styles.title}>Banner image</h2>
            <div>
                {/* <DropArchive file={newCampaign.banner_url} setFile={setBanner} /> */}
                <BannerCampaign picture={campaign.campaign.banner_url || ''} setPicture={(picture) => handleChangeBanner(picture)} isEditing={true} />
            </div>
            <div className={styles.foundraisingController}>
                <h2 className={styles.title}>Choose the raising goal and your milestones quantity</h2>
                <FundrasingSlider {...props} handleChangeRequestedMaxADA={handleChangeRequestedMaxADA} handleSetNumOfMilestones={handleSetNumOfMilestones} />
                <MinCollectorSlider {...props} handleChangeRequestedMinADA={handleChangeRequestedMinADA} />
            </div>
            <div className={styles.buttonContainerLayout}>
                <div className={styles.btnActions}>
                    <CommonsBtn type="primary" action={() => setStep(3)} content="Continue" disabled={!isValidEdit} />
                </div>
            </div>
        </article>
    );
};

export default FormStep02;
