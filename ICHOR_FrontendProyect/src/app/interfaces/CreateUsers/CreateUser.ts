export interface data {
    username: string,
    password: string,
    id_hospitals: Number
}
export interface authCredentials {
    username: string,
    password: string
}
export interface userCreateBody {
    data: data
    authCredentials: authCredentials
}
