import BtnGeneral from '@/components/GeneralOK/Buttons/BtnGeneral/BtnGeneral';
import { ProtocolApi } from '@/lib/SmartDB/FrontEnd';
import styles from '@/styles/Admin.module.scss';
import type { NextPage } from 'next';
import Link from 'next/link';
import { LucidToolsFrontEnd, pushSucessNotification, pushWarningNotification, useWalletStore } from 'smart-db';

const AdminDashboard: NextPage = () => {
    const pages = [
        { name: 'Campaign Category', path: '/admin/campaign-category' },
        { name: 'Campaign Content', path: '/admin/campaign-content' },
        { name: 'Campaign FAQs', path: '/admin/campaign-faqs' },
        { name: 'Campaign Funds', path: '/admin/campaign-funds' },
        { name: 'Campaign Member', path: '/admin/campaign-member' },
        { name: 'Campaign Status', path: '/admin/campaign-status' },
        { name: 'Campaign Submission', path: '/admin/campaign-submission' },
        { name: 'Campaign', path: '/admin/campaign' },
        { name: 'Milestone Status', path: '/admin/milestone-status' },
        { name: 'Milestone Submission', path: '/admin/milestone-submission' },
        { name: 'Milestone', path: '/admin/milestone' },
        { name: 'Protocol Admin Wallet', path: '/admin/protocol-admin-wallet' },
        { name: 'Protocol', path: '/admin/protocol' },
        { name: 'Submission Status', path: '/admin/submission-status' },
        { name: 'Wallet', path: '/admin/wallet' },
    ];

    const walletStore = useWalletStore();

    const handlePopulateDB = async () => {
        try {
            //--------------------------------------
            const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
            //--------------------------------------
            const response = await ProtocolApi.populateApi(walletTxParams);
            if (response === false) {
                throw 'Failed to populate database';
            }
            pushSucessNotification('Success', 'Database populated successfully', false);
        } catch (error) {
            pushWarningNotification('Error', `Failed to populate database: ${error}`);
        }
    };

    return (
        <main className={styles.dashboard}>
            <h1>Admin Dashboard</h1>
            <div className="mb-6">
                <BtnGeneral onClick={handlePopulateDB} className="bg-blue-600 hover:bg-blue-700">
                    Populate Database
                </BtnGeneral>
            </div>
            <ul className={styles.pageList}>
                {pages.map((page) => (
                    <li key={page.path}>
                        <Link href={page.path}>{page.name}</Link>
                    </li>
                ))}
            </ul>
        </main>
    );
};

export default AdminDashboard;
