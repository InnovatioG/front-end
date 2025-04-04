import { useDashboardCard } from '@/hooks/useDashboardCard';
import { PLUS_ICON } from '@/utils/images';
import Link from 'next/link';
import React from 'react';
import DraftCard from './DraftCard/DraftCard';
import styles from './DraftDashboard.module.scss';
import DraftFilters from './DraftFilters/DraftFilters';
interface NewDraftDashboardProps {
    address: string | null;
}

const NewDraftDashboard: React.FC<NewDraftDashboardProps> = ({ address }) => {
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
    } = useDashboardCard(address);

    return (
        <div className={styles.draftDashboard}>
            <DraftFilters
                searchTerm={searchTerm}
                stateFilter={stateFilter}
                categoryFilter={categoryFilter}
                categories={categories}
                states={states}
                viewAdmin={adminView}
                onSearchChange={handleSearchChange}
                onStateFilterChange={handleStateFilterChange}
                onCategoryFilterChange={handleCategoryFilterChange}
                screenSize={screenSize}
                onClickAdminView={handleClickAdminView}
                isAdmin={isAdmin}
            />
            <div className={styles.draftGrid}>
                <Link href={'./new'}>
                    <div className={styles.newCampaign}>
                        <svg width="24" height="24" className={styles.icon}>
                            <use href={PLUS_ICON}></use>
                        </svg>
                        <p className={styles.text}>Start new campaign</p>
                    </div>
                </Link>
                {visibleCampaigns.map((campaign) => (
                    <DraftCard key={campaign.id} campaign={campaign} isProtocolTeam={isProtocolTeam} isAdmin={isAdmin} />
                ))}
                <button onClick={loadMoreCampaigns}>Load more</button>
            </div>
        </div>
    );

    /*  */
};

export default NewDraftDashboard;
