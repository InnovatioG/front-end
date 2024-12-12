import { CampaignMemberEntity } from '../../../lib/SmartDB/Entities/CampaignMember.Entity';
import { CampaignMemberApi } from '../../../lib/SmartDB/FrontEnd/CampaignMember.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './CampaignMember.module.scss';

export default function CampaignMember() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<CampaignMemberEntity[]>();
    const [newItem, setNewItem] = useState<Partial<CampaignMemberEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: CampaignMemberEntity[] = await CampaignMemberApi.getAllApi_();
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
          const entity = new CampaignMemberEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdCampaignMember = await CampaignMemberApi.createApi(entity);

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
            await CampaignMemberApi.deleteByIdApi(CampaignMemberEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof CampaignMemberEntity, value: any) => {
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
                        <label>editor: </label>
                        <input 
                            type="checked" 
                            checked={newItem.editor || false} 
                            onChange={(e) => handleInputChange('editor', e.target.checked)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>walletId: </label>
                        <input 
                            type="text" 
                            value={newItem.walletId || ''} 
                            onChange={(e) => handleInputChange('walletId', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>rol: </label>
                        <input 
                            type="text" 
                            value={newItem.rol || ''} 
                            onChange={(e) => handleInputChange('rol', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>description: </label>
                        <input 
                            type="text" 
                            value={newItem.description || ''} 
                            onChange={(e) => handleInputChange('description', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>website: </label>
                        <input 
                            type="text" 
                            value={newItem.website || ''} 
                            onChange={(e) => handleInputChange('website', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>instagram: </label>
                        <input 
                            type="text" 
                            value={newItem.instagram || ''} 
                            onChange={(e) => handleInputChange('instagram', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>twitter: </label>
                        <input 
                            type="text" 
                            value={newItem.twitter || ''} 
                            onChange={(e) => handleInputChange('twitter', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>discord: </label>
                        <input 
                            type="text" 
                            value={newItem.discord || ''} 
                            onChange={(e) => handleInputChange('discord', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>facebook: </label>
                        <input 
                            type="text" 
                            value={newItem.facebook || ''} 
                            onChange={(e) => handleInputChange('facebook', e.target.value)} 
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
                <div>List of CampaignMember</div>
                <div className={styles.listContainer}>
                    <table>
                        <thead>
                          <tr>
                            <th key="0">campaignId</th><th key="1">editor</th><th key="2">walletId</th><th key="3">rol</th><th key="4">description</th><th key="5">website</th><th key="6">instagram</th><th key="7">twitter</th><th key="8">discord</th><th key="9">facebook</th><th key="10">createdAt</th><th key="11">updatedAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.campaignId }</td><td key="1">{item.editor }</td><td key="2">{item.walletId }</td><td key="3">{item.rol }</td><td key="4">{item.description }</td><td key="5">{item.website }</td><td key="6">{item.instagram }</td><td key="7">{item.twitter }</td><td key="8">{item.discord }</td><td key="9">{item.facebook }</td><td key="10">{item.createdAt.toISOString() }</td><td key="11">{item.updatedAt?.toISOString() }</td>
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
