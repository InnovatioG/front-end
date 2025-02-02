import { dataBaseService } from '@/HardCode/dataBaseService';
import { Category, State, User } from '@/HardCode/databaseType';
import { useScreenSize } from '@/hooks/useScreenSize';
import { useRouter } from 'next/router';
import { useGeneralStore } from '@/store/generalConstants/useGeneralConstants';
import { useNewDashboardCard } from './newUseDashboardCard';
import { useState, useEffect, useCallback } from 'react';
export const useDashboardCard = (address: string | null) => {
    const {
        campaigns,
        filteredCampaigns,
        stateFilter,
        categoryFilter,
        setStateFilter,
        setCategoryFilter,
        visibleCampaigns,
        setVisibleCampaigns,
        setSearchTerm,
        searchTerm,
        campaignsLoading,
        setCampaignsLoading,
    } = useNewDashboardCard();
    const { campaignStatus, campaignCategories } = useGeneralStore();
    const screenSize = useScreenSize();
    const [adminView, setAdminView] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    /*     const [campaignsLoading, setCampaignsLoading] = useState(false);
     */ const [isProtocolTeam, setIsProtocolTeam] = useState(false);
    const [myProposal, setMyProposal] = useState(false);
    const [isHomePage, setIsHomePage] = useState(false);
    const router = useRouter();
    const [loadMoreEnabled, setLoadMoreEnabled] = useState(true);
    const [haveProjects, setHaveProjects] = useState(false);
    const pathName = router.pathname;

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
        visibleCampaigns,
        searchTerm,
        stateFilter,
        categoryFilter,
        states: campaignStatus,
        categories: campaignCategories,
        adminView,
        isAdmin,
        loading,
        campaignsLoading,
        setSearchTerm,
        setStateFilter,
        setCategoryFilter,
        handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(event.target.value),
        handleClickAdminView: () => isAdmin && setAdminView(!adminView),
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
