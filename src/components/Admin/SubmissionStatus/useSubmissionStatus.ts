import { useEffect, useState } from 'react';
import { pushWarningNotification } from 'smart-db';
import { SubmissionStatusEntity } from '../../../lib/SmartDB/Entities/SubmissionStatus.Entity';
import { SubmissionStatusApi } from '../../../lib/SmartDB/FrontEnd/SubmissionStatus.FrontEnd.Api.Calls';

export function useSubmissionStatus() {
    const [list, setList] = useState<SubmissionStatusEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<SubmissionStatusEntity>>({});
    const [editItem, setEditItem] = useState<Partial<SubmissionStatusEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<SubmissionStatusEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: SubmissionStatusEntity[] = await SubmissionStatusApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching SubmissionStatus: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: SubmissionStatusEntity = new SubmissionStatusEntity(newItem);
            entity = await SubmissionStatusApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating SubmissionStatus: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new SubmissionStatusEntity(editItem);
                entity = await SubmissionStatusApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating SubmissionStatus: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await SubmissionStatusApi.deleteByIdApi(SubmissionStatusEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting SubmissionStatus: ${e}`);
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
