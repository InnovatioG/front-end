import { useCampaignFaqs } from './useCampaignFaqs';
import styles from './CampaignFaqs.module.scss';

export default function CampaignFaqs() {
    const {
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
    } = useCampaignFaqs();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No CampaignFaqs found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign ID</th>
                            <th>Name</th>
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
                                <td>{item.campaignId}</td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.order}</td>
                                <td>{item.createdAt.toISOString()}</td>
                                <td>{item.updatedAt?.toISOString()}</td>
                                <td>
                                    <button onClick={() => {
                                        setEditItem(item);
                                        setView('edit');
                                    }}>Edit</button>
                                    <button onClick={() => {
                                        setDeleteItem(item);
                                        setView('confirmDelete');
                                    }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderCreateForm = () => (
        <form className={styles.form}>
            <div>
                <label>Campaign ID:</label>
                <input
                    type="number"
                    value={newItem.campaignId || ''}
                    onChange={(e) => setNewItem({ ...newItem, campaignId: e.target.value })}
                />
            </div>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={newItem.name || ''}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={newItem.description || ''}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
            </div>
            <div>
                <label>Order:</label>
                <input
                    type="text"
                    value={newItem.order || ''}
                    onChange={(e) => setNewItem({ ...newItem, order: e.target.value })}
                />
            </div>

            <button type="button" onClick={create}>Create</button>
            <button type="button" onClick={() => setView('list')}>Cancel</button>
        </form>
    );

    const renderEditForm = () => (
        <form className={styles.form}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={editItem?.name || ''}
                    onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
                />
            </div>
            <div>
                <label>Description:</label>
                <input
                    type="text"
                    value={editItem?.description || ''}
                    onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                />
            </div>
            <div>
                <label>Order:</label>
                <input
                    type="text"
                    value={editItem?.order || ''}
                    onChange={(e) => setEditItem({ ...editItem, order: e.target.value })}
                />
            </div>


            <button type="button" onClick={update}>Update</button>
            <button type="button" onClick={() => setView('list')}>Cancel</button>
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
            {view === 'create' && renderCreateForm()}
            {view === 'edit' && renderEditForm()}
            {view === 'confirmDelete' && renderConfirmDelete()}
        </div>
    );
}
