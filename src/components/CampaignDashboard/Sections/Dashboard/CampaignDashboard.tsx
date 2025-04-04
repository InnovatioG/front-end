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
        campaigns,
        filteredCampaigns,
        visibleCampaigns,
        searchTerm,
        categoryFilter,
        categories,
        adminView,
        isAdmin,
        loading,
        campaignsLoading,
        handleSearchChange,
        handleStateFilterChange,
        handleCategoryFilterChange,
        handleClickAdminView,
        getStatusName,
        getCategoryName,
        loadMoreCampaigns,
        screenSize,
        isProtocolTeam,
        states,
        stateFilter,
        myProposal,
        setMyProposal,
        isHomePage,
        setIsHomePage,
        pathName,
    } = useDashboardCard(address);

    /*   useEffect(() => {
      console.log('campaignList', campaignList);
      console.log('campaignsa', campaignsa);
      console.log('milestoneList', milestoneList);
    }, [campaignsa, milestoneList]);
   */
    const getInitialLoadCount = useCallback(() => {
        if (screenSize === 'mobile') return 3;
        ``;
        if (screenSize === 'tablet') return 4;
        return 8;
    }, [screenSize]);

    const getLoadMoreCount = useCallback(() => {
        if (screenSize === 'mobile') return 3;
        if (screenSize === 'tablet') return 4;
        return 8;
    }, [screenSize]);

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
                states={states}
                categories={categories}
                onSearchChange={handleSearchChange}
                onStatusFilterChange={handleStateFilterChange}
                onCategoryFilterChange={handleCategoryFilterChange}
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
                        <CampaignCard key={campaign.id} campaign={campaign} getStatusName={getStatusName} getCategoryName={getCategoryName} />
                    ))}
                </div>
            )}

            {visibleCampaigns.length < filteredCampaigns.length &&
                (pathName === '/' ? (
                    <Link href={'/campaigns'}>
                        <div className={styles.buttonContainer}>
                            <GeneralButtonUI onClick={() => {}} classNameStyle="outlineb" text="Explore more campaings" />
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
