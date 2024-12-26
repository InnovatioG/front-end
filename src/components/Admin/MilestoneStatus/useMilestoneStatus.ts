import { useState, useEffect } from 'react';
import { MilestoneStatusEntity } from '../../../lib/SmartDB/Entities/MilestoneStatus.Entity';
import { MilestoneStatusApi } from '../../../lib/SmartDB/FrontEnd/MilestoneStatus.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';
import { th } from 'date-fns/locale';

export function useMilestoneStatus() {
    const [list, setList] = useState<MilestoneStatusEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<MilestoneStatusEntity>>({});
    const [editItem, setEditItem] = useState<Partial<MilestoneStatusEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<MilestoneStatusEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: MilestoneStatusEntity[] = await MilestoneStatusApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching MilestoneStatus: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: MilestoneStatusEntity = new MilestoneStatusEntity(newItem);
            entity = await MilestoneStatusApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating MilestoneStatus: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new MilestoneStatusEntity(editItem);
                entity = await MilestoneStatusApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating MilestoneStatus: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await MilestoneStatusApi.deleteByIdApi(MilestoneStatusEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting MilestoneStatus: ${e}`);
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
