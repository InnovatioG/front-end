import { useCallback, useEffect, useState } from 'react';
import { pushWarningNotification } from 'smart-db';
import { MilestoneSubmissionEntity } from '../../../lib/SmartDB/Entities/MilestoneSubmission.Entity';
import { MilestoneSubmissionApi } from '../../../lib/SmartDB/FrontEnd/MilestoneSubmission.FrontEnd.Api.Calls';

export function useMilestoneSubmission() {
    const [list, setList] = useState<MilestoneSubmissionEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<MilestoneSubmissionEntity>>({});
    const [editItem, setEditItem] = useState<Partial<MilestoneSubmissionEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<MilestoneSubmissionEntity | null>(null);

    const fetch = useCallback(async () => {
        try {
            const fetchedList: MilestoneSubmissionEntity[] = await MilestoneSubmissionApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching MilestoneSubmission: ${e}`);
        }
    }, []); 

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = async () => {
        try {
            let entity: MilestoneSubmissionEntity = new MilestoneSubmissionEntity(newItem);
            entity = await MilestoneSubmissionApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating MilestoneSubmission: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new MilestoneSubmissionEntity(editItem);
                entity = await MilestoneSubmissionApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating MilestoneSubmission: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await MilestoneSubmissionApi.deleteByIdApi(MilestoneSubmissionEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting MilestoneSubmission: ${e}`);
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
