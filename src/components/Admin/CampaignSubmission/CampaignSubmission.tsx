import { CampaignSubmissionEntity } from '../../../lib/SmartDB/Entities/CampaignSubmission.Entity';
import { CampaignSubmissionApi } from '../../../lib/SmartDB/FrontEnd/CampaignSubmission.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './CampaignSubmission.module.scss';

export default function CampaignSubmission() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<CampaignSubmissionEntity[]>();
    const [newItem, setNewItem] = useState<Partial<CampaignSubmissionEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: CampaignSubmissionEntity[] = await CampaignSubmissionApi.getAllApi_();
                setList(list);
            } catch (e) {
                console.error(e);
            }
        };
    useEffect(() => {fetch();}, []);
    //----------------------------
    const handleBtnCreate = async () => {
        try {
          // Crear un nuevo entidad a partir de los datos de newItem
          const entity = new CampaignSubmissionEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdCampaignSubmission = await CampaignSubmissionApi.createApi(entity);

          // Limpiar los campos después de crear
          setNewItem({});

          fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleDelete = async (id: string) => {
        try {
            await CampaignSubmissionApi.deleteByIdApi(CampaignSubmissionEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof CampaignSubmissionEntity, value: any) => {
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
                        <label>campaignId: </label>
                        <input 
                            type="text" 
                            value={newItem.campaignId || ''} 
                            onChange={(e) => handleInputChange('campaignId', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>submissionStatusId: </label>
                        <input 
                            type="text" 
                            value={newItem.submissionStatusId || ''} 
                            onChange={(e) => handleInputChange('submissionStatusId', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>submittedByWalletId: </label>
                        <input 
                            type="text" 
                            value={newItem.submittedByWalletId || ''} 
                            onChange={(e) => handleInputChange('submittedByWalletId', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>revisedByWalletId: </label>
                        <input 
                            type="text" 
                            value={newItem.revisedByWalletId || ''} 
                            onChange={(e) => handleInputChange('revisedByWalletId', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>approvedJustification: </label>
                        <input 
                            type="text" 
                            value={newItem.approvedJustification || ''} 
                            onChange={(e) => handleInputChange('approvedJustification', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>rejectedJustification: </label>
                        <input 
                            type="text" 
                            value={newItem.rejectedJustification || ''} 
                            onChange={(e) => handleInputChange('rejectedJustification', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
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
                    <div>
                    </div>
                    <button type="button" onClick={handleBtnCreate}>Create</button>
                </form>
            </div>
            <div>
                <div>List of CampaignSubmission</div>
                <div className={styles.listContainer}>
                    <table>
                        <thead>
                          <tr>
                            <th key="0">campaignId</th><th key="1">submissionStatusId</th><th key="2">submittedByWalletId</th><th key="3">revisedByWalletId</th><th key="4">approvedJustification</th><th key="5">rejectedJustification</th><th key="6">createdAt</th><th key="7">updatedAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.campaignId }</td><td key="1">{item.submissionStatusId }</td><td key="2">{item.submittedByWalletId }</td><td key="3">{item.revisedByWalletId }</td><td key="4">{item.approvedJustification }</td><td key="5">{item.rejectedJustification }</td><td key="6">{item.createdAt.toISOString() }</td><td key="7">{item.updatedAt?.toISOString() }</td>
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
