import { CampaignState } from '@/store/campaign/initialState';
import type { User } from '@/HardCode/databaseType';
import type { MembersTeam } from '@/store/campaign/initialState';

type CampaignStateKey = keyof CampaignState;

export const setCampaignStateAction = <K extends CampaignStateKey>(state: CampaignState, key: K, value: CampaignState[K]) => {
    state[key] = value;
};

export const setNestedCampaignStateAction = <K extends keyof CampaignState['newCampaign']>(state: CampaignState, key: K, value: CampaignState['newCampaign'][K]) => {
    state.newCampaign[key] = value;
};

export const setBrandFieldAction = <K extends keyof CampaignState['newCampaign']>(state: CampaignState, key: K, value: CampaignState['newCampaign'][K]) => {
    state.newCampaign[key] = value;
};

export const setMembersTeam = (state: CampaignState, users: MembersTeam[]) => {
    state.newCampaign.members_team = users;
};
export const addMemberToTeam = (state: CampaignState, member: MembersTeam) => {
    state.newCampaign.members_team.push(member);
};

export const updateMemberField = <K extends keyof MembersTeam>(state: CampaignState, memberId: number, key: K, value: MembersTeam[K]) => {
    const member = state.newCampaign.members_team.find((m) => m.id === memberId);
    if (member) {
        member[key] = value;
    }
};

export const setNextStepAction = (state: CampaignState) => {
    state.step = (state.step + 1) as 1 | 2 | 3 | 4;
};

export const setPrevStepAction = (state: CampaignState) => {
    state.step = (state.step - 1) as 1 | 2 | 3 | 4;
};

export const setGotal = (state: CampaignState, goal: number) => {
    state.newCampaign.goal = goal;
};
