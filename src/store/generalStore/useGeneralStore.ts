import { CampaignCategoryEntity, CampaignStatusEntity, MilestoneStatusEntity, ProtocolEntity, SubmissionStatusEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, CampaignCategoryApi, CampaignStatusApi, MilestoneStatusApi, ProtocolApi, SubmissionStatusApi } from '@/lib/SmartDB/FrontEnd';
import { formatMoney } from '@/utils/formats';
import axios from 'axios';
import { WritableDraft } from 'immer';
import { ConnectedWalletInfo, isNullOrBlank, WalletEntity, WalletFrontEndApiCalls } from 'smart-db';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface IGeneralStore {
    protocol?: ProtocolEntity;
    campaignCategories: CampaignCategoryEntity[];
    campaignStatus: CampaignStatusEntity[];
    milestoneStatus: MilestoneStatusEntity[];
    submissionStatus: SubmissionStatusEntity[];
    priceADAOrDollar: 'dollar' | 'ada';
    adaPrice: number;
    wallet: WalletEntity | undefined;
    haveCampaigns: boolean;
    setProtocol: (protocol?: ProtocolEntity) => void;
    setCampaignCategories: (categories: CampaignCategoryEntity[]) => void;
    setCampaignStatus: (statuses: CampaignStatusEntity[]) => void;
    setMilestoneStatus: (statuses: MilestoneStatusEntity[]) => void;
    setSubmissionStatus: (statuses: SubmissionStatusEntity[]) => void;
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
    isLoadingStoreData: boolean;
    isLoadedStoreData: boolean;
    setIsLoadingStoreData: (isLoadingStoreData: boolean) => void;
    setIsLoadedStoreData: (isLoadedStoreData: boolean) => void;
}

export const useGeneralStore = create<IGeneralStore>()(
    immer((set) => ({
        protocol: undefined,
        campaignCategories: [],
        campaignStatus: [],
        milestoneStatus: [],
        submissionStatus: [],
        adaPrice: 0,
        wallet: undefined,
        haveCampaigns: false,
        priceADAOrDollar: 'dollar',
        _DebugIsAdmin: undefined,
        _DebugIsEditor: undefined,
        _DebugIsProtocolTeam: undefined,
        isProtocolTeam: false,
        showDebug: false,
        isLoadingStoreData: true,
        isLoadedStoreData: false,
        setProtocol: (protocol?: ProtocolEntity) => {
                console.log('setProtocol', protocol);
            set((state) => {
                state.protocol = protocol;
            });
        },
        setIsLoadingStoreData: (isLoadingStoreData) => {
                console.log('setIsLoadingStoreData', isLoadingStoreData);
            set((state) => {
                state.isLoadingStoreData = isLoadingStoreData;
            });
        },
        setIsLoadedStoreData: (isLoadedStoreData) => {
                console.log('setIsLoadedStoreData', isLoadedStoreData);
            set((state) => {
                state.isLoadedStoreData = isLoadedStoreData;
            });
        },
        setShowDebug: (showDebug) => {
                console.log('setShowDebug', showDebug);
            set((state) => {
                state.showDebug = showDebug;
            });
        },
        setDebugIsAdmin: (isAdmin) => {
                console.log('setDebugIsAdmin', isAdmin);
            set((state) => {
                state._DebugIsAdmin = isAdmin;
            });
        },
        setDebugIsEditor: (isEditor) => {
                console.log('setDebugIsEditor', isEditor);
            set((state) => {
                state._DebugIsEditor = isEditor;
            });
        },
        setDebugIsProtocolTeam: (isProtocolTeam) => {
                console.log('setDebugIsProtocolTeam', isProtocolTeam);
            set((state) => {
                state._DebugIsProtocolTeam = isProtocolTeam;
            });
        },
        setIsProtocolTeam: (isProtocolTeam) => {
            console.log('setIsProtocolTeam', isProtocolTeam);
            set((state) => {
                state.isProtocolTeam = isProtocolTeam;
            });
        },
        setPriceADAOrDollar: (price) => {
            console.log('setPriceADAOrDollar', price);
            set((state) => {
                state.priceADAOrDollar = price;
            });
        },
        setCampaignCategories: (categories) => {
            console.log('setCampaignCategories', categories);
            set((state) => {
                state.campaignCategories = categories;
            });
        },
        setCampaignStatus: (statuses) => {
            console.log('setCampaignStatus', statuses);
            set((state) => {
                state.campaignStatus = statuses;
            });
        },
        setMilestoneStatus: (statuses) => {
            console.log('setMilestoneStatus', statuses);
            set((state) => {
                state.milestoneStatus = statuses;
            });
        },
        setSubmissionStatus: (statuses) => {
            console.log('setSubmissionStatus', statuses);
            set((state) => {
                state.submissionStatus = statuses;
            });
        },
        setADAPrice: (price) => {
            console.log('setADAPrice', price);
            set((state) => {
                state.adaPrice = price;
            });
        },
        setWallet: async (info?: ConnectedWalletInfo) => {
            console.log('setWallet', info);
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
            console.log('refreshHaveCampaigns', info);
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
                const { count } = await CampaignApi.getCountApi_({ creator_wallet_id: wallet._DB_id });
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

const fetchProtocol = async () => {
    try {
        console.log('Fetching protocol...');
        // Example: fetch your protocol entity from SmartDB
        const protocol: ProtocolEntity | undefined = await ProtocolApi.getOneByParamsApi_(); // You must define this function
        useGeneralStore.getState().setProtocol(protocol);
        if (!protocol) {
            console.warn('No protocol found');
            return undefined;
        }
        console.log('Protocol fetched successfully');
        return protocol;
    } catch (error) {
        console.error('Error fetching data:', error);
        return undefined;
    }
};

// Función para CampaignCategories
const fetchCampaignCategories = async () => {
    console.log('Fetching campaign categories...');
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
    console.log('Fetching milestone status...');
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
    console.log('Fetching campaign status...');
    try {
        const fetchedData: CampaignStatusEntity[] = await CampaignStatusApi.getAllApi_();
        useGeneralStore.getState().setCampaignStatus(fetchedData);
        return fetchedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchSubmissionStatus = async () => {
    console.log('Fetching submission status...');
    try {
        const fetchedData: SubmissionStatusEntity[] = await SubmissionStatusApi.getAllApi_();
        useGeneralStore.getState().setSubmissionStatus(fetchedData);
        return fetchedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchADAPrice = async () => {
    console.log('Fetching ADA price...');
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
    console.log('Fetching all data for general store...');
    try {
        useGeneralStore.getState().setIsLoadingStoreData(true);
        useGeneralStore.getState().setIsLoadedStoreData(false);
        await Promise.all([fetchProtocol(), fetchCampaignCategories(), fetchCampaignStatus(), fetchADAPrice(), fetchMilestoneStatus(), fetchSubmissionStatus()]);
        useGeneralStore.getState().setIsLoadingStoreData(false);
        useGeneralStore.getState().setIsLoadedStoreData(true);
    } catch (error) {
        console.error('Error fetching all data:', error);
    }
};

export const formatMoneyByADAOrDollar = (value: number | bigint) => {
    console.log('formatMoneyByADAOrDollar', value);
    if (typeof value !== 'number' && value !== undefined) {
        value = Number(value);
    }
    if (useGeneralStore.getState().priceADAOrDollar === 'dollar') {
        if (!useGeneralStore.getState().adaPrice) return formatMoney(Number(value), 'ADA');
        return formatMoney(Number(value) / Number(useGeneralStore.getState().adaPrice), 'USD');
    }
    return formatMoney(Number(value), 'ADA');
};
