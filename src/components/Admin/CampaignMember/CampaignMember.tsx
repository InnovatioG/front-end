import { useCampaignMember } from './useCampaignMember';
import styles from './CampaignMember.module.scss';
import { CampaignMemberEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';

export default function CampaignMember() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaignMember();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Campaign Members found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign ID</th>
                            <th>Editor</th>
                            <th>Wallet ID</th>
                            <th>Role</th>
                            <th>Description</th>
                            <th>Website</th>
                            <th>Instagram</th>
                            <th>Twitter</th>
                            <th>Discord</th>
                            <th>Facebook</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.campaign_id}</td>
                                <td>{item.editor ? 'Yes' : 'No'}</td>
                                <td>{item.wallet_id}</td>
                                <td>{item.rol}</td>
                                <td>{item.description}</td>
                                <td>{item.website}</td>
                                <td>{item.instagram}</td>
                                <td>{item.twitter}</td>
                                <td>{item.discord}</td>
                                <td>{item.facebook}</td>
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
        item: Partial<CampaignMemberEntity>,
        setItem: Dispatch<SetStateAction<Partial<CampaignMemberEntity>>> | Dispatch<SetStateAction<Partial<CampaignMemberEntity> | null>>
    ) => (
        <form className={styles.form}>
            <div>
                <label>Campaign ID:</label>
                <input type="text" value={item.campaign_id || ''} onChange={(e) => setItem({ ...item, campaign_id: e.target.value })} />
            </div>
            <div>
                <label>Editor:</label>
                <input type="checkbox" checked={item.editor || false} onChange={(e) => setItem({ ...item, editor: e.target.checked })} />
            </div>
            <div>
                <label>Wallet ID:</label>
                <input type="text" value={item.wallet_id || ''} onChange={(e) => setItem({ ...item, wallet_id: e.target.value })} />
            </div>
            <div>
                <label>Role:</label>
                <input type="text" value={item.rol || ''} onChange={(e) => setItem({ ...item, rol: e.target.value })} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={item.description || ''} onChange={(e) => setItem({ ...item, description: e.target.value })} />
            </div>
            <div>
                <label>Website:</label>
                <input type="text" value={item.website || ''} onChange={(e) => setItem({ ...item, website: e.target.value })} />
            </div>
            <div>
                <label>Instagram:</label>
                <input type="text" value={item.instagram || ''} onChange={(e) => setItem({ ...item, instagram: e.target.value })} />
            </div>
            <div>
                <label>Twitter:</label>
                <input type="text" value={item.twitter || ''} onChange={(e) => setItem({ ...item, twitter: e.target.value })} />
            </div>
            <div>
                <label>Discord:</label>
                <input type="text" value={item.discord || ''} onChange={(e) => setItem({ ...item, discord: e.target.value })} />
            </div>
            <div>
                <label>Facebook:</label>
                <input type="text" value={item.facebook || ''} onChange={(e) => setItem({ ...item, facebook: e.target.value })} />
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
