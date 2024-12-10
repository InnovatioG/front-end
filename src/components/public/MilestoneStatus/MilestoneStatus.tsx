import { MilestoneStatusEntity } from '../../../lib/SmartDB/Entities/MilestoneStatus.Entity';
import { MilestoneStatusApi } from '../../../lib/SmartDB/FrontEnd/MilestoneStatus.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './MilestoneStatus.module.scss';

export default function MilestoneStatus() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<MilestoneStatusEntity[]>();
    const [newItem, setNewItem] = useState<Partial<MilestoneStatusEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: MilestoneStatusEntity[] = await MilestoneStatusApi.getAllApi_();
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
          const entity = new MilestoneStatusEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdMilestoneStatus = await MilestoneStatusApi.createApi(entity);

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
            await MilestoneStatusApi.deleteByIdApi(MilestoneStatusEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof MilestoneStatusEntity, value: any) => {
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
                        <label>createAt: </label>
                        <input 
                            type="text" 
                            value={newItem.createAt || ''} 
                            onChange={(e) => handleInputChange('createAt', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>updateAt: </label>
                        <input 
                            type="text" 
                            value={newItem.updateAt || ''} 
                            onChange={(e) => handleInputChange('updateAt', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <button type="button" onClick={handleBtnCreate}>Create</button>
                </form>
            </div>
            <div>
                <div>List of MilestoneStatus</div>
                <div className={styles.listContainer}>
                    <table border="1">
                        <thead>
                          <tr>
                            <th key="0">name</th><th key="1">description</th><th key="2">createAt</th><th key="3">updateAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.name }</td><td key="1">{item.description }</td><td key="2">{item.createAt }</td><td key="3">{item.updateAt }</td>
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
