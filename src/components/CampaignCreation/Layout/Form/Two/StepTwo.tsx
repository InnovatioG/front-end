import MinCollectorSlider from '@/components/CampaignCreation/Layout/Form/Two/MinCollectorSlider';
import DropArchive from '@/components/General/Elements/DropArchive/DropArchive';
import Avatar from '@/components/General/Elements/PictureUpload/Avatar';
import CommonsBtn from '@/components/UI/Buttons/CommonsBtn';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import React from 'react';
import FundrasingSlider from './FundrasingSlider';
import styles from './StepTwo.module.scss';
interface StepTwoProps {
    // Define props here
}

const StepTwo: React.FC<StepTwoProps> = (props) => {
    const { setBanner, newCampaign, nextStep, setCompanyLogo } = useCampaignStore();

    const disabledButton = () => {
        return !newCampaign.banner_url || !newCampaign.logo_url || newCampaign.milestones.length === 0 || newCampaign.min_request === 0;
    };

    return (
        <article className={styles.articleContainer}>
            <h2 className={styles.title}>Add Company logo</h2>
            <section className={styles.imagenContainer}>
                <Avatar setPicture={setCompanyLogo} picture={newCampaign.logo_url} />
                <div className={styles.spanContainer}>
                    <span className={styles.span}>The image shoud be 600x600 píxeles.t must be a JPG, PNG, GIF, TIFF or BMP file, no larger than 5 MB.</span>
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
                    <CommonsBtn type="primary" action={() => nextStep()} content="Continue" disabled={disabledButton()} />
                </div>
            </div>
        </article>
    );
};

export default StepTwo;
