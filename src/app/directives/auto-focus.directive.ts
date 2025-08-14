import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[autofocus]'
})
export class AutoFocusDirective implements OnInit{

  constructor(public elementRef: ElementRef) { }
  ngOnInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
    });
  }
}
