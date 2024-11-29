import React from 'react';
import { useDashboardCard } from '@/hooks/useDashboardCard';
import DraftFilters from '../draftFilters/DraftFilters';
import DraftCard from './DraftCard';


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
        screenSize
    } = useDashboardCard(address);

    return (


        <div>
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
            {visibleCampaigns.map((campaign) => (
                <DraftCard key={campaign.id} campaign={campaign} />
            ))}

        </div>
    );
}

export default NewDraftDashboard;