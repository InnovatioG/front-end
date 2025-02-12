import { getCampaignEX } from '@/hooks/useCampaingDetails';
import { useResponsive } from '@/contexts/ResponsiveContext';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi } from '@/lib/SmartDB/FrontEnd';
import { useGeneralStore } from '@/store/generalStore/useGeneralStore';
import { CampaignEX } from '@/types/types';
import { CampaignViewForEnums } from '@/utils/constants/constants';
import { CampaignsStatus_Code_Ids_For_Investors } from '@/utils/constants/status';
import { useCallback, useEffect, useState } from 'react';
import { pushWarningNotification, useWalletStore } from 'smart-db';

export interface CampaignDashboardProps {
    campaignViewFor: CampaignViewForEnums;

}

export const useCampaignsDashboard = (props: CampaignDashboardProps) => {
    const { screenSize } = useResponsive();

    const walletStore = useWalletStore();

    const [campaignsLoading, setCampaignsLoading] = useState(true);

    const { campaignStatus, campaignCategories, wallet } = useGeneralStore();

    const [campaignCategoriesFilterd, setCampaignCategoriesFilterd] = useState(campaignCategories);
    const [campaignStatusFilterd, setCampaignStatusFilterd] = useState(campaignStatus);

    const [statusFilter, setStatusFilter] = useState<string>('-1');
    const [categoryFilter, setCategoryFilter] = useState<string>('-1');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [myProposal, setMyProposal] = useState(false);
    const [showMyProposalButton, setShowMyProposalButton] = useState(true);

    const [hasMore, setHasMore] = useState(false);

    const [campaigns, setCampaigns] = useState<CampaignEX[]>([]);

    const handleMyProposalChange = (checked: boolean) => {
        setMyProposal(checked);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const fetchCampaigns = useCallback(async () => {
        // TODO: falta ver quienes son editores o managers, etc, ahora solo uso creator_wallet_id: walletStore.info!.address
        //TODO: falta verificar signed wallet
        console.log(
            `fetchCampaigns: ${props.campaignViewFor} - ${campaignStatus}- ${myProposal} - ${statusFilter} - ${categoryFilter} - ${searchTerm} - ${walletStore.isConnected} - ${wallet}`
        );

        setCampaignsLoading(true);
        try {
            const limit = props.campaignViewFor === CampaignViewForEnums.home ? 10 : 20;

            let filterConditions: any[] = [];

            if (props.campaignViewFor === CampaignViewForEnums.manage) {
                if (walletStore.isConnected === false || wallet === undefined) {
                    setCampaigns([]);
                    setCampaignsLoading(false);
                    return;
                }
                if (walletStore.isCoreTeam()) {
                    setShowMyProposalButton(true);
                } else {
                    // en manage para los no core team solo se muestran sus propuestas
                    setShowMyProposalButton(false);
                    filterConditions.push({ creator_wallet_id: wallet._DB_id });
                }
            }

            if (myProposal) {
                if (walletStore.isConnected && wallet !== undefined) {
                    filterConditions.push({ creator_wallet_id: wallet._DB_id });
                } else {
                    setCampaigns([]);
                    setCampaignsLoading(false);
                    return;
                }
            }

            if (statusFilter && statusFilter !== '-1') {
                filterConditions.push({ campaign_status_id: statusFilter });
            }

            if (categoryFilter && categoryFilter !== '-1') {
                filterConditions.push({ campaign_category_id: categoryFilter });
            }

            if (searchTerm) {
                filterConditions.push({ $or: [{ name: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }] });
            }

            if (props.campaignViewFor === CampaignViewForEnums.home || props.campaignViewFor === CampaignViewForEnums.campaigns) {
                setShowMyProposalButton(true);

                const campaignStatusIdsForInvestors = campaignStatus
                    .filter((status) => CampaignsStatus_Code_Ids_For_Investors.includes(status.code_id))
                    .map((status) => status._DB_id);

                if (campaignStatusIdsForInvestors.length > 0) {
                    filterConditions.push({ campaign_status_id: { $in: campaignStatusIdsForInvestors } });
                }
            }

            const filter = filterConditions.length > 0 ? { $and: filterConditions } : {};

            const data: CampaignEntity[] = await CampaignApi.getByParamsApi_(filter, { limit });
            const count = await CampaignApi.getCountApi_(filter);

            setHasMore(count > limit);
            setCampaigns(await Promise.all(data.map(getCampaignEX)));
        } catch (err) {
            console.error('Error fetching campaigns:', err);
            pushWarningNotification('Error', `Error fetching Campaigns: ${err}`);
        }
        setCampaignsLoading(false);
    }, [
        props.campaignViewFor,
        campaignStatus,
        myProposal,
        statusFilter,
        categoryFilter,
        searchTerm,
        // Solo incluir la billetera si estamos en "manage" o "myProposal"
        ...(props.campaignViewFor === CampaignViewForEnums.manage || myProposal ? [walletStore.isConnected, wallet] : []),
    ]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    useEffect(() => {
        if (props.campaignViewFor === CampaignViewForEnums.home || props.campaignViewFor === CampaignViewForEnums.campaigns) {
            setCampaignStatusFilterd(campaignStatus.filter((status) => CampaignsStatus_Code_Ids_For_Investors.includes(status.code_id)));
        }
    }, [props.campaignViewFor, campaignStatus]);

    return {
        campaignsLoading,
        walletStore,
        searchTerm,
        campaigns,
        hasMore,
        campaignStatus: campaignStatusFilterd,
        statusFilter,
        setStatusFilter,
        campaignCategories: campaignCategoriesFilterd,
        categoryFilter,
        setCategoryFilter,
        handleSearchChange,
        screenSize,
        myProposal,
        handleMyProposalChange,
        showMyProposalButton,
    };
};
