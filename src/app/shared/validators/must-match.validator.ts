import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const mustMatchValidator = (...controlNames: string[]): ValidatorFn => {
    return (control: AbstractControl): ValidationErrors | null => {
        const values = controlNames.map((name) => control.get(name)?.value);

        // Only validate if all controls have values
        if (values.some((value) => !value)) {
            return null;
        }

        const allMatch = values.every((value) => value === values[0]);

        return allMatch ? null : { mustMatch: { controlNames } };
    };
};
