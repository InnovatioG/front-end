import { CampaignCategoryEntity, CampaignStatusEntity, MilestoneStatusEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, CampaignCategoryApi, CampaignStatusApi, MilestoneStatusApi } from '@/lib/SmartDB/FrontEnd';
import { WritableDraft } from 'immer';
import { ConnectedWalletInfo, isNullOrBlank, WalletEntity, WalletFrontEndApiCalls } from 'smart-db';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import axios from 'axios';
import { formatMoney } from '@/utils/formats';

interface IGeneralStore {
    campaignCategories: CampaignCategoryEntity[];
    campaignStatus: CampaignStatusEntity[];
    milestoneStatus: MilestoneStatusEntity[];
    priceADAOrDollar: 'dollar' | 'ada';
    adaPrice: number;
    wallet: WalletEntity | undefined;
    haveCampaigns: boolean;
    setCampaignCategories: (categories: CampaignCategoryEntity[]) => void;
    setCampaignStatus: (statuses: CampaignStatusEntity[]) => void;
    setMilestoneStatus: (statuses: MilestoneStatusEntity[]) => void;
    setADAPrice: (price: number) => void;
    setPriceADAOrDollar: (price: 'dollar' | 'ada') => void;
    setWallet: (info?: ConnectedWalletInfo) => void;
    refreshHaveCampaigns: (info?: ConnectedWalletInfo) => Promise<void>;
    showDebug?: boolean;
    _DebugIsAdmin?: boolean;
    _DebugIsEditor?: boolean;
    _DebugIsProtocolTeam?: boolean;
    isProtocolTeam: boolean;
    setShowDebug: (showDebug: boolean) => void;
    setDebugIsAdmin: (isAdmin?: boolean) => void;
    setDebugIsEditor: (isEditor?: boolean) => void;
    setDebugIsProtocolTeam: (isProtocolTeam?: boolean) => void;
    setIsProtocolTeam: (isProtocolTeam: boolean) => void;
}

export const useGeneralStore = create<IGeneralStore>()(
    immer((set) => ({
        campaignCategories: [],
        campaignStatus: [],
        milestoneStatus: [],
        adaPrice: 0,
        wallet: undefined,
        haveCampaigns: false,
        priceADAOrDollar: 'dollar',
        _DebugIsAdmin: undefined,
        _DebugIsEditor: undefined,
        _DebugIsProtocolTeam: undefined,
        isProtocolTeam: false,
        showDebug: false,
        setShowDebug: (showDebug) =>
            set((state) => {
                state.showDebug = showDebug;
            }),
        setDebugIsAdmin: (isAdmin) =>
            set((state) => {
                state._DebugIsAdmin = isAdmin;
            }),
        setDebugIsEditor: (isEditor) =>
            set((state) => {
                state._DebugIsEditor = isEditor;
            }),
        setDebugIsProtocolTeam: (isProtocolTeam) =>
            set((state) => {
                state._DebugIsProtocolTeam = isProtocolTeam;
            }),
        setIsProtocolTeam: (isProtocolTeam) =>
            set((state) => {
                state.isProtocolTeam = isProtocolTeam;
            }),
        setPriceADAOrDollar: (price) =>
            set((state) => {
                state.priceADAOrDollar = price;
            }),
        setCampaignCategories: (categories) => {
            set((state) => {
                state.campaignCategories = categories;
            });
        },
        setCampaignStatus: (statuses) => {
            set((state) => {
                state.campaignStatus = statuses;
            });
        },
        setMilestoneStatus: (statuses) => {
            set((state) => {
                state.milestoneStatus = statuses;
            });
        },
        setADAPrice: (price) => {
            set((state) => {
                state.adaPrice = price;
            });
        },
        setWallet: async (info?: ConnectedWalletInfo) => {
            try {
                if (!info || isNullOrBlank(info.pkh)) {
                    set((state) => {
                        state.wallet = undefined;
                    });
                    return;
                }

                let queryConditions: Record<string, any>[] = [{ paymentPKH: info.pkh }];

                if (!isNullOrBlank(info.address)) {
                    queryConditions.push({ testnet_address: info.address });
                    queryConditions.push({ mainnet_address: info.address });
                }

                const queryCondition = { $or: queryConditions };
                const wallet: WalletEntity | undefined = await WalletFrontEndApiCalls.getOneByParamsApi_(queryCondition);

                set((state) => {
                    state.wallet = wallet;
                });
            } catch (error) {
                console.error('Error fetching wallet entity:', error);
            }
        },

        refreshHaveCampaigns: async (info?: ConnectedWalletInfo) => {
            try {
                if (info === undefined || info.isWalletValidatedWithSignedToken === false) {
                    set((state) => {
                        state.haveCampaigns = false;
                    });
                    return;
                }
                //--------------------------------------
                let queryConditions: Record<string, any> = [{ paymentPKH: info.pkh }];
                //--------------------------------------
                if (!isNullOrBlank(info.address)) {
                    queryConditions.push({ testnet_address: info.address });
                    queryConditions.push({ mainnet_address: info.address });
                }
                //--------------------
                let queryCondition = { $or: queryConditions };
                //--------------------
                const wallet: WalletEntity | undefined = await WalletFrontEndApiCalls.getOneByParamsApi_(queryCondition);
                //--------------------
                if (wallet === undefined) {
                    set((state) => {
                        state.haveCampaigns = false;
                    });
                    return;
                }
                //--------------------
                // TODO : hay que buscar si es editor, no solo creador...
                const count = await CampaignApi.getCountApi_({ creator_wallet_id: wallet._DB_id });
                //--------------------
                set((state: WritableDraft<IGeneralStore>) => {
                    state.haveCampaigns = count > 0;
                });
            } catch (error) {
                console.error('Error checking user campaigns:', error);
            }
        },
    }))
);

// Función para CampaignCategories
const fetchCampaignCategories = async () => {
    try {
        const fetchedData: CampaignCategoryEntity[] = await CampaignCategoryApi.getAllApi_();

        useGeneralStore.getState().setCampaignCategories(fetchedData);

        return fetchedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchMilestoneStatus = async () => {
    try {
        const fetchData: MilestoneStatusEntity[] = await MilestoneStatusApi.getAllApi_();

        useGeneralStore.getState().setMilestoneStatus(fetchData);

        return fetchData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchCampaignStatus = async () => {
    try {
        const fetchedData: CampaignStatusEntity[] = await CampaignStatusApi.getAllApi_();

        useGeneralStore.getState().setCampaignStatus(fetchedData);

        return fetchedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchADAPrice = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
        useGeneralStore.getState().setADAPrice(response.data.cardano.usd);
        return response.data.cardano.usd;
    } catch (error) {
        console.error('Error fetching ADA price:', error);
        return null;
    }
};

export const fetchGeneralStoreData = async () => {
    try {
        await Promise.all([fetchCampaignCategories(), fetchCampaignStatus(), fetchADAPrice(), fetchMilestoneStatus()]);
    } catch (error) {
        console.error('Error fetching all data:', error);
    }
};

export const formatMoneyByADAOrDollar = (value: number | bigint) => {
    if (typeof value !== 'number' && value !== undefined) {
        value = Number(value);
    }
    if (useGeneralStore.getState().priceADAOrDollar === 'dollar') {
        if (!useGeneralStore.getState().adaPrice) return formatMoney(Number(value), 'ADA');
        return formatMoney(Number(value) / Number(useGeneralStore.getState().adaPrice), 'USD');
    }
    return formatMoney(Number(value), 'ADA');
};