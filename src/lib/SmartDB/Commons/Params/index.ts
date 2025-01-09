import { UTxO } from 'lucid-cardano';

export interface ProtocolCreateParams {
    name: string;
    configJson: string;
    uTxO: UTxO;
}

// export interface SellMarketNFTTxParams {
//     token_TN: string;
//     token_CS: string;
//     datumID_CS: string;
//     datumID_TN: string;
//     validatorAddress: string;
//     mintingPolicyID: Script;
//     validatorMarket: Script;
//     priceOfAsset: bigint;
// }
// export interface BuyMarketNFTTxParams {
//     token_TN: string;
//     token_CS: string;
//     datumID_CS: string;
//     datumID_TN: string;
//     marketNft_id: string;
//     sellerAddress: string;
//     mintingPolicyID: Script;
//     validatorMarket: Script;
//     priceOfAsset: bigint;
// }

// export interface WithdrawMarketNFTTxParams {
//     token_TN: string;
//     token_CS: string;
//     datumID_CS: string;
//     datumID_TN: string;
//     marketNft_id: string;
//     mintingPolicyID: Script;
//     validatorMarket: Script;
// }
// export const sellMarketNFTTxParamsSchema = yup.object().shape({
//     token_TN: yup.string().required(),
//     token_CS: yup.string().required(),
//     datumID_CS: yup.string().required(),
//     datumID_TN: yup.string().required(),
//     validatorAddress: yup.string().required(),
//     mintingPolicyID: scriptSchema.required(),
//     validatorMarket: scriptSchema.required(),
//     priceOfAsset: yup.number().required(),
// });

// export const buyMarketNFTTxParamsSchema = yup.object().shape({
//     token_TN: yup.string().required(),
//     token_CS: yup.string().required(),
//     datumID_CS: yup.string().required(),
//     datumID_TN: yup.string().required(),
//     marketNft_id:  yup.string().required(),
//     sellerpayment_pkh:  yup.string().required(),
//     mintingPolicyID: scriptSchema.required(),
//     validatorMarket: scriptSchema.required(),
//     priceOfAsset: yup.number().required(),
// });

// export const withdrawMarketNFTTxParamsSchema = yup.object().shape({
//     token_TN: yup.string().required(),
//     token_CS: yup.string().required(),
//     datumID_CS: yup.string().required(),
//     datumID_TN: yup.string().required(),
//     marketNft_id:  yup.string().required(),
//     mintingPolicyID: scriptSchema.required(),
//     validatorMarket: scriptSchema.required(),
// });
