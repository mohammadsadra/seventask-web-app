import {animate, animateChild, group, query, state, style, transition, trigger, stagger, keyframes} from '@angular/animations';

export const listAnimation = 
  trigger('listAnimation', [
    transition('* => *', [ // each time the binding value changes
      query(':enter', [
        style({ opacity: 0 }),
        stagger('35ms', [
          animate('600ms ease-out', style({ opacity: 1 }))
        ])
      ], { optional: true })
    ])
  ]);
export const slideInOut = 
  trigger('slideInOut', [
    transition(
      ':enter',
      [
        style({ width: '0' }),
        animate(
          '{{timingEnter}} ease-in-out',
          style({ width: '{{enterPx}}' })
        ),
      ],
      {
        params: {
          timingEnter: '170ms',
          enterPx: '0'
        },
      }
    ),
    transition(
      ':leave',
      [
        
        style({ width: '{{enterPx}}' }),
        animate(
          '{{timingLeave}} ease-in-out',
          style({ width: '0' })
        ),
      ],
      {
        params: {
          timingLeave: '170ms',
          enterPx: '0'
        },
      }
    ),
  ]);

export const chatAnimation = 
trigger('chatAnimation', [
  state(
    'fadeIn',
    style({
      opacity: '1',
    })
  ),
  transition('void => newMessage', [
    style({ opacity: '0', transform: 'translateY(15px)' }),
    animate('330ms'),
  ]),
  // transition('void => loadMessages', [
  //   style({ opacity: '0' }),
  //   animate('600ms'),
  // ]),
]);

export const listAnimationReversed = 
trigger('listAnimationReversed', [
  transition('* => *', [ // each time the binding value changes
    query(':enter', [
      style({ opacity: 0 }),
      stagger('-40ms', [
        animate('600ms ease-out', style({ opacity: 1 }))
      ])
    ], { optional: true })
  ]),
  transition(':enter', [style({ opacity: '0' }), animate('3s ease-out', style({ opacity: '1' }))]),
]);

  export const listFade = 
  trigger('listFade', [
    transition('* => *', [ // each time the binding value changes
      query(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ], { optional: true })
    ])
  ]);

export const fade = 
 trigger('valueChange', [
      transition('void => *', []),
      transition('* => void', []),
      transition('* => *', [
          animate(330, keyframes([
              style ({ opacity: 0, offset: 0.0 }),
              style ({ opacity: 1, offset: 1.0 }),
          ])),
      ]),
  ]);

export const fadeInOutAnimation =
  trigger('fadeInOut', [
    state('show', style({
      opacity: 1,
    })),
    state('hide', style({
      opacity: 0,
    })),
    transition('show => hide', animate('.33s ease-out')),
    transition('hide => show', animate('.33s ease-in'))
  ]);

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('KanbanPage <=> ProjectPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%' }))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('* <=> FilterPage', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%' })
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('4000ms ease-out', style({ left: '100%' }))
        ]),
        query(':enter', [
          animate('5000ms ease-out', style({ left: '0%' }))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('SignInPage => ForgetPasswordPage', [
      transition(':leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          opacity: '1'
        }),
        animate('.3s ease-out', style({ opacity: 0 })),
        animateChild()
      ]),
      query(':enter', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          opacity: '0'
        }),
        animate('.3s ease-in', style({ opacity: 1 })),
        animateChild()
      ]),
    ])
  ]);
