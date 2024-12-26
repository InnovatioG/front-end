import { useCampaignMember } from './useCampaignMember';
import styles from './CampaignMember.module.scss';

export default function CampaignMember() {
  const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaignMember();

  const renderList = () => (
    <div>
      <div className={styles.listHeader}>
        <button onClick={() => setView('create')}>Create New Item</button>
      </div>
      {list.length === 0 ? (
        <p>No CampaignMember found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Wallet ID</th>
              <th>Role</th>
              <th>Description</th>
              <th>Website</th>
              <th>Instagram</th>
              <th>Twitter</th>
              <th>Discord</th>
              <th>Facebook</th>
              <th>Editor</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item._DB_id}>
                <td>{item.campaignId}</td>
                <td>{item.walletId}</td>
                <td>{item.rol}</td>
                <td>{item.description}</td>
                <td>{item.website}</td>
                <td>{item.instagram}</td>
                <td>{item.twitter}</td>
                <td>{item.discord}</td>
                <td>{item.facebook}</td>
                <td>{(item.editor == true) ? 'Yes' : 'No'}</td>
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
        <label>Wallet ID:</label>
        <input type="number" value={newItem.walletId || ''} onChange={(e) => setNewItem({ ...newItem, walletId: e.target.value })} />
      </div>
      <div>
        <label>Role:</label>
        <input type="text" value={newItem.rol || ''} onChange={(e) => setNewItem({ ...newItem, rol: e.target.value })} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={newItem.description || ''} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
      </div>
      <div>
        <label>Website:</label>
        <input type="text" value={newItem.website || ''} onChange={(e) => setNewItem({ ...newItem, website: e.target.value })} />
      </div>
      <div>
        <label>Instagram:</label>
        <input type="text" value={newItem.instagram || ''} onChange={(e) => setNewItem({ ...newItem, instagram: e.target.value })} />
      </div>
      <div>
        <label>Twitter:</label>
        <input type="text" value={newItem.twitter || ''} onChange={(e) => setNewItem({ ...newItem, twitter: e.target.value })} />
      </div>
      <div>
        <label>Discord:</label>
        <input type="text" value={newItem.discord || ''} onChange={(e) => setNewItem({ ...newItem, discord: e.target.value })} />
      </div>
      <div>
        <label>Facebook:</label>
        <input type="text" value={newItem.facebook || ''} onChange={(e) => setNewItem({ ...newItem, facebook: e.target.value })} />
      </div>
      <div>
        <label>Editor:</label>
        <input type="checkbox" checked={newItem.editor || false} onChange={(e) => setNewItem({ ...newItem, editor: e.target.checked })} />
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
        <label>Wallet ID:</label>
        <input type="number" value={editItem?.walletId || ''} onChange={(e) => setEditItem({ ...editItem, walletId: e.target.value })} />
      </div>
      <div>
        <label>Role:</label>
        <input type="text" value={editItem?.rol || ''} onChange={(e) => setEditItem({ ...editItem, rol: e.target.value })} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={editItem?.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
      </div>
      <div>
        <label>Website:</label>
        <input type="text" value={editItem?.website || ''} onChange={(e) => setEditItem({ ...editItem, website: e.target.value })} />
      </div>
      <div>
        <label>Instagram:</label>
        <input type="text" value={editItem?.instagram || ''} onChange={(e) => setEditItem({ ...editItem, instagram: e.target.value })} />
      </div>
      <div>
        <label>Twitter:</label>
        <input type="text" value={editItem?.twitter || ''} onChange={(e) => setEditItem({ ...editItem, twitter: e.target.value })} />
      </div>
      <div>
        <label>Discord:</label>
        <input type="text" value={editItem?.discord || ''} onChange={(e) => setEditItem({ ...editItem, discord: e.target.value })} />
      </div>
      <div>
        <label>Facebook:</label>
        <input type="text" value={editItem?.facebook || ''} onChange={(e) => setEditItem({ ...editItem, facebook: e.target.value })} />
      </div>
      <div>
        <label>Editor:</label>
        <input type="checkbox" checked={editItem?.editor || false} onChange={(e) => setEditItem({ ...editItem, editor: e.target.checked })} />
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
