import { Injectable } from '@angular/core';
import { debounceTime, fromEvent, map, Observable, startWith, throttleTime } from 'rxjs';

export const enum pageWidth {
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
}
export const enum deviceMaxWitdh {
  MOBILE = 767,
  TABLET = 1199,
}

export interface IPageWidth {
  device: pageWidth;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PageWidthService {
  pageWidth$: Observable<IPageWidth> = fromEvent(window, 'resize').pipe(
    startWith(0),
    map(() => window),
    throttleTime(100),
    debounceTime(300),
    map((window: Window) => {
      if (window.innerWidth > deviceMaxWitdh.TABLET) {
        return { device: pageWidth.DESKTOP, isMobile: false, isTablet: false, isDesktop: true };
      }
      if (window.innerWidth > deviceMaxWitdh.MOBILE) {
        return { device: pageWidth.TABLET, isMobile: false, isTablet: true, isDesktop: false };
      }
      return { device: pageWidth.MOBILE, isMobile: true, isTablet: false, isDesktop: false };
    }),
  );
}
