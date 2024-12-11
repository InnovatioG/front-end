import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CampaignContent from '../../components/Admin/CampaignContent/CampaignContent';

const CampaignContentPage: NextPage = () => {
    return (
        <>
            <main >
                <CampaignContent />
            </main>
        </>
    );
};

export default CampaignContentPage;
