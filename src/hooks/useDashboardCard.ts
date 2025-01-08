import { useCallback, useEffect, useState } from 'react';
import { Campaign, Category, State, User } from '@/HardCode/databaseType';
import { useScreenSize } from '@/hooks/useScreenSize';
import { dataBaseService } from '@/HardCode/dataBaseService';
import { useRouter } from 'next/router';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import { useNewDashboardCard } from './newUseDashboardCard';

export const useDashboardCard = (address: string | null) => {
    const { campaigns, filteredCampaigns } = useNewDashboardCard(address);
    /*     const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
     */

    const { campaignStatus, campaignCategories } = useGeneralStore();
    const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stateFilter, setStateFilter] = useState('');
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
    const [loadMoreEnabled, setLoadMoreEnabled] = useState(true);
    const [haveProjects, setHaveProjects] = useState(false);
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

    /*   useEffect(() => {
        pathName === '/' || pathName === '/campaigns' ? setIsHomePage(true) : setIsHomePage(false);

        setLoading(true);
        const fetchData = async () => {
            try {
                const filters = {
                    isHomePage,
                    userId: address,
                    isAdmin,
                    adminView,
                    searchTerm,
                    stateFilter: stateFilter || '', // Asegura que no sea null/undefined
                    categoryFilter,
                    isProtocolTeam,
                    myProposal,
                    haveProjects,
                    setHaveProjects,
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
    }, [address, isAdmin, adminView, searchTerm, stateFilter, categoryFilter, isProtocolTeam, myProposal, isHomePage, pathName, haveProjects, setHaveProjects]); */

    /*     const getStatusName = useCallback(
        (statusId: number): string => {
            const status = states.find((s) => s.id === statusId);
            return status ? status.name : '';
        },
        [states]
    );
 */
    const getCategoryName = useCallback(
        (category_id: number): string => {
            const category = categories.find((c) => c.id === category_id);
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
        if (pathName === '/campaigns' || pathName === '/campaign/manage') {
            loadMoreCampaigns(); // Carga inicial y permite cargar más.
        } else if (isHomePage) {
            setVisibleCampaigns(filteredCampaigns.slice(0, getInitialLoadCount())); // Solo carga initialLoadCount.
        }
    }, [filteredCampaigns, screenSize, loadMoreCampaigns, pathName, isHomePage]);

    const handleMyProposalChange = useEffect(() => {
        if (myProposal) {
        }
    }, [myProposal]);

    return {
        campaigns,
        filteredCampaigns,
        visibleCampaigns: campaigns,
        searchTerm,
        stateFilter,
        categoryFilter,
        states: campaignStatus,
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
        haveProjects,
    };
};
