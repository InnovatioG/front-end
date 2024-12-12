import { useCampaignSubmission } from './useCampaignSubmission';
import styles from './CampaignSubmission.module.scss';

export default function CampaignSubmission() {
  const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaignSubmission();

  const renderList = () => (
    <div>
      <div className={styles.listHeader}>
        <button onClick={() => setView('create')}>Create New Item</button>
      </div>
      {list.length === 0 ? (
        <p>No CampaignSubmission found.</p>
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
                <td>{item.createdAt ? new Date(item.createdAt).toISOString() : ''}</td>
                <td>{item.updatedAt ? new Date(item.updatedAt).toISOString() : ''}</td>
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
        <label>Campaign ID:</label>
        <input type="number" value={newItem.campaignId || ''} onChange={(e) => setNewItem({ ...newItem, campaignId: e.target.value })} />
      </div>
      <div>
        <label>Submission Status ID:</label>
        <input type="number" value={newItem.submissionStatusId || ''} onChange={(e) => setNewItem({ ...newItem, submissionStatusId: e.target.value })} />
      </div>
      <div>
        <label>Submitted By Wallet ID:</label>
        <input type="number" value={newItem.submittedByWalletId || ''} onChange={(e) => setNewItem({ ...newItem, submittedByWalletId: e.target.value })} />
      </div>
      <div>
        <label>Revised By Wallet ID:</label>
        <input type="number" value={newItem.revisedByWalletId || ''} onChange={(e) => setNewItem({ ...newItem, revisedByWalletId: e.target.value })} />
      </div>
      <div>
        <label>Approved Justification:</label>
        <input type="text" value={newItem.approvedJustification || ''} onChange={(e) => setNewItem({ ...newItem, approvedJustification: e.target.value })} />
      </div>
      <div>
        <label>Rejected Justification:</label>
        <input type="text" value={newItem.rejectedJustification || ''} onChange={(e) => setNewItem({ ...newItem, rejectedJustification: e.target.value })} />
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
        <label>Campaign ID:</label>
        <input type="number" value={editItem?.campaignId || ''} onChange={(e) => setEditItem({ ...editItem, campaignId: e.target.value })} />
      </div>
      <div>
        <label>Submission Status ID:</label>
        <input type="number" value={editItem?.submissionStatusId || ''} onChange={(e) => setEditItem({ ...editItem, submissionStatusId: e.target.value })} />
      </div>
      <div>
        <label>Submitted By Wallet ID:</label>
        <input type="number" value={editItem?.submittedByWalletId || ''} onChange={(e) => setEditItem({ ...editItem, submittedByWalletId: e.target.value })} />
      </div>
      <div>
        <label>Revised By Wallet ID:</label>
        <input type="number" value={editItem?.revisedByWalletId || ''} onChange={(e) => setEditItem({ ...editItem, revisedByWalletId: e.target.value })} />
      </div>
      <div>
        <label>Approved Justification:</label>
        <input type="text" value={editItem?.approvedJustification || ''} onChange={(e) => setEditItem({ ...editItem, approvedJustification: e.target.value })} />
      </div>
      <div>
        <label>Rejected Justification:</label>
        <input type="text" value={editItem?.rejectedJustification || ''} onChange={(e) => setEditItem({ ...editItem, rejectedJustification: e.target.value })} />
      </div>{' '}
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
