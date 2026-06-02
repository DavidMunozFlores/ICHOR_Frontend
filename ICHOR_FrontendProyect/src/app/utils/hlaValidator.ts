import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";



export function hlaStringValidator(): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {

    const controlValue: string = control.value;
    if (!controlValue || controlValue.trim() === '') {
      return null;
    }


    const GENS = ['A', 'B', 'DRB1'];
    const HLA_ALLELE_PATTERN = /^[A-Z0-9\-]+:[0-9]{2,3}:[0-9]{2,3}$/;

    const alleles = controlValue
      .split(/[\s,;]+/)
      .map((allele: string) => allele.trim())
      .filter((allele: string) => allele !== '');

    if (alleles.length === 0) {
      return { hlaInvalid: { message: 'There are no alleles valid.' } };
    }

    const genGroupsCount: Record<string, number> = {};
    const uniqueAlleles = new Set<string>();

    for (const allele of alleles) {
      if (!HLA_ALLELE_PATTERN.test(allele)) {
        return {
          hlaInvalid: {
            message: `The allele ${allele} does not have a valid format. (Ex: A:02:01)`
          }
        };
      }


      if(uniqueAlleles.has(allele)){
        return{
          hlaInvalid: {
            message: `The allele ${allele} is introduced two times. It must not be equals.`
          }
        }
      }

      uniqueAlleles.add(allele);

      const genName = allele.split(':')[0];

      if(genGroupsCount[genName]){
        genGroupsCount[genName] += 1;
      }else{
        genGroupsCount[genName] = 1;
      }


    }


    for(const geneName in genGroupsCount) {
      if(genGroupsCount[geneName] !== 2){
        return{
          hlaInvalid: {
            message: `The gene ${geneName} has been introduced ${genGroupsCount[geneName]} time/s. It must be only 2 times.`
          }
        }
      }
    }


    for(const mandatoryGene of GENS){
      if(!genGroupsCount[mandatoryGene] || genGroupsCount[mandatoryGene] === 0){
        return {
          hlaInvalid: {
            message: `It is necessary to include the gen ${mandatoryGene}`
          }
        };
      }
    }

    return null;
  }
}
