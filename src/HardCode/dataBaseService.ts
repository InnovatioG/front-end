import database from './database.json';
import { User } from './databaseType';
import type { Campaign } from './databaseType';

const LOCAL_STORAGE_KEY = 'campaignData';

export const dataBaseService = {
    initializeData: () => {
        if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
            const newData = {
                ...database,
                version: {
                    ...database.version,
                    stored_at: new Date().toISOString(),
                },
            };
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
        } else {
            const data = dataBaseService.getData();
            let shouldUpdate = false;
            if (data.version.version !== database.version.version || !data.version) {
                shouldUpdate = true;
            } else {
                const storedAt = new Date(data.version.stored_at);
                const diffInMs = Date.now() - storedAt.getTime();
                const oneDayInMs = 24 * 60 * 60 * 1000;
                if (diffInMs > oneDayInMs) {
                    shouldUpdate = true;
                }
            }

            if (shouldUpdate) {
                const updatedData = {
                    ...database,
                    version: {
                        ...database.version,
                        stored_at: new Date().toISOString(),
                    },
                };
                dataBaseService.updateData(updatedData);
            }
        }
    },

    getData: () => {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    },

    getUsers: () => {
        const data = dataBaseService.getData();
        return data ? data.users : [];
    },

    getCategories: () => {
        const data = dataBaseService.getData();
        return data ? data.categories : [];
    },

    getUserByAddress: (userId: number): string | null => {
        const users = dataBaseService.getUsers();
        const user = users.find((user: User) => user.id === userId);
        return user ? user.wallet_address : null;
    },

    updateData: (newData: any) => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
    },

    createCampaign: (campaign: any) => {
        const data = dataBaseService.getData();
        const newCampaign = {
            ...campaign,
            id: data.campaigns.length + 1,
            create_at: Date.now().toString(),
            updated_at: Date.now().toString(),
        };
        data.campaigns.push(newCampaign);
        dataBaseService.updateData(data);
        return newCampaign;
    },

    updateCampaign: (id: number, updates: any) => {
        const data = dataBaseService.getData();
        const index = data.campaigns.findIndex((c: any) => c.id === id);
        if (index !== -1) {
            data.campaigns[index] = {
                ...data.campaigns[index],
                ...updates,
                updated_at: Date.now().toString(),
            };
            dataBaseService.updateData(data);
            return data.campaigns[index];
        }
        return null;
    },
    getFilteredData: (filters: {
        isHomePage: boolean;
        userId: string | null;
        isAdmin: boolean;
        adminView: boolean;
        searchTerm: string;
        stateFilter: string;
        categoryFilter: string;
        isProtocolTeam: boolean;
        myProposal: boolean;
    }) => {
        const data = dataBaseService.getData();
        if (!data) return { campaigns: [], contracts: [], categories: [], states: [] };

        const { userId, isAdmin, adminView, searchTerm, stateFilter, categoryFilter, isProtocolTeam, myProposal, isHomePage } = filters;

        console.log(stateFilter);
        console.log();

        // Si `isHomePage` es verdadero, devuelve todas las campañas sin filtrar
        if (isHomePage) {
            const filteredCampaigns = data.campaigns.filter((campaign: Campaign) => {
                const stateMatches = !stateFilter || campaign.state_id === Number(stateFilter);
                const categoryMatches = !categoryFilter || campaign.category_id === Number(categoryFilter);
                const searchTermMatches = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());

                return campaign.state_id >= 8 && campaign.state_id !== 10 && stateMatches && categoryMatches && searchTermMatches;
            });

            return {
                campaigns: filteredCampaigns,
                contracts: data.contracts || [],
                states: data.states || [],
                categories: data.categories || [],
            };
        }
        // Lógica de filtrado para otros casos
        const filteredCampaigns = data.campaigns.filter((campaign: Campaign) => {
            const stateMatches = !stateFilter || campaign.state_id === Number(stateFilter);
            const categoryMatches = !categoryFilter || campaign.category_id === Number(categoryFilter);
            const searchTermMatches = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());

            if (myProposal) {
                return campaign.user_id === parseInt(userId as string);
            }

            if (isProtocolTeam || (isAdmin && adminView)) {
                return searchTermMatches && stateMatches && categoryMatches;
            } else {
                const userMatches = data.users.some((user: User) => user.id === campaign.user_id && user.wallet_address === userId);
                const isContractVisible = campaign.contract_id === 1 || campaign.contract_id === 2;
                const isVisible = isContractVisible && (campaign.vizualization === 1 || campaign.vizualization === 2) && userMatches;

                return isVisible && searchTermMatches && stateMatches && categoryMatches;
            }
        });
        return {
            campaigns: filteredCampaigns,
            contracts: data.contracts || [],
            states: data.states || [],
            categories: data.categories || [],
        };
    },
    deleteCampaign: (id: number) => {
        const data = dataBaseService.getData();
        const index = data.campaigns.findIndex((c: any) => c.id === id);
        if (index !== -1) {
            data.campaigns.splice(index, 1);
            dataBaseService.updateData(data);
            return true;
        }
        return false;
    },
};
