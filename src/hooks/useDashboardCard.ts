import { useCallback, useEffect, useState } from 'react';
import { Campaign, Category, Contracts, User, State } from '@/HardCode/databaseType';
import { useScreenSize } from '@/hooks/useScreenSize';
import { dataBaseService } from '@/HardCode/dataBaseService';
import { useRouter } from 'next/router';

export const useDashboardCard = (address: string | null) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusContractsFilter, setStatusContractsFilter] = useState('');
    const [states, setStates] = useState<State[]>([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [statesContracts, setStatesContracts] = useState<Contracts[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const screenSize = useScreenSize();
    const [adminView, setAdminView] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [campaignsLoading, setCampaignsLoading] = useState(true);
    const router = useRouter();
    const pathName = router.pathname;
    console.log(pathName);

    useEffect(() => {
        if (!address) {
            setIsAdmin(false);
            setLoading(false);
            return;
        }
        const users = dataBaseService.getUsers();
        const user = users.find((user: User) => user.wallet_address === address);
        const isAdmin = user?.is_admin || false;
        setIsAdmin(isAdmin);
        setAdminView(isAdmin);
        setLoading(false);
    }, [address]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = dataBaseService.getFilteredData({
                    userId: address,
                    isAdmin,
                    adminView,
                    searchTerm,
                    statusContractsFilter,
                    categoryFilter,
                });
                setCampaigns(data.campaigns);
                setFilteredCampaigns(data.campaigns);
                setStatesContracts(data.contracts || []);
                setCategories(data.categories || []);
                setCampaignsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setCampaignsLoading(false);
            }
        };

        fetchData();
    }, [address, isAdmin, adminView, searchTerm, statusContractsFilter, categoryFilter]);

    const getContractsName = useCallback(
        (contractId: number): string => {
            const contract = statesContracts.find((s) => s.id === contractId);
            return contract ? contract.name : '';
        },
        [statesContracts]
    );

    const getStatusName = useCallback(
        (statusId: number): string => {
            const status = states.find((s) => s.id === statusId);
            return status ? status.name : '';
        },
        [states]
    );

    const getCategoryName = useCallback(
        (categoryId: number): string => {
            const category = categories.find((c) => c.id === categoryId);
            return category ? category.name : '';
        },
        [categories]
    );

    const getInitialLoadCount = useCallback(() => {
        if (screenSize === 'mobile') return 3;
        if (screenSize === 'tablet') return 4;
        return 8;
    }, [screenSize]);

    const getLoadMoreCount = useCallback(() => {
        if (screenSize === 'mobile') return 3;
        if (screenSize === 'tablet') return 4;
        return 8;
    }, [screenSize]);

    const loadMoreCampaigns = useCallback(() => {
        setVisibleCampaigns((prevVisible) => {
            const currentCount = prevVisible.length;
            const newCount = currentCount === 0 ? getInitialLoadCount() : currentCount + getLoadMoreCount();
            return filteredCampaigns.slice(0, newCount);
        });
    }, [filteredCampaigns, getInitialLoadCount, getLoadMoreCount]);

    useEffect(() => {
        loadMoreCampaigns();
    }, [filteredCampaigns, screenSize, loadMoreCampaigns]);

    return {
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
        setSearchTerm,
        setStatusContractsFilter,
        setCategoryFilter,
        handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value),
        handleStatusContractsFilterChange: (value: string) => setStatusContractsFilter(value),
        handleCategoryFilterChange: (value: string) => setCategoryFilter(value),
        handleClickAdminView: () => isAdmin && setAdminView(!adminView),
        getContractsName,
        getStatusName,
        getCategoryName,
        loadMoreCampaigns,
        screenSize,
    };
};
