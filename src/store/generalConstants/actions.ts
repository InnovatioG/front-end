import { useCampaignCategory } from '@/components/Admin/CampaignCategory/useCampaignCategory';
import { useCampaignStatus } from '@/components/Admin/CampaignStatus/useCampaignStatus';
import { useGeneralStore } from './useGeneralConstants';

const fetchAndSetData = async <T, U>(fetchFunction: () => { list: T[] }, mapFunction: (item: T) => U, setFunction: (data: U[]) => void): Promise<T[]> => {
    try {
        const { list } = fetchFunction();
        const mappedData = list.map(mapFunction);
        setFunction(mappedData);
        return list;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
};

// Función para CampaignCategories
const fetchCampaignCategories = async () => {
    return fetchAndSetData(
        useCampaignCategory,
        (category) => ({
            id: category.id_internal,
            name: category.name,
            description: category.description,
        }),
        useGeneralStore.getState().setCampaignCategories
    );
};

// Función para CampaignStatus
const fetchCampaignStatus = async () => {
    return fetchAndSetData(
        useCampaignStatus,
        (status) => ({
            id: status.id_internal,
            name: status.name,
            description: status.description,
        }),
        useGeneralStore.getState().setCampaignStatus
    );
};

// Función para traer todo en paralelo
export const fetchAllData = async () => {
    try {
        await Promise.all([fetchCampaignCategories(), fetchCampaignStatus()]);
        console.log('All data fetched successfully');
    } catch (error) {
        console.error('Error fetching all data:', error);
    }
};
