import { useProtocol } from './useProtocol';
import styles from './Protocol.module.scss';

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
                <td>{item.pdMinADA}</td>
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

  const renderCreateForm = () => (
    <form className={styles.form}>
      <div>
        <label>Protocol Version:</label>
        <input type="text" value={newItem.pdProtocolVersion || ''} onChange={(e) => setNewItem({ ...newItem, pdProtocolVersion: e.target.value })} />
      </div>
      <div>
        <label>Admins:</label>
        <input
          type="text"
          value={newItem.pdAdmins?.join(', ') || '[]'}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              pdAdmins: e.target.value.split(',').map((admin) => admin.trim()),
            })
          }
        />
      </div>
      <div>
        <label>Token Admin Policy:</label>
        <input type="text" value={newItem.pdTokenAdminPolicy_CS || ''} onChange={(e) => setNewItem({ ...newItem, pdTokenAdminPolicy_CS: e.target.value })} />
      </div>
      <div>
        <label>Min ADA:</label>
        <input type="text" value={newItem.pdMinADA || ''} onChange={(e) => setNewItem({ ...newItem, pdMinADA: e.target.value })} />
      </div>
      <div>
        <label>Contracts:</label>
        <input
          type="text"
          value={newItem.contracts?.join(', ') || ''}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              contracts: e.target.value.split(',').map((contract) => contract.trim()),
            })
          }
        />
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
        <label>Protocol Version:</label>
        <input type="text" value={editItem?.pdProtocolVersion || ''} onChange={(e) => setEditItem({ ...editItem, pdProtocolVersion: e.target.value })} />
      </div>
      <div>
        <label>Admins:</label>
        <input
          type="text"
          value={editItem?.pdAdmins?.join(', ') || ''}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              pdAdmins: e.target.value.split(',').map((admin) => admin.trim()),
            })
          }
        />
      </div>
      <div>
        <label>Token Admin Policy:</label>
        <input type="text" value={editItem?.pdTokenAdminPolicy_CS || ''} onChange={(e) => setEditItem({ ...editItem, pdTokenAdminPolicy_CS: e.target.value })} />
      </div>
      <div>
        <label>Min ADA:</label>
        <input type="text" value={editItem?.pdMinADA || ''} onChange={(e) => setEditItem({ ...editItem, pdMinADA: e.target.value })} />
      </div>
      <div>
        <label>Contracts:</label>
        <input
          type="text"
          value={editItem?.contracts?.join(', ') || ''}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              contracts: e.target.value.split(',').map((contract) => contract.trim()),
            })
          }
        />
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
