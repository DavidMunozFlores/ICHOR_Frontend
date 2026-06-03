export interface OrganPostResponse {
organType: string,
weightGrams: number,
volumeCC: number,
hla: hlaAllele[],
bloodType: string
}

export interface hlaAllele {
  letter: string,
  allele: string,
  protein: string
}
