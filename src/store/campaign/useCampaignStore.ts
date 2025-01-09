import type { Milestone, User } from '@/HardCode/databaseType';
import { MembersTeam } from '@/HardCode/databaseType';
import {
    addMemberToTeam,
    setBrandFieldAction,
    setCampaignStateAction,
    setMembersTeam,
    setNestedCampaignStateAction,
    setNextStepAction,
    setPrevStepAction,
    updateMemberField,
} from '@/store/campaign/actions';
import { CampaignState, initialState } from '@/store/campaign/initialState';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
interface UseCampaignStore extends CampaignState {
    newMember: MembersTeam;
    setStep: (step: 1 | 2 | 3 | 4) => void;
    setTitle: (title: string) => void;
    setCategory: (category: string) => void;
    setCategoryId: (categoryId: number | null) => void;
    setDescription: (description: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    setUser: (user: User) => void;
    nextStep: () => void;
    prevStep: () => void;
    setCompanyLogo: (companyLogo: string) => void;
    setBanner: (banner: string) => void;
    setGoal: (goal: number) => void;
    setMilestones: (milestones: Milestone[]) => void;
    setMinRequest: (minRequest: number) => void;
    setBrandField: <K extends keyof CampaignState['newCampaign']>(key: K, value: CampaignState['newCampaign'][K]) => void;
    setMembersTeam: (users: MembersTeam[]) => void;
    addMemberToTeam: (member: MembersTeam) => void;
    updateMemberField: <K extends keyof MembersTeam>(key: K, value: MembersTeam[K]) => void;
    setNewMemberField: <K extends keyof MembersTeam>(key: K, value: MembersTeam[K]) => void;
    resetNewMember: () => void;
    selectedMember: MembersTeam | null;
    setSelectedMember: (member: MembersTeam | null) => void;
}

export const useCampaignStore = create<UseCampaignStore>()(
    immer<UseCampaignStore>((set) => ({
        ...initialState,
        selectedMember: null,
        newMember: {
            id: '0',
            editor: false,
            campaign_id: 0,
            member_picture: '',
            name: '',
            last_name: '',
            role: '',
            member_description: '',
            email: '',
            admin: false,
            website: '',
            facebook: '',
            instagram: '',
            discord: '',
            linkedin: '',
            twitter: '',
            member_manage_funds: false,
            wallet_address: '',
        },

        setStep: (step) =>
            set((state) => {
                setCampaignStateAction(state, 'step', step);
            }),
        setTitle: (name) =>
            set((state) => {
                setCampaignStateAction(state, 'name', name);
            }),
        setCategory: (category) =>
            set((state) => {
                setCampaignStateAction(state, 'category', category);
            }),
        setCategoryId: (category_id) =>
            set((state) => {
                setCampaignStateAction(state, 'category_id', category_id);
            }),
        setDescription: (description) =>
            set((state) => {
                setCampaignStateAction(state, 'description', description);
            }),
        setIsLoading: (isLoading) =>
            set((state) => {
                setCampaignStateAction(state, 'isLoading', isLoading);
            }),
        setUser: (user) =>
            set((state) => {
                setCampaignStateAction(state, 'user', user);
            }),
        setCompanyLogo: (companyLogo) =>
            set((state) => {
                setNestedCampaignStateAction(state, 'logo_url', companyLogo);
            }),
        nextStep: () =>
            set((state) => {
                setNextStepAction(state);
            }),
        prevStep: () =>
            set((state) => {
                setPrevStepAction(state);
            }),
        setBanner: (banner) =>
            set((state) => {
                setNestedCampaignStateAction(state, 'banner_url', banner);
            }),
        setGoal: (goal) =>
            set((state) => {
                setNestedCampaignStateAction(state, 'goal', goal);
            }),
        setMilestones: (milestones) =>
            set((state) => {
                setNestedCampaignStateAction(state, 'milestones', milestones);
            }),
        setMinRequest: (minRequest) =>
            set((state) => {
                setNestedCampaignStateAction(state, 'min_request', minRequest);
            }),
        setBrandField: (key, value) =>
            set((state) => {
                setBrandFieldAction(state, key, value);
            }),
        setMembersTeam: (users) =>
            set((state) => {
                setMembersTeam(state, users);
            }),
        addMemberToTeam: (member) =>
            set((state) => {
                addMemberToTeam(state, member);
            }),
        updateMemberField: <K extends keyof MembersTeam>(key: K, value: MembersTeam[K]) =>
            set((state) => {
                updateMemberField(state, state.selectedMember!.id, key, value);
            }),
        setNewMemberField: (key, value) =>
            set((state) => {
                state.newMember[key] = value;
            }),
        setSelectedMember: (member) =>
            set((state) => {
                if (member) {
                    state.newMember = { ...member };
                } else {
                    state.resetNewMember();
                }
                state.selectedMember = member;
            }),

        resetNewMember: () =>
            set((state) => {
                state.newMember = {
                    id: '0',
                    campaign_id: 0,
                    member_picture: '',
                    name: '',
                    last_name: '',
                    role: '',
                    member_description: '',
                    email: '',
                    admin: false,
                    website: '',
                    facebook: '',
                    instagram: '',
                    discord: '',
                    linkedin: '',
                    twitter: '',
                    member_manage_funds: false,
                    wallet_address: '',
                    editor: false,
                };
            }),
    }))
);
