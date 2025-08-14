import {Directive, Input, Output, AfterViewInit, OnChanges, OnDestroy, ElementRef} from '@angular/core';
import {fromEvent, Observable, Subject, BehaviorSubject} from 'rxjs';
import {takeUntil, debounceTime, map} from 'rxjs/operators';

declare global {
  interface Window {
    ResizeObserver: any;
  }
}
@Directive({
  selector: '[appScrollToBottom]'
})

export class ScrollToBottomDirective implements AfterViewInit, OnChanges, OnDestroy {

  @Input('stayAtBottom') stayAtBottom: boolean = true;
  @Input('scrollNow$s') scrollNow: Subject<any> = new Subject();
  @Output('amScrolledToBottom') amScrolledToBottom: Observable<boolean> = new Observable();

  private destroy$ = new Subject();
  private changes: MutationObserver;

  private scrollEvent: Observable<{}>;
  private mutations = new BehaviorSubject(null);
  private _userScrolledUp = new BehaviorSubject<boolean>(false);

  constructor(private self: ElementRef) {
  }

  public ngOnChanges() {
    if (this.stayAtBottom === true) {
      this.scrollToBottom();
    }
  }

  public ngAfterViewInit() {
    this.registerScrollHandlers();
  }

  public ngOnDestroy() {
    this.destroy$.next(null);
    if (this.changes != null) {
      this.changes.disconnect();
    }
  }

  private registerScrollHandlers() {
    this.amScrolledToBottom = this._userScrolledUp.pipe(takeUntil(this.destroy$), map(x => !x));

    new MutationObserver(() => this.mutations.next(null))
      .observe(this.self.nativeElement, {
        attributes: true,
        childList: true,
        characterData: true
      });

    this.scrollEvent = fromEvent(this.self.nativeElement, 'scroll')
      .pipe(takeUntil(this.destroy$), debounceTime(100));

    this.scrollNow.pipe(takeUntil(this.destroy$)).subscribe(x => {
      this.scrollToBottom();
    });

    this.mutations.pipe(takeUntil(this.destroy$)).subscribe(x => {
      if (this._userScrolledUp.value === false) {
        this.scrollToBottom();
      }
    });

    this.scrollEvent.pipe(takeUntil(this.destroy$)).subscribe(x => {
      // this.setHasUserScrolledUp();
    });
  }

  private setHasUserScrolledUp() {

    // If currently at bottom, user not scrolled up;
    const el = this.self.nativeElement;
    if (el.scrollHeight === el.clientHeight + el.scrollTop === true) {
      this._userScrolledUp.next(false);
      return;
    }

    // If, already userScrolledUp, nothing to do.
    if (this._userScrolledUp.value === true) {
      return;
    }

    // Not at bottom, is caused by mutation or user?
    // Assume mutation will scroll within 5ms.
    setTimeout(() => {
      if (el.scrollHeight === el.clientHeight + el.scrollTop === false) {
        this._userScrolledUp.next(true);
      }
    }, 5);
  }

  private scrollToBottom() {
    setTimeout(() => this.self.nativeElement.scrollTop = this.self.nativeElement.scrollHeight, 0);
  }


}
