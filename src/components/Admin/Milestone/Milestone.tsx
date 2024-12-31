import { useMilestone } from './useMilestone';
import styles from './Milestone.module.scss';
import { MilestoneEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';

export default function Milestone() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useMilestone();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Milestones found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign ID</th>
                            <th>Milestone Status ID</th>
                            <th>Estimated Delivery Date</th>
                            <th>Percentage</th>
                            <th>Status</th>
                            <th>Description</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.campaignId}</td>
                                <td>{item.milestoneStatusId}</td>
                                <td>{item.estimatedDeliveryDate.toISOString()}</td>
                                <td>{item.percentage}</td>
                                <td>{item.status}</td>
                                <td>{item.description}</td>
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
        item: Partial<MilestoneEntity>,
        setItem: Dispatch<SetStateAction<Partial<MilestoneEntity>>> | Dispatch<SetStateAction<Partial<MilestoneEntity> | null>>
    ) => (
        <form className={styles.form}>
            <div>
                <label>Campaign ID:</label>
                <input type="text" value={item.campaignId || ''} onChange={(e) => setItem({ ...item, campaignId: e.target.value })} />
            </div>
            <div>
                <label>Milestone Status ID:</label>
                <input type="text" value={item.milestoneStatusId || ''} onChange={(e) => setItem({ ...item, milestoneStatusId: e.target.value })} />
            </div>
            <div>
                <label>Estimated Delivery Date:</label>
                <input
                    type="datetime-local"
                    value={item.estimatedDeliveryDate ? new Date(item.estimatedDeliveryDate).toISOString().slice(0, -1) : ''}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            estimatedDeliveryDate: new Date(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Percentage:</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.percentage || ''}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            percentage: Number(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Status:</label>
                <input
                    type="number"
                    value={item.status || ''}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            status: Number(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={item.description || ''} onChange={(e) => setItem({ ...item, description: e.target.value })} />
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
