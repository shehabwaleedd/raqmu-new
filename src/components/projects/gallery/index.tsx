'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryProps {
    images: Content.ProjectPostDocumentDataGalleryImagesItem[];
}

interface ThumbProps {
    selected: boolean;
    image: Content.ProjectPostDocumentDataGalleryImagesItem;
    onClick: () => void;
    index: number;
}

const Thumb: React.FC<ThumbProps> = ({ selected, image, onClick, index }) => (
    <div className={`border-2px border-black bg-white transition-all duration-200 ${selected ? 'bg-black' : 'hover:bg-gray-50'}`}>
        <button onClick={onClick} className="w-full h-full p-2" type="button">
            <div className="aspect-square relative overflow-hidden border-2px border-black">
                <PrismicNextImage field={image.image} sizes="(max-width: 768px) 15vw, 10vw" fill className="object-cover" />
            </div>
            <div className="p-2">
                <div className={`text-xs font-bold uppercase tracking-wider ${selected ? 'text-white' : 'text-black'}`}>
                    {String(index + 1).padStart(2, '0')}
                </div>
            </div>
        </button>
    </div>
);

export default function Gallery({ images }: GalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    const [emblaMainRef, emblaMainApi] = useEmblaCarousel({
        loop: false,
        align: 'center',
    });
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true,
        loop: false,
    });

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    const openModal = useCallback((index: number) => {
        setModalImageIndex(index);
        setModalOpen(true);
        document.body.style.overflow = 'hidden';
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        document.body.style.overflow = 'unset';
    }, []);

    const goToNext = useCallback(() => {
        if (modalImageIndex < images.length - 1) {
            setModalImageIndex(modalImageIndex + 1);
        }
    }, [modalImageIndex, images.length]);

    const goToPrev = useCallback(() => {
        if (modalImageIndex > 0) {
            setModalImageIndex(modalImageIndex - 1);
        }
    }, [modalImageIndex]);

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();
        emblaMainApi.on('select', onSelect).on('reInit', onSelect);
    }, [emblaMainApi, onSelect]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!modalOpen) return;

            switch (event.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
                case 'ArrowLeft':
                    goToPrev();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [modalOpen, closeModal, goToNext, goToPrev]);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <>
            <div className="w-full bg-white border-2px border-black font-helvetica">
                <div className="border-b-2px border-black bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-bold uppercase tracking-wider text-black">PROJECT GALLERY</div>
                        <div className="border-2px border-black bg-white px-3 py-1">
                            <div className="text-xs font-bold uppercase tracking-wider text-black">{images.length} IMAGES</div>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                        <div className="border-2px border-black bg-white overflow-hidden" ref={emblaMainRef}>
                            <div className="flex">
                                {images.map((item, index) => (
                                    <div className="flex-none w-full" key={index}>
                                        <div className="aspect-video relative cursor-pointer group" onClick={() => openModal(index)}>
                                            <PrismicNextImage field={item.image} sizes="(max-width: 768px) 90vw, 70vw" fill className="object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                                <div className="border-2px border-white bg-white text-black p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="text-xs font-bold uppercase tracking-wider">EXPAND VIEW</div>
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t-2px border-black backdrop-blur-sm p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs font-bold uppercase tracking-wider text-black">
                                                        IMAGE {String(index + 1).padStart(2, '0')}
                                                    </div>
                                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-600">
                                                        {index + 1} OF {images.length}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {images.length > 1 && (
                        <div className="border-2px border-black bg-gray-50 p-4">
                            <div className="border-b-2px border-black bg-white px-3 py-2 inline-block mb-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">THUMBNAILS</div>
                            </div>
                            <div className="overflow-hidden" ref={emblaThumbsRef}>
                                <div className="flex gap-3">
                                    {images.map((item, index) => (
                                        <div className="flex-none w-24" key={index}>
                                            <Thumb
                                                onClick={() => onThumbClick(index)}
                                                selected={index === selectedIndex}
                                                image={item}
                                                index={index}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <motion.div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={closeModal}>
                        <motion.div className="border-2px border-white bg-white max-w-6xl max-h-full relative" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                            <div className="border-b-2px border-black bg-white p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-bold uppercase tracking-wider text-black">
                                        IMAGE {String(modalImageIndex + 1).padStart(2, '0')} OF {String(images.length).padStart(2, '0')}
                                    </div>
                                    <button className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 px-3 py-1 text-xs font-bold uppercase tracking-wider" onClick={closeModal}>
                                        CLOSE
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <PrismicNextImage field={images[modalImageIndex].image} sizes="90vw" className="max-h-[70vh] w-auto" />

                                {images.length > 1 && (
                                    <>
                                        <button className={`absolute left-4 top-1/2 -translate-y-1/2 border-2px border-white bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-3 ${modalImageIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={goToPrev} disabled={modalImageIndex === 0}>
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <span className="text-sm font-bold">←</span>
                                            </div>
                                        </button>
                                        <button className={`absolute right-4 top-1/2 -translate-y-1/2 border-2px border-white bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-3 ${modalImageIndex === images.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`} onClick={goToNext} disabled={modalImageIndex === images.length - 1}>
                                            <div className="w-4 h-4 flex items-center justify-center">
                                                <span className="text-sm font-bold">→</span>
                                            </div>
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}