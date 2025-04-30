import { CampaignCategoryEntity, CampaignStatusEntity } from '@/lib/SmartDB/Entities';
import { CampaignApi, CampaignCategoryApi, CampaignStatusApi } from '@/lib/SmartDB/FrontEnd';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import { PROYECT_NAME, pushWarningNotification } from 'smart-db';
import { CampaignEntity } from '../../../lib/SmartDB/Entities/Campaign.Entity';

export interface MilestoneFormProps {
    item: Partial<CampaignEntity>;
    setItem: (value: SetStateAction<Partial<CampaignEntity>>) => void;
}

// export interface CampaignStatusAndCategory {
//     category: CampaignCategoryEntity;
//     status: CampaignStatusEntity;
// }

export function useCampaign() {
    const [list, setList] = useState<CampaignEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignEntity | null>(null);

    const [categories, setCategories] = useState<CampaignCategoryEntity[]>([]);
    const [statuses, setStatuses] = useState<CampaignStatusEntity[]>([]);

    const fetchCampaignsExtras = async () => {
        const categories: CampaignCategoryEntity[] = await CampaignCategoryApi.getAllApi_();
        const statuses: CampaignStatusEntity[] = await CampaignStatusApi.getAllApi_();
        setCategories(categories);
        setStatuses(statuses);
    };

    // Helper method to get category name by ID
    const getCategoryName = (id: string): string => {
        const category = categories.find((cat) => cat._DB_id === id);
        return category?.name || 'Unknown';
    };

    // Helper method to get status name by ID
    const getStatusName = (id: string): string => {
        const status = statuses.find((stat) => stat._DB_id === id);
        return status?.name || 'Unknown';
    };

    const fetch = useCallback(async () => {
        try {
            await fetchCampaignsExtras();
            const fetchedList: CampaignEntity[] = await CampaignApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error fetching Campaign: ${e}`);
        }
    }, []); 

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = async () => {
        try {
            newItem._NET_address = 'test address';
            newItem._NET_id_CS = 'test CS';
            newItem._isDeployed = false;
            let entity: CampaignEntity = new CampaignEntity(newItem);
            entity = await CampaignApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error creating Campaign: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                editItem._isDeployed = false;
                let entity = new CampaignEntity(editItem);
                entity = await CampaignApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification(`${PROYECT_NAME}`, `Error updating Campaign: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignApi.deleteByIdApi(CampaignEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification(`${PROYECT_NAME}`, `Error deleting Campaign: ${e}`);
            }
        }
    };

    return {
        list,
        newItem,
        editItem,
        deleteItem,
        view,
        setNewItem,
        setEditItem,
        setDeleteItem,
        setView,
        create,
        update,
        remove,
        getCategoryName,
        getStatusName,
    };
}
