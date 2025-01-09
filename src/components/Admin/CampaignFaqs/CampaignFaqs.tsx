import { CampaignFaqsEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';
import styles from './CampaignFaqs.module.scss';
import { useCampaignFaqs } from './useCampaignFaqs';

export default function CampaignFaqs() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaignFaqs();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New FAQ</button>
            </div>
            {list.length === 0 ? (
                <p>No Campaign FAQs found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign ID</th>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Order</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.campaign_id}</td>
                                <td>{item.question}</td>
                                <td>{item.answer}</td>
                                <td>{item.order}</td>
                                <td>{item.createdAt.toISOString()}</td>
                                <td>{item.updatedAt?.toISOString()}</td>
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
        item: Partial<CampaignFaqsEntity>,
        setItem: Dispatch<SetStateAction<Partial<CampaignFaqsEntity>>> | Dispatch<SetStateAction<Partial<CampaignFaqsEntity> | null>>
    ) => (
        <form className={styles.form}>
            <div>
                <label>Campaign ID:</label>
                <input type="text" value={item.campaign_id || ''} onChange={(e) => setItem({ ...item, campaign_id: e.target.value })} />
            </div>
            <div>
                <label>Question:</label>
                <input type="text" value={item.question || ''} onChange={(e) => setItem({ ...item, question: e.target.value })} />
            </div>
            <div>
                <label>Answer:</label>
                <textarea value={item.answer || ''} onChange={(e) => setItem({ ...item, answer: e.target.value })} />
            </div>
            <div>
                <label>Order:</label>
                <input type="number" value={item.order || ''} onChange={(e) => setItem({ ...item, order: Number(e.target.value) })} />
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
            {deleteItem && <pre>{JSON.stringify(deleteItem, null, 2)}</pre>}
            <button onClick={remove}>Confirm</button>
            <button onClick={() => setView('list')}>Cancel</button>
        </div>
    );

    return (
        <div className={styles.content}>
            {view === 'list' && renderList()}
            {view === 'create' && renderForm(newItem, setNewItem)}
            {view === 'edit' && editItem && renderForm(editItem, setEditItem)}
            {view === 'confirmDelete' && renderConfirmDelete()}
        </div>
    );
}
