import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import BtnConnectWallet from '@/components/GeneralOK/Buttons/Buttons/BtnConnectWallet/BtnConnectWallet';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { ProtocolApi } from '@/lib/SmartDB/FrontEnd';
import styles from './AdminDashboard.module.scss';
import { LucidToolsFrontEnd, pushSucessNotification, pushWarningNotification, useWalletStore } from 'smart-db';

// Import admin components
import Campaign from '@/components/Admin/Campaign/Campaign';
import CampaignCategory from '@/components/Admin/CampaignCategory/CampaignCategory';
import CampaignContent from '@/components/Admin/CampaignContent/CampaignContent';
import CampaignFaqs from '@/components/Admin/CampaignFaqs/CampaignFaqs';
import CampaignFunds from '@/components/Admin/CampaignFunds/CampaignFunds';
import CampaignMember from '@/components/Admin/CampaignMember/CampaignMember';
import CampaignStatus from '@/components/Admin/CampaignStatus/CampaignStatus';
import CampaignSubmission from '@/components/Admin/CampaignSubmission/CampaignSubmission';
import Milestone from '@/components/Admin/Milestone/Milestone';
import MilestoneStatus from '@/components/Admin/MilestoneStatus/MilestoneStatus';
import MilestoneSubmission from '@/components/Admin/MilestoneSubmission/MilestoneSubmission';
import ProtocolAdminWallet from '@/components/Admin/ProtocolAdminWallet/ProtocolAdminWallet';
import Protocol from '@/components/Admin/Protocol/Protocol';
import SubmissionStatus from '@/components/Admin/SubmissionStatus/SubmissionStatus';
import Wallet from '@/components/Admin/Wallet/Wallet';
import { fetchGeneralStoreData } from '@/store/generalStore/useGeneralStore';

const AdminDashboard = () => {
    const router = useRouter();
    const { entity } = router.query;
    const walletStore = useWalletStore();
    const { screenSize } = useResponsive();
    const [sidebarOpen, setSidebarOpen] = useState(true); // Toggle sidebar visibility

    // Admin sections
    const pages = [
        { name: 'Protocol', entity: 'protocol' },
        { name: 'Wallet', entity: 'wallet' },
        { name: 'Campaign Status', entity: 'campaign-status' },
        { name: 'Milestone Status', entity: 'milestone-status' },
        { name: 'Submission Status', entity: 'submission-status' },
        { name: 'Campaign Category', entity: 'campaign-category' },
        { name: 'Campaign', entity: 'campaign' },
        { name: 'Campaign Content', entity: 'campaign-content' },
        { name: 'Campaign Member', entity: 'campaign-member' },
        { name: 'Campaign FAQs', entity: 'campaign-faqs' },
        { name: 'Campaign Submission', entity: 'campaign-submission' },
        { name: 'Campaign Funds', entity: 'campaign-funds' },
        { name: 'Milestone', entity: 'milestone' },
        { name: 'Milestone Submission', entity: 'milestone-submission' },
        { name: 'Protocol Admin Wallet', entity: 'protocol-admin-wallet' },
    ];

    // Map entity names to components
    const entityComponents: Record<string, JSX.Element> = useMemo(
        () => ({
            campaign: <Campaign />,
            'campaign-category': <CampaignCategory />,
            'campaign-content': <CampaignContent />,
            'campaign-faqs': <CampaignFaqs />,
            'campaign-funds': <CampaignFunds />,
            'campaign-member': <CampaignMember />,
            'campaign-status': <CampaignStatus />,
            'campaign-submission': <CampaignSubmission />,
            milestone: <Milestone />,
            'milestone-status': <MilestoneStatus />,
            'milestone-submission': <MilestoneSubmission />,
            'protocol-admin-wallet': <ProtocolAdminWallet />,
            protocol: <Protocol />,
            'submission-status': <SubmissionStatus />,
            wallet: <Wallet />,
        }),
        []
    );

    const handlePopulateDB = async () => {
        try {
            if (confirm('Are you sure you want to populate the database?')) {
                const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
                const response = await ProtocolApi.populateApi(walletTxParams);
                await fetchGeneralStoreData();
                if (response === false) throw 'Failed to populate database';
                pushSucessNotification('Success', 'Database populated successfully', false);
            }
        } catch (error) {
            pushWarningNotification('Error', `Failed to populate database: ${error}`);
        }
    };

    const handleNavigate = (entityName: string) => {
        router.push({ pathname: '/admin', query: { entity: entityName } }, undefined, { shallow: true });
    };

    if (!walletStore.isConnected || !walletStore.info?.isWalletValidatedWithSignedToken) {
        return (
            <div className={styles.campaignSection}>
                <div className={styles.mainSection}>
                    <h2 className={styles.title}>Connect your wallet in Admin Mode to continue</h2>
                    <div className={styles.btns}>
                        <BtnConnectWallet type="primary" width={screenSize === 'desktop' ? 225 : undefined} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.adminDashboard}>
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : styles.closed}`}>
                <button className={styles.toggleButton} onClick={() => setSidebarOpen(!sidebarOpen)}>
                    {sidebarOpen ? '❮' : '❯'}
                </button>
                <ul className={styles.navList}>
                    <li>
                        <BtnGeneral onClick={handlePopulateDB} classNameStyle="fill">
                            Populate DB
                        </BtnGeneral>
                    </li>
                    {pages.map((page) => (
                        <li key={page.entity}>
                            <BtnGeneral onClick={() => handleNavigate(page.entity)} classNameStyle="fill">
                                {page.name}
                            </BtnGeneral>
                        </li>
                    ))}
                </ul>
            </aside>

            <main className={styles.content}>
                <div className={styles.header}>
                    <h1>Admin Dashboard {entity && entityComponents[entity as string] ? ` > ${pages.find((p) => p.entity === (entity as string))?.name}` : null}</h1>
                    {entity && entityComponents[entity as string] ? (
                        <button onClick={() => handleNavigate('')} className={styles.close}>
                            X
                        </button>
                    ) : null}
                </div>
                {entity && entityComponents[entity as string] ? entityComponents[entity as string] : <p>Select a section from the sidebar</p>}
            </main>
        </div>
    );
};

export default AdminDashboard;
