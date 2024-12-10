import { MilestoneEntity } from '../../../lib/SmartDB/Entities/Milestone.Entity';
import { MilestoneApi } from '../../../lib/SmartDB/FrontEnd/Milestone.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './Milestone.module.scss';

export default function Milestone() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<MilestoneEntity[]>();
    const [newItem, setNewItem] = useState<Partial<MilestoneEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: MilestoneEntity[] = await MilestoneApi.getAllApi_();
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
          const entity = new MilestoneEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdMilestone = await MilestoneApi.createApi(entity);

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
            await MilestoneApi.deleteByIdApi(MilestoneEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof MilestoneEntity, value: any) => {
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
                        <label>campaignStatusId: </label>
                        <input 
                            type="text" 
                            value={newItem.campaignStatusId || ''} 
                            onChange={(e) => handleInputChange('campaignStatusId', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>cmEstimateDeliveryDate: </label>
                        <input 
                            type="text" 
                            value={newItem.cmEstimateDeliveryDate || ''} 
                            onChange={(e) => handleInputChange('cmEstimateDeliveryDate', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>cmPercentage: </label>
                        <input 
                            type="text" 
                            value={newItem.cmPercentage || ''} 
                            onChange={(e) => handleInputChange('cmPercentage', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>cmStatus: </label>
                        <input 
                            type="text" 
                            value={newItem.cmStatus || ''} 
                            onChange={(e) => handleInputChange('cmStatus', e.target.value)} 
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
                    <button type="button" onClick={handleBtnCreate}>Create</button>
                </form>
            </div>
            <div>
                <div>List of Milestone</div>
                <div className={styles.listContainer}>
                    <table border="1">
                        <thead>
                          <tr>
                            <th key="0">campaignId</th><th key="1">campaignStatusId</th><th key="2">cmEstimateDeliveryDate</th><th key="3">cmPercentage</th><th key="4">cmStatus</th><th key="5">description</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.campaignId }</td><td key="1">{item.campaignStatusId }</td><td key="2">{item.cmEstimateDeliveryDate }</td><td key="3">{item.cmPercentage }</td><td key="4">{item.cmStatus }</td><td key="5">{item.description }</td>
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
