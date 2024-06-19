import { Directive, ElementRef, HostListener, Renderer2, ForwardRefFn } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appDateInputConverter]',
  standalone: true
})
export class DateInputConverterDirective implements ControlValueAccessor {

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(private elementRef: ElementRef, private renderer: Renderer2) { }

  writeValue(value: any): void {
    if (value) {
      const date = new Date(value);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', `${day}-${month}-${year}`);
    } else {
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', '');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const [day, month, year] = value.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    this.onChange(date);
  }
}
