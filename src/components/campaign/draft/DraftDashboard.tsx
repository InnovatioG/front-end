import React, { useEffect } from 'react';
import { useDashboardCard } from '@/hooks/useDashboardCard';
import DraftFilters from './draftFilters/DraftFilters';
import DraftCard from './draftCard/DraftCard';
import styles from "./DraftDashboard.module.scss";
import { useModalStore } from '@/store/modal/useModalStoreState';
import ModalTemplate from '@/components/modal/Modal';
import InitializeCampaignModal from '@/components/modal/InitializeCampaignModal';
import ManageCampaignModal from '@/components/modal/ManageCampaignModal';
import SendReportMilestone from '@/components/modal/SendReport';

interface NewDraftDashboardProps {
    address: string | null;
}

const NewDraftDashboard: React.FC<NewDraftDashboardProps> = ({ address }) => {
    const { openModal, closeModal, modalType, campaignId } = useModalStore();

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
        stateFilter
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
                {visibleCampaigns.map((campaign) => (
                    <DraftCard key={campaign.id} campaign={campaign} isProtocolTeam={isProtocolTeam} />
                ))}
            </div>


        </div>
    );
}

export default NewDraftDashboard;