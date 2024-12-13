import { useProtocolAdminWallet } from './useProtocolAdminWallet';
import styles from './ProtocolAdminWallet.module.scss';

export default function ProtocolAdminWallet() {
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
    } = useProtocolAdminWallet();
  const renderList = () => (
    <div>
      <div className={styles.listHeader}>
        <button onClick={() => setView('create')}>Create New Item</button>
      </div>
      {list.length === 0 ? (
        <p>No MilestoneSubmission found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Protocol ID</th>
              <th>Wallet ID</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item._DB_id}>
                <td>{item.protocolId}</td>
                <td>{item.walletId}</td>
                <td>{item.createdAt.toISOString()}</td>
                <td>{item.updatedAt ? item.updatedAt.toISOString() : 'N/A'}</td>
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
        <label>Protocol ID:</label>
        <input type="number" value={newItem.protocolId || ''} onChange={(e) => setNewItem({ ...newItem, protocolId: e.target.value })} />
      </div>
      <div>
        <label>Wallet ID:</label>
        <input type="number" value={newItem.walletId || ''} onChange={(e) => setNewItem({ ...newItem, walletId: e.target.value })} />
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
        <label>Protocol ID:</label>
        <input type="number" value={editItem?.protocolId || ''} onChange={(e) => setEditItem({ ...editItem, protocolId: e.target.value })} />
      </div>
      <div>
        <label>Wallet ID:</label>
        <input type="number" value={editItem?.walletId || ''} onChange={(e) => setEditItem({ ...editItem, walletId: e.target.value })} />
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
