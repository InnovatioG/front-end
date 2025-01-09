import React from 'react';
import Avatar from '@/components/General/elements/pictureUpload/Avatar';
import styles from "./StepTwo.module.scss"
import DropArchive from '@/components/General/elements/dropArchive/DropArchive';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import FundrasingSlider from './FundrasingSlider';
import MinCollectorSlider from '@/components/CampaignCreation/layout/form/two/MinCollectorSlider';
import CommonsBtn from '@/components/ui/buttons/CommonsBtn';
interface StepTwoProps {
    // Define props here
}

const StepTwo: React.FC<StepTwoProps> = (props) => {
    const { setBanner, newCampaign, nextStep, setCompanyLogo } = useCampaignStore();


    const disabledButton = () => {
        return !newCampaign.banner_url || !newCampaign.logo_url || newCampaign.milestones.length === 0 || newCampaign.requestMinAda === 0n;
    };

    return (
        <article className={styles.articleContainer} >
            <h2 className={styles.title}>Add Company logo</h2>
            <section className={styles.imagenContainer}>
                <Avatar setPicture={setCompanyLogo} picture={newCampaign.logo_url} />
                <div className={styles.spanContainer}>
                    <span className={styles.span}>
                        The image shoud be 600x600 píxeles.t must be a JPG, PNG, GIF, TIFF or BMP file, no larger than 5 MB.
                    </span>
                </div>
            </section>
            <h2 className={styles.title}>Banner image</h2>
            <div>
                <DropArchive file={newCampaign.banner_url} setFile={setBanner} />
            </div>
            <div className={styles.foundraisingController}>
                <h2 className={styles.title}>Choose the raising goal and your milestones quantity</h2>
                <FundrasingSlider />
                <MinCollectorSlider />
            </div>
            <div className={styles.buttonContainerLayout}>
                <div className={styles.btnActions}>
                    <CommonsBtn
                        type="primary"
                        action={() => nextStep()}
                        content="Continue"
                        disabled={disabledButton()}
                    />
                </div>
            </div>
        </article>
    );
}

export default StepTwo;