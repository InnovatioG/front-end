import { useCustomWallet } from './useCustomWallet';
import styles from './CustomWallet.module.scss';

export default function CustomWallet() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCustomWallet();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No CampaignWallet found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created By</th>
                            <th>Last Connection</th>
                            <th>Wallet Used</th>
                            <th>Wallet Validated With Signed Token</th>
                            <th>Payment Pkh</th>
                            <th>Stake Pkh</th>
                            <th>Testnet Address</th>
                            <th>Mainnet Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.name}</td>
                                <td>{item.email || 'N/A'}</td>
                                <td>{item.created_by}</td>
                                <td>{item.last_connection?.toISOString()}</td>
                                <td>{item.wallet_used}</td>
                                <td>{item.wallet_validated_with_signed_token == true ? 'Yes' : 'No'}</td>
                                <td>{item.payment_pkh}</td>
                                <td>{item.stakePkh}</td>
                                <td>{item.testnet_address}</td>
                                <td>{item.mainnet_address}</td>
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

    const renderCreateForm = () => (
        <form className={styles.form}>
            <div>
                <label>Name:</label>
                <input type="text" value={newItem.name || ''} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            </div>
            <div>
                <label>Email:</label>
                <input type="text" value={newItem.email || ''} onChange={(e) => setNewItem({ ...newItem, email: e.target.value })} />
            </div>
            <div>
                <label>Created By:</label>
                <input type="text" value={newItem.created_by || ''} onChange={(e) => setNewItem({ ...newItem, created_by: e.target.value })} />
            </div>
            <div>
                <label>Last Connection:</label>
                <input
                    type="date"
                    value={newItem.last_connection ? newItem.last_connection.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        setNewItem({
                            ...newItem,
                            last_connection: new Date(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Wallet Used:</label>
                <input type="text" value={newItem.wallet_used || ''} onChange={(e) => setNewItem({ ...newItem, wallet_used: e.target.value })} />
            </div>
            <div>
                <label>Wallet Validated With Signed Token:</label>
                <input
                    type="checkbox"
                    checked={newItem.wallet_validated_with_signed_token || false}
                    onChange={(e) =>
                        setNewItem({
                            ...newItem,
                            wallet_validated_with_signed_token: e.target.checked,
                        })
                    }
                />
            </div>
            <div>
                <label>Payment Pkh:</label>
                <input type="text" value={newItem.payment_pkh || ''} onChange={(e) => setNewItem({ ...newItem, payment_pkh: e.target.value })} />
            </div>
            <div>
                <label>Stake Pkh:</label>
                <input type="text" value={newItem.stakePkh || ''} onChange={(e) => setNewItem({ ...newItem, stakePkh: e.target.value })} />
            </div>
            <div>
                <label>Testnet Address:</label>
                <input type="text" value={newItem.testnet_address || ''} onChange={(e) => setNewItem({ ...newItem, testnet_address: e.target.value })} />
            </div>
            <div>
                <label>Mainnet Address:</label>
                <input type="text" value={newItem.mainnet_address || ''} onChange={(e) => setNewItem({ ...newItem, mainnet_address: e.target.value })} />
            </div>
            <button type="button" onClick={create}>
                Create
            </button>
            <button type="button" onClick={() => setView('list')}>
                Cancel
            </button>
        </form>
    );

    const renderEditForm = () => (
        <form className={styles.form}>
            <div>
                <label>Name:</label>
                <input type="text" value={editItem?.name || ''} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} />
            </div>
            <div>
                <label>Email:</label>
                <input type="text" value={editItem?.email || ''} onChange={(e) => setEditItem({ ...editItem, email: e.target.value })} />
            </div>
            <div>
                <label>Created By:</label>
                <input type="text" value={editItem?.created_by || ''} onChange={(e) => setEditItem({ ...editItem, created_by: e.target.value })} />
            </div>
            <div>
                <label>Last Connection:</label>
                <input
                    type="date"
                    value={editItem?.last_connection ? editItem.last_connection.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        setEditItem({
                            ...editItem,
                            last_connection: new Date(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Wallet Used:</label>
                <input type="text" value={editItem?.wallet_used || ''} onChange={(e) => setEditItem({ ...editItem, wallet_used: e.target.value })} />
            </div>
            <div>
                <label>Wallet Validated With Signed Token:</label>
                <input
                    type="checkbox"
                    checked={editItem?.wallet_validated_with_signed_token || false}
                    onChange={(e) =>
                        setEditItem({
                            ...editItem,
                            wallet_validated_with_signed_token: e.target.checked,
                        })
                    }
                />
            </div>
            <div>
                <label>Payment Pkh:</label>
                <input type="text" value={editItem?.payment_pkh || ''} onChange={(e) => setEditItem({ ...editItem, payment_pkh: e.target.value })} />
            </div>
            <div>
                <label>Stake Pkh:</label>
                <input type="text" value={editItem?.stakePkh || ''} onChange={(e) => setEditItem({ ...editItem, stakePkh: e.target.value })} />
            </div>
            <div>
                <label>Testnet Address:</label>
                <input type="text" value={editItem?.testnet_address || ''} onChange={(e) => setEditItem({ ...editItem, testnet_address: e.target.value })} />
            </div>
            <div>
                <label>Mainnet Address:</label>
                <input type="text" value={editItem?.mainnet_address || ''} onChange={(e) => setEditItem({ ...editItem, mainnet_address: e.target.value })} />
            </div>
            <button type="button" onClick={update}>
                Update
            </button>
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
            {view === 'create' && renderCreateForm()}
            {view === 'edit' && renderEditForm()}
            {view === 'confirmDelete' && renderConfirmDelete()}
        </div>
    );
}
