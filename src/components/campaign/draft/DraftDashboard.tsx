import { useCallback, useEffect, useState } from "react";
import styles from "./DraftDashboard.module.scss";
import { Campaign, Category, Contracts, User } from "@/HardCode/databaseType";
import { useScreenSize } from "@/hooks/useScreenSize";
import { dataBaseService } from "@/HardCode/dataBaseService";
import DraftFilters from "./draftFilters/DraftFilters";
import DraftCard from "./draftCard/DraftCard";
import CommonsBtn from "@/components/buttons/CommonsBtn";
import Link from "next/link";
import { PLUS_ICON } from "@/utils/images";
import { ROUTES } from "@/utils/routes";




export default function DraftDashboard({
  address,
}: {
  address: string | null;
}) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusContractsFilter, setStatusContractsFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statesContracts, setStatesContracts] = useState<Contracts[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const screenSize = useScreenSize();
  const [adminView, setAdminView] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [campaignsLoading, setCampaignsLoading] = useState(true);



  useEffect(() => {
    if (!address) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }


    const users = dataBaseService.getUsers();
    const user = users.find((user: User) => user.wallet_address === address);
    setIsAdmin(user?.is_admin || false);
    setLoading(false);
  }, [address]);



  /* cargo la data (se esta cargando ahora todos los cards, por mas que no esten linkeados con mi usuario) */

  useEffect(() => {
    const data = dataBaseService.getData();
    if (data) {
      setCampaigns(data.campaigns);
      setFilteredCampaigns(data.campaigns);
      setStatesContracts(data.contracts || []);
      setCategories(data.categories || []);
      setCampaignsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading || campaignsLoading) return;

    const results = campaigns.filter((campaign) => {
      if (isAdmin && adminView) {
        return (
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (statusContractsFilter === "" ||
            campaign.contract_id === parseInt(statusContractsFilter)) &&
          (categoryFilter === "" ||
            campaign.category_id === parseInt(categoryFilter))
        );
      } else {
        const userMatches = dataBaseService
          .getUsers()
          .some(
            (user: User) =>
              user.id === campaign.user_id && user.wallet_address === address
          );

        const isContractVisible =
          campaign.contract_id === 1 || campaign.contract_id === 2;

        const isVisible =
          (statusContractsFilter === "" ||
            campaign.contract_id === parseInt(statusContractsFilter)) &&
          isContractVisible &&
          (campaign.vizualization === 1 || campaign.vizualization === 2) &&
          userMatches;

        return (
          isVisible &&
          campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          (categoryFilter === "" ||
            campaign.category_id === parseInt(categoryFilter))
        );
      }
    }
    );

    setFilteredCampaigns(results);
    setVisibleCampaigns([]);
  }, [
    loading,
    searchTerm,
    statusContractsFilter,
    categoryFilter,
    campaigns,
    address,
    isAdmin,
    adminView,
    campaignsLoading,
  ]);
  const getContractsName = useCallback(
    (contractId: number): string => {
      const contract = statesContracts.find((s) => s.id === contractId);
      return contract ? contract.name : "";
    },
    [statesContracts]
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

  const handleStatusContractsFilterChange = (value: string) => {
    setStatusContractsFilter(value);
  };

  const handleCategoryFilterChange = (value: string) => {
    setCategoryFilter(value);
  };


  const handleClickAdminView = () => {
    if (isAdmin) {
      setAdminView(!adminView);
    }
  };

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
      {visibleCampaigns.length === 0 ? (
        <p className={styles.notFound}>No Campaigns Found</p>
      ) : (
        <div className={styles.draftGrid}>
          <Link className={styles.newCampaign} href={ROUTES.new}>
            <svg width="24" height="24" className={styles.icon}>
              <use href={PLUS_ICON}></use>
            </svg>
            <p className={styles.text}>Start new campaign</p>
          </Link>
          {visibleCampaigns.map((campaign) => (
            <DraftCard
              key={campaign.id}
              campaign={campaign}
              getContractsName={getContractsName}
              getCategoryName={getCategoryName}
              adminView={adminView}
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
