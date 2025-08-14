import { Directive, ElementRef, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appAutoScrollToTask]'
})
export class AutoScrollToTaskDirective implements OnChanges {

  @Input('selectedTaskId') selectedTaskId: number;
  @Input('dropped') dropped;

  constructor(public el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const property in changes) {
      if (changes.hasOwnProperty(property)) {
        const newValue = changes[property].currentValue;
        switch (property) {
          case 'dropped':
            this.dropped = newValue;
            break;
        }
      }
    }
    let selectedTask = this.el.nativeElement.querySelector('#Task'+this.selectedTaskId);    
    if (selectedTask !== null && this.dropped) {
      if (selectedTask.offsetTop - this.el.nativeElement.offsetTop + selectedTask.offsetHeight> this.el.nativeElement.offsetHeight
        || selectedTask.offsetTop < this.el.nativeElement.scrollTop ) {
        this.el.nativeElement.scrollTop = selectedTask.offsetTop - this.el.nativeElement.offsetTop;
      }
    }
  }
}
