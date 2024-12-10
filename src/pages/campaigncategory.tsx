import type { NextPage } from 'next';
import styles from './index.module.scss';
import CampaignCategory from '../components/public/CampaignCategory/CampaignCategory';

const CampaignCategoryPage: NextPage = () => {
    return (
        <>
            <main >
                <CampaignCategory />
            </main>
        </>
    );
};

export default CampaignCategoryPage;
