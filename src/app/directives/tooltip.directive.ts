import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appTooltip]',
})
export class TooltipDirective {
  @Input('appTooltip') tooltipTitle: any;
  @Input() placement: string;
  @Input() delay: number;
  @Input() condition: boolean;
  @Input() tooltipClass: string;
  tooltip: HTMLElement;
  offset = 10;
  tooltipInnerHtml: string;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    if (this.condition === undefined || this.condition === null) {
      this.condition = true;
    }
    if (this.tooltipClass === undefined || this.tooltipClass === null) {
      this.tooltipClass = 'ng-tooltip';
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltip && this.condition) {
      this.show();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.tooltip) {
      this.hide();
    }
  }

  show() {
    this.create();
    this.setPosition();
    this.renderer.addClass(this.tooltip, 'ng-tooltip-show');
  }

  hide() {
    this.renderer.removeClass(this.tooltip, 'ng-tooltip-show');
    window.setTimeout(() => {
      this.renderer.removeChild(document.body, this.tooltip);
      this.tooltip = null;
    }, this.delay);
  }

  create() {
    this.tooltip = this.renderer.createElement('div');
    this.renderer.setAttribute(this.tooltip, 'dir', 'auto');
    this.renderer.setProperty(
      this.tooltip,
      'innerHTML',
      `${this.tooltipTitle}`
    );
    this.renderer.appendChild(document.body, this.tooltip);

    this.renderer.addClass(this.tooltip, 'ng-tooltip-global');
    this.renderer.addClass(this.tooltip, `${this.tooltipClass}`);
    this.renderer.setStyle(
      this.tooltip,
      'transition',
      `opacity ${this.delay}ms`
    );
  }

  setPosition() {
    const scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltip.getBoundingClientRect();

    let top, left;

    if (this.placement === 'top') {
      if (hostPos.top - tooltipPos.height < 0) {
        top = hostPos.bottom + this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
      } else {
        top = hostPos.top - tooltipPos.height - this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
      }
    }

    if (this.placement === 'bottom') {
      if (hostPos.bottom + tooltipPos.height > tooltipPos.top) {
        top = hostPos.top - tooltipPos.height - this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
      } else {
        top = hostPos.bottom + this.offset;
        left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;
      }
    }

    if (this.placement === 'left') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.left - tooltipPos.width - this.offset;
    }

    if (this.placement === 'right') {
      top = hostPos.top + (hostPos.height - tooltipPos.height) / 2;
      left = hostPos.right + this.offset;
    }

    this.renderer.setStyle(this.tooltip, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  }
}
