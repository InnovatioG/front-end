import { useCampaign } from './useCampaign';
import styles from './Campaign.module.scss';
import { nextWednesday } from 'date-fns';

export default function Campaign() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaign();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Campaign found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Project ID</th>
                            <th>Campaign Category ID</th>
                            <th>Campaign Status ID</th>
                            <th>Creator Wallet ID</th>
                            <th>Campaign Version</th>
                            <th>Campaign Policy</th>
                            <th>Admins</th>
                            <th>Campaign Token</th>
                            <th>Funds</th>
                            <th>Status</th>
                            <th>Milestones</th>
                            <th>Funds Count</th>
                            <th>Funds Index</th>
                            <th>Minimum ADA</th>
                            <th>Description</th>
                            <th>Logo URL</th>
                            <th>Banner URL</th>
                            <th>Website</th>
                            <th>Instagram</th>
                            <th>Twitter</th>
                            <th>Discord</th>
                            <th>Facebook</th>
                            <th>Investors</th>
                            <th>Tokenomics Max Supply</th>
                            <th>Tokenomics Description</th>
                            <th>Featured</th>
                            <th>Archived</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((item) => (
                            <tr key={item._DB_id}>
                                <td>{item.projectId}</td>
                                <td>{item.campaingCategoryId}</td>
                                <td>{item.campaignStatusId}</td>
                                <td>{item.creatorWalletId}</td>
                                <td>{item.cdCampaignVersion}</td>
                                <td>{item.cdCampaignPolicy_CS}</td>
                                <td>{item.cdAdmins.join(', ')}</td>
                                <td>{item.cdCampaignToken_CS}</td>
                                <td>{item.cdFundedADA}</td>
                                <td>{item.cdStatus}</td>
                                <td>{item.cdMilestones}</td>
                                <td>{item.cdFundsCount}</td>
                                <td>{item.cdFundsIndex}</td>
                                <td>{item.cdMinADA}</td>
                                <td>{item.description}</td>
                                <td>{item.logoUrl}</td>
                                <td>{item.bannerUrl}</td>
                                <td>{item.website}</td>
                                <td>{item.instagram}</td>
                                <td>{item.twitter}</td>
                                <td>{item.discord}</td>
                                <td>{item.facebook}</td>
                                <td>{item.investors}</td>
                                <td>{item.tokenomicsMaxSupply}</td>
                                <td>{item.tokenomicsDescription}</td>
                                <td>{(item.featured == "true")? 'Yes' : 'No'}</td>
                                <td>{(item.archived == "true") ? 'Yes' : 'No'}</td>
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
                // <table>
                //   <thead>
                //     <tr>
                //       {Object.keys(list[0] || {}).map((field) => (
                //         <th key={field}>{field}</th>
                //       ))}
                //       <th>Actions</th>
                //     </tr>
                //   </thead>
                //   <tbody>
                //     {list.map((item) => (
                //       <tr key={item._DB_id}>
                //         {Object.entries(item).map(([field, value]) => (
                //           <td key={field}>{value?.toString() || ''}</td>
                //         ))}
                //         <td>
                //           <button
                //             onClick={() => {
                //               setEditItem(item);
                //               setView('edit');
                //             }}
                //           >
                //             Edit
                //           </button>
                //           <button
                //             onClick={() => {
                //               setDeleteItem(item);
                //               setView('confirmDelete');
                //             }}
                //           >
                //             Delete
                //           </button>
                //         </td>
                //       </tr>
                //     ))}
                //   </tbody>
                // </table>
            )}
        </div>
    );

    const renderCreateForm = () => (
        <form className={styles.form}>
            <div>
                <label>Project ID:</label>
                <input type="number" value={newItem.projectId || ''} onChange={(e) => setNewItem({ ...newItem, projectId: e.target.value })} />
            </div>
            <div>
                <label>Campaign Category ID:</label>
                <input type="number" value={newItem.campaingCategoryId || ''} onChange={(e) => setNewItem({ ...newItem, campaingCategoryId: e.target.value })} />
            </div>
            <div>
                <label>Campaign Status ID:</label>
                <input type="number" value={newItem.campaignStatusId || ''} onChange={(e) => setNewItem({ ...newItem, campaignStatusId: e.target.value })} />
            </div>
            <div>
                <label>Creator Wallet ID:</label>
                <input type="number" value={newItem.creatorWalletId || ''} onChange={(e) => setNewItem({ ...newItem, creatorWalletId: e.target.value })} />
            </div>
            <div>
                <label>Campaign Version:</label>
                <input type="text" value={newItem.cdCampaignVersion || ''} onChange={(e) => setNewItem({ ...newItem, cdCampaignVersion: e.target.value })} />
            </div>
            <div>
                <label>Campaign Policy:</label>
                <input type="text" value={newItem.cdCampaignPolicy_CS || ''} onChange={(e) => setNewItem({ ...newItem, cdCampaignPolicy_CS: e.target.value })} />
            </div>
            <div>
                <label>Admins:</label>
                <input type="text" value={newItem.cdAdmins?.join(', ') || ''} onChange={(e) => setNewItem({ ...newItem, cdAdmins: e.target.value.split(', ') })} />
            </div>
            <div>
                <label>Campaign Token:</label>
                <input type="text" value={newItem.cdCampaignToken_CS || ''} onChange={(e) => setNewItem({ ...newItem, cdCampaignToken_CS: e.target.value })} />
            </div>
            <div>
                <label>Funded ADA:</label>
                <input type="text" value={newItem.cdFundedADA || ''} onChange={(e) => setNewItem({ ...newItem, cdFundedADA: e.target.value })} />
            </div>
            <div>
                <label>Status:</label>
                <input type="number" value={newItem.cdStatus || ''} onChange={(e) => setNewItem({ ...newItem, cdStatus: e.target.value })} />
            </div>
            <div>
                <label>Milestones:</label>
                <input type="text" value={newItem.cdMilestones || ''} onChange={(e) => setNewItem({ ...newItem, cdMilestones: e.target.value })} />
            </div>
            <div>
                <label>Funds Count:</label>
                <input type="number" value={newItem.cdFundsCount || ''} onChange={(e) => setNewItem({ ...newItem, cdFundsCount: e.target.value })} />
            </div>
            <div>
                <label>Funds Index:</label>
                <input type="number" value={newItem.cdFundsIndex || ''} onChange={(e) => setNewItem({ ...newItem, cdFundsIndex: e.target.value })} />
            </div>
            <div>
                <label>Minimum ADA:</label>
                <input type="text" value={newItem.cdMinADA || ''} onChange={(e) => setNewItem({ ...newItem, cdMinADA: e.target.value })} />
            </div>
            <div>
                <label>Description:</label>
                <input type="text" value={newItem.description || ''} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
            </div>
            <div>
                <label>Logo URL:</label>
                <input type="text" value={newItem.logoUrl || ''} onChange={(e) => setNewItem({ ...newItem, logoUrl: e.target.value })} />
            </div>
            <div>
                <label>Banner URL:</label>
                <input type="text" value={newItem.bannerUrl || ''} onChange={(e) => setNewItem({ ...newItem, bannerUrl: e.target.value })} />
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
                <label>Investors:</label>
                <input type="number" value={newItem.investors || ''} onChange={(e) => setNewItem({ ...newItem, investors: e.target.value })} />
            </div>
            <div>
                <label>Tokenomics Max Supply:</label>
                <input type="text" value={newItem.tokenomicsMaxSupply || ''} onChange={(e) => setNewItem({ ...newItem, tokenomicsMaxSupply: e.target.value })} />
            </div>
            <div>
                <label>Tokenomics Description:</label>
                <input type="text" value={newItem.tokenomicsDescription || ''} onChange={(e) => setNewItem({ ...newItem, tokenomicsDescription: e.target.value })} />
            </div>
            <div>
                <label>Featured:</label>
                <input type="checkbox" checked={newItem.featured || false} onChange={(e) => setNewItem({ ...newItem, featured: e.target.checked })} />
            </div>
            <div>
                <label>Archived:</label>
                <input type="checkbox" checked={newItem.archived || false} onChange={(e) => setNewItem({ ...newItem, archived: e.target.checked })} />
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
            <button type="button" onClick={update}>
                Update
            </button>
            <button type="button" onClick={() => setView('list')}>
                Cancel
            </button>
        </form>
    );
    // const renderCreateForm = () => (
    //     <form className={styles.form}>
    //         {Object.entries(newItem).map(([field, value]) => {
    //             const isNumber = typeof value === 'number';
    //             const isBoolean = typeof value === 'boolean';
    //             const isArray = Array.isArray(value);
    //             const isDate = value instanceof Date;
    //             const isObject = typeof value === 'object' && value !== null && !isArray && !isDate;
    //
    //             // Normalizar el valor para mostrar en el input
    //             let displayedValue: string = '';
    //             if (isNumber) {
    //                 displayedValue = value.toString();
    //             } else if (isBoolean) {
    //                 displayedValue = value ? 'true' : 'false';
    //             } else if (isArray) {
    //                 displayedValue = value.join(', ');
    //             } else if (isDate) {
    //                 displayedValue = (value as Date).toISOString().split('T')[0]; // Convertir Date a formato YYYY-MM-DD
    //             } else if (isObject) {
    //                 displayedValue = JSON.stringify(value); // Serializar objetos
    //             } else {
    //                 displayedValue = value as string;
    //             }
    //
    //             return (
    //                 <div key={field}>
    //                     <label>{field}:</label>
    //                     <input
    //                         type={isNumber ? 'number' : isDate ? 'date' : 'text'}
    //                         value={displayedValue}
    //                         onChange={(e) => {
    //                             let newValue: any = e.target.value;
    //                             if (isNumber) {
    //                                 newValue = parseFloat(e.target.value) || 0;
    //                             } else if (isBoolean) {
    //                                 newValue = e.target.value === 'true';
    //                             } else if (isArray) {
    //                                 newValue = e.target.value.split(',').map((item) => item.trim());
    //                             } else if (isDate) {
    //                                 newValue = new Date(e.target.value);
    //                             } else if (isObject) {
    //                                 try {
    //                                     newValue = JSON.parse(e.target.value);
    //                                 } catch (error) {
    //                                     newValue = e.target.value; // Si no es JSON válido, mantener el texto
    //                                 }
    //                             }
    //                             setNewItem({
    //                                 ...newItem,
    //                                 [field]: newValue,
    //                             });
    //                         }}
    //                     />
    //                 </div>
    //             );
    //         })}
    //         <button type="button" onClick={create}>
    //             Create
    //         </button>
    //         <button type="button" onClick={() => setView('list')}>
    //             Cancel
    //         </button>
    //     </form>
    // );
    //
    // const renderEditForm = () => (
    //     <form className={styles.form}>
    //         {Object.entries(editItem!).map(([field, value]) => {
    //             const isNumber = typeof value === 'number';
    //             const isBoolean = typeof value === 'boolean';
    //             const isArray = Array.isArray(value);
    //             const isDate = value instanceof Date;
    //             const isObject = typeof value === 'object' && value !== null && !isArray && !isDate;
    //
    //             // Normalizar el valor para mostrar en el input
    //             let displayedValue: string = '';
    //             if (isNumber) {
    //                 displayedValue = value.toString();
    //             } else if (isBoolean) {
    //                 displayedValue = value ? 'true' : 'false';
    //             } else if (isArray) {
    //                 displayedValue = value.join(', ');
    //             } else if (isDate) {
    //                 displayedValue = (value as Date).toISOString().split('T')[0]; // Convertir Date a formato YYYY-MM-DD
    //             } else if (isObject) {
    //                 displayedValue = JSON.stringify(value); // Serializar objetos
    //             } else {
    //                 displayedValue = value as string;
    //             }
    //
    //             return (
    //                 <div key={field}>
    //                     <label>{field}:</label>
    //                     <input
    //                         type={isNumber ? 'number' : isDate ? 'date' : 'text'}
    //                         value={displayedValue}
    //                         onChange={(e) => {
    //                             let editItem: any = e.target.value;
    //                             if (isNumber) {
    //                                 editItem = parseFloat(e.target.value) || 0;
    //                             } else if (isBoolean) {
    //                                 editItem = e.target.value === 'true';
    //                             } else if (isArray) {
    //                                 editItem = e.target.value.split(',').map((item) => item.trim());
    //                             } else if (isDate) {
    //                                 editItem = new Date(e.target.value);
    //                             } else if (isObject) {
    //                                 try {
    //                                     editItem = JSON.parse(e.target.value);
    //                                 } catch (error) {
    //                                     editItem = e.target.value; // Si no es JSON válido, mantener el texto
    //                                 }
    //                             }
    //                             setEditItem({
    //                                 ...editItem,
    //                                 [field]: editItem,
    //                             });
    //                         }}
    //                     />
    //                 </div>
    //             );
    //         })}
    //         <button type="button" onClick={update}>
    //             Update
    //         </button>
    //         <button type="button" onClick={() => setView('list')}>
    //             Cancel
    //         </button>
    //     </form>
    // );
    //
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
