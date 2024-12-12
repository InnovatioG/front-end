import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CampaignCategory from '../../components/Admin/CampaignCategory/CampaignCategory';

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
