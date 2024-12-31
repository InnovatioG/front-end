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
                                <td>{item.createdBy}</td>
                                <td>{item.lastConnection?.toISOString()}</td>
                                <td>{item.walletUsed}</td>
                                <td>{item.walletValidatedWithSignedToken == true ? 'Yes' : 'No'}</td>
                                <td>{item.paymentPkh}</td>
                                <td>{item.stakePkh}</td>
                                <td>{item.testnetAddress}</td>
                                <td>{item.mainnetAddress}</td>
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
                <input type="text" value={newItem.createdBy || ''} onChange={(e) => setNewItem({ ...newItem, createdBy: e.target.value })} />
            </div>
            <div>
                <label>Last Connection:</label>
                <input
                    type="date"
                    value={newItem.lastConnection ? newItem.lastConnection.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        setNewItem({
                            ...newItem,
                            lastConnection: new Date(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Wallet Used:</label>
                <input type="text" value={newItem.walletUsed || ''} onChange={(e) => setNewItem({ ...newItem, walletUsed: e.target.value })} />
            </div>
            <div>
                <label>Wallet Validated With Signed Token:</label>
                <input
                    type="checkbox"
                    checked={newItem.walletValidatedWithSignedToken || false}
                    onChange={(e) =>
                        setNewItem({
                            ...newItem,
                            walletValidatedWithSignedToken: e.target.checked,
                        })
                    }
                />
            </div>
            <div>
                <label>Payment Pkh:</label>
                <input type="text" value={newItem.paymentPkh || ''} onChange={(e) => setNewItem({ ...newItem, paymentPkh: e.target.value })} />
            </div>
            <div>
                <label>Stake Pkh:</label>
                <input type="text" value={newItem.stakePkh || ''} onChange={(e) => setNewItem({ ...newItem, stakePkh: e.target.value })} />
            </div>
            <div>
                <label>Testnet Address:</label>
                <input type="text" value={newItem.testnetAddress || ''} onChange={(e) => setNewItem({ ...newItem, testnetAddress: e.target.value })} />
            </div>
            <div>
                <label>Mainnet Address:</label>
                <input type="text" value={newItem.mainnetAddress || ''} onChange={(e) => setNewItem({ ...newItem, mainnetAddress: e.target.value })} />
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
                <input type="text" value={editItem?.createdBy || ''} onChange={(e) => setEditItem({ ...editItem, createdBy: e.target.value })} />
            </div>
            <div>
                <label>Last Connection:</label>
                <input
                    type="date"
                    value={editItem?.lastConnection ? editItem.lastConnection.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                        setEditItem({
                            ...editItem,
                            lastConnection: new Date(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Wallet Used:</label>
                <input type="text" value={editItem?.walletUsed || ''} onChange={(e) => setEditItem({ ...editItem, walletUsed: e.target.value })} />
            </div>
            <div>
                <label>Wallet Validated With Signed Token:</label>
                <input
                    type="checkbox"
                    checked={editItem?.walletValidatedWithSignedToken || false}
                    onChange={(e) =>
                        setEditItem({
                            ...editItem,
                            walletValidatedWithSignedToken: e.target.checked,
                        })
                    }
                />
            </div>
            <div>
                <label>Payment Pkh:</label>
                <input type="text" value={editItem?.paymentPkh || ''} onChange={(e) => setEditItem({ ...editItem, paymentPkh: e.target.value })} />
            </div>
            <div>
                <label>Stake Pkh:</label>
                <input type="text" value={editItem?.stakePkh || ''} onChange={(e) => setEditItem({ ...editItem, stakePkh: e.target.value })} />
            </div>
            <div>
                <label>Testnet Address:</label>
                <input type="text" value={editItem?.testnetAddress || ''} onChange={(e) => setEditItem({ ...editItem, testnetAddress: e.target.value })} />
            </div>
            <div>
                <label>Mainnet Address:</label>
                <input type="text" value={editItem?.mainnetAddress || ''} onChange={(e) => setEditItem({ ...editItem, mainnetAddress: e.target.value })} />
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
