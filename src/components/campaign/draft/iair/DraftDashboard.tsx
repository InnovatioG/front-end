import React from 'react';
import { useDashboardCard } from '@/hooks/useDashboardCard';
import DraftFilters from '../draftFilters/DraftFilters';
import DraftCard from './DraftCard';
import styles from "../DraftDashboard.module.scss"


interface NewDraftDashboardProps {

    address: string | null;
}

const NewDraftDashboard: React.FC<NewDraftDashboardProps> = ({ address }) => {


    const {
        campaigns,
        filteredCampaigns,
        visibleCampaigns,
        searchTerm,
        statusContractsFilter,
        categoryFilter,
        statesContracts,
        categories,
        adminView,
        isAdmin,
        loading,
        campaignsLoading,
        handleSearchChange,
        handleStatusContractsFilterChange,
        handleCategoryFilterChange,
        handleClickAdminView,
        getContractsName,
        getStatusName,
        getCategoryName,
        loadMoreCampaigns,
        screenSize,
        isProtocolTeam
    } = useDashboardCard(address);

    return (


        <div className={styles.draftDashboard}>
            <DraftFilters
                searchTerm={searchTerm}
                statusContractsFilter={statusContractsFilter}
                categoryFilter={categoryFilter}
                contracts={statesContracts}
                categories={categories}
                viewAdmin={adminView}
                onSearchChange={handleSearchChange}
                onStatusContractsFilterChange={handleStatusContractsFilterChange}
                onCategoryFilterChange={handleCategoryFilterChange}
                screenSize={screenSize}
                onClickAdminView={handleClickAdminView}
                isAdmin={isAdmin}
            />
            <div className={styles.draftGrid}>
                {visibleCampaigns.map((campaign) => (
                    <DraftCard key={campaign.id} campaign={campaign} isProtocolTeam={isProtocolTeam} />
                ))}
            </div>

        </div>
    );
}

export default NewDraftDashboard;