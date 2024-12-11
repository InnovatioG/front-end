import type { NextPage } from 'next';
import styles from '@/styles/Admin.module.scss';
import CampaignMember from '../../components/Admin/CampaignMember/CampaignMember';

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
