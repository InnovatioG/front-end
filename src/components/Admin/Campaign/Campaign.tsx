import { CampaignEntity } from '../../../lib/SmartDB/Entities/Campaign.Entity';
import { CampaignApi } from '../../../lib/SmartDB/FrontEnd/Campaign.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './Campaign.module.scss';
import { pushWarningNotification } from 'smart-db';

export default function Campaign() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<CampaignEntity[]>();
    const [newItem, setNewItem] = useState<Partial<CampaignEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
        try {
            const list: CampaignEntity[] = await CampaignApi.getAllApi_();
            setList(list);
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        fetch();
    }, []);
    //----------------------------
    const handleBtnCreate = async () => {
        try {
            // Crear un nuevo entidad a partir de los datos de newItem
            const entity = new CampaignEntity(newItem);

            // Llamada al API para crear el entidad en la base de datos
            const createdCampaign = await CampaignApi.createApi(entity);

            // Limpiar los campos después de crear
            setNewItem({});

            fetch();
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error creating Campaign: ${e}`);
        }
    };
    //----------------------------
    const handleDelete = async (id: string) => {
        try {
            await CampaignApi.deleteByIdApi(CampaignEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
            pushWarningNotification('Error', `Error deleting Campaign: ${e}`);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof CampaignEntity, value: any) => {
        setNewItem({
            ...newItem,
            [field]: value,
        });
    };
    //----------------------------
    return (
        <div className={styles.content}>
            <div>
                <div className={styles.subTitle}>CREATE</div>
                <form>
                    <div>
                        <label>projectId: </label>
                        <input type="text" value={newItem.projectId || ''} onChange={(e) => handleInputChange('projectId', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>campaingCategoryId: </label>
                        <input type="text" value={newItem.campaingCategoryId || ''} onChange={(e) => handleInputChange('campaingCategoryId', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>campaignStatusId: </label>
                        <input type="text" value={newItem.campaignStatusId || ''} onChange={(e) => handleInputChange('campaignStatusId', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>creatorWalletId: </label>
                        <input type="text" value={newItem.creatorWalletId || ''} onChange={(e) => handleInputChange('creatorWalletId', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdCampaignVersion: </label>
                        <input type="text" value={newItem.cdCampaignVersion || ''} onChange={(e) => handleInputChange('cdCampaignVersion', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdCampaignPolicy_CS: </label>
                        <input type="text" value={newItem.cdCampaignPolicy_CS || ''} onChange={(e) => handleInputChange('cdCampaignPolicy_CS', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdCampaignFundsPolicyID_CS: </label>
                        <input type="text" value={newItem.cdCampaignFundsPolicyID_CS || ''} onChange={(e) => handleInputChange('cdCampaignFundsPolicyID_CS', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdAdmins: </label>
                        <input
                            type="text"
                            value={(newItem.cdAdmins || []).join(', ')}
                            onChange={(e) =>
                                handleInputChange(
                                    'cdAdmins',
                                    e.target.value.split(',').map((s) => s.trim())
                                )
                            }
                        />
                    </div>
                    <div></div>
                    <div>
                        <label>cdTokenAdminPolicy_CS: </label>
                        <input type="text" value={newItem.cdTokenAdminPolicy_CS || ''} onChange={(e) => handleInputChange('cdTokenAdminPolicy_CS', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdMint_CampaignToken: </label>
                        <input type="checkbox" checked={newItem.cdMint_CampaignToken || false} onChange={(e) => handleInputChange('cdMint_CampaignToken', e.target.checked)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdCampaignToken_CS: </label>
                        <input type="text" value={newItem.cdCampaignToken_CS || ''} onChange={(e) => handleInputChange('cdCampaignToken_CS', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdCampaignToken_TN: </label>
                        <input type="text" value={newItem.cdCampaignToken_TN || ''} onChange={(e) => handleInputChange('cdCampaignToken_TN', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdCampaignToken_PriceADA: </label>
                        <input type="text" value={newItem.cdCampaignToken_PriceADA || ''} onChange={(e) => handleInputChange('cdCampaignToken_PriceADA', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdRequestedMaxADA: </label>
                        <input type="text" value={newItem.cdRequestedMaxADA || ''} onChange={(e) => handleInputChange('cdRequestedMaxADA', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdRequestedMinADA: </label>
                        <input type="text" value={newItem.cdRequestedMinADA || ''} onChange={(e) => handleInputChange('cdRequestedMinADA', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdFundedADA: </label>
                        <input type="text" value={newItem.cdFundedADA || ''} onChange={(e) => handleInputChange('cdFundedADA', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdCollectedADA: </label>
                        <input type="text" value={newItem.cdCollectedADA || ''} onChange={(e) => handleInputChange('cdCollectedADA', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdBeginAt: </label>
                        <input
                            type="text"
                            value={newItem.cdBeginAt ? new Date(newItem.cdBeginAt).toISOString() : ''}
                            onChange={(e) => handleInputChange('cdBeginAt', new Date(e.target.value))}
                        />
                    </div>
                    <div></div>
                    <input
                        type="text"
                        value={newItem.cdDeadline ? new Date(newItem.cdDeadline).toISOString() : ''}
                        onChange={(e) => handleInputChange('cdDeadline', new Date(e.target.value))}
                    />
                    <div></div>
                    <div>
                        <label>cdStatus: </label>
                        <input type="text" value={newItem.cdStatus || ''} onChange={(e) => handleInputChange('cdStatus', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdMilestones: </label>
                        <input type="text" value={newItem.cdMilestones || ''} onChange={(e) => handleInputChange('cdMilestones', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdFundsCount: </label>
                        <input type="text" value={newItem.cdFundsCount || ''} onChange={(e) => handleInputChange('cdFundsCount', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdFundsIndex: </label>
                        <input type="text" value={newItem.cdFundsIndex || ''} onChange={(e) => handleInputChange('cdFundsIndex', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>cdMinADA: </label>
                        <input type="text" value={newItem.cdMinADA || ''} onChange={(e) => handleInputChange('cdMinADA', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>description: </label>
                        <input type="text" value={newItem.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>logoUrl: </label>
                        <input type="text" value={newItem.logoUrl || ''} onChange={(e) => handleInputChange('logoUrl', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>bannerUrl: </label>
                        <input type="text" value={newItem.bannerUrl || ''} onChange={(e) => handleInputChange('bannerUrl', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>website: </label>
                        <input type="text" value={newItem.website || ''} onChange={(e) => handleInputChange('website', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>instagram: </label>
                        <input type="text" value={newItem.instagram || ''} onChange={(e) => handleInputChange('instagram', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>twitter: </label>
                        <input type="text" value={newItem.twitter || ''} onChange={(e) => handleInputChange('twitter', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>discord: </label>
                        <input type="text" value={newItem.discord || ''} onChange={(e) => handleInputChange('discord', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>facebook: </label>
                        <input type="text" value={newItem.facebook || ''} onChange={(e) => handleInputChange('facebook', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>investors: </label>
                        <input type="text" value={newItem.investors || ''} onChange={(e) => handleInputChange('investors', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>tokenomicsMaxSupply: </label>
                        <input type="text" value={newItem.tokenomicsMaxSupply || ''} onChange={(e) => handleInputChange('tokenomicsMaxSupply', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>tokenomicsDescription: </label>
                        <input type="text" value={newItem.tokenomicsDescription || ''} onChange={(e) => handleInputChange('tokenomicsDescription', e.target.value)} />
                    </div>
                    <div></div>
                    <div>
                        <label>featured: </label>
                        <input type="checked" checked={newItem.featured || false} onChange={(e) => handleInputChange('featured', e.target.checked)} />
                    </div>
                    <div></div>
                    <div>
                        <label>archived: </label>
                        <input type="checked" checked={newItem.archived || false} onChange={(e) => handleInputChange('archived', e.target.checked)} />
                    </div>
                    <div></div>
                    <div>
                        <label>createdAt: </label>
                        <input type="text" value={newItem.createdAt ? new Date(newItem.createdAt).toISOString() : ''}
                        onChange={(e) => handleInputChange('createdAt', new Date(e.target.value))} />
                    </div>
                    <div></div>
                    <div>
                        <label>updatedAt: </label>
                        <input type="text" value={newItem.updatedAt ? new Date(newItem.updatedAt).toISOString() : ''}
                        onChange={(e) => handleInputChange('updatedAt', new Date(e.target.value))} />
                    </div>
                    <div></div>
                    <button type="button" onClick={handleBtnCreate}>
                        Create
                    </button>
                </form>
            </div>
            <div>
                <div>List of Campaign</div>
                <div className={styles.listContainer}>
                    <table >
                        <thead>
                            <tr>
                                <th key="0">projectId</th>
                                <th key="1">campaingCategoryId</th>
                                <th key="2">campaignStatusId</th>
                                <th key="3">creatorWalletId</th>
                                <th key="4">cdCampaignVersion</th>
                                <th key="5">cdCampaignPolicy_CS</th>
                                <th key="6">cdCampaignFundsPolicyID_CS</th>
                                <th key="7">cdAdmins</th>
                                <th key="8">cdTokenAdminPolicy_CS</th>
                                <th key="9">cdMint_CampaignToken</th>
                                <th key="10">cdCampaignToken_CS</th>
                                <th key="11">cdCampaignToken_TN</th>
                                <th key="12">cdCampaignToken_PriceADA</th>
                                <th key="13">cdRequestedMaxADA</th>
                                <th key="14">cdRequestedMinADA</th>
                                <th key="15">cdFundedADA</th>
                                <th key="16">cdCollectedADA</th>
                                <th key="17">cdBeginAt</th>
                                <th key="18">cdDeadline</th>
                                <th key="19">cdStatus</th>
                                <th key="20">cdMilestones</th>
                                <th key="21">cdFundsCount</th>
                                <th key="22">cdFundsIndex</th>
                                <th key="23">cdMinADA</th>
                                <th key="24">description</th>
                                <th key="25">logoUrl</th>
                                <th key="26">bannerUrl</th>
                                <th key="27">website</th>
                                <th key="28">instagram</th>
                                <th key="29">twitter</th>
                                <th key="30">discord</th>
                                <th key="31">facebook</th>
                                <th key="32">investors</th>
                                <th key="33">tokenomicsMaxSupply</th>
                                <th key="34">tokenomicsDescription</th>
                                <th key="35">featured</th>
                                <th key="36">archived</th>
                                <th key="37">createdAt</th>
                                <th key="38">updatedAt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                                <tr key={index}>
                                    <td key="0">{item.projectId}</td>
                                    <td key="1">{item.campaingCategoryId}</td>
                                    <td key="2">{item.campaignStatusId}</td>
                                    <td key="3">{item.creatorWalletId}</td>
                                    <td key="4">{item.cdCampaignVersion}</td>
                                    <td key="5">{item.cdCampaignPolicy_CS}</td>
                                    <td key="6">{item.cdCampaignFundsPolicyID_CS}</td>
                                    <td key="7">{item.cdAdmins}</td>
                                    <td key="8">{item.cdTokenAdminPolicy_CS}</td>
                                    <td key="9">{item.cdMint_CampaignToken}</td>
                                    <td key="10">{item.cdCampaignToken_CS}</td>
                                    <td key="11">{item.cdCampaignToken_TN}</td>
                                    <td key="12">{item.cdCampaignToken_PriceADA}</td>
                                    <td key="13">{item.cdRequestedMaxADA}</td>
                                    <td key="14">{item.cdRequestedMinADA}</td>
                                    <td key="15">{item.cdFundedADA}</td>
                                    <td key="16">{item.cdCollectedADA}</td>
                                    <td key="17">{item.cdBeginAt.toISOString()}</td>
                                    <td key="18">{item.cdDeadline.toISOString()}</td>
                                    <td key="19">{item.cdStatus}</td>
                                    <td key="20">{item.cdMilestones}</td>
                                    <td key="21">{item.cdFundsCount}</td>
                                    <td key="22">{item.cdFundsIndex}</td>
                                    <td key="23">{item.cdMinADA}</td>
                                    <td key="24">{item.description}</td>
                                    <td key="25">{item.logoUrl}</td>
                                    <td key="26">{item.bannerUrl}</td>
                                    <td key="27">{item.website}</td>
                                    <td key="28">{item.instagram}</td>
                                    <td key="29">{item.twitter}</td>
                                    <td key="30">{item.discord}</td>
                                    <td key="31">{item.facebook}</td>
                                    <td key="32">{item.investors}</td>
                                    <td key="33">{item.tokenomicsMaxSupply}</td>
                                    <td key="34">{item.tokenomicsDescription}</td>
                                    <td key="35">{item.featured}</td>
                                    <td key="36">{item.archived}</td>
                                    <td key="37">{item.createdAt.toISOString()}</td>
                                    <td key="38">{item.updatedAt?.toISOString()}</td>
                                    <td>
                                        <button onClick={() => handleDelete(item._DB_id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
Modal.setAppElement('#__next');
