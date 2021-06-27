// import the required animation functions from the angular animations module
import { trigger, animate, transition, style } from '@angular/animations';

// Based on: https://jasonwatmore.com/post/2019/11/04/angular-8-router-animation-tutorial-example

export const fadeInAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('fadeInAnimation', [

    // route 'enter' transition
    transition(':enter', [

      // css styles at start of transition
      style({ opacity: 0 }),

      // animation and styles at end of transition
      animate('1s', style({ opacity: 1 }))
    ]),
  ]);
