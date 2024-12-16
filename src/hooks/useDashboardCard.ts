import { useCallback, useEffect, useState } from 'react';
import { Campaign, Category, State, User } from '@/HardCode/databaseType';
import { useScreenSize } from '@/hooks/useScreenSize';
import { dataBaseService } from '@/HardCode/dataBaseService';
import { useRouter } from 'next/router';

export const useDashboardCard = (address: string | null) => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
    const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('');
    const [states, setStates] = useState<State[]>([]);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const screenSize = useScreenSize();
    const [adminView, setAdminView] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [campaignsLoading, setCampaignsLoading] = useState(true);
    const [isProtocolTeam, setIsProtocolTeam] = useState(false);
    const [myProposal, setMyProposal] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const router = useRouter();
    const pathName = router.pathname;

    useEffect(() => {
        if (!address) {
            setLoading(false);
            return;
        }
        const users = dataBaseService.getUsers();
        const user = users.find((user: User) => user.wallet_address === address);
        const isAdmin = user?.is_admin || false;
        setIsAdmin(isAdmin);
        setAdminView(isAdmin);
        setIsProtocolTeam(user?.is_protocol_team || false);
        setLoading(false);
    }, [address]);

    useEffect(() => {
        pathName === '/' || pathName === '/campaigns' ? setIsHomePage(true) : setIsHomePage(false);
        console.log(isHomePage);

        /*         if (!address || !isHomePage) return;
         */ setLoading(true);
        const fetchData = async () => {
            try {
                const filters = {
                    isHomePage,
                    userId: address,
                    isAdmin,
                    adminView,
                    searchTerm,
                    stateFilter,
                    categoryFilter,
                    isProtocolTeam,
                    myProposal,
                };

                const data = await dataBaseService.getFilteredData(filters);
                setCampaigns(data.campaigns);
                setFilteredCampaigns(data.campaigns);

                setStates(data.states || []);
                setCategories(data.categories || []);

                setCampaignsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setCampaignsLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [address, isAdmin, adminView, searchTerm, stateFilter, categoryFilter, isProtocolTeam, myProposal, isHomePage, pathName]);

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
        stateFilter,
        categoryFilter,
        states,
        categories,
        adminView,
        isAdmin,
        loading,
        campaignsLoading,
        setSearchTerm,
        setStateFilter,
        setCategoryFilter,
        handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value),
        handleStateFilterChange: (value: string) => setStateFilter(value),
        handleCategoryFilterChange: (value: string) => setCategoryFilter(value),
        handleClickAdminView: () => isAdmin && setAdminView(!adminView),
        getStatusName,
        getCategoryName,
        loadMoreCampaigns,
        screenSize,
        isProtocolTeam,
        setLoading,
        myProposal,
        setMyProposal,
        isHomePage,
        setIsHomePage,
        pathName,
    };
};
