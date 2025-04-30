import { WalletEntity } from 'smart-db';
import { Dispatch, SetStateAction } from 'react';
import styles from './Wallet.module.scss';
import { useWallet } from './useWallet';

export default function Wallet() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useWallet();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Wallets found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created By</th>
                            <th>Last Connection</th>
                            <th>Wallet Used</th>
                            <th>Validated</th>
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
                                <td>{item.walletName}</td>
                                <td>{item.walletValidatedWithSignedToken ? 'Yes' : 'No'}</td>
                                <td>{item.paymentPKH}</td>
                                <td>{item.stakePKH}</td>
                                <td>{item.testnet_address}</td>
                                <td>{item.mainnet_address}</td>
                                <td>
                                    <button onClick={() => { setEditItem(item); setView('edit'); }}>Edit</button>
                                    <button onClick={() => { setDeleteItem(item); setView('confirmDelete'); }}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );

    const renderForm = (
        item: Partial<WalletEntity>,
        setItem: Dispatch<SetStateAction<Partial<WalletEntity>>> | Dispatch<SetStateAction<Partial<WalletEntity> | null>>
    ) => (
        <form className={styles.form}>
            <div>
                <label>Name:</label>
                <input type="text" value={item.name || ''} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            </div>
            <div>
                <label>Email:</label>
                <input type="text" value={item.email || ''} onChange={(e) => setItem({ ...item, email: e.target.value })} />
            </div>
            <div>
                <label>Created By:</label>
                <input type="text" value={item.createdBy || ''} onChange={(e) => setItem({ ...item, createdBy: e.target.value })} />
            </div>
            <div>
                <label>Last Connection:</label>
                <input
                    type="date"
                    value={item.lastConnection ? item.lastConnection.toISOString().split('T')[0] : ''}
                    onChange={(e) => setItem({ ...item, lastConnection: new Date(e.target.value) })}
                />
            </div>
            <div>
                <label>Wallet Used:</label>
                <input type="text" value={item.walletName || ''} onChange={(e) => setItem({ ...item, walletName: e.target.value })} />
            </div>
            <div>
                <label>Wallet Validated With Signed Token:</label>
                <input
                    type="checkbox"
                    checked={item.walletValidatedWithSignedToken || false}
                    onChange={(e) => setItem({ ...item, walletValidatedWithSignedToken: e.target.checked })}
                />
            </div>
            <div>
                <label>Payment Pkh:</label>
                <input type="text" value={item.paymentPKH || ''} onChange={(e) => setItem({ ...item, paymentPKH: e.target.value })} />
            </div>
            <div>
                <label>Stake Pkh:</label>
                <input type="text" value={item.stakePKH || ''} onChange={(e) => setItem({ ...item, stakePKH: e.target.value })} />
            </div>
            <div>
                <label>Testnet Address:</label>
                <input type="text" value={item.testnet_address || ''} onChange={(e) => setItem({ ...item, testnet_address: e.target.value })} />
            </div>
            <div>
                <label>Mainnet Address:</label>
                <input type="text" value={item.mainnet_address || ''} onChange={(e) => setItem({ ...item, mainnet_address: e.target.value })} />
            </div>
            {view === 'create' ? (
                <button type="button" onClick={create}>Create</button>
            ) : (
                <button type="button" onClick={update}>Update</button>
            )}
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
            {view === 'create' && renderForm(newItem, setNewItem)}
            {view === 'edit' && editItem !== null && renderForm(editItem, setEditItem)}
            {view === 'confirmDelete' && renderConfirmDelete()}
        </div>
    );
}
