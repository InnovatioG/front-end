//--------------------------------------------------------------

export enum CampaignDatumStatus_Code_Id_Enums {
    CsCreated = 1,
    CsInitialized = 2,
    CsReached = 3,
    CsNotReached = 4,
    CsFailedMilestone = 5,
}

export enum MilestoneDatumStatus_Code_Id_Enums {
    MsCreated = 1,
    MsSuccess = 2,
    MsFailed = 3,
}

//--------------------------------------------------------------

export enum CampaignStatus_Code_Id_Enums {
    NOT_STARTED = 0,
    CREATED = 1,
    SUBMITTED = 2,
    REJECTED = 3,
    APPROVED = 4,
    CONTRACT_CREATED = 5,

    CONTRACT_STARTED = 7,

    CONTRACT_PUBLISHED = 6,

    
    COUNTDOWN = 8,
    FUNDRAISING = 9,
    FINISHING = 10,
    ACTIVE = 11,
    FAILED = 12,
    UNREACHED = 13,
    SUCCESS = 14,
}

export const CampaignsStatus_Code_Ids_For_Investors = [
    CampaignStatus_Code_Id_Enums.COUNTDOWN,
    CampaignStatus_Code_Id_Enums.FUNDRAISING,
    CampaignStatus_Code_Id_Enums.ACTIVE,
    CampaignStatus_Code_Id_Enums.FAILED,
    CampaignStatus_Code_Id_Enums.UNREACHED,
    CampaignStatus_Code_Id_Enums.SUCCESS,
];

//--------------------------------------------------------------

export enum MilestoneStatus_Code_Id_Enums {
    NOT_STARTED = 1,
    STARTED = 2,
    SUBMITTED = 3,
    REJECTED = 4,
    COLLECT = 5,
    FINISHED = 6,
    FAILED = 7,
}

export enum SubmissionStatus_Enums {
    SUBMITTED = 1,
    APPROVED = 2,
    REJECTED = 3,
    FAILED = 4,
}


//--------------------------------------------------------------
