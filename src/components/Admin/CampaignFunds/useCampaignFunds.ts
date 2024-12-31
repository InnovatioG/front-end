import { useState, useEffect } from 'react';
import { CampaignFundsEntity } from '../../../lib/SmartDB/Entities/CampaignFunds.Entity';
import { CampaignFundsApi } from '../../../lib/SmartDB/FrontEnd/CampaignFunds.FrontEnd.Api.Calls';
import { pushWarningNotification } from 'smart-db';

export function useCampaignFunds() {
    const [list, setList] = useState<CampaignFundsEntity[]>([]);
    const [newItem, setNewItem] = useState<Partial<CampaignFundsEntity>>({});
    const [editItem, setEditItem] = useState<Partial<CampaignFundsEntity> | null>(null);
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'confirmDelete'>('list');
    const [deleteItem, setDeleteItem] = useState<CampaignFundsEntity | null>(null);

    const fetch = async () => {
        try {
            const fetchedList: CampaignFundsEntity[] = await CampaignFundsApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error fetching CampaignFunds: ${e}`);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const create = async () => {
        try {
            newItem._NET_address = 'test address';
            newItem._NET_id_CS = 'test CS';
            newItem._NET_id_TN = 'test TN';
            newItem._isDeployed = false;
            let entity: CampaignFundsEntity = new CampaignFundsEntity(newItem);
            entity = await CampaignFundsApi.createApi(entity);
            setNewItem({});
            fetch();
            setView('list');
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating CampaignFunds: ${e}`);
        }
    };

    const update = async () => {
        if (editItem && editItem._DB_id) {
            try {
                editItem._isDeployed = false;
                let entity = new CampaignFundsEntity(editItem);
                entity = await CampaignFundsApi.updateWithParamsApi_(editItem._DB_id, entity);
                setEditItem(null);
                fetch();
                setView('list');
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error updating CampaignFunds: ${e}`);
            }
        }
    };

    const remove = async () => {
        if (deleteItem) {
            try {
                if (await CampaignFundsApi.deleteByIdApi(CampaignFundsEntity, deleteItem._DB_id!)) {
                    fetch();
                    setDeleteItem(null);
                    setView('list');
                } else {
                    throw new Error('Unknown error');
                }
            } catch (e) {
                console.error(e);
                pushWarningNotification('Error', `Error deleting CampaignFunds: ${e}`);
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
