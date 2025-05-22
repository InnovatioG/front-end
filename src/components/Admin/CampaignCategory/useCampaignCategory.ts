import { useCallback, useEffect, useState } from 'react';
import { CampaignCategoryEntity } from '../../../lib/SmartDB/Entities/CampaignCategory.Entity';
import { CampaignCategoryApi } from '../../../lib/SmartDB/FrontEnd/CampaignCategory.FrontEnd.Api.Calls';
import { PROYECT_NAME, pushWarningNotification } from 'smart-db';

export function useCampaignCategory() {
    const [list, setList] = useState<CampaignCategoryEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignCategoryEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignCategoryEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignCategoryEntity | null>(null);

    const fetch = useCallback(async () => {
        try {
            const fetchedList: CampaignCategoryEntity[] = await CampaignCategoryApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error fetching CampaignCategory: ${e}`);
        }
    }, []); 

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = async () => {
        try {
            let entity: CampaignCategoryEntity = new CampaignCategoryEntity(newItem);
            entity = await CampaignCategoryApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error creating CampaignCategory: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CampaignCategoryEntity(editItem);
                entity = await CampaignCategoryApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification(`${PROYECT_NAME}`, `Error updating CampaignCategory: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignCategoryApi.deleteByIdApi(CampaignCategoryEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification(`${PROYECT_NAME}`, `Error deleting CampaignCategory: ${e}`);
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
    };
}
