'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Content, isFilled } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import Link from 'next/link';

interface SectorDetailProps {
    sector: Content.SectorPostDocument;
    subsectors: Content.SubsectorPostDocument[];
}

export default function SectorDetail({ sector, subsectors }: SectorDetailProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const titleY = useTransform(scrollYProgress, [0, 1], [0, 50]);

    const [activeSubsector, setActiveSubsector] = useState<string | null>(
        subsectors.length > 0 ? subsectors[0].uid : null
    );

    const activeSubsectorData = subsectors.find(sub => sub.uid === activeSubsector);

    return (
        <motion.div className="w-full bg-white font-helvetica" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <section ref={heroRef} className="relative w-full bg-white border-2px border-black">
                <div className="grid grid-cols-1 lg:grid-cols-5 min-h-screen">
                    <div className="lg:col-span-3 border-b-2px lg:border-b-0 lg:border-r-2px border-black bg-white relative overflow-hidden order-2 lg:order-1">
                        {isFilled.image(sector.data.main_image) && (
                            <div className="absolute inset-0">
                                <PrismicNextImage field={sector.data.main_image} sizes="60vw" priority fill className="object-cover" />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t-2px border-black backdrop-blur-sm">
                            <div className="p-4 sm:p-6 lg:p-12">
                                <div className="border-2px border-black bg-white px-3 py-1 sm:px-4 sm:py-2 inline-block mb-4 sm:mb-6">
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">SECTOR OVERVIEW</div>
                                </div>
                                <motion.h1 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-black uppercase tracking-wider text-black leading-none" style={{ y: titleY }} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                                    {sector.data.name}
                                </motion.h1>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-gray-50 flex flex-col order-1 lg:order-2">
                        <div className="border-b-2px border-black bg-white p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold uppercase tracking-wider text-black">SECTOR PROFILE</div>
                                <div className="border-2px border-black bg-gray-50 px-3 py-1">
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">{new Date().getFullYear()}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">
                            <motion.div className="flex-1 mb-6 sm:mb-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                                <div className="prose prose-sm max-w-none text-black leading-relaxed [&>p]:mb-4 sm:[&>p]:mb-6 [&>p]:text-sm sm:[&>p]:text-base [&>p]:font-medium [&>p]:leading-relaxed [&>p]:text-gray-800">
                                    <PrismicRichText field={sector.data.description} />
                                </div>
                            </motion.div>

                            <div className="border-t-2px border-black pt-6 sm:pt-8">
                                <motion.div className="space-y-3 sm:space-y-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                                    <div className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 p-3 sm:p-4 cursor-pointer group">
                                        <a href="#areas" className="flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider">
                                            <span>EXPLORE AREAS</span>
                                            <span className="text-base sm:text-lg group-hover:translate-x-1 transition-transform duration-200">▼</span>
                                        </a>
                                    </div>

                                    <div className="border-2px border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-3 sm:p-4 cursor-pointer group">
                                        <Link href="/contact" className="flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider">
                                            <span>GET IN TOUCH</span>
                                            <span className="text-base sm:text-lg group-hover:translate-x-1 transition-transform duration-200">▸</span>
                                        </Link>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="border-t-2px border-black bg-white p-4 sm:p-6">
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                                <div className="border-2px border-black bg-white p-2 sm:p-4">
                                    <div className="text-lg sm:text-2xl font-black text-black mb-1">{subsectors.length}</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">AREAS</div>
                                </div>
                                <div className="border-2px border-black bg-gray-50 p-2 sm:p-4">
                                    <div className="text-lg sm:text-2xl font-black text-black mb-1">•</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">ACTIVE</div>
                                </div>
                                <div className="border-2px border-black bg-white p-2 sm:p-4">
                                    <div className="text-lg sm:text-2xl font-black text-black mb-1">∞</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">PROJECTS</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {subsectors.length > 0 && (
                <section id="areas" className="w-full bg-white border-l-2px border-r-2px border-b-2px border-black">
                    <div className="border-b-2px border-black bg-white">
                        <motion.div className="p-4 sm:p-6 lg:p-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, margin: "-100px" }}>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12">
                                <div className="lg:col-span-7">
                                    <div className="border-2px border-black bg-white px-3 py-1 sm:px-4 sm:py-2 inline-block mb-4 sm:mb-6">
                                        <div className="text-xs font-bold uppercase tracking-wider text-black">OUR EXPERTISE</div>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-black uppercase tracking-wider text-black leading-none mb-4 sm:mb-6">
                                        SPECIALIZED<br />AREAS
                                    </h2>
                                </div>
                                <div className="lg:col-span-5 flex items-end">
                                    <div className="border-l-2px border-black pl-4 sm:pl-6">
                                        <p className="text-base sm:text-lg font-medium text-gray-800 leading-relaxed">
                                            Explore our comprehensive range of specialized services within the <strong>{sector.data.name}</strong> sector.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="bg-gray-50 p-4 sm:p-6 lg:p-12">
                        <motion.div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true, margin: "-100px" }}>
                            <div className="xl:col-span-4">
                                <div className="border-2px border-black bg-white h-full">
                                    <div className="border-b-2px border-black bg-gray-50 p-4 sm:p-6">
                                        <div className="text-sm font-bold uppercase tracking-wider text-black">AREA NAVIGATION</div>
                                    </div>
                                    
                                    <div className="p-4 sm:p-6 space-y-0">
                                        {subsectors.map((subsector, index) => (
                                            <motion.button key={subsector.uid} className={`w-full text-left border-2px border-black transition-all duration-300 ${index > 0 ? 'border-t-0' : ''} ${activeSubsector === subsector.uid ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`} onClick={() => setActiveSubsector(subsector.uid)} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.3 }}>
                                                <div className="p-4 sm:p-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className={`border-2px ${activeSubsector === subsector.uid ? 'border-white bg-white text-black' : 'border-black bg-black text-white'} px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                                                            {String(index + 1).padStart(2, '0')}
                                                        </div>
                                                        <div className="text-sm sm:text-base font-bold uppercase tracking-wider">
                                                            {subsector.data.name}
                                                        </div>
                                                    </div>
                                                    <div className={`text-lg transition-transform duration-200 ${activeSubsector === subsector.uid ? 'rotate-90' : ''}`}>
                                                        ▸
                                                    </div>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="xl:col-span-8">
                                {activeSubsectorData && (
                                    <motion.div key={activeSubsectorData.uid} className="border-2px border-black bg-white h-full" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                                        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">
                                            <div className="lg:col-span-3 border-b-2px lg:border-b-0 lg:border-r-2px border-black p-6 sm:p-8 lg:p-10">
                                                <div className="border-2px border-black bg-gray-50 p-4 mb-6 sm:mb-8">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-xs font-bold uppercase tracking-wider text-black">AREA PROFILE</div>
                                                        <div className="border-2px border-black bg-white px-3 py-1">
                                                            <div className="text-xs font-bold uppercase tracking-wider text-black">
                                                                {String(subsectors.findIndex(s => s.uid === activeSubsectorData.uid) + 1).padStart(2, '0')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <h3 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black uppercase tracking-wider text-black mb-6 sm:mb-8 leading-tight">
                                                    {activeSubsectorData.data.name}
                                                </h3>

                                                <div className="prose prose-sm sm:prose-base max-w-none text-black leading-relaxed mb-6 sm:mb-8 [&>p]:mb-4 sm:[&>p]:mb-6 [&>p]:text-sm sm:[&>p]:text-base [&>p]:font-medium [&>p]:leading-relaxed [&>p]:text-gray-800">
                                                    <PrismicRichText field={activeSubsectorData.data.description} />
                                                </div>

                                                <div className="border-t-2px border-black pt-6 sm:pt-8">
                                                    <div className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 p-3 sm:p-4 inline-block cursor-pointer group">
                                                        <a href={`/sectors/${sector.uid}/${activeSubsectorData.uid}`} className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold uppercase tracking-wider">
                                                            <span>VIEW PROJECTS</span>
                                                            <span className="text-base sm:text-lg group-hover:translate-x-1 transition-transform duration-200">▸</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="lg:col-span-2 bg-gray-50 relative">
                                                {isFilled.image(activeSubsectorData.data.main_image) ? (
                                                    <div className="h-64 sm:h-80 lg:h-full relative">
                                                        <PrismicNextImage field={activeSubsectorData.data.main_image} sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 30vw" fill className="object-cover" />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t-2px border-black backdrop-blur-sm p-3 sm:p-4">
                                                            <div className="text-xs font-bold uppercase tracking-wider text-black">
                                                                {activeSubsectorData.data.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="h-64 sm:h-80 lg:h-full flex items-center justify-center bg-gray-100 border-2px border-dashed border-gray-300 m-4">
                                                        <div className="text-center">
                                                            <div className="border-2px border-gray-400 bg-white w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center mb-3 sm:mb-4">
                                                                <div className="text-2xl sm:text-3xl text-gray-400">📷</div>
                                                            </div>
                                                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">IMAGE PLACEHOLDER</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>

                    <div className="border-t-2px border-black bg-white p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-center text-center sm:text-left">
                            <div className="lg:col-span-2">
                                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                                    SECTOR: {sector.data.name?.toUpperCase()}
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <div className="border-2px border-black bg-gray-50 px-3 py-1 sm:px-4 sm:py-2 inline-block">
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">DIRECTORY</div>
                                </div>
                            </div>
                            <div className="lg:col-span-2 lg:text-right">
                                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                                    {subsectors.length} SPECIALIZED AREAS
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </motion.div>
    );
}