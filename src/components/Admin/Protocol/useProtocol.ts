import { useModal } from '@/contexts/ModalContext';
import { ProtocolAddScriptsTxParams, ProtocolDeployTxParams } from '@/lib/SmartDB/Commons/Params';
import { ScriptApi } from '@/lib/SmartDB/FrontEnd';
import { ModalsEnums, TaskEnums } from '@/utils/constants/constants';
import { ADMIN_TOKEN_POLICY_CS, TxEnums } from '@/utils/constants/on-chain';
import { ScriptHash } from '@lucid-evolution/lucid';
import { useCallback, useEffect, useState } from 'react';
import {
    AddressToFollowFrontEndApiCalls,
    BaseSmartDBFrontEndBtnHandlers,
    explainErrorTx,
    formatHash,
    isEmulator,
    LucidToolsFrontEnd,
    optionsGetMinimal,
    PROYECT_NAME,
    pushSucessNotification,
    pushWarningNotification,
    sleep,
    TX_PROPAGATION_DELAY_MS,
    useTransactions,
    useWalletStore,
} from 'smart-db';
import { ProtocolEntity } from '../../../lib/SmartDB/Entities/Protocol.Entity';
import { ProtocolApi } from '../../../lib/SmartDB/FrontEnd/Protocol.FrontEnd.Api.Calls';

