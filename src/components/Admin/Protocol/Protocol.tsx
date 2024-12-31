import { useProtocol } from './useProtocol';
import styles from './Protocol.module.scss';
import { ProtocolEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';

export default function Protocol() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useProtocol();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Protocol found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Protocol Version</th>
                            <th>Admins</th>
                            <th>Token Admin Policy</th>
                            <th>Min ADA</th>
                            <th>Contracts</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.pdProtocolVersion}</td>
                                <td>{item.pdAdmins.join(', ')}</td>
                                <td>{item.pdTokenAdminPolicy_CS}</td>
                                <td>{item.pdMinADA.toString()}</td>
                                <td>{item.contracts.join(', ')}</td>
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

    const renderForm = (item: Partial<ProtocolEntity>, setItem: Dispatch<SetStateAction<Partial<ProtocolEntity>>> | Dispatch<SetStateAction<Partial<ProtocolEntity> | null>>) => (
        <form className={styles.form}>
            <div>
                <label>Protocol Version:</label>
                <input
                    type="number"
                    value={item.pdProtocolVersion || ''}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            pdProtocolVersion: Number(e.target.value),
                        })
                    }
                />
            </div>
            <div>
                <label>Admins:</label>
                <input
                    type="text"
                    value={item.pdAdmins?.join(', ') || ''}
                    placeholder="Comma-separated list of admin addresses"
                    onChange={(e) =>
                        setItem({
                            ...item,
                            pdAdmins: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
                        })
                    }
                />
            </div>
            <div>
                <label>Token Admin Policy:</label>
                <input
                    type="text"
                    value={item.pdTokenAdminPolicy_CS || ''}
                    onChange={(e) =>
                        setItem({
                            ...item,
                            pdTokenAdminPolicy_CS: e.target.value,
                        })
                    }
                />
            </div>
            <div>
                <label>Min ADA:</label>
                <input
                    type="text"
                    value={item.pdMinADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({
                                ...item,
                                pdMinADA: BigInt(e.target.value),
                            });
                        }
                    }}
                />
            </div>
            <div>
                <label>Contracts:</label>
                <input
                    type="text"
                    value={item.contracts?.join(', ') || ''}
                    placeholder="Comma-separated list of contract addresses"
                    onChange={(e) =>
                        setItem({
                            ...item,
                            contracts: e.target.value
                                .split(',')
                                .map((s) => s.trim())
                                .filter(Boolean),
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
