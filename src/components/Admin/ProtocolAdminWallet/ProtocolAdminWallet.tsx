import { ProtocolAdminWalletEntity } from '../../../lib/SmartDB/Entities/ProtocolAdminWallet.Entity';
import { ProtocolAdminWalletApi } from '../../../lib/SmartDB/FrontEnd/ProtocolAdminWallet.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './ProtocolAdminWallet.module.scss';

export default function ProtocolAdminWallet() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<ProtocolAdminWalletEntity[]>();
    const [newItem, setNewItem] = useState<Partial<ProtocolAdminWalletEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: ProtocolAdminWalletEntity[] = await ProtocolAdminWalletApi.getAllApi_();
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
          const entity = new ProtocolAdminWalletEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdProtocolAdminWallet = await ProtocolAdminWalletApi.createApi(entity);

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
            await ProtocolAdminWalletApi.deleteByIdApi(ProtocolAdminWalletEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof ProtocolAdminWalletEntity, value: any) => {
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
                        <label>protocolId: </label>
                        <input 
                            type="text" 
                            value={newItem.protocolId || ''} 
                            onChange={(e) => handleInputChange('protocolId', e.target.value)} 
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
                <div>List of ProtocolAdminWallet</div>
                <div className={styles.listContainer}>
                    <table>
                        <thead>
                          <tr>
                            <th key="0">protocolId</th><th key="1">walletId</th><th key="2">createdAt</th><th key="3">updatedAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.protocolId }</td><td key="1">{item.walletId }</td><td key="2">{item.createdAt.toISOString()  }</td><td key="3">{item.updatedAt?.toISOString()  }</td>
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
