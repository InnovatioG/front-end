import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '@/styles/Admin.module.scss';

const AdminDashboard: NextPage = () => {
    const pages = [
        { name: 'Campaign Category', path: '/admin/campaign-category' },
        { name: 'Campaign Content', path: '/admin/campaign-content' },
        { name: 'Campaign FAQs', path: '/admin/campaign-faqs' },
        { name: 'Campaign Member', path: '/admin/campaign-member' },
        { name: 'Campaign Status', path: '/admin/campaign-status' },
        { name: 'Campaign Submission', path: '/admin/campaign-submission' },
        { name: 'Campaign', path: '/admin/campaign' },
        { name: 'Custom Wallet', path: '/admin/custom-wallet' },
        { name: 'Milestone Status', path: '/admin/milestone-status' },
        { name: 'Milestone Submission', path: '/admin/milestone-submission' },
        { name: 'Milestone', path: '/admin/milestone' },
        { name: 'Protocol Admin Wallet', path: '/admin/protocol-admin-wallet' },
        { name: 'Protocol', path: '/admin/protocol' },
        { name: 'Submission Status', path: '/admin/submission-status' },
    ];

    return (
        <main className={styles.dashboard}>
            <h1>Admin Dashboard</h1>
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
