import { CampaignContentEntity } from '../../../lib/SmartDB/Entities/CampaignContent.Entity';
import { CampaignContentApi } from '../../../lib/SmartDB/FrontEnd/CampaignContent.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './CampaignContent.module.scss';

export default function CampaignContent() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<CampaignContentEntity[]>();
    const [newItem, setNewItem] = useState<Partial<CampaignContentEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: CampaignContentEntity[] = await CampaignContentApi.getAllApi_();
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
          const entity = new CampaignContentEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdCampaignContent = await CampaignContentApi.createApi(entity);

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
            await CampaignContentApi.deleteByIdApi(CampaignContentEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof CampaignContentEntity, value: any) => {
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
                        <label>name: </label>
                        <input 
                            type="text" 
                            value={newItem.name || ''} 
                            onChange={(e) => handleInputChange('name', e.target.value)} 
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
                        <label>order: </label>
                        <input 
                            type="text" 
                            value={newItem.order || ''} 
                            onChange={(e) => handleInputChange('order', e.target.value)} 
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
                <div>List of CampaignContent</div>
                <div className={styles.listContainer}>
                    <table>
                        <thead>
                          <tr>
                            <th key="0">campaignId</th><th key="1">name</th><th key="2">description</th><th key="3">order</th><th key="4">createdAt</th><th key="5">updatedAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.campaignId }</td><td key="1">{item.name }</td><td key="2">{item.description }</td><td key="3">{item.order }</td><td key="4">{item.createdAt.toISOString() }</td><td key="5">{item.updatedAt?.toISOString() }</td>
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
