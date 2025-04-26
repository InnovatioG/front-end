import { useCallback, useEffect, useState } from 'react';
import { PROYECT_NAME, pushWarningNotification, WalletEntity, WalletFrontEndApiCalls } from 'smart-db';

export function useWallet() {
    const [list, setList] = useState<WalletEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<WalletEntity>>({});
    const [editItem, setEditItem] = useState<Partial<WalletEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<WalletEntity | null>(null);

    const fetch = useCallback(async () => {
        try {
            const fetchedList: WalletEntity[] = await WalletFrontEndApiCalls.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error fetching Wallet: ${e}`);
        }
    }, []); 

    useEffect(() => {
        fetch();
    }, [fetch]);

    const create = async () => {
        try {
            newItem.walletValidatedWithSignedToken = newItem.walletValidatedWithSignedToken ?? false;
            let entity: WalletEntity = new WalletEntity(newItem);
            entity = await WalletFrontEndApiCalls.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error creating Wallet: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                let entity = new WalletEntity(editItem);
                entity = await WalletFrontEndApiCalls.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification(`${PROYECT_NAME}`, `Error updating Wallet: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await WalletFrontEndApiCalls.deleteByIdApi(WalletEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification(`${PROYECT_NAME}`, `Error deleting Wallet: ${e}`);
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
