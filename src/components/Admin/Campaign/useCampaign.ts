import { useState, useEffect } from 'react';
import { CampaignEntity } from '../../../lib/SmartDB/Entities/Campaign.Entity';
import { CampaignApi } from '../../../lib/SmartDB/FrontEnd/Campaign.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';
import { th } from 'date-fns/locale';

export function useCampaign() {
    const [list, setList] = useState<CampaignEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CampaignEntity[] = await CampaignApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching Campaign: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            newItem.featured= newItem.featured?? false 
            newItem.archived= newItem.archived?? false 
            let entity: CampaignEntity = new CampaignEntity(newItem);
            entity = await CampaignApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating Campaign: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CampaignEntity(editItem);
                entity = await CampaignApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating Campaign: ${e}`);
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
                pushWarningNotification('Error', `Error deleting Campaign: ${e}`);
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
