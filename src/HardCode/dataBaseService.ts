import database from './database.json';

const LOCAL_STORAGE_KEY = 'campaignData';

export const dataBaseService = {
  initializeData: () => {
    if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(database));
    }
  },

  getData: () => {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  },

  updateData: (newData: any) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newData));
  },

  createCampaign: (campaign: any) => {
    const data = dataBaseService.getData();
    const newCampaign = {
      ...campaign,
      id: data.campaigns.length + 1,
      create_at: Date.now().toString(),
      updated_at: Date.now().toString(),
    };
    data.campaigns.push(newCampaign);
    dataBaseService.updateData(data);
    return newCampaign;
  },

  updateCampaign: (id: number, updates: any) => {
    const data = dataBaseService.getData();
    const index = data.campaigns.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      data.campaigns[index] = {
        ...data.campaigns[index],
        ...updates,
        updated_at: Date.now().toString(),
      };
      dataBaseService.updateData(data);
      return data.campaigns[index];
    }
    return null;
  },

  deleteCampaign: (id: number) => {
    const data = dataBaseService.getData();
    const index = data.campaigns.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      data.campaigns.splice(index, 1);
      dataBaseService.updateData(data);
      return true;
    }
    return false;
  },


};