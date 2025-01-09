import GeneralButtonUI from '@/components/UI/Buttons/UI/Button';
import { useDashboardCard } from '@/hooks/useDashboardCard';
import Link from 'next/link';
import { useCallback } from 'react';
import { useWalletStore } from 'smart-db';
import CampaignCard from './CampaignCard/CampaignCard';
import styles from './CampaignDashboard.module.scss';
import CampaignFilters from './CampaignFilters/CampaignFilters';


export default function CampaignDashboard() {
    const walletStore = useWalletStore();
    const address = walletStore.info?.address || '';

    const {
        filteredCampaigns,
        visibleCampaigns,
        searchTerm,
        categoryFilter,
        categories,
        handleSearchChange,
        setStateFilter,
        setCategoryFilter,
        loadMoreCampaigns,
        screenSize,
        states,
        stateFilter,
        myProposal,
        setMyProposal,
        isHomePage,
        pathName,
    } = useDashboardCard(address);



    const handleMyProposalChange = (checked: boolean) => {
        setMyProposal(checked);
    };

    return (
        <div className={styles.campaignDashboard}>
            <CampaignFilters
                isHomePage={isHomePage}
                searchTerm={searchTerm}
                statusFilter={stateFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                setStateFilter={setStateFilter}
                onSearchChange={handleSearchChange}
                screenSize={screenSize}
                isConnected={!!address}
                myProposal={myProposal}
                onMyProposalChange={handleMyProposalChange}
            />
            {visibleCampaigns.length === 0 ? (
                <p className={styles.notFound}>No Campaigns Found</p>
            ) : (
                <div className={styles.campaignGrid}>
                    {visibleCampaigns.map((campaign) => (
                        <CampaignCard key={campaign._DB_id} campaign={campaign} />
                    ))}
                </div>
            )}

            {visibleCampaigns.length < filteredCampaigns.length &&
                (pathName === '/' ? (
                    <Link href={'/campaigns'}>
                        <div className={styles.buttonContainer}>
                            <GeneralButtonUI onClick={() => { }} classNameStyle="outlineb" text="Explore more campaings" />
                        </div>
                    </Link>
                ) : (
                    <div className={styles.buttonContainer}>
                        <GeneralButtonUI onClick={loadMoreCampaigns} classNameStyle="outlineb" text="Explore more campaings" />
                    </div>
                ))}
        </div>
    );
}
