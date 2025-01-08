import { useState, useEffect } from 'react';
import { MilestoneEntity } from '../../../lib/SmartDB/Entities/Milestone.Entity';
import { MilestoneApi } from '../../../lib/SmartDB/FrontEnd/Milestone.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';
import { MilestoneStatusEntity } from '@/lib/SmartDB/Entities';
import { MilestoneStatusApi } from '@/lib/SmartDB/FrontEnd';

export function useMilestone() {
    const [list, setList] = useState<MilestoneEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<MilestoneEntity>>({});
    const [editItem, setEditItem] = useState<Partial<MilestoneEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<MilestoneEntity | null>(null);

    const [statuses, setStatuses] = useState<MilestoneStatusEntity[]>([]);

    const fetchMilestineExtras = async () => {
        const statuses: MilestoneStatusEntity[] = await MilestoneStatusApi.getAllApi_();
        setStatuses(statuses);
    };

    // Helper method to get status name by ID
    const getStatusName = (id: string): string => {
        const status = statuses.find((stat) => stat._DB_id === id);
        return status?.name || 'Unknown';
    };

    const fetch = async () => {
        try {
            await fetchMilestineExtras();
            const fetchedList: MilestoneEntity[] = await MilestoneApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching Milestone: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: MilestoneEntity = new MilestoneEntity(newItem);
            entity = await MilestoneApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating Milestone: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new MilestoneEntity(editItem);
                entity = await MilestoneApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating Milestone: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await MilestoneApi.deleteByIdApi(MilestoneEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting Milestone: ${e}`);
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
        getStatusName,
    };
}
