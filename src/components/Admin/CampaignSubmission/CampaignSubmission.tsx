import { useCampaignSubmission } from './useCampaignSubmission';
import styles from './CampaignSubmission.module.scss';
import { CampaignSubmissionEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';

export default function CampaignSubmission() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaignSubmission();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Campaign Submissions found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign ID</th>
                            <th>Submission Status ID</th>
                            <th>Submitted By Wallet ID</th>
                            <th>Revised By Wallet ID</th>
                            <th>Approved Justification</th>
                            <th>Rejected Justification</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.campaignId}</td>
                                <td>{item.submissionStatusId}</td>
                                <td>{item.submittedByWalletId}</td>
                                <td>{item.revisedByWalletId}</td>
                                <td>{item.approvedJustification}</td>
                                <td>{item.rejectedJustification}</td>
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
        item: Partial<CampaignSubmissionEntity>,
        setItem: Dispatch<SetStateAction<Partial<CampaignSubmissionEntity>>> | Dispatch<SetStateAction<Partial<CampaignSubmissionEntity> | null>>
    ) => (
        <form className={styles.form}>
            <div>
                <label>Campaign ID:</label>
                <input type="text" value={item.campaignId || ''} onChange={(e) => setItem({ ...item, campaignId: e.target.value })} />
            </div>
            <div>
                <label>Submission Status ID:</label>
                <input type="text" value={item.submissionStatusId || ''} onChange={(e) => setItem({ ...item, submissionStatusId: e.target.value })} />
            </div>
            <div>
                <label>Submitted By Wallet ID:</label>
                <input type="text" value={item.submittedByWalletId || ''} onChange={(e) => setItem({ ...item, submittedByWalletId: e.target.value })} />
            </div>
            <div>
                <label>Revised By Wallet ID:</label>
                <input type="text" value={item.revisedByWalletId || ''} onChange={(e) => setItem({ ...item, revisedByWalletId: e.target.value })} />
            </div>
            <div>
                <label>Approved Justification:</label>
                <input type="text" value={item.approvedJustification || ''} onChange={(e) => setItem({ ...item, approvedJustification: e.target.value })} />
            </div>
            <div>
                <label>Rejected Justification:</label>
                <input type="text" value={item.rejectedJustification || ''} onChange={(e) => setItem({ ...item, rejectedJustification: e.target.value })} />
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
