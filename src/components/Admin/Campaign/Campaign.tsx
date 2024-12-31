import { useCampaign } from './useCampaign';
import styles from './Campaign.module.scss';
import { CampaignEntity } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction } from 'react';

export default function Campaign() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove } = useCampaign();

    const renderList = () => (
        <div>
            <div className={styles.listHeader}>
                <button onClick={() => setView('create')}>Create New Item</button>
            </div>
            {list.length === 0 ? (
                <p>No Campaigns found.</p>
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
                            <th>Campaign Funds Policy ID</th>
                            <th>Admins</th>
                            <th>Token Admin Policy</th>
                            <th>Mint Campaign Token</th>
                            <th>Campaign Token CS</th>
                            <th>Campaign Token TN</th>
                            <th>Campaign Token Price (ADA)</th>
                            <th>Requested Max ADA</th>
                            <th>Requested Min ADA</th>
                            <th>Funded ADA</th>
                            <th>Collected ADA</th>
                            <th>Begin At</th>
                            <th>Deadline</th>
                            <th>Status</th>
                            <th>Milestones</th>
                            <th>Funds Count</th>
                            <th>Funds Index</th>
                            <th>Minimum ADA</th>
                            <th>Description</th>
                            <th>Begin At (Human-Readable)</th>
                            <th>Deadline (Human-Readable)</th>
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
                                <td>{item.cdCampaignFundsPolicyID_CS}</td>
                                <td>{item.cdAdmins.join(', ')}</td>
                                <td>{item.cdTokenAdminPolicy_CS}</td>
                                <td>{item.cdMint_CampaignToken ? 'Yes' : 'No'}</td>
                                <td>{item.cdCampaignToken_CS}</td>
                                <td>{item.cdCampaignToken_TN}</td>
                                <td>{item.cdCampaignToken_PriceADA.toString()}</td>
                                <td>{item.cdRequestedMaxADA.toString()}</td>
                                <td>{item.cdRequestedMinADA.toString()}</td>
                                <td>{item.cdFundedADA.toString()}</td>
                                <td>{item.cdCollectedADA.toString()}</td>
                                <td>{new Date(item.cdBeginAt?.toString()).toISOString()}</td>
                                <td>{new Date(item.cdDeadline?.toString()).toISOString()}</td>
                                <td>{item.cdStatus}</td>
                                <td>{item.cdMilestones}</td>
                                <td>{item.cdFundsCount}</td>
                                <td>{item.cdFundsIndex}</td>
                                <td>{item.cdMinADA.toString()}</td>
                                <td>{item.description}</td>
                                <td>{item.beginAt?.toISOString()}</td>
                                <td>{item.deadline?.toISOString()}</td>
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
                                <td>{item.featured ? 'Yes' : 'No'}</td>
                                <td>{item.archived ? 'Yes' : 'No'}</td>
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

    const renderForm = (item: Partial<CampaignEntity>, setItem: Dispatch<SetStateAction<Partial<CampaignEntity>>> | Dispatch<SetStateAction<Partial<CampaignEntity> | null>>) => (
        <form className={styles.form}>
            {/* General Fields */}
            <div>
                <label>Project ID:</label>
                <input type="text" value={item.projectId || ''} onChange={(e) => setItem({ ...item, projectId: e.target.value })} />
            </div>
            <div>
                <label>Campaign Category ID:</label>
                <input type="text" value={item.campaingCategoryId || ''} onChange={(e) => setItem({ ...item, campaingCategoryId: e.target.value })} />
            </div>
            <div>
                <label>Campaign Status ID:</label>
                <input type="text" value={item.campaignStatusId || ''} onChange={(e) => setItem({ ...item, campaignStatusId: e.target.value })} />
            </div>
            <div>
                <label>Creator Wallet ID:</label>
                <input type="text" value={item.creatorWalletId || ''} onChange={(e) => setItem({ ...item, creatorWalletId: e.target.value })} />
            </div>

            {/* Datum Fields */}
            <div>
                <label>Campaign Version:</label>
                <input type="number" value={item.cdCampaignVersion || ''} onChange={(e) => setItem({ ...item, cdCampaignVersion: Number(e.target.value) })} />
            </div>
            <div>
                <label>Campaign Policy:</label>
                <input type="text" value={item.cdCampaignPolicy_CS || ''} onChange={(e) => setItem({ ...item, cdCampaignPolicy_CS: e.target.value })} />
            </div>
            <div>
                <label>Campaign Funds Policy ID:</label>
                <input type="text" value={item.cdCampaignFundsPolicyID_CS || ''} onChange={(e) => setItem({ ...item, cdCampaignFundsPolicyID_CS: e.target.value })} />
            </div>
            <div>
                <label>Admins (comma-separated):</label>
                <input type="text" value={item.cdAdmins?.join(', ') || ''} onChange={(e) => setItem({ ...item, cdAdmins: e.target.value.split(',').map((v) => v.trim()) })} />
            </div>
            <div>
                <label>Token Admin Policy:</label>
                <input type="text" value={item.cdTokenAdminPolicy_CS || ''} onChange={(e) => setItem({ ...item, cdTokenAdminPolicy_CS: e.target.value })} />
            </div>
            <div>
                <label>Mint Campaign Token:</label>
                <input type="checkbox" checked={item.cdMint_CampaignToken || false} onChange={(e) => setItem({ ...item, cdMint_CampaignToken: e.target.checked })} />
            </div>
            <div>
                <label>Campaign Token CS:</label>
                <input type="text" value={item.cdCampaignToken_CS || ''} onChange={(e) => setItem({ ...item, cdCampaignToken_CS: e.target.value })} />
            </div>
            <div>
                <label>Campaign Token TN:</label>
                <input type="text" value={item.cdCampaignToken_TN || ''} onChange={(e) => setItem({ ...item, cdCampaignToken_TN: e.target.value })} />
            </div>
            <div>
                <label>Campaign Token Price (ADA):</label>
                <input
                    type="text"
                    value={item.cdCampaignToken_PriceADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdCampaignToken_PriceADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Requested Max ADA:</label>
                <input
                    type="text"
                    value={item.cdRequestedMaxADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdRequestedMaxADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Requested Min ADA:</label>
                <input
                    type="text"
                    value={item.cdRequestedMinADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdRequestedMinADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Funded ADA:</label>
                <input
                    type="text"
                    value={item.cdFundedADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdFundedADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Collected ADA:</label>
                <input
                    type="text"
                    value={item.cdCollectedADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdCollectedADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Begin At (POSIXTime):</label>
                <input
                    type="text"
                    value={item.cdBeginAt?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdBeginAt: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Deadline (POSIXTime):</label>
                <input
                    type="text"
                    value={item.cdDeadline?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdDeadline: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Status:</label>
                <input type="number" value={item.cdStatus || ''} onChange={(e) => setItem({ ...item, cdStatus: Number(e.target.value) })} />
            </div>
            <div>
                <label>Milestones:</label>
                <input type="text" value={item.cdMilestones || ''} onChange={(e) => setItem({ ...item, cdMilestones: e.target.value })} />
            </div>
            <div>
                <label>Funds Count:</label>
                <input type="number" value={item.cdFundsCount || ''} onChange={(e) => setItem({ ...item, cdFundsCount: Number(e.target.value) })} />
            </div>
            <div>
                <label>Funds Index:</label>
                <input type="number" value={item.cdFundsIndex || ''} onChange={(e) => setItem({ ...item, cdFundsIndex: Number(e.target.value) })} />
            </div>
            <div>
                <label>Minimum ADA:</label>
                <input
                    type="text"
                    value={item.cdMinADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdMinADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>

            {/* Additional Campaign Details */}
            <div>
                <label>Description:</label>
                <textarea value={item.description || ''} onChange={(e) => setItem({ ...item, description: e.target.value })} />
            </div>
            <div>
                <label>Begin At (Human-Readable):</label>
                <input
                    type="datetime-local"
                    value={item.beginAt ? new Date(item.beginAt).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setItem({ ...item, beginAt: selectedDate });
                    }}
                />
            </div>
            <div>
                <label>Deadline (Human-Readable):</label>
                <input
                    type="datetime-local"
                    value={item.deadline ? new Date(item.deadline).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setItem({ ...item, deadline: selectedDate });
                    }}
                />
            </div>

            <div>
                <label>Logo URL:</label>
                <input type="text" value={item.logoUrl || ''} onChange={(e) => setItem({ ...item, logoUrl: e.target.value })} />
            </div>
            <div>
                <label>Banner URL:</label>
                <input type="text" value={item.bannerUrl || ''} onChange={(e) => setItem({ ...item, bannerUrl: e.target.value })} />
            </div>
            <div>
                <label>Website:</label>
                <input type="text" value={item.website || ''} onChange={(e) => setItem({ ...item, website: e.target.value })} />
            </div>
            <div>
                <label>Instagram:</label>
                <input type="text" value={item.instagram || ''} onChange={(e) => setItem({ ...item, instagram: e.target.value })} />
            </div>
            <div>
                <label>Twitter:</label>
                <input type="text" value={item.twitter || ''} onChange={(e) => setItem({ ...item, twitter: e.target.value })} />
            </div>
            <div>
                <label>Discord:</label>
                <input type="text" value={item.discord || ''} onChange={(e) => setItem({ ...item, discord: e.target.value })} />
            </div>
            <div>
                <label>Facebook:</label>
                <input type="text" value={item.facebook || ''} onChange={(e) => setItem({ ...item, facebook: e.target.value })} />
            </div>
            <div>
                <label>Investors:</label>
                <input type="number" value={item.investors || ''} onChange={(e) => setItem({ ...item, investors: Number(e.target.value) })} />
            </div>
            <div>
                <label>Tokenomics Max Supply:</label>
                <input type="text" value={item.tokenomicsMaxSupply || ''} onChange={(e) => setItem({ ...item, tokenomicsMaxSupply: e.target.value })} />
            </div>
            <div>
                <label>Tokenomics Description:</label>
                <input type="text" value={item.tokenomicsDescription || ''} onChange={(e) => setItem({ ...item, tokenomicsDescription: e.target.value })} />
            </div>
            <div>
                <label>Featured:</label>
                <input type="checkbox" checked={item.featured || false} onChange={(e) => setItem({ ...item, featured: e.target.checked })} />
            </div>
            <div>
                <label>Archived:</label>
                <input type="checkbox" checked={item.archived || false} onChange={(e) => setItem({ ...item, archived: e.target.checked })} />
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
            {/* Submit */}
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
