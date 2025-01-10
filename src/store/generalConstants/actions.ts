import { useGeneralStore } from './useGeneralConstants';
import { CampaignStatusApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignStatusEntity } from '@/lib/SmartDB/Entities';
import { CampaignCategoryApi } from '@/lib/SmartDB/FrontEnd';
import { CampaignCategoryEntity } from '@/lib/SmartDB/Entities';
import { MilestoneStatusApi } from '@/lib/SmartDB/FrontEnd';
import { MilestoneStatusEntity } from '@/lib/SmartDB/Entities';

import axios from 'axios';
// Función para manejar la obtención de datos y actualización del store

// Función para CampaignCategories
const fetchCampaignCategories = async () => {
    try {
        const fetchedData: CampaignCategoryEntity[] = await CampaignCategoryApi.getAllApi_();

        const mappedData = fetchedData.map((category) => ({
            id: category.id_internal,
            name: category.name,
            description: category.description,
        }));

        useGeneralStore.getState().setCampaignCategories(mappedData);

        return mappedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchMilestoneStatus = async () => {
    try {
        const fetchData: MilestoneStatusEntity[] = await MilestoneStatusApi.getAllApi_();

        const mappedData = fetchData.map((milestoneStatus) => ({
            id: milestoneStatus.id_internal,
            id_internal: milestoneStatus.id_internal,
            name: milestoneStatus.name,
        }));

        useGeneralStore.getState().setMilestoneStatus(mappedData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchCampaignStatus = async () => {
    try {
        const fetchedData: CampaignStatusEntity[] = await CampaignStatusApi.getAllApi_();

        const mappedData = fetchedData.map((category) => ({
            id: category._DB_id,
            id_internal: category.id_internal,
            name: category.name,
            description: category.description,
        }));

        useGeneralStore.getState().setCampaignStatus(mappedData);

        return mappedData;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

const fetchAdaPrice = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd');
        useGeneralStore.getState().setAdaPrice(response.data.cardano.usd);
        return response.data.cardano.usd;
    } catch (error) {
        console.error('Error fetching ADA price:', error);
        return null;
    }
};

export const fetchAllData = async () => {
    try {
        await Promise.all([fetchCampaignCategories(), fetchCampaignStatus(), fetchAdaPrice(), fetchMilestoneStatus()]);
    } catch (error) {
        console.error('Error fetching all data:', error);
    }
};
