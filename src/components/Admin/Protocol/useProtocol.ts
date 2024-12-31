import { useState, useEffect } from 'react';
import { ProtocolEntity } from '../../../lib/SmartDB/Entities/Protocol.Entity';
import { ProtocolApi } from '../../../lib/SmartDB/FrontEnd/Protocol.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';

export function useProtocol() {
    const [list, setList] = useState<ProtocolEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<ProtocolEntity>>({});
    const [editItem, setEditItem] = useState<Partial<ProtocolEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<ProtocolEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: ProtocolEntity[] = await ProtocolApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching Protocol: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            newItem._NET_address = 'test address';
            newItem._NET_id_CS = 'test CS';
            newItem._isDeployed = true;
            let entity: ProtocolEntity = new ProtocolEntity(newItem);
            entity = await ProtocolApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating Protocol: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new ProtocolEntity(editItem);
                entity = await ProtocolApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating Protocol: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await ProtocolApi.deleteByIdApi(ProtocolEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting Protocol: ${e}`);
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
