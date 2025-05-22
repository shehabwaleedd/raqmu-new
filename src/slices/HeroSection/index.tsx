'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import useEmblaCarousel, { UseEmblaCarouselType } from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import TransitionLink from '@/animation/transitionLink';
import { usePerformanceDetection } from '@/hooks/usePerformanceDetection';
import type { LinkToMediaField, ImageField } from '@prismicio/client';

export type HeroSectionProps = SliceComponentProps<Content.HeroSectionSlice>;

type MediaField = LinkToMediaField | ImageField | null | undefined;

const TWEEN_FACTOR_BASE = 0.2;

const HeroSection: React.FC<HeroSectionProps> = ({ slice }) => {
  const { shouldReduceMotion } = usePerformanceDetection();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<Map<number, HTMLDivElement>>(new Map());
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const slideRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const isScrolling = useRef(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: shouldReduceMotion ? 0 : 30,
      dragFree: true
    },
    [Autoplay({ delay: 10000, stopOnInteraction: false })]
  );

  const setTweenNodes = useCallback((emblaApi: UseEmblaCarouselType[1] | undefined): void => {
    if (!emblaApi) return;
    tweenNodes.current = new Map(
      emblaApi.slideNodes().map((slideNode: HTMLElement, index: number) => {
        const layer = slideNode.querySelector('.parallax-layer') as HTMLDivElement;
        return [index, layer];
      })
    );
  }, []);

  const setTweenFactor = useCallback((emblaApi: UseEmblaCarouselType[1] | undefined) => {
    if (!emblaApi) return;
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback(
    (emblaApi: UseEmblaCarouselType[1] | undefined, eventName?: string) => {
      if (!emblaApi) return;
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();
      const isScrollEvent = eventName === 'scroll';

      emblaApi.scrollSnapList().forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = engine.slideRegistry[snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem: { index: number; target: () => number }) => {
              const target = loopItem.target();

              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);

                if (sign === -1) {
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                }
                if (sign === 1) {
                  diffToTarget = scrollSnap + (1 - scrollProgress);
                }
              }
            });
          }

          const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
          const tweenNode = tweenNodes.current.get(slideIndex);
          if (tweenNode) {
            tweenNode.style.transform = `translateX(${translate}%)`;
          }
        });
      });
    },
    []
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    setSelectedIndex(currentIndex);

    const autoplay = emblaApi.plugins().autoplay;
    if (autoplay) {
      autoplay.stop();
      autoplay.play();
    }
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (!emblaApi) return;
    isScrolling.current = true;
    emblaApi.scrollTo(index);

    setTimeout(() => {
      isScrolling.current = false;
    }, 30);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => {
    if (!emblaApi || isScrolling.current) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    const totalSlides = emblaApi.scrollSnapList().length;
    const prevIndex = currentIndex === 0 ? totalSlides - 1 : currentIndex - 1;
    scrollTo(prevIndex);
  }, [emblaApi, scrollTo]);

  const scrollNext = useCallback(() => {
    if (!emblaApi || isScrolling.current) return;
    const currentIndex = emblaApi.selectedScrollSnap();
    const totalSlides = emblaApi.scrollSnapList().length;
    const nextIndex = currentIndex === totalSlides - 1 ? 0 : currentIndex + 1;
    scrollTo(nextIndex);
  }, [emblaApi, scrollTo]);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('select', onSelect);

    return () => {
      emblaApi
        .off('reInit', setTweenNodes)
        .off('reInit', setTweenFactor)
        .off('reInit', tweenParallax)
        .off('scroll', tweenParallax)
        .off('select', onSelect);
    };
  }, [emblaApi, tweenParallax, onSelect]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (index === selectedIndex) {
        video.play().catch(console.error);
      } else {
        video.pause();
      }
    });
  }, [selectedIndex]);

  const setVideoRef = (index: number) => (el: HTMLVideoElement | null) => {
    if (el) {
      videoRefs.current.set(index, el);
    } else {
      videoRefs.current.delete(index);
    }
  };

  const setSlideRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) {
      slideRefs.current.set(index, el);
    } else {
      slideRefs.current.delete(index);
    }
  };

  const getMediaUrl = (field: MediaField): string => {
    if (!field) return '';

    if ('link_type' in field && field.link_type === 'Media') {
      return field.url || '';
    }

    if ('url' in field && field.url) {
      return field.url;
    }

    return '';
  };

  const slides = slice.primary.slides || [];

  if (slides.length === 0) {
    return null;
  }

  return (
    <section 
      className="relative h-screen min-h-[600px] overflow-hidden bg-title medium-tablet:h-[70vh] medium-tablet:min-h-[500px]" 
      data-slice-type={slice.slice_type}
    >
      <div className="h-full overflow-hidden relative" ref={emblaRef}>
        <div className="flex flex-row justify-start items-start h-full">
          {slides.map((slide, index) => (
            <div key={index} className="flex-none flex-[0_0_100%] min-w-0 relative h-full">
              <div
                className={`relative h-full w-full overflow-hidden ${index === selectedIndex ? 'active' : ''}`}
                ref={setSlideRef(index)}
              >
                <div className="absolute inset-0 z-[1] overflow-hidden">
                  <div className="parallax-layer relative h-full w-full flex justify-center">
                    {slide.slide_type === 'video' && slide.background_video ? (
                      <video
                        ref={setVideoRef(index)}
                        className="w-full h-full object-cover object-center scale-[1.02] flex-none flex-[0_0_115%] max-w-none"
                        src={getMediaUrl(slide.background_video)}
                        poster={getMediaUrl(slide.video_poster) || getMediaUrl(slide.background_image) || ''}
                        muted
                        loop
                        playsInline
                        preload="metadata"
                      />
                    ) : slide.background_image ? (
                      <Image
                        src={getMediaUrl(slide.background_image)}
                        alt={slide.background_image.alt || slide.heading || ''}
                        fill
                        className="object-cover flex-none flex-[0_0_115%] max-w-none"
                        priority={index === 0}
                        sizes="100vw"
                        quality={90}
                      />
                    ) : null}
                  </div>

                  <div
                    className="absolute inset-0 z-[2]"
                    style={{ 
                      opacity: (slide.overlay_opacity || 40) / 100,
                      background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.7) 0%, rgba(30, 30, 30, 0.4) 50%, rgba(30, 30, 30, 0.2) 100%)'
                    }}
                  />
                </div>

                <div className={`absolute inset-0 z-[3] flex flex-col justify-end items-start p-5xl large-tablet:p-xl medium-tablet:p-lg ${slide.text_color === 'dark' ? 'theme-dark' : 'theme-light'}`}>
                  <div className="max-width-[600px] flex flex-col justify-start items-start gap-lg medium-tablet:max-w-full medium-tablet:gap-md">
                    <AnimatePresence mode="wait">
                      {selectedIndex === index && (
                        <motion.div
                          key={`slide-${index}-${selectedIndex}`}
                          initial={{ opacity: 0, y: 60 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -60 }}
                          transition={{
                            duration: shouldReduceMotion ? 0.1 : 0.8,
                            ease: [0.16, 1, 0.3, 1]
                          }}
                        >
                          {slide.subheading && (
                            <motion.h2
                              className={`font-body text-lg font-normal m-0 tracking-[0.02em] leading-[1.4] medium-tablet:text-base ${
                                slide.text_color === 'dark' 
                                  ? 'text-title/70' 
                                  : 'text-white/80'
                              }`}
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: shouldReduceMotion ? 0 : 0.2,
                                duration: shouldReduceMotion ? 0.1 : 0.6
                              }}
                            >
                              {slide.subheading}
                            </motion.h2>
                          )}

                          {slide.heading && (
                            <motion.h1
                              className={`font-title text-[clamp(2.5rem,5vw,4rem)] font-thick m-0 leading-[1.1] tracking-[-0.02em] medium-tablet:text-[clamp(2rem,8vw,3rem)] ${
                                slide.text_color === 'dark' 
                                  ? 'text-title' 
                                  : 'text-white'
                              }`}
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: shouldReduceMotion ? 0 : 0.4,
                                duration: shouldReduceMotion ? 0.1 : 0.6
                              }}
                            >
                              {slide.heading}
                            </motion.h1>
                          )}

                          {slide.cta_text && slide.cta_link && (
                            <motion.div
                              initial={{ opacity: 0, y: 40 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: shouldReduceMotion ? 0 : 0.6,
                                duration: shouldReduceMotion ? 0.1 : 0.6
                              }}
                            >
                              <TransitionLink
                                href={slide.cta_link}
                                className={`font-medium text-base font-bold p-md px-xl rounded-sm border-2 cursor-pointer transition-all duration-normal ease-secondary no-underline inline-flex items-center justify-center min-w-[160px] relative overflow-hidden medium-tablet:p-sm medium-tablet:px-lg medium-tablet:text-sm medium-tablet:min-w-[140px] hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none ${
                                  slide.text_color === 'dark'
                                    ? 'bg-title text-white border-title hover:bg-transparent hover:text-title hover:border-title'
                                    : 'bg-white text-title border-white hover:bg-transparent hover:text-white hover:border-white'
                                }`}
                              >
                                {slide.cta_text}
                              </TransitionLink>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button 
            className="fixed top-1/2 -translate-y-1/2 left-xl w-[60px] h-[60px] rounded-full bg-white/15 backdrop-blur-[10px] border border-white/20 text-white cursor-pointer transition-all duration-normal ease-out flex-center-row z-[100] large-tablet:left-lg medium-tablet:w-[50px] medium-tablet:h-[50px] medium-tablet:hidden hover:bg-white/25 hover:-translate-y-1/2 hover:scale-110 active:-translate-y-1/2 active:scale-95 motion-reduce:transition-none phone:hidden" 
            onClick={scrollPrev} 
            aria-label="Previous slide"
          >
            <svg className="w-7 h-7 medium-tablet:w-6 medium-tablet:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M15 18l-6-6 6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button 
            className="fixed top-1/2 -translate-y-1/2 right-xl w-[60px] h-[60px] rounded-full bg-white/15 backdrop-blur-[10px] border border-white/20 text-white cursor-pointer transition-all duration-normal ease-out flex-center-row z-[100] large-tablet:right-lg medium-tablet:w-[50px] medium-tablet:h-[50px] medium-tablet:hidden hover:bg-white/25 hover:-translate-y-1/2 hover:scale-110 active:-translate-y-1/2 active:scale-95 motion-reduce:transition-none phone:hidden" 
            onClick={scrollNext} 
            aria-label="Next slide"
          >
            <svg className="w-7 h-7 medium-tablet:w-6 medium-tablet:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M9 18l6-6-6-6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}
    </section>
  );
};

export default HeroSection;