import { MilestoneSubmissionEntity } from '../../../lib/SmartDB/Entities/MilestoneSubmission.Entity';
import { MilestoneSubmissionApi } from '../../../lib/SmartDB/FrontEnd/MilestoneSubmission.FrontEnd.Api.Calls';
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import styles from './MilestoneSubmission.module.scss';

export default function MilestoneSubmission() {
    //--------------------------------------
    const [isRefreshing, setIsRefreshing] = useState(true);
    useEffect(() => {
        setIsRefreshing(false);
    }, []);
    //----------------------------
    const [list, setList] = useState<MilestoneSubmissionEntity[]>();
    const [newItem, setNewItem] = useState<Partial<MilestoneSubmissionEntity>>({}); // Estado para el nuevo entidad
    //----------------------------
    const fetch = async () => {
            try {
                const list: MilestoneSubmissionEntity[] = await MilestoneSubmissionApi.getAllApi_();
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
          const entity = new MilestoneSubmissionEntity(newItem);

          // Llamada al API para crear el entidad en la base de datos
          const createdMilestoneSubmission = await MilestoneSubmissionApi.createApi(entity);

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
            await MilestoneSubmissionApi.deleteByIdApi(MilestoneSubmissionEntity, id); // Llama a la API para eliminar el elemento
            fetch();
        } catch (e) {
            console.error(e);
        }
    };
    //----------------------------
    const handleInputChange = (field: keyof MilestoneSubmissionEntity, value: any) => {
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
                        <label>milestoneId: </label>
                        <input 
                            type="text" 
                            value={newItem.milestoneId || ''} 
                            onChange={(e) => handleInputChange('milestoneId', e.target.value)} 
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
                        <label>reportProofOfFinalization: </label>
                        <input 
                            type="text" 
                            value={newItem.reportProofOfFinalization || ''} 
                            onChange={(e) => handleInputChange('reportProofOfFinalization', e.target.value)} 
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
                <div>List of MilestoneSubmission</div>
                <div className={styles.listContainer}>
                    <table border="1">
                        <thead>
                          <tr>
                            <th key="0">milestoneId</th><th key="1">submissionStatusId</th><th key="2">submittedByWalletId</th><th key="3">revisedByWalletId</th><th key="4">reportProofOfFinalization</th><th key="5">approvedJustification</th><th key="6">rejectedJustification</th><th key="7">createAt</th><th key="8">updateAt</th>
                          </tr>
                        </thead>
                        <tbody>
                            {list?.map((item, index) => (
                              <tr key={index}>
                                <td key="0">{item.milestoneId }</td><td key="1">{item.submissionStatusId }</td><td key="2">{item.submittedByWalletId }</td><td key="3">{item.revisedByWalletId }</td><td key="4">{item.reportProofOfFinalization }</td><td key="5">{item.approvedJustification }</td><td key="6">{item.rejectedJustification }</td><td key="7">{item.createAt }</td><td key="8">{item.updateAt }</td>
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
