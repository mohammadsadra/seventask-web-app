import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[autoSelect]'
})
export class AutoSelectDirective implements OnInit {

  constructor(public elementRef: ElementRef) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.elementRef.nativeElement.select();
    });
  }
}
