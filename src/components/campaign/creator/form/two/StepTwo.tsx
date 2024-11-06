import React from 'react';
import Avatar from '@/components/general/pictureUpload/Avatar';
import styles from "./StepTwo.module.scss"
import DropArchive from '@/components/general/dropArchive/DropArchive';
import { useCampaignStore } from '@/store/campaign/useCampaignStore';
import FundrasingSlider from './FundrasingSlider';
interface StepTwoProps {
    // Define props here
}

const StepTwo: React.FC<StepTwoProps> = (props) => {
    const { setBanner, newCampaign } = useCampaignStore();

    console.log(newCampaign)

    return (
        <article className={styles.articleContainer} >
            <h2 className={styles.title}>Add Company logo</h2>
            <section className={styles.imagenContainer}>
                <Avatar />
                <div className={styles.spanContainer}>
                    <span className={styles.span}>
                        The image shoud be 600x600 píxeles.t must be a JPG, PNG, GIF, TIFF or BMP file, no larger than 5 MB.
                    </span>
                </div>
            </section>
            <h2 className={styles.title}>Banner image</h2>
            <div>
                <DropArchive file={newCampaign.banner_image} setFile={setBanner} />
            </div>
            <FundrasingSlider />
        </article>
    );
}

export default StepTwo;