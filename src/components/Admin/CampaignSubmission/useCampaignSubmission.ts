import { useCallback, useEffect, useState } from 'react';
import { PROYECT_NAME, pushWarningNotification } from 'smart-db';
import { CampaignSubmissionEntity } from '../../../lib/SmartDB/Entities/CampaignSubmission.Entity';
import { CampaignSubmissionApi } from '../../../lib/SmartDB/FrontEnd/CampaignSubmission.FrontEnd.Api.Calls';

export function useCampaignSubmission() {
    const [list, setList] = useState<CampaignSubmissionEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignSubmissionEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignSubmissionEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignSubmissionEntity | null>(null);

    const fetch = useCallback(async () => {
        try {
            const fetchedList: CampaignSubmissionEntity[] = await CampaignSubmissionApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error fetching CampaignSubmission: ${e}`);
        }
    }, []); 

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = async () => {
        try {
            let entity: CampaignSubmissionEntity = new CampaignSubmissionEntity(newItem);
            entity = await CampaignSubmissionApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error creating CampaignSubmission: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CampaignSubmissionEntity(editItem);
                entity = await CampaignSubmissionApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification(`${PROYECT_NAME}`, `Error updating CampaignSubmission: ${e}`);
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
                pushWarningNotification(`${PROYECT_NAME}`, `Error deleting CampaignSubmission: ${e}`);
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
