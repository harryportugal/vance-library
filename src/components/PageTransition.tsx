import { useImperativeHandle, forwardRef, useRef } from 'react';
import { gsap } from 'gsap';

export interface PageTransitionRef {
  play: (middleCallback: () => void) => Promise<void>;
}

interface PageTransitionProps {
  color?: string;
}

export const PageTransition = forwardRef<PageTransitionRef, PageTransitionProps>(
  ({ color = '#ffffff' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      play: (middleCallback: () => void) => {
        return new Promise<void>((resolve) => {
          if (!containerRef.current) {
            middleCallback();
            resolve();
            return;
          }

          // Enable pointer events during transition so user can't click things
          containerRef.current.style.pointerEvents = 'all';

          const blocks = containerRef.current.querySelectorAll('.page-transition-block');
          gsap.killTweensOf(blocks);

          // 1. Cover transition: animate scaleY from 0 to 1
          gsap.set(blocks, { 
            scaleY: 0, 
            visibility: 'visible',
            transformOrigin: (i) => i < 5 ? 'top' : 'bottom' 
          });

          gsap.to(blocks, {
            scaleY: 1,
            duration: 0.65,
            stagger: {
              each: 0.07,
              from: 'start',
              grid: [2, 5],
              axis: 'x',
            },
            ease: 'power4.inOut',
            onComplete: () => {
              // Execute the page/state change mid-way when the screen is fully covered
              middleCallback();

              // 2. Reveal transition: animate scaleY from 1 to 0 (exit blocks)
              // Setting transformOrigin to top and bottom to collapse outwards
              gsap.set(blocks, { 
                transformOrigin: (i) => i < 5 ? 'top' : 'bottom' 
              });

              gsap.to(blocks, {
                scaleY: 0,
                duration: 0.65,
                stagger: {
                  each: 0.07,
                  from: 'start',
                  grid: [2, 5],
                  axis: 'x',
                },
                ease: 'power4.inOut',
                onComplete: () => {
                  // Disable pointer events after transition completes
                  if (containerRef.current) {
                    containerRef.current.style.pointerEvents = 'none';
                    gsap.set(blocks, { visibility: 'hidden' });
                  }
                  resolve();
                },
              });
            },
          });
        });
      },
    }));

    return (
      <div
        ref={containerRef}
        className="fixed inset-0 w-screen h-screen flex flex-col z-[99999] pointer-events-none"
      >
        {/* Row 1 (origin top) */}
        <div className="flex-1 flex">
          {[...Array(5)].map((_, i) => (
            <div
              key={`row-1-${i}`}
              style={{ backgroundColor: color, transform: 'scaleY(0)', willChange: 'transform', visibility: 'hidden' }}
              className="page-transition-block flex-1 origin-top"
            />
          ))}
        </div>
        {/* Row 2 (origin bottom) */}
        <div className="flex-1 flex">
          {[...Array(5)].map((_, i) => (
            <div
              key={`row-2-${i}`}
              style={{ backgroundColor: color, transform: 'scaleY(0)', willChange: 'transform', visibility: 'hidden' }}
              className="page-transition-block flex-1 origin-bottom"
            />
          ))}
        </div>
      </div>
    );
  }
);

PageTransition.displayName = 'PageTransition';