export function useProtocol() {
    //-------------------------
    const [list, setList] = useState<ProtocolEntity[]>([]);
    const [editItem, setEditItem] = useState<Partial<ProtocolEntity> | null>(null);
    const [view, setView] = useState<'list' | 'addscripts' | 'deploy'>('list');
    //-------------------------
    const walletStore = useWalletStore();
    //-------------------------
    const { openModal } = useModal();
    //--------------------------------------
    useEffect(() => {
        if (walletStore.isConnected === true && walletStore.info !== undefined && view === 'deploy' && editItem !== null) {
            if (editItem.pdAdmins?.length === 0) {
                setEditItem({ ...editItem, pdAdmins: [walletStore.info.pkh] });
            }
        }
    }, [walletStore.isConnected, view, editItem]);
    useEffect(() => {
        if (editItem === undefined) return;
        if (editItem?.pdTokenAdminPolicy_CS === undefined) {
            setEditItem({ ...editItem, pdTokenAdminPolicy_CS: ADMIN_TOKEN_POLICY_CS });
        }
    }, [editItem]);
    //--------------------------------------
    const fetch = useCallback(async () => {
        try {
            const fetchedList: ProtocolEntity[] = await ProtocolApi.getAllApi_();
            setList(fetchedList);
        } catch (e) {
            console.error(e);
            pushWarningNotification(`${PROYECT_NAME}`, `Error fetching Protocol: ${e}`);
        }
    }, []);
    //--------------------------------------
    useEffect(() => {
        fetch();
    }, [fetch]);
    //--------------------------------------
    const onTx = async () => {
        fetch();
        setView('list');
        setEditItem(null);
    };
    const onTryAgainTx = async () => {
        setIsFaildedTx(false);
        setIsFaildedTx(false);
        setShowProcessingTx(false);
    };
    const onFinishTx = async () => {
        // si la tx paso, ya se reseto el form en onTx, pero por las dudas, si aprienta cuando falla
        if (isFaildedTx === true) {
            fetch();
        }
        setIsConfirmedTx(false);
        setIsFaildedTx(false);
        setShowProcessingTx(false);
    };
    //--------------------------------------
    async function checkIsValidTx() {
        const isValid = true;
        return isValid;
    }
    //--------------------------------------
    const dependenciesValidTx: any[] = [];
    //--------------------------------------
    const {
        appStore,
        tokensStore,
        session,
        status,
        showUserConfirmation,
        setShowUserConfirmation,
        showProcessingTx,
        setShowProcessingTx,
        isProcessingTx,
        setIsProcessingTx,
        isFaildedTx,
        setIsFaildedTx,
        isConfirmedTx,
        setIsConfirmedTx,
        processingTxName,
        setProcessingTxName,
        processingTxMessage,
        setProcessingTxMessage,
        processingTxHash,
        setProcessingTxHash,
        isValidTx,
        setIsValidTx,
        tokensGiveWithMetadata,
        setTokensGiveWithMetadata,
        tokensGetWithMetadata,
        setTokensGetWithMetadata,
        available_ADA_in_Wallet,
        available_forSpend_ADA_in_Wallet,
        isMaxAmountLoaded: isMaxAmountLoadedFromTxHook,
        handleBtnShowUserConfirmation,
        handleBtnDoTransaction_WithErrorControl,
    } = useTransactions({ dependenciesValidTx, checkIsValidTx, onTx });
    //--------------------------------------
    const handleDeployTx = async () => {
        //--------------------------------------
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        //--------------------------------------
        const fetchParams = async () => {
            //--------------------------------------
            const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
            //--------------------------------------
            const txParams: ProtocolDeployTxParams = {
                protocol_id: editItem!._DB_id!,
                pdAdmins: editItem!.pdAdmins!,
                pdTokenAdminPolicy_CS: editItem!.pdTokenAdminPolicy_CS!,
            };
            return {
                lucid,
                emulatorDB,
                walletTxParams,
                txParams,
            };
        };
        //--------------------------------------
        openModal(ModalsEnums.PROCESSING_TX);
        //--------------------------------------
        const txApiCall = ProtocolApi.callGenericTxApi.bind(ProtocolApi);
        const handleBtnTx = BaseSmartDBFrontEndBtnHandlers.handleBtnDoTransaction_V2_NoErrorControl.bind(BaseSmartDBFrontEndBtnHandlers);
        //--------------------------------------
        await handleBtnDoTransaction_WithErrorControl(ProtocolEntity, TxEnums.PROTOCOL_DEPLOY, 'Deploying Protocol...', 'deploy-tx', fetchParams, txApiCall, handleBtnTx);
        //--------------------------------------
    };
    //--------------------------------------
    async function handleAddScriptTx(protocol: ProtocolEntity) {
        try {
            //--------------------------------------
            if (appStore.isProcessingTx === true) {
                openModal(ModalsEnums.PROCESSING_TX);
                return;
            }
            if (appStore.isProcessingTask === true) {
                openModal(ModalsEnums.PROCESSING_TASK);
                return;
            }
            //--------------------------------------
            setProcessingTxName(TxEnums.SCRIPTS_ADD);
            setShowProcessingTx(true);
            setIsProcessingTx(true);
            setIsConfirmedTx(false);
            setIsFaildedTx(false);
            //--------------------------------------
            setProcessingTxMessage('Adding Protocol Scripts...');
            setProcessingTxHash('');
            openModal(ModalsEnums.PROCESSING_TX);
            //--------------------------------------
            const { lucid, emulatorDB, walletTxParams } = await LucidToolsFrontEnd.prepareLucidFrontEndForTx(walletStore);
            //--------------------------------------
            const protocolWithScripts: ProtocolEntity | undefined = await ProtocolApi.getByIdApi_(protocol._DB_id, {
                ...optionsGetMinimal,
                fieldsForSelect: ProtocolEntity.defaultFieldsAddScriptsTxScript,
            });
            if (protocolWithScripts === undefined) {
                throw `Invalid protocol id`;
            }
            //--------------------------------------
            const txParams: ProtocolAddScriptsTxParams = {
                protocol_id: editItem!._DB_id!,
            };
            //--------------------------------------
            const scriptsToAdd = [
                { hash: protocolWithScripts.fdpProtocolPolicyID_CS, script: protocolWithScripts.fdpProtocolPolicyID_Script },
                { hash: protocolWithScripts.fdpProtocolValidator_Hash, script: protocolWithScripts.fdpProtocolValidator_Script },
                { hash: protocolWithScripts.fdpScriptPolicyID_CS, script: protocolWithScripts.fdpScriptPolicyID_Script },
                { hash: protocolWithScripts.fdpScriptValidator_Hash, script: protocolWithScripts.fdpScriptValidator_Script },
            ];
            //--------------------------------------
            for (let index = 0; index < scriptsToAdd.length; index++) {
                //--------------------------------------
                const scriptToAdd = scriptsToAdd[index];
                //--------------------------------------
                const script_Hash: ScriptHash = scriptToAdd.hash;
                //--------------------------------------
                console.log(`${ProtocolEntity.className()} - handleBtnProtocolAddScriptsTx - Adding Script: ${script_Hash}`);
                //--------------------------------------
                const script = await ScriptApi.getByHashApi(script_Hash);
                if (script !== undefined) {
                    console.log(`${ProtocolEntity.className()} - handleBtnProtocolAddScriptsTx - Skipping script: ${script_Hash}, it's already added`);
                } else {
                    setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Adding ${formatHash(script_Hash)}...`);
                    //--------------------------------------
                    const { txCborHex } = await ScriptApi.addProtocolScriptTxApi(walletTxParams, { script_Hash, ...txParams });
                    //--------------------------------------
                    setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Transaction prepared, waiting for sign to submit...`);
                    //--------------------------------------
                    const txHash = await LucidToolsFrontEnd.signAndSubmitTx(lucid, txCborHex, walletStore.info, emulatorDB, walletStore.swDoNotPromtForSigning);
                    //--------------------------------------
                    setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Transaction submitted, waiting for confirmation...`);
                    setProcessingTxHash(txHash);
                    //--------------------------------------
                    if (await LucidToolsFrontEnd.awaitTx(lucid, txHash)) {
                        console.log(`${ProtocolEntity.className()} - handleBtnProtocolAddScriptsTx - waitForTxConfirmation - Tx confirmed - ${txHash}`);
                        //--------------------------------------
                        setProcessingTxMessage(`Script (${index + 1}/${scriptsToAdd.length}): Syncronizing...`);
                        //--------------------------------------
                        pushSucessNotification(`${ProtocolEntity.className()} Add Script Tx`, txHash, true);
                    } else {
                        console.log(`${ProtocolEntity.className()} - handleBtnProtocolAddScriptsTx - waitForTxConfirmation - Tx not confirmed - ${txHash}`);
                        // throw `Tx not confirmed`
                    }
                    //--------------------------------------
                    if (!isEmulator) {
                        // como estoy haciendo mas de una tx y no quiero hacer todo el proceso de update wallet salvar emulador, si no hacerlo solo una vez al final,
                        // tengo que actualizar al menos las utxos de la wallet aqui de forma manual
                        // espero un poco para que se actualicen las utxos
                        await sleep(TX_PROPAGATION_DELAY_MS);
                    }
                    walletTxParams.utxos = await lucid.wallet().getUtxos();
                    //--------------------------------------
                }
            }
            //--------------------------------------
            pushSucessNotification(`${ProtocolEntity.className()} Add Script Tx`, 'Completed', false);
            //--------------------------------------
            await walletStore.loadWalletData();
            //--------------------------------------
            setIsConfirmedTx(true);
            //--------------------------------------
            onTx();
            //--------------------------------------
            return true;
        } catch (error) {
            const error_explained = explainErrorTx(error);
            console.log(`[${ProtocolEntity.className()}] - handleBtnProtocolAddScriptsTx - Error: ${error_explained}`);
            pushWarningNotification(`${ProtocolEntity.className()} Add Scripts Tx`, error_explained);
            setProcessingTxMessage(error_explained);
            setIsFaildedTx(true);
            return false;
        } finally {
            setIsProcessingTx(false);
            setProcessingTxMessage('');
            setProcessingTxHash('');
        }
    }
    //--------------------------------------
    const handleSyncTaks = async (protocol: ProtocolEntity) => {
        if (appStore.isProcessingTx === true) {
            openModal(ModalsEnums.PROCESSING_TX);
            return;
        }
        if (appStore.isProcessingTask === true) {
            openModal(ModalsEnums.PROCESSING_TASK);
            return;
        }
        if (confirm('Are you sure you want to sync the Protocol?')) {
            //--------------------------------------
            appStore.setProcessingTaskName(TaskEnums.SYNC_PROTOCOL);
            appStore.setShowProcessingTask(true);
            appStore.setIsProcessingTask(true);
            appStore.setIsConfirmedTask(false);
            appStore.setIsFaildedTask(false);
            //--------------------------------------
            appStore.setProcessingTaskMessage('Syncing Protocol...');
            openModal(ModalsEnums.PROCESSING_TASK);
            //--------------------------------------
            try {
                await AddressToFollowFrontEndApiCalls.syncAllApi(true);

                // await ProtocolApi.syncWithAddressApi(ProtocolEntity, protocol.getNet_Address(), protocol.fdpProtocolPolicyID_CS, true);
                // await ProtocolApi.syncWithAddressApi(ScriptEntity, protocol.getNet_Script_Validator_Address(), protocol.fdpScriptPolicyID_CS, true);
                pushSucessNotification(`${ProtocolEntity.className()}`, `${ProtocolEntity.className()} syncronized`, false);
                //--------------------------------------
                appStore.setIsConfirmedTask(true);
                //--------------------------------------
                onTx();
                //--------------------------------------
                return true;
            } catch (error) {
                console.log(`[${ProtocolEntity.className()}] - handleBtnProtocolHooksSync - Error: ${error}`);
                pushWarningNotification(`${ProtocolEntity.className()}`, `Error syncronizing ${ProtocolEntity.className()}: ${error}`);
                appStore.setIsFaildedTask(true);
                return false;
            } finally {
                appStore.setIsProcessingTask(false);
                appStore.setProcessingTaskMessage('');
            }
        }
    };
    //--------------------------------------
    return {
        list,
        editItem,
        view,
        setEditItem,
        setView,
        handleDeployTx,
        handleAddScriptTx,
        handleSyncTaks,
    };
}
