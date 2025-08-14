import { Directive, ElementRef, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appHoverClass]'
})
export class HoverClassDirective implements OnChanges {
  @Input('active') isActivated: boolean;
  isHovered = false;

  constructor(public el: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    for (const property in changes) {
      if (property === 'isActivated' && changes[property].currentValue !== null) {
        this.isActivated = changes[property].currentValue;
        if (this.isActivated && !this.isHovered) {
          this.addAcitvatedClass();
        } else if (!this.isActivated && !this.isHovered) {
          this.removeAcitvatedClass();
        }
      }
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.isHovered = false;
    if (this.isActivated && !this.isHovered) {
      this.addAcitvatedClass();
    } else if (!this.isActivated && !this.isHovered) {
      this.removeAcitvatedClass();
    }
  }
  @HostListener('mouseenter') onMouseEnter() {
    this.isHovered = true;
  }
  
  addAcitvatedClass() {
    this.el.nativeElement.classList.add('activated');
  }

  removeAcitvatedClass() {
    this.el.nativeElement.classList.remove('activated');
  }

}
