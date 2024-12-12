import { useCallback, useEffect, useState } from "react";
import styles from "./CampaignDashboard.module.scss";
import { dataBaseService } from "@/HardCode/dataBaseService";
import { Campaign, State, Category, User } from "@/HardCode/databaseType";
import CampaignCard from "./campaignCard/CampaignCard";
import { useScreenSize } from "@/hooks/useScreenSize";
import CommonsBtn from "@/components/buttons/CommonsBtn";
import CampaignFilters from "./campaignFilters/CampaignFilters";
import { useCardano } from "@/contexts/CardanoContext";

export default function CampaignDashboard() {
  const { address } = useCardano();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [states, setStates] = useState<State[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const screenSize = useScreenSize();
  const [myProposal, setMyProposal] = useState(false);

  useEffect(() => {
    const data = dataBaseService.getData();
    if (data) {
      setCampaigns(data.campaigns);
      setFilteredCampaigns(data.campaigns);
      setStates(data.states);
      setCategories(data.categories);
    }
  }, []);


  useEffect(() => {
    const results = campaigns.filter((campaign) => {
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "" || campaign.state_id === parseInt(statusFilter);
      const matchesCategory = categoryFilter === "" || campaign.category_id === parseInt(categoryFilter);

      const campaignOwnerAddress = campaign.user_id
        ? dataBaseService.getUserByAddress(campaign.user_id)
        : null; const matchesProposal = !myProposal || campaignOwnerAddress === address;

      return campaign.vizualization === 1 && matchesSearch && matchesStatus && matchesCategory && matchesProposal;
    });

    setFilteredCampaigns(results);
    setVisibleCampaigns([]);
  }, [searchTerm, statusFilter, categoryFilter, myProposal, campaigns, address]);



  const getStatusName = useCallback(
    (statusId: number): string => {
      const status = states.find((s) => s.id === statusId);
      return status ? status.name : "";
    },
    [states]
  );

  const getCategoryName = useCallback(
    (categoryId: number): string => {
      const category = categories.find((c) => c.id === categoryId);
      return category ? category.name : "";
    },
    [categories]
  );

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

  const loadMoreCampaigns = useCallback(() => {
    setVisibleCampaigns((prevVisible) => {
      const currentCount = prevVisible.length;
      const newCount =
        currentCount === 0
          ? getInitialLoadCount()
          : currentCount + getLoadMoreCount();
      return filteredCampaigns.slice(0, newCount);
    });
  }, [filteredCampaigns, getInitialLoadCount, getLoadMoreCount]);

  useEffect(() => {
    loadMoreCampaigns();
  }, [filteredCampaigns, screenSize, loadMoreCampaigns]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleMyProposalChange = (checked: boolean) => {
    setMyProposal(checked);
  };

  return (
    <div className={styles.campaignDashboard}>
      <CampaignFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        states={states}
        categories={categories}
        onSearchChange={handleSearchChange}
        onStatusFilterChange={handleStatusFilterChange}
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
