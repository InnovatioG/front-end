import { ProtocolEntity } from '../../../lib/SmartDB/Entities/Protocol.Entity';
import { ProtocolApi } from '../../../lib/SmartDB/FrontEnd/Protocol.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './Protocol.module.scss';

export default function Protocol() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<ProtocolEntity[]>();
    const [newItem, setNewItem] = useState<Partial<ProtocolEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: ProtocolEntity[] = await ProtocolApi.getAllApi_();
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
          const entity = new ProtocolEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdProtocol = await ProtocolApi.createApi(entity);

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
            await ProtocolApi.deleteByIdApi(ProtocolEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof ProtocolEntity, value: any) => {
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
                        <label>pdProtocolVersion: </label>
                        <input 
                            type="text" 
                            value={newItem.pdProtocolVersion || ''} 
                            onChange={(e) => handleInputChange('pdProtocolVersion', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>pdAdmins: </label>
                        <input 
                            type="text" 
                            value={newItem.pdAdmins || ''} 
                            onChange={(e) => handleInputChange('pdAdmins', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>pdTokenAdminPolicy_CS: </label>
                        <input 
                            type="text" 
                            value={newItem.pdTokenAdminPolicy_CS || ''} 
                            onChange={(e) => handleInputChange('pdTokenAdminPolicy_CS', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>pdMinADA: </label>
                        <input 
                            type="text" 
                            value={newItem.pdMinADA || ''} 
                            onChange={(e) => handleInputChange('pdMinADA', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>contracts: </label>
                        <input 
                            type="text" 
                            value={newItem.contracts || ''} 
                            onChange={(e) => handleInputChange('contracts', e.target.value)} 
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
                <div>List of Protocol</div>
                <div className={styles.listContainer}>
                    <table border="1">
                        <thead>
                          <tr>
                            <th key="0">pdProtocolVersion</th><th key="1">pdAdmins</th><th key="2">pdTokenAdminPolicy_CS</th><th key="3">pdMinADA</th><th key="4">contracts</th><th key="5">createAt</th><th key="6">updateAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.pdProtocolVersion }</td><td key="1">{item.pdAdmins }</td><td key="2">{item.pdTokenAdminPolicy_CS }</td><td key="3">{item.pdMinADA }</td><td key="4">{item.contracts }</td><td key="5">{item.createAt }</td><td key="6">{item.updateAt }</td>
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
