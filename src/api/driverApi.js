import api from './client';

export const startDuty = (payload) => api.post('/api/ambulance/duty/start', payload);
export const getAssignedEmergencies = (payload) => api.post('/api/ambulance/emergencies/assigned', payload);
export const acceptEmergency = (id, payload = {}) => api.post(`/api/ambulance/emergency/${id}/accept`, payload);
export const markAtScene = (id, payload = {}) => api.post(`/api/ambulance/emergency/${id}/at-scene`, payload);
export const startTransport = (id, payload = {}) => api.post(`/api/ambulance/emergency/${id}/start-transport`, payload);
export const reachedHospital = (id, payload = {}) => api.post(`/api/ambulance/emergency/${id}/reached-hospital`, payload);
export const completeEmergency = (id, payload = {}) => api.post(`/api/ambulance/emergency/${id}/complete`, payload);
export const updateLocation = (payload) => api.post('/api/ambulance/location/update', payload);

export const getFirstAidQuestions = () => api.get('/api/ambulance/first-aid/questions');
export const getFirstAidOptions = (id) => api.get(`/api/ambulance/emergency/${id}/first-aid/options`);
export const submitFirstAid = (id, payload) => api.post(`/api/ambulance/emergency/${id}/first-aid`, payload);
