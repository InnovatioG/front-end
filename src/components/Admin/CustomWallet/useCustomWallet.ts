import { useState, useEffect } from 'react';
import { CustomWalletEntity } from '../../../lib/SmartDB/Entities/CustomWallet.Entity';
import { CustomWalletApi } from '../../../lib/SmartDB/FrontEnd/CustomWallet.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';
import { th } from 'date-fns/locale';

export function useCustomWallet() {
    const [list, setList] = useState<CustomWalletEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CustomWalletEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CustomWalletEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CustomWalletEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CustomWalletEntity[] = await CustomWalletApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching CustomWallet: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            newItem.walletValidatedWithSignedToken = newItem.walletValidatedWithSignedToken ?? false 
            let entity: CustomWalletEntity = new CustomWalletEntity(newItem);
            entity = await CustomWalletApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating CustomWallet: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new CustomWalletEntity(editItem);
                entity = await CustomWalletApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating CustomWallet: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CustomWalletApi.deleteByIdApi(CustomWalletEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting CustomWallet: ${e}`);
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
