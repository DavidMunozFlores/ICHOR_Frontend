export interface PatientCreateResponse {
    internalID: string,
    name: string,
    identification: string,
    bloodType: string,
    height: number,
    weight: number,
    idHospital: number
}
export interface PatientAuthCredentials {
    username: string,
    password: string
}
export interface PatientCreateBody {
    auth: PatientAuthCredentials,
    data: PatientCreateResponse
}
