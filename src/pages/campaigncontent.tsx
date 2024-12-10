import type { NextPage } from 'next';
import styles from './index.module.scss';
import CampaignContent from '../components/public/CampaignContent/CampaignContent';

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
