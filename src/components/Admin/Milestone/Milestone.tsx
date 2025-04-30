import { MilestoneEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';
import styles from './Milestone.module.scss';
import { useMilestone } from './useMilestone';

export default function Milestone() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove, getStatusName } = useMilestone();

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
                            <th>Milestone Status</th>
                            <th>Estimated Delivery Days</th>
                            <th>Estimated Delivery Date</th>
                            <th>Percentage</th>
                            <th>Description</th>
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
                                <td>{getStatusName(item.milestone_status_id)}</td>
                                <td>{item.estimate_delivery_days}</td>
                                <td>{item.estimate_delivery_date?.toISOString()}</td>
                                <td>{item.percentage}</td>
                                <td>{item.description}</td>
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
        item: Partial<MilestoneEntity>,
        setItem: Dispatch<SetStateAction<Partial<MilestoneEntity>>> | Dispatch<SetStateAction<Partial<MilestoneEntity> | null>>
    ) => (
        <form className={styles.form}>
            <div>
                <label>Campaign ID:</label>
                <input type="text" value={item.campaign_id || ''} onChange={(e) => setItem({ ...item, campaign_id: e.target.value })} />
            </div>
            <div>
                <label>Milestone Status ID:</label>
                <input type="text" value={item.milestone_status_id || ''} onChange={(e) => setItem({ ...item, milestone_status_id: e.target.value })} />
            </div>
            <div>
                <label>Estimated Delivery Days:</label>
                <input
                    type="number"
                    value={item.estimate_delivery_days}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            estimate_delivery_days: Number(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Estimated Delivery Date:</label>
                <input
                    type="datetime-local"
                    value={item.estimate_delivery_date ? new Date(item.estimate_delivery_date).toISOString().slice(0, -1) : ''}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            estimate_delivery_date: new Date(e.target.value),
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
                <label>Description:</label>
                <textarea value={item.description || ''} onChange={(e) => setItem({ ...item, description: e.target.value })} />
            </div>
            <div>
                <label>Order:</label>
                <input
                    type="number"
                    value={item.order}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            order: Number(e.target.value),
                        })
                    }
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
