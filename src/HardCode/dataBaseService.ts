import { User } from './databaseType';
import { Campaign } from '@/types/types';

const LOCAL_STORAGE_KEY = 'campaignData';

export const dataBaseService = {
    /*  initializeData: () => {
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
    }, */

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
            updatedAt: Date.now().toString(),
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
                updatedAt: Date.now().toString(),
            };
            dataBaseService.updateData(data);
            return data.campaigns[index];
        }
        return null;
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
