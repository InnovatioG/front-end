import { useState, useEffect } from 'react';
import { CampaignSubmissionEntity } from '../../../lib/SmartDB/Entities/CampaignSubmission.Entity';
import { CampaignSubmissionApi } from '../../../lib/SmartDB/FrontEnd/CampaignSubmission.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';

export function useCampaignSubmission() {
    const [list, setList] = useState<CampaignSubmissionEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignSubmissionEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignSubmissionEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignSubmissionEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CampaignSubmissionEntity[] = await CampaignSubmissionApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching CampaignSubmission: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: CampaignSubmissionEntity = new CampaignSubmissionEntity(newItem);
            entity = await CampaignSubmissionApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating CampaignSubmission: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                console.log(editItem._DB_id);
                let entity = new CampaignSubmissionEntity(editItem);
                entity = await CampaignSubmissionApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating CampaignSubmission: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignSubmissionApi.deleteByIdApi(CampaignSubmissionEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting CampaignSubmission: ${e}`);
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
