import { useEffect, useState } from 'react';
import { pushWarningNotification } from 'smart-db';
import { CampaignContentEntity } from '../../../lib/SmartDB/Entities/CampaignContent.Entity';
import { CampaignContentApi } from '../../../lib/SmartDB/FrontEnd/CampaignContent.FrontEnd.Api.Calls';

export function useCampaignContent() {
    const [list, setList] = useState<CampaignContentEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignContentEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignContentEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignContentEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CampaignContentEntity[] = await CampaignContentApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching CampaignContent: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: CampaignContentEntity = new CampaignContentEntity(newItem);
            entity = await CampaignContentApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating CampaignContent: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CampaignContentEntity(editItem);
                entity = await CampaignContentApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating CampaignContent: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignContentApi.deleteByIdApi(CampaignContentEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting CampaignContent: ${e}`);
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
