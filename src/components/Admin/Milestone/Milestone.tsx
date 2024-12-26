import { useMilestone } from './useMilestone';
import styles from './Milestone.module.scss';

export default function Milestone() {
  const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useMilestone();

  const renderList = () => (
    <div>
      <div className={styles.listHeader}>
        <button onClick={() => setView('create')}>Create New Item</button>
      </div>
      {list.length === 0 ? (
        <p>No Milestone found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Campaign Status ID</th>
              <th>Estimate Delivery Date</th>
              <th>Percentage</th>
              <th>Status</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item._DB_id}>
                <td>{item.campaignId}</td>
                <td>{item.campaignStatusId}</td>
                <td>{item.cmEstimateDeliveryDate.toISOString()}</td>
                <td>{item.cmPercentage}</td>
                <td>{item.cmStatus}</td>
                <td>{item.description}</td>
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
        <label>Campaign Status ID:</label>
        <input type="number" value={newItem.campaignStatusId || ''} onChange={(e) => setNewItem({ ...newItem, campaignStatusId: e.target.value })} />
      </div>
      <div>
        <label>Estimate Delivery Date:</label>
        <input
          type="date"
          value={newItem?.cmEstimateDeliveryDate? newItem.cmEstimateDeliveryDate.toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setNewItem({
              ...newItem,
              cmEstimateDeliveryDate: new Date(e.target.value),
            })
          }
        />
      </div>
      <div>
        <label>Percentage:</label>
        <input type="number" value={newItem.cmPercentage || ''} onChange={(e) => setNewItem({ ...newItem, cmPercentage: parseInt(e.target.value) })} />
      </div>
      <div>
        <label>Status:</label>
        <input type="number" value={newItem.cmStatus || ''} onChange={(e) => setNewItem({ ...newItem, cmStatus: parseInt(e.target.value) })} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={newItem.description || ''} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
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
        <label>Campaign Status ID:</label>
        <input type="number" value={editItem?.campaignStatusId || ''} onChange={(e) => setEditItem({ ...editItem, campaignStatusId: e.target.value })} />
      </div>
      <div>
        <label>Estimate Delivery Date:</label>
        <input
          type="date"
          value={editItem?.cmEstimateDeliveryDate? editItem.cmEstimateDeliveryDate.toISOString().split('T')[0] : ''}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              cmEstimateDeliveryDate: new Date(e.target.value),
            })
          }
        />
      </div>
      <div>
        <label>Percentage:</label>
        <input
          type="number"
          value={editItem?.cmPercentage || ''}
          onChange={(e) =>
            setEditItem({
              ...editItem,
              cmPercentage: parseInt(e.target.value),
            })
          }
        />
      </div>
      <div>
        <label>Status:</label>
        <input type="number" value={editItem?.cmStatus || ''} onChange={(e) => setEditItem({ ...editItem, cmStatus: parseInt(e.target.value) })} />
      </div>
      <div>
        <label>Description:</label>
        <input type="text" value={editItem?.description || ''} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} />
      </div>
      <button type="button" onClick={create}>
        Create
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
