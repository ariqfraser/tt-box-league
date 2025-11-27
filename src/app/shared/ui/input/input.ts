import { Component, input, inject, forwardRef } from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormsModule,
    NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
} from '@angular/forms';
import { ControlContainer } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Reusable input component that works with reactive forms
 */
@Component({
    selector: 'app-input',
    imports: [ReactiveFormsModule, FormsModule, CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => Input),
            multi: true,
        },
    ],
    templateUrl: './input.html',
    styleUrl: './input.scss',
})
export class Input implements ControlValueAccessor {
    readonly name = input<string>('');
    readonly placeholder = input<string>('');
    readonly label = input<string>('');
    readonly type = input<string>('text');
    readonly controlName = input<string>();

    private controlContainer = inject(ControlContainer);
    protected value = '';
    private onChange: (value: string) => void = (): void => {
        // This function is replaced by registerOnChange
    };
    private onTouched: () => void = (): void => {
        // This function is replaced by registerOnTouched
    };

    /**
     * Gets the form control for this input from the parent form group
     * @returns the form control or null if not found
     */
    get control(): AbstractControl | null {
        return this.controlContainer.control?.get(this.controlName() ?? '') ?? null;
    }

    /**
     * Write a new value to the element
     * @param value - the value to write
     */
    writeValue(value: string): void {
        this.value = value || '';
    }

    /**
     * Set the function to be called when the control value changes
     * @param fn - the change callback function
     */
    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    /**
     * Set the function to be called when the control is touched
     * @param fn - the touched callback function
     */
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /**
     * Handle input change events
     * @param event - the input event
     */
    onInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
    }

    /**
     * Handle input blur events
     */
    onInputBlur(): void {
        this.onTouched();
    }
}
