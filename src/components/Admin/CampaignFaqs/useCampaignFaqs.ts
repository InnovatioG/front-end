import { useEffect, useState } from 'react';
import { pushWarningNotification } from 'smart-db';
import { CampaignFaqsEntity } from '../../../lib/SmartDB/Entities/CampaignFaqs.Entity';
import { CampaignFaqsApi } from '../../../lib/SmartDB/FrontEnd/CampaignFaqs.FrontEnd.Api.Calls';

export function useCampaignFaqs() {
    const [list, setList] = useState<CampaignFaqsEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignFaqsEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignFaqsEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignFaqsEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CampaignFaqsEntity[] = await CampaignFaqsApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching CampaignFaqs: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: CampaignFaqsEntity = new CampaignFaqsEntity(newItem);
            entity = await CampaignFaqsApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating CampaignFaqs: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CampaignFaqsEntity(editItem);
                entity = await CampaignFaqsApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating CampaignFaqs: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignFaqsApi.deleteByIdApi(CampaignFaqsEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting CampaignFaqs: ${e}`);
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
