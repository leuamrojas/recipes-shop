import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {

  @HostBinding('class.open') isOpen = false; //whenever it switches to true, the class 'open' will be attached. If false, it will be removed

  @HostListener('click') toggleOpen() {
    this.isOpen = !this.isOpen;
  }

}

// Replace the DropdownDirective class with this to make the dropdown close when clickng anywhere outside it 
// (placing the listener not on the dropdown, but on the document)
// export class DropdownDirective {
//   @HostBinding('class.open') isOpen = false;
//   @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
//     this.isOpen = this.elRef.nativeElement.contains(event.target) ? !this.isOpen : false;
//   }
//   constructor(private elRef: ElementRef) {}
// }
