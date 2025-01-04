import { MilestoneFormProps, useCampaign } from './useCampaign';
import styles from './Campaign.module.scss';
import { CampaignEntity, CampaignMilestone } from '@/lib/SmartDB/Entities';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { toJson } from 'smart-db';

export default function Campaign() {
    const { list, newItem, editItem, deleteItem, view, setNewItem, setEditItem, setDeleteItem, setView, create, update, remove, getCategoryName, getStatusName } = useCampaign();

    const AdminsForm: React.FC<{
        item: Partial<CampaignEntity>;
        setItem: Dispatch<SetStateAction<Partial<CampaignEntity>>>;
    }> = ({ item, setItem }) => {
        const [localAdmins, setLocalAdmins] = useState<string[]>(item.cdAdmins || []);
        const [editingIndex, setEditingIndex] = useState<number | null>(null);

        useEffect(() => {
            setLocalAdmins(item.cdAdmins || []); // Sync with parent state
        }, [item.cdAdmins]);

        const addAdmin = () => {
            const newAdminIndex = localAdmins.length;
            setLocalAdmins((prev) => [...prev, '']); // Add an empty admin
            setEditingIndex(newAdminIndex); // Focus on editing the new admin
        };

        const removeAdmin = (index: number) => {
            const updatedAdmins = localAdmins.filter((_, i) => i !== index);
            setLocalAdmins(updatedAdmins);
            setItem((prev) => ({ ...prev, cdAdmins: updatedAdmins })); // Update parent state
            if (editingIndex === index) setEditingIndex(null);
        };

        const saveAdmin = (index: number, value: string) => {
            const updatedAdmins = localAdmins.map((admin, i) => (i === index ? value : admin));
            setLocalAdmins(updatedAdmins);
            setItem((prev) => ({ ...prev, cdAdmins: updatedAdmins })); // Update parent state
            setEditingIndex(null); // Exit editing mode
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
                                            setLocalAdmins(updatedAdmins); // Update locally
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

    const MilestoneForm: React.FC<MilestoneFormProps> = ({ item, setItem }) => {
        const [localMilestones, setLocalMilestones] = useState<CampaignMilestone[]>(item.cdMilestones || []);
        const [editingIndex, setEditingIndex] = useState<number | null>(null); // Track the currently edited row

        useEffect(() => {
            setLocalMilestones(item.cdMilestones || []); // Sync with parent state
        }, [item.cdMilestones]);

        const addMilestone = () => {
            const newMilestone: CampaignMilestone = {
                cmPerncentage: 0,
                cmStatus: 0, // Default status
            };
            const newMilestoneIndex = localMilestones.length; // Index of the new milestone
            setLocalMilestones((prev) => [...prev, newMilestone]); // Add a new milestone row
            setEditingIndex(newMilestoneIndex); // Focus on editing the new row
        };

        const removeMilestone = (index: number) => {
            const updatedMilestones = localMilestones.filter((_, i) => i !== index);
            setLocalMilestones(updatedMilestones);
            setItem((prev) => ({ ...prev, cdMilestones: updatedMilestones })); // Update parent state
            if (editingIndex === index) setEditingIndex(null); // Exit edit mode if the current row is removed
        };

        const saveMilestone = (index: number) => {
            setItem((prev) => ({ ...prev, cdMilestones: localMilestones })); // Save to parent state
            setEditingIndex(null); // Exit editing mode
        };

        const updateMilestone = (index: number, field: keyof CampaignMilestone, value: string | number | bigint) => {
            const parsedValue = Number(value);
            const updatedMilestones = localMilestones.map((m, i) => (i === index ? { ...m, [field]: parsedValue } : m));
            setLocalMilestones(updatedMilestones); // Update local state
        };

        return (
            <table style={{ width: '100%', marginTop: '10px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Percentage</th>
                        <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Status</th>
                        <th style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {localMilestones.map((milestone, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                {editingIndex === index ? (
                                    <input
                                        type="number"
                                        value={milestone.cmPerncentage}
                                        min="0"
                                        max="100"
                                        onChange={(e) => updateMilestone(index, 'cmPerncentage', e.target.value)}
                                        style={{ width: '100%' }}
                                    />
                                ) : (
                                    `${milestone.cmPerncentage}%`
                                )}
                            </td>
                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>
                                {editingIndex === index ? (
                                    <select value={milestone.cmStatus} onChange={(e) => updateMilestone(index, 'cmStatus', e.target.value)} style={{ width: '100%' }}>
                                        <option value="0">Created</option>
                                        <option value="1">Success</option>
                                        <option value="2">Failed</option>
                                    </select>
                                ) : milestone.cmStatus === 0 ? (
                                    'Created'
                                ) : milestone.cmStatus === 1 ? (
                                    'Success'
                                ) : (
                                    'Failed'
                                )}
                            </td>
                            <td style={{ textAlign: 'center', padding: '8px', borderBottom: '1px solid #ddd' }}>
                                {editingIndex === index ? (
                                    <button
                                        type="button"
                                        onClick={() => saveMilestone(index)}
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
                                    onClick={() => removeMilestone(index)}
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
                        <td colSpan={4} style={{ textAlign: 'center', padding: '12px 0' }}>
                            <button
                                type="button"
                                onClick={addMilestone}
                                style={{
                                    backgroundColor: 'blue',
                                    color: 'white',
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                }}
                            >
                                Add Milestone
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
                <p>No Campaigns found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Campaign Category</th>
                            <th>Campaign Status</th>

                            <th>Creator Wallet ID</th>

                            <th>Name</th>
                            <th>Description</th>

                            <th>Begin At Days</th>
                            <th>Deadline Days</th>
                            <th>Deployed (Human-Readable)</th>
                            <th>Actived (Human-Readable)</th>

                            <th>Begin At (Human-Readable)</th>
                            <th>Deadline (Human-Readable)</th>

                            <th>Mint Campaign Token</th>
                            <th>Campaign Token CS</th>
                            <th>Campaign Token TN</th>
                            <th>Campaign Token Price (ADA)</th>
                            <th>Requested Max ADA</th>
                            <th>Requested Min ADA</th>

                            <th>Logo URL</th>
                            <th>Banner URL</th>
                            <th>Website</th>
                            <th>Instagram</th>
                            <th>Twitter</th>
                            <th>Discord</th>
                            <th>Facebook</th>
                            <th>Visualizations</th>
                            <th>Investors</th>
                            <th>Tokenomics Max Supply</th>
                            <th>Tokenomics Description</th>

                            <th>Campaign Version (Datum)</th>
                            <th>Campaign Policy (Datum)</th>
                            <th>Campaign Funds Policy ID (Datum)</th>
                            <th>Admins (Datum)</th>
                            <th>Token Admin Policy (Datum)</th>
                            <th>Mint Campaign Token (Datum)</th>
                            <th>Campaign Token CS (Datum)</th>
                            <th>Campaign Token TN (Datum)</th>
                            <th>Campaign Token Price (ADA) (Datum)</th>
                            <th>Requested Max ADA (Datum)</th>
                            <th>Requested Min ADA (Datum)</th>
                            <th>Funded ADA (Datum)</th>
                            <th>Collected ADA (Datum)</th>
                            <th>Begin At (Datum)</th>
                            <th>Deadline (Datum)</th>
                            <th>Status (Datum)</th>
                            <th>Milestones (Datum)</th>
                            <th>Funds Count (Datum)</th>
                            <th>Funds Index (Datum)</th>
                            <th>Minimum ADA (Datum)</th>

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
                                <td>{getCategoryName(item.campaing_category_id)}</td>
                                <td>{getStatusName(item.campaign_status_id)}</td>
                                <td>{item.creator_wallet_id}</td>

                                <td>{item.name}</td>
                                <td>{item.description}</td>

                                <td>{item.begin_at_days}</td>
                                <td>{item.deadline_days}</td>
                                <td>{item.campaign_deployed_date?.toISOString()}</td>
                                <td>{item.campaign_actived_date?.toISOString()}</td>

                                <td>{item.begin_at?.toISOString()}</td>
                                <td>{item.deadline?.toISOString()}</td>

                                <td>{item.mint_CampaignToken ? 'Yes' : 'No'}</td>
                                <td>{item.campaignToken_CS}</td>
                                <td>{item.campaignToken_TN}</td>
                                <td>{item.campaignToken_PriceADA.toString()}</td>
                                <td>{item.requestedMaxADA.toString()}</td>
                                <td>{item.requestedMinADA.toString()}</td>

                                <td>{item.logo_url}</td>
                                <td>{item.banner_url}</td>
                                <td>{item.website}</td>
                                <td>{item.instagram}</td>
                                <td>{item.twitter}</td>
                                <td>{item.discord}</td>
                                <td>{item.facebook}</td>
                                <td>{item.visualizations}</td>
                                <td>{item.investors}</td>
                                <td>{item.tokenomics_max_supply}</td>
                                <td>{item.tokenomics_description}</td>

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
                                <td>{item.cdbegin_at?.toString()}</td>
                                <td>{item.cdDeadline?.toString()}</td>
                                <td>{item.cdStatus}</td>
                                <td>{toJson(item.cdMilestones)}</td>
                                <td>{item.cdFundsCount}</td>
                                <td>{item.cdFundsIndex}</td>
                                <td>{item.cdMinADA.toString()}</td>

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
                <label>Campaign Category ID:</label>
                <input type="text" value={item.campaing_category_id || ''} onChange={(e) => setItem({ ...item, campaing_category_id: e.target.value })} />
            </div>
            <div>
                <label>Campaign Status ID:</label>
                <input type="text" value={item.campaign_status_id || ''} onChange={(e) => setItem({ ...item, campaign_status_id: e.target.value })} />
            </div>
            <div>
                <label>Creator Wallet ID:</label>
                <input type="text" value={item.creator_wallet_id || ''} onChange={(e) => setItem({ ...item, creator_wallet_id: e.target.value })} />
            </div>

            <div>
                <label>Name:</label>
                <input type="text" value={item.name || ''} onChange={(e) => setItem({ ...item, name: e.target.value })} />
            </div>
            <div>
                <label>Description:</label>
                <textarea value={item.description || ''} onChange={(e) => setItem({ ...item, description: e.target.value })} />
            </div>

            <div>
                <label>Begin At (Days):</label>
                <input type="number" value={item.begin_at_days || ''} onChange={(e) => setItem({ ...item, begin_at_days: Number(e.target.value) })} />
            </div>

            <div>
                <label>Deadline (Days):</label>
                <input type="number" value={item.deadline_days || ''} onChange={(e) => setItem({ ...item, deadline_days: Number(e.target.value) })} />
            </div>
            <div>
                <label>Deployed (Human-Readable):</label>
                <input
                    type="datetime-local"
                    value={item.campaign_deployed_date ? new Date(item.campaign_deployed_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setItem({ ...item, campaign_deployed_date: selectedDate });
                    }}
                />
            </div>
            <div>
                <label>Actived (Human-Readable):</label>
                <input
                    type="datetime-local"
                    value={item.campaign_actived_date ? new Date(item.campaign_actived_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setItem({ ...item, campaign_actived_date: selectedDate });
                    }}
                />
            </div>

            <div>
                <label>Begin At (Human-Readable):</label>
                <input
                    type="datetime-local"
                    value={item.begin_at ? new Date(item.begin_at).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                        const selectedDate = new Date(e.target.value);
                        setItem({ ...item, begin_at: selectedDate });
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

            {/* Additional Campaign Details */}

            <div>
                <label>Mint Campaign Token:</label>
                <input type="checkbox" checked={item.mint_CampaignToken || false} onChange={(e) => setItem({ ...item, mint_CampaignToken: e.target.checked })} />
            </div>
            <div>
                <label>Campaign Token CS:</label>
                <input type="text" value={item.campaignToken_CS || ''} onChange={(e) => setItem({ ...item, campaignToken_CS: e.target.value })} />
            </div>
            <div>
                <label>Campaign Token TN:</label>
                <input type="text" value={item.campaignToken_TN || ''} onChange={(e) => setItem({ ...item, campaignToken_TN: e.target.value })} />
            </div>
            <div>
                <label>Campaign Token Price (ADA):</label>
                <input
                    type="text"
                    value={item.campaignToken_PriceADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, campaignToken_PriceADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Requested Max ADA:</label>
                <input
                    type="text"
                    value={item.requestedMaxADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, requestedMaxADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Requested Min ADA:</label>
                <input
                    type="text"
                    value={item.requestedMinADA?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, requestedMinADA: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>

            <div>
                <label>Logo URL:</label>
                <input type="text" value={item.logo_url || ''} onChange={(e) => setItem({ ...item, logo_url: e.target.value })} />
            </div>
            <div>
                <label>Banner URL:</label>
                <input type="text" value={item.banner_url || ''} onChange={(e) => setItem({ ...item, banner_url: e.target.value })} />
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
                <label>Visualizations:</label>
                <input type="number" value={item.visualizations || ''} onChange={(e) => setItem({ ...item, visualizations: Number(e.target.value) })} />
            </div>
            <div>
                <label>Investors:</label>
                <input type="number" value={item.investors || ''} onChange={(e) => setItem({ ...item, investors: Number(e.target.value) })} />
            </div>
            <div>
                <label>Tokenomics Max Supply:</label>
                <input type="text" value={item.tokenomics_max_supply || ''} onChange={(e) => setItem({ ...item, tokenomics_max_supply: e.target.value })} />
            </div>
            <div>
                <label>Tokenomics Description:</label>
                <input type="text" value={item.tokenomics_description || ''} onChange={(e) => setItem({ ...item, tokenomics_description: e.target.value })} />
            </div>

            {/* Datum Fields */}
            <div>
                <label>Campaign Version (Datum):</label>
                <input type="number" value={item.cdCampaignVersion || ''} onChange={(e) => setItem({ ...item, cdCampaignVersion: Number(e.target.value) })} />
            </div>
            <div>
                <label>Campaign Policy (Datum):</label>
                <input type="text" value={item.cdCampaignPolicy_CS || ''} onChange={(e) => setItem({ ...item, cdCampaignPolicy_CS: e.target.value })} />
            </div>
            <div>
                <label>Campaign Funds Policy ID (Datum):</label>
                <input type="text" value={item.cdCampaignFundsPolicyID_CS || ''} onChange={(e) => setItem({ ...item, cdCampaignFundsPolicyID_CS: e.target.value })} />
            </div>
            <div>
                <label>Admins (Datum):</label>
                <AdminsForm item={item} setItem={(value) => setItem(typeof value === 'function' ? (prev: any) => value(prev) : value)} />
            </div>
            <div>
                <label>Token Admin Policy (Datum):</label>
                <input type="text" value={item.cdTokenAdminPolicy_CS || ''} onChange={(e) => setItem({ ...item, cdTokenAdminPolicy_CS: e.target.value })} />
            </div>
            <div>
                <label>Mint Campaign Token (Datum):</label>
                <input type="checkbox" checked={item.cdMint_CampaignToken || false} onChange={(e) => setItem({ ...item, cdMint_CampaignToken: e.target.checked })} />
            </div>
            <div>
                <label>Campaign Token CS (Datum):</label>
                <input type="text" value={item.cdCampaignToken_CS || ''} onChange={(e) => setItem({ ...item, cdCampaignToken_CS: e.target.value })} />
            </div>
            <div>
                <label>Campaign Token TN (Datum):</label>
                <input type="text" value={item.cdCampaignToken_TN || ''} onChange={(e) => setItem({ ...item, cdCampaignToken_TN: e.target.value })} />
            </div>
            <div>
                <label>Campaign Token Price (ADA) (Datum):</label>
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
                <label>Requested Max ADA (Datum):</label>
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
                <label>Requested Min ADA (Datum):</label>
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
                <label>Funded ADA (Datum):</label>
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
                <label>Collected ADA (Datum):</label>
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
                <label>Begin At (POSIXTime) (Datum):</label>
                <input
                    type="text"
                    value={item.cdbegin_at?.toString() || ''}
                    onChange={(e) => {
                        if (!isNaN(Number(e.target.value))) {
                            setItem({ ...item, cdbegin_at: BigInt(e.target.value) });
                        }
                    }}
                />
            </div>
            <div>
                <label>Deadline (POSIXTime) (Datum):</label>
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
                <label>Status (Datum):</label>
                <input type="number" value={item.cdStatus || ''} onChange={(e) => setItem({ ...item, cdStatus: Number(e.target.value) })} />
            </div>
            <div>
                <label>Milestones (Datum):</label>
                <MilestoneForm item={item} setItem={(value) => setItem(typeof value === 'function' ? (prev: any) => value(prev) : value)} />
            </div>
            <div>
                <label>Funds Count (Datum):</label>
                <input type="number" value={item.cdFundsCount || ''} onChange={(e) => setItem({ ...item, cdFundsCount: Number(e.target.value) })} />
            </div>
            <div>
                <label>Funds Index (Datum):</label>
                <input type="number" value={item.cdFundsIndex || ''} onChange={(e) => setItem({ ...item, cdFundsIndex: Number(e.target.value) })} />
            </div>
            <div>
                <label>Minimum ADA (Datum):</label>
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
