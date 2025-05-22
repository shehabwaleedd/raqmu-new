'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Content, isFilled } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import Breadcrumbs from '@/components/breadCrumbs';
import ProjectsClient from '@/components/projects/ProjectsClient';

interface SubSectorDetailProps {
    sector: Content.SectorPostDocument;
    subsector: Content.SubsectorPostDocument;
    projects: Content.ProjectPostDocument[];
}

export default function SubSectorDetail({ sector, subsector, projects }: SubSectorDetailProps) {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const titleY = useTransform(scrollYProgress, [0, 1], [0, 30]);

    const locations = [...new Set(
        projects
            .map(p => p.data.location as string)
            .filter(Boolean)
    )];

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Sectors', href: '/sectors' },
        { label: sector.data.name || '', href: `/sectors/${sector.uid}` },
        { label: subsector.data.name || '', href: `/sectors/${sector.uid}/${subsector.uid}`, current: true }
    ];

    return (
        <motion.div className="w-full bg-white font-helvetica border-2px border-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="border-b-2px border-black bg-white p-4 sm:p-6">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <section ref={heroRef} className="relative w-full bg-white border-b-2px border-black">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                    <div className="lg:col-span-3 border-b-2px lg:border-b-0 lg:border-r-2px border-black bg-white relative overflow-hidden">
                        {(isFilled.image(subsector.data.main_image) || isFilled.image(sector.data.main_image)) && (
                            <div className="absolute inset-0">
                                <PrismicNextImage 
                                    field={subsector.data.main_image || sector.data.main_image} 
                                    sizes="60vw" 
                                    priority 
                                    fill 
                                    className="object-cover" 
                                />
                            </div>
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t-2px border-black backdrop-blur-sm">
                            <div className="p-6 sm:p-8 lg:p-12">
                                <motion.div className="border-2px border-black bg-white px-4 py-2 inline-block mb-4" style={{ y: titleY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">{sector.data.name}</div>
                                </motion.div>
                                
                                <motion.h1 className="text-3xl sm:text-4xl lg:text-6xl font-black uppercase tracking-wider text-black leading-none" style={{ y: titleY }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                    {subsector.data.name}
                                </motion.h1>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-gray-50 flex flex-col">
                        <div className="border-b-2px border-black bg-white p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm font-bold uppercase tracking-wider text-black">SUBSECTOR PROFILE</div>
                                <div className="border-2px border-black bg-gray-50 px-3 py-1">
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">ACTIVE</div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex-1 p-6 sm:p-8 flex flex-col">
                            <motion.div className="flex-1 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <div className="prose prose-sm max-w-none text-black leading-relaxed [&>p]:mb-4 sm:[&>p]:mb-6 [&>p]:text-sm sm:[&>p]:text-base [&>p]:font-medium [&>p]:leading-relaxed [&>p]:text-gray-800">
                                    <PrismicRichText field={subsector.data.description} />
                                </div>
                            </motion.div>

                            <div className="border-t-2px border-black pt-6">
                                <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                    <div className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 p-4 cursor-pointer group">
                                        <a href="#projects" className="flex items-center justify-between text-sm font-bold uppercase tracking-wider">
                                            <span>EXPLORE PROJECTS</span>
                                            <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">▼</span>
                                        </a>
                                    </div>

                                    <div className="border-2px border-black bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-4 cursor-pointer group">
                                        <a href={`/sectors/${sector.uid}`} className="flex items-center justify-between text-sm font-bold uppercase tracking-wider">
                                            <span>BACK TO {sector.data.name?.toUpperCase()}</span>
                                            <span className="text-lg group-hover:translate-x-1 transition-transform duration-200">▸</span>
                                        </a>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="border-t-2px border-black bg-white p-6">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="border-2px border-black bg-white p-4">
                                    <div className="text-xl font-black text-black mb-1">{projects.length}</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">PROJECTS</div>
                                </div>
                                <div className="border-2px border-black bg-gray-50 p-4">
                                    <div className="text-xl font-black text-black mb-1">{locations.length}</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">LOCATIONS</div>
                                </div>
                                <div className="border-2px border-black bg-white p-4">
                                    <div className="text-xl font-black text-black mb-1">•</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">ACTIVE</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="projects" className="border-l-2px border-r-2px border-b-2px border-black bg-white">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} viewport={{ once: true, margin: "-100px" }}>
                    <ProjectsClient projects={projects} sectors={[]} subSectors={[]} locations={locations} />
                </motion.div>
            </section>
        </motion.div>
    );
}