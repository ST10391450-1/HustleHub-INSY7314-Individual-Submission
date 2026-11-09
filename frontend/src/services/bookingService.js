import api from './api';

export const getMyClientBookings = async () => {
    const response = await api.get('/bookings/mine/client');
    return response.data.data;
};

export const createBooking = async (gigId) => {
    const response = await api.post('/bookings', {
        gigId
    });

    return response.data;
};
