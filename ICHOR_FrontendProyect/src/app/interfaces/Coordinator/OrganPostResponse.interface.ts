export interface OrganPostResponse {
organType: string,
weightGrams: number,
volumeCC: number,
hla: hlaAllele[]
}

interface hlaAllele {
  letter: string,
  allele: string,
  protein: string
}
