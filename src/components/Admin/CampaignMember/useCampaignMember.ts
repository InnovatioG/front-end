import { useState, useEffect } from 'react';
import { CampaignMemberEntity } from '../../../lib/SmartDB/Entities/CampaignMember.Entity';
import { CampaignMemberApi } from '../../../lib/SmartDB/FrontEnd/CampaignMember.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';

import { Newspaper } from 'lucide-react';

export function useCampaignMember() {
    const [list, setList] = useState<CampaignMemberEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignMemberEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignMemberEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignMemberEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CampaignMemberEntity[] = await CampaignMemberApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching CampaignMember: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            newItem.editor = newItem.editor ?? false;
            let entity: CampaignMemberEntity = new CampaignMemberEntity(newItem);
            entity = await CampaignMemberApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating CampaignMember: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CampaignMemberEntity(editItem);
                entity = await CampaignMemberApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating CampaignMember: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignMemberApi.deleteByIdApi(CampaignMemberEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting CampaignMember: ${e}`);
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
