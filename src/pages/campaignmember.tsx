import type { NextPage } from 'next';
import styles from './index.module.scss';
import CampaignMember from '../components/public/CampaignMember/CampaignMember';

const CampaignMemberPage: NextPage = () => {
    return (
        <>
            <main >
                <CampaignMember />
            </main>
        </>
    );
};

export default CampaignMemberPage;
