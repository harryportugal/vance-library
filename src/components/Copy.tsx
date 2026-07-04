import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface CopyProps {
  children: React.ReactNode;
  animateOnScroll?: boolean;
  delay?: number;
}

export default function Copy({ children, animateOnScroll = true, delay = 0 }: CopyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const words = containerRef.current.querySelectorAll('.reveal-word-inner');
      if (words.length === 0) return;

      // Group words into lines based on their vertical positions
      const rects = Array.from(words).map((el) => el.getBoundingClientRect().top);
      const uniqueTops: number[] = [];
      rects.forEach((top) => {
        if (!uniqueTops.some((ut) => Math.abs(ut - top) < 8)) {
          uniqueTops.push(top);
        }
      });
      uniqueTops.sort((a, b) => a - b);

      gsap.set(words, { y: '115%' });

      const staggerFn = (_index: number, target: Element) => {
        const top = target.getBoundingClientRect().top;
        const lineIdx = uniqueTops.findIndex((ut) => Math.abs(ut - top) < 8);
        const safeLineIdx = lineIdx >= 0 ? lineIdx : 0;
        return delay + safeLineIdx * 0.12; // 0.12s delay between lines
      };

      const animationProps = {
        y: '0%',
        duration: 1.1,
        stagger: staggerFn,
        ease: 'power4.out',
      };

      if (animateOnScroll) {
        gsap.to(words, {
          ...animationProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 88%',
            once: true,
          },
        });
      } else {
        gsap.to(words, animationProps);
      }
    },
    { scope: containerRef, dependencies: [animateOnScroll, delay] }
  );

  // Helper to split a raw text string into words wrapped in masking divs
  const splitText = (text: string) => {
    return text.split(' ').map((word, idx, arr) => {
      if (word === '') return null;
      const isLast = idx === arr.length - 1;
      return (
        <span key={idx} className="inline-flex overflow-hidden pb-[0.15em] -mb-[0.15em]">
          <span className="reveal-word-inner inline-block translate-y-[115%] will-change-transform">
            {word}
          </span>
          {!isLast && <span className="inline-block">&nbsp;</span>}
        </span>
      );
    });
  };

  // Helper to recursively traverse children and split text nodes
  const renderChildren = (node: React.ReactNode): React.ReactNode => {
    return React.Children.map(node, (child) => {
      if (typeof child === 'string') {
        return splitText(child);
      }
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<any>;
        return React.cloneElement(element, {
          ...element.props,
          children: renderChildren(element.props.children),
        });
      }
      return child;
    });
  };

  return (
    <div ref={containerRef} className="w-full">
      {renderChildren(children)}
    </div>
  );
}
