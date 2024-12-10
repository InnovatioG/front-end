import { CustomWalletEntity } from '../../../lib/SmartDB/Entities/CustomWallet.Entity';
import { CustomWalletApi } from '../../../lib/SmartDB/FrontEnd/CustomWallet.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './CustomWallet.module.scss';

export default function CustomWallet() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<CustomWalletEntity[]>();
    const [newItem, setNewItem] = useState<Partial<CustomWalletEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: CustomWalletEntity[] = await CustomWalletApi.getAllApi_();
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
          const entity = new CustomWalletEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdCustomWallet = await CustomWalletApi.createApi(entity);

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
            await CustomWalletApi.deleteByIdApi(CustomWalletEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof CustomWalletEntity, value: any) => {
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
                        <label>createdBy: </label>
                        <input 
                            type="text" 
                            value={newItem.createdBy || ''} 
                            onChange={(e) => handleInputChange('createdBy', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>lastConnection: </label>
                        <input 
                            type="text" 
                            value={newItem.lastConnection || ''} 
                            onChange={(e) => handleInputChange('lastConnection', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>walletUsed: </label>
                        <input 
                            type="text" 
                            value={newItem.walletUsed || ''} 
                            onChange={(e) => handleInputChange('walletUsed', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>walletValidatedWithSignedToken: </label>
                        <input 
                            type="text" 
                            value={newItem.walletValidatedWithSignedToken || ''} 
                            onChange={(e) => handleInputChange('walletValidatedWithSignedToken', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>paymentPkh: </label>
                        <input 
                            type="text" 
                            value={newItem.paymentPkh || ''} 
                            onChange={(e) => handleInputChange('paymentPkh', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>stakePkh: </label>
                        <input 
                            type="text" 
                            value={newItem.stakePkh || ''} 
                            onChange={(e) => handleInputChange('stakePkh', e.target.value)} 
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
                        <label>email: </label>
                        <input 
                            type="text" 
                            value={newItem.email || ''} 
                            onChange={(e) => handleInputChange('email', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>validatedEmail: </label>
                        <input 
                            type="text" 
                            value={newItem.validatedEmail || ''} 
                            onChange={(e) => handleInputChange('validatedEmail', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>testnetAddress: </label>
                        <input 
                            type="text" 
                            value={newItem.testnetAddress || ''} 
                            onChange={(e) => handleInputChange('testnetAddress', e.target.value)} 
                        />
                    </div>
                    <div>
                    </div>
                    <div>
                        <label>mainnetAddress: </label>
                        <input 
                            type="text" 
                            value={newItem.mainnetAddress || ''} 
                            onChange={(e) => handleInputChange('mainnetAddress', e.target.value)} 
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
                <div>List of CustomWallet</div>
                <div className={styles.listContainer}>
                    <table border="1">
                        <thead>
                          <tr>
                            <th key="0">createdBy</th><th key="1">lastConnection</th><th key="2">walletUsed</th><th key="3">walletValidatedWithSignedToken</th><th key="4">paymentPkh</th><th key="5">stakePkh</th><th key="6">name</th><th key="7">email</th><th key="8">validatedEmail</th><th key="9">testnetAddress</th><th key="10">mainnetAddress</th><th key="11">createAt</th><th key="12">updateAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.createdBy }</td><td key="1">{item.lastConnection }</td><td key="2">{item.walletUsed }</td><td key="3">{item.walletValidatedWithSignedToken }</td><td key="4">{item.paymentPkh }</td><td key="5">{item.stakePkh }</td><td key="6">{item.name }</td><td key="7">{item.email }</td><td key="8">{item.validatedEmail }</td><td key="9">{item.testnetAddress }</td><td key="10">{item.mainnetAddress }</td><td key="11">{item.createAt }</td><td key="12">{item.updateAt }</td>
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
