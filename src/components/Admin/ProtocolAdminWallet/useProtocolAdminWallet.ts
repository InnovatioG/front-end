import { useEffect, useState } from 'react';
import { pushWarningNotification } from 'smart-db';
import { ProtocolAdminWalletEntity } from '../../../lib/SmartDB/Entities/ProtocolAdminWallet.Entity';
import { ProtocolAdminWalletApi } from '../../../lib/SmartDB/FrontEnd/ProtocolAdminWallet.FrontEnd.Api.Calls';

export function useProtocolAdminWallet() {
    const [list, setList] = useState<ProtocolAdminWalletEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<ProtocolAdminWalletEntity>>({});
    const [editItem, setEditItem] = useState<Partial<ProtocolAdminWalletEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<ProtocolAdminWalletEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: ProtocolAdminWalletEntity[] = await ProtocolAdminWalletApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching ProtocolAdminWallet: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            let entity: ProtocolAdminWalletEntity = new ProtocolAdminWalletEntity(newItem);
            entity = await ProtocolAdminWalletApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating ProtocolAdminWallet: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new ProtocolAdminWalletEntity(editItem);
                entity = await ProtocolAdminWalletApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating ProtocolAdminWallet: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await ProtocolAdminWalletApi.deleteByIdApi(ProtocolAdminWalletEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting ProtocolAdminWallet: ${e}`);
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
