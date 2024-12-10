import type { NextPage } from 'next';
import styles from './index.module.scss';
import Campaign from '../components/public/Campaign/Campaign';

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
