import { ProtocolEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styles from './Protocol.module.scss';
import { useProtocol } from './useProtocol';

export default function Protocol() {
    const { list, editItem, view, setEditItem, setView, handleDeployTx, handleUpdateTx, handleAddScriptTx, handleSyncTaks } = useProtocol();
    //--------------------------------------
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
    //--------------------------------------
    const renderList = () => (
        <div>
            {list.length === 0 ? (
                <p>No Protocol found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Protocol Version</th>
                            <th>Name</th>
                            <th>Admins</th>
                            <th>Token Admin Policy</th>
                            <th>Min ADA</th>
                            {/* <th>Contracts</th> */}
                            {/* <th>Created At</th>
                            <th>Updated At</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.fdpProtocolVersion}</td>
                                <td>{item.name}</td>
                                <td>{item.pdAdmins?.join(', ')}</td>
                                <td>{item.pdTokenAdminPolicy_CS}</td>
                                <td>{item.pdMinADA?.toString()}</td>
                                {/* <td>{item.contracts.join(', ')}</td> */}
                                {/* <td>{item.createdAt.toISOString()}</td>
                                <td>{item.updatedAt?.toISOString()}</td> */}
                                <td>
                                    {item._isDeployed === true ? (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setEditItem(item);
                                                    setView('update');
                                                }}
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditItem(item);
                                                    setView('addscripts');
                                                }}
                                            >
                                                Add Scripts
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEditItem(item);
                                                setView('deploy');
                                            }}
                                        >
                                            Deploy
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            handleSyncTaks(item);
                                        }}
                                    >
                                        Sync
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
    //--------------------------------------
    const renderDeployOrUpdate = () => {
        if (editItem === null) return null;

        console.log(editItem);

        return (
            <form className={styles.form}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={editItem!.name || ''}
                        onChange={(e) =>
                            setEditItem({
                                ...editItem!,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <label>Admins:</label>
                    <AdminsForm item={editItem!} setItem={(value) => setEditItem(typeof value === 'function' ? (prev: any) => value(prev) : value)} />
                </div>
                <div>
                    <label>Token Admin Policy:</label>
                    <input
                        type="text"
                        value={editItem?.pdTokenAdminPolicy_CS || ''}
                        onChange={(e) =>
                            setEditItem({
                                ...editItem!,
                                pdTokenAdminPolicy_CS: e.target.value,
                            })
                        }
                    />
                </div>
                {editItem?._isDeployed === true ? (
                    <button type="button" onClick={handleDeployTx}>
                        Deploy
                    </button>
                ) : (
                    <button type="button" onClick={handleUpdateTx}>
                        Update
                    </button>
                )}

                <button type="button" onClick={() => setView('list')}>
                    Cancel
                </button>
            </form>
        );
    };
    //--------------------------------------
    const renderAddScripts = () => (
        <form className={styles.form}>
            <button type="button" onClick={() => handleAddScriptTx(editItem! as ProtocolEntity)}>
                Add Scripts
            </button>

            <button type="button" onClick={() => setView('list')}>
                Cancel
            </button>
        </form>
    );
    //--------------------------------------
    return (
        <div className={styles.content}>
            {view === 'list' && renderList()}
            {view === 'deploy' && editItem !== null && renderDeployOrUpdate()}
            {view === 'update' && editItem !== null && renderDeployOrUpdate()}
            {view === 'addscripts' && editItem !== null && renderAddScripts()}
        </div>
    );
}
