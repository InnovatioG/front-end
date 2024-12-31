import { useProtocol } from './useProtocol';
import styles from './Protocol.module.scss';
import { ProtocolEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export default function Protocol() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useProtocol();

    const AdminsForm: React.FC<{
        item: Partial<ProtocolEntity>;
        setItem: Dispatch<SetStateAction<Partial<ProtocolEntity>>>;
    }> = ({ item, setItem }) => {
        const [localAdmins, setLocalAdmins] = useState<string[]>(item.pdAdmins || []);
        const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track the currently edited row

        useEffect(() => {
            setLocalAdmins(item.pdAdmins || []); // Sync local state when the parent changes
        }, [item.pdAdmins]);

        const addAdmin = () => {
            const newAdminIndex = localAdmins.length; // Index of the new admin
            setLocalAdmins((prev) => [...prev, '']); // Add an empty admin row
            setEditingIndex(newAdminIndex); // Enter edit mode for the new row
        };

        const removeAdmin = (index: number) => {
            const updatedAdmins = localAdmins.filter((_, i) => i !== index);
            setLocalAdmins(updatedAdmins);
            setItem((prev) => ({ ...prev, pdAdmins: updatedAdmins })); // Save to parent
            if (editingIndex === index) setEditingIndex(null); // Exit edit mode if the current row is removed
        };

        const saveAdmin = (index: number, value: string) => {
            const updatedAdmins = localAdmins.map((admin, i) => (i === index ? value : admin));
            setLocalAdmins(updatedAdmins);
            setItem((prev) => ({ ...prev, pdAdmins: updatedAdmins })); // Save to parent
            setEditingIndex(null); // Exit edit mode
        };

        return (
            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Admin Address</th>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {localAdmins.map((admin, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={admin}
                                        onChange={(e) => {
                                            const updatedAdmins = localAdmins.map((a, i) => (i === index ? e.target.value : a));
                                            setLocalAdmins(updatedAdmins); // Update local state
                                        }}
                                        placeholder="Enter admin address"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    admin
                                )}
                            </td>
                            <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                                {editingIndex === index ? (
                                    <button
                                        type="button"
                                        onClick={() => saveAdmin(index, localAdmins[index])}
                                        style={{
                                            backgroundColor: 'green',
                                            color: 'white',
                                            padding: '4px 8px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setEditingIndex(index)}
                                        style={{
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            padding: '4px 8px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '8px',
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeAdmin(index)}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '4px 8px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginLeft: '8px',
                                    }}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} style={{ textAlign: 'center', padding: '12px 0' }}>
                            <button
                                type="button"
                                onClick={addAdmin}
                                style={{
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Add Admin
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    };

    const ContractsForm: React.FC<{
        item: Partial<ProtocolEntity>;
        setItem: Dispatch<SetStateAction<Partial<ProtocolEntity>>>;
    }> = ({ item, setItem }) => {
        const [localContracts, setLocalContracts] = useState<string[]>(item.contracts || []);
        const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track the currently edited row

        useEffect(() => {
            setLocalContracts(item.contracts || []); // Sync local state when the parent changes
        }, [item.contracts]);

        const addContract = () => {
            const newContractIndex = localContracts.length; // Index of the new contract
            setLocalContracts((prev) => [...prev, '']); // Add an empty contract row
            setEditingIndex(newContractIndex); // Enter edit mode for the new row
        };

        const removeContract = (index: number) => {
            const updatedContracts = localContracts.filter((_, i) => i !== index);
            setLocalContracts(updatedContracts);
            setItem((prev) => ({ ...prev, contracts: updatedContracts })); // Save to parent
            if (editingIndex === index) setEditingIndex(null); // Exit edit mode if the current row is removed
        };

        const saveContract = (index: number, value: string) => {
            const updatedContracts = localContracts.map((contract, i) => (i === index ? value : contract));
            setLocalContracts(updatedContracts);
            setItem((prev) => ({ ...prev, contracts: updatedContracts })); // Save to parent
            setEditingIndex(null); // Exit edit mode
        };

        return (
            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Contracts Code</th>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {localContracts.map((contract, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        value={contract}
                                        onChange={(e) => {
                                            const updatedContracts = localContracts.map((c, i) => (i === index ? e.target.value : c));
                                            setLocalContracts(updatedContracts); // Update local state
                                        }}
                                        placeholder="Enter contract address"
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    contract
                                )}
                            </td>
                            <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                                {editingIndex === index ? (
                                    <button
                                        type="button"
                                        onClick={() => saveContract(index, localContracts[index])}
                                        style={{
                                            backgroundColor: 'green',
                                            color: 'white',
                                            padding: '4px 8px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setEditingIndex(index)}
                                        style={{
                                            backgroundColor: 'blue',
                                            color: 'white',
                                            padding: '4px 8px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginRight: '8px',
                                        }}
                                    >
                                        Edit
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => removeContract(index)}
                                    style={{
                                        backgroundColor: 'red',
                                        color: 'white',
                                        padding: '4px 8px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        marginLeft: '8px',
                                    }}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2} style={{ textAlign: 'center', padding: '12px 0' }}>
                            <button
                                type="button"
                                onClick={addContract}
                                style={{
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Add Contract
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    };

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
                <AdminsForm item={item} setItem={(value) => setItem(typeof value === 'function' ? (prev: any) => value(prev) : value)} />
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
                <ContractsForm item={item} setItem={(value) => setItem(typeof value === 'function' ? (prev: any) => value(prev) : value)} />
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
