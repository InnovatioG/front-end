import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import Campaign from '../../components/Admin/Campaign/Campaign';

const CampaignPage: NextPage = () => {
    return (
        <>
            <main >
                <Campaign />
            </main>
        </>
    );
};

export default CampaignPage;
