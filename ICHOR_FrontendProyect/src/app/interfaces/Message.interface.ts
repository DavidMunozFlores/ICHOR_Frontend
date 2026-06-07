export interface Message {
    id: number,
    message: string,
    type: 'info' | 'error' | 'warning' | 'success'
}
