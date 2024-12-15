import { useCallback, useEffect, useState } from "react";
import styles from "./CampaignDashboard.module.scss";
import { dataBaseService } from "@/HardCode/dataBaseService";
import { Campaign, State, Category, User } from "@/HardCode/databaseType";
import CampaignCard from "./campaignCard/CampaignCard";
import { useScreenSize } from "@/hooks/useScreenSize";
import CommonsBtn from "@/components/buttons/CommonsBtn";
import CampaignFilters from "./campaignFilters/CampaignFilters";
import { useCardano } from "@/contexts/CardanoContext";
import { useDashboardCard } from "@/hooks/useDashboardCard";
export default function CampaignDashboard() {
  const { address } = useCardano();


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
    setIsHomePage
  } = useDashboardCard(address);



  //! TODO my proposal filter */


  const getInitialLoadCount = useCallback(() => {
    if (screenSize === "mobile") return 3;
    if (screenSize === "tablet") return 4;
    return 8;
  }, [screenSize]);

  const getLoadMoreCount = useCallback(() => {
    if (screenSize === "mobile") return 3;
    if (screenSize === "tablet") return 4;
    return 8;
  }, [screenSize]);


  const handleMyProposalChange = (checked: boolean) => {
    setMyProposal(checked);
  };

  return (
    <div className={styles.campaignDashboard}>
      <CampaignFilters
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
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              getStatusName={getStatusName}
              getCategoryName={getCategoryName}
            />
          ))}
        </div>
      )}

      {visibleCampaigns.length < filteredCampaigns.length && (
        <CommonsBtn
          type="secondary"
          action={loadMoreCampaigns}
          content="Explore more campaigns"
          width={260}
        />
      )}
    </div>
  );
}
