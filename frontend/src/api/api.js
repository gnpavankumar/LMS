import axiosInstance from './axiosInstance';

// Book Catalog Endpoints
export const getBooks = () => axiosInstance.get('books/');
export const getBookDetails = (id) => axiosInstance.get(`books/${id}/`);
export const createBook = (bookData) => axiosInstance.post('books/', bookData);
export const updateBook = (id, bookData) => axiosInstance.patch(`books/${id}/`, bookData);
export const deleteBook = (id) => axiosInstance.delete(`books/${id}/`);
export const bulkUploadBooks = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('books/bulk_upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// Lending and Fines Endpoints
export const getLendingRecords = () => axiosInstance.get('lending/');
export const getLendingRecordDetails = (id) => axiosInstance.get(`lending/${id}/`);
export const lendBook = (data) => axiosInstance.post('lending/lend/', data);
export const returnBook = (id) => axiosInstance.post(`lending/${id}/return/`);

// Reservation Endpoints
export const getReservations = () => axiosInstance.get('reservations/');
export const reserveBook = (data) => axiosInstance.post('reservations/reserve/', data);
export const cancelReservation = (id) => axiosInstance.post(`reservations/${id}/cancel/`);

export const loginUser = (credentials) => axiosInstance.post('auth/token/', credentials);
export const registerUser = (userData) => axiosInstance.post('auth/register/', userData);
export const logoutUser = (refreshToken) => axiosInstance.post('auth/logout/', { refresh: refreshToken });
export const getUserProfile = () => axiosInstance.get('auth/users/me/');
export const getMemberDashboard = () => axiosInstance.get('auth/member-dashboard/');
export const getLibrarianDashboard = () => axiosInstance.get('auth/librarian-dashboard/');
export const getAdminDashboard = () => axiosInstance.get('auth/admin-dashboard/');