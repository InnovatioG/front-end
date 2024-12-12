import { useState, useEffect } from 'react';
import { CampaignStatusEntity } from '../../../lib/SmartDB/Entities/CampaignStatus.Entity';
import { CampaignStatusApi } from '../../../lib/SmartDB/FrontEnd/CampaignStatus.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';
import { th } from 'date-fns/locale';

export function useCampaignStatus() {
    const [list, setList] = useState<CampaignStatusEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignStatusEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignStatusEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignStatusEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CampaignStatusEntity[] = await CampaignStatusApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching CampaignStatus: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: CampaignStatusEntity = new CampaignStatusEntity(newItem);
            entity = await CampaignStatusApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating CampaignStatus: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CampaignStatusEntity(editItem);
                entity = await CampaignStatusApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating CampaignStatus: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignStatusApi.deleteByIdApi(CampaignStatusEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting CampaignStatus: ${e}`);
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
