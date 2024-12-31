import { useCampaignFunds } from './useCampaignFunds';
import styles from './CampaignFunds.module.scss';
import { CampaignFundsEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';

export default function CampaignFunds() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaignFunds();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Campaign Funds found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Index</th>
                            <th>Campaign Policy CS</th>
                            <th>Campaign Funds Policy ID CS</th>
                            <th>Available Campaign Tokens</th>
                            <th>Sold Campaign Tokens</th>
                            <th>Available ADA</th>
                            <th>Collected ADA</th>
                            <th>Min ADA</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.cfdIndex}</td>
                                <td>{item.cfdCampaignPolicy_CS}</td>
                                <td>{item.cfdCampaignFundsPolicyID_CS}</td>
                                <td>{item.cfdSubtotal_Avalaible_CampaignToken.toString()}</td>
                                <td>{item.cfdSubtotal_Sold_CampaignToken.toString()}</td>
                                <td>{item.cfdSubtotal_Avalaible_ADA.toString()}</td>
                                <td>{item.cfdSubtotal_Collected_ADA.toString()}</td>
                                <td>{item.cfdMinADA.toString()}</td>
                                <td>{item.createdAt.toISOString()}</td>
                                <td>{item.updated_at?.toISOString()}</td>
                                <td>
                                    <button
                                        onClick={() => {
                                            setEditItem(item);
                                            setView('edit');
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setDeleteItem(item);
                                            setView('confirmDelete');
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderForm = (
        item: Partial<CampaignFundsEntity>,
        setItem: Dispatch<SetStateAction<Partial<CampaignFundsEntity>>> | Dispatch<SetStateAction<Partial<CampaignFundsEntity> | null>>
    ) => (
        <form className={styles.form}>
            <div>
                <label>Index:</label>
                <input type="number" value={item.cfdIndex || ''} onChange={(e) => setItem({ ...item, cfdIndex: Number(e.target.value) })} />
            </div>
            <div>
                <label>Campaign Policy CS:</label>
                <input type="text" value={item.cfdCampaignPolicy_CS || ''} onChange={(e) => setItem({ ...item, cfdCampaignPolicy_CS: e.target.value })} />
            </div>
            <div>
                <label>Campaign Funds Policy ID CS:</label>
                <input type="text" value={item.cfdCampaignFundsPolicyID_CS || ''} onChange={(e) => setItem({ ...item, cfdCampaignFundsPolicyID_CS: e.target.value })} />
            </div>
            <div>
                <label>Available Campaign Tokens:</label>
                <input
                    type="text"
                    value={item.cfdSubtotal_Avalaible_CampaignToken?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cfdSubtotal_Avalaible_CampaignToken: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Sold Campaign Tokens:</label>
                <input
                    type="text"
                    value={item.cfdSubtotal_Sold_CampaignToken?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cfdSubtotal_Sold_CampaignToken: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Available ADA:</label>
                <input
                    type="text"
                    value={item.cfdSubtotal_Avalaible_ADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cfdSubtotal_Avalaible_ADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Collected ADA:</label>
                <input
                    type="text"
                    value={item.cfdSubtotal_Collected_ADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cfdSubtotal_Collected_ADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Min ADA:</label>
                <input
                    type="text"
                    value={item.cfdMinADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cfdMinADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Created At:</label>
                <input
                    type="datetime-local"
                    value={item.createdAt ? new Date(item.createdAt).toISOString().slice(0, -1) : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setItem({ ...item, createdAt: selectedDate });
                    }}
                    disabled={true}
                />
            </div>
            <div>
                <label>Updated At:</label>
                <input
                    type="datetime-local"
                    value={item.updatedAt ? new Date(item.updatedAt).toISOString().slice(0, -1) : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setItem({ ...item, updatedAt: selectedDate });
                    }}
                    disabled={true}
                />
            </div>
            {view === 'create' ? (
                <button type="button" onClick={create}>
                    Create
                </button>
            ) : (
                <button type="button" onClick={update}>
                    Update
                </button>
            )}
            <button type="button" onClick={() => setView('list')}>
                Cancel
            </button>
        </form>
    );

    const renderConfirmDelete = () => (
        <div className={styles.confirmDelete}>
            <p>Are you sure you want to delete this item?</p>
            {deleteItem && <pre>{deleteItem.show()}</pre>}
            <button onClick={remove}>Confirm</button>
            <button onClick={() => setView('list')}>Cancel</button>
        </div>
    );

    return (
        <div className={styles.content}>
            {view === 'list' && renderList()}
            {view === 'create' && renderForm(newItem, setNewItem)}
            {view === 'edit' && editItem !== null && renderForm(editItem, setEditItem)}
            {view === 'confirmDelete' && renderConfirmDelete()}
        </div>
    );
}
