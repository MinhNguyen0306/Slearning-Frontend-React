export interface ApiResponse {
    message: string,
    status: 'failed' | 'success' | 'valid' | 'rejected' | 'accepted' | 'error'
}