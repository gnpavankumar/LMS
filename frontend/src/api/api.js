import axiosInstance from './axiosInstance';

// Book Catalog Endpoints
export const getBooks = (params = {}) => axiosInstance.get('books/books/', { params });
export const getBookDetails = (id) => axiosInstance.get(`books/books/${id}/`);
export const createBook = (bookData) => axiosInstance.post('books/books/', bookData);
export const updateBook = (id, bookData) => axiosInstance.patch(`books/books/${id}/`, bookData);
export const deleteBook = (id) => axiosInstance.delete(`books/books/${id}/`);
export const bulkUploadBooks = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('books/books/bulk_upload/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
// Book Request Endpoints
export const getBookRequests = () => axiosInstance.get('requests/book-requests/');
export const createBookRequest = (book_id) => axiosInstance.post('requests/book-requests/', { book_id });
export const fulfillRequest = (id) => axiosInstance.post(`requests/book-requests/${id}/fulfill/`);
export const cancelBookRequest = (id) => axiosInstance.post(`requests/book-requests/${id}/cancel/`);

// Lending and Fines Endpoints
export const getLendingRecords = () => axiosInstance.get('lending/lending-records/');
export const getLendingRecordDetails = (id) => axiosInstance.get(`lending/lending-records/${id}/`);
export const lendBook = (data) => axiosInstance.post('lending/lending-records/lend/', data);
export const returnBook = (id) => axiosInstance.post(`lending/lending-records/${id}/return/`);

// Reservation Endpoints
export const getReservations = () => axiosInstance.get('reservations/reservations/');
export const reserveBook = (data) => axiosInstance.post('reservations/reservations/reserve/', data);
export const cancelReservation = (id) => axiosInstance.post(`reservations/reservations/${id}/cancel/`);

// User and Authentication Endpoints
export const loginUser = (credentials) => axiosInstance.post('auth/token/', credentials);
export const registerUser = (userData) => axiosInstance.post('auth/register/', userData);
export const logoutUser = (refreshToken) => axiosInstance.post('auth/logout/', { refresh: refreshToken });
export const getUserProfile = () => axiosInstance.get('auth/users/me/'); 
export const updateUserProfile = (id, userData) => axiosInstance.patch(`auth/users/${id}/`, userData);
export const getMemberDashboard = () => axiosInstance.get('auth/member-dashboard/');
export const getLibrarianDashboard = () => axiosInstance.get('auth/librarian-dashboard/');
export const getAdminDashboard = () => axiosInstance.get('auth/admin-dashboard/');