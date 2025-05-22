'use client';

import { motion } from 'framer-motion';
import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import TransitionLink from '@/animation/transitionLink';

interface SubSectorsListProps {
    subSectors: {
        name: string;
        projectCount: number;
        projects: Content.ProjectPostDocument[];
    }[];
    sector: string;
}

export default function SubSectorsList({ subSectors, sector }: SubSectorsListProps) {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="w-full bg-white border-2px border-black font-helvetica">
            <div className="border-b-2px border-black bg-black text-white p-6">
                <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">SUBSECTORS DIRECTORY</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white">{subSectors.length} CATEGORIES</div>
                </div>
            </div>

            <motion.div className="bg-gray-50" variants={staggerContainer} initial="initial" animate="animate">
                {subSectors.map((subSector, index) => (
                    <motion.div key={subSector.name} className={`border-b-2px border-black bg-white ${index === subSectors.length - 1 ? 'border-b-0' : ''}`} variants={fadeInUp} transition={{ delay: index * 0.05 }}>
                        <div className="grid grid-cols-12">
                            <div className="col-span-4 border-r-2px border-black bg-black text-white p-6">
                                <div className="flex flex-col h-full justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-3">
                                            <TransitionLink href={`/sectors/${encodeURIComponent(sector.toLowerCase())}/${encodeURIComponent(subSector.name.toLowerCase())}`} className="hover:text-gray-300 transition-colors duration-200">
                                                {subSector.name}
                                            </TransitionLink>
                                        </h2>
                                        <div className="border-2px border-white bg-white text-black px-3 py-2 inline-block">
                                            <span className="text-xs font-bold uppercase tracking-wider">{subSector.projectCount} PROJECTS</span>
                                        </div>
                                    </div>
                                    <div className="mt-6">
                                        <TransitionLink href={`/sectors/${encodeURIComponent(sector.toLowerCase())}/${encodeURIComponent(subSector.name.toLowerCase())}`} className="border-2px border-white bg-white text-black hover:bg-black hover:text-white hover:border-white transition-all duration-200 px-4 py-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                            VIEW ALL PROJECTS
                                            <span className="text-sm">▸</span>
                                        </TransitionLink>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-8 bg-white">
                                <div className="p-6">
                                    <div className="border-b-2px border-black bg-gray-50 p-4 mb-6">
                                        <div className="text-xs font-bold uppercase tracking-wider text-black">FEATURED PROJECTS</div>
                                    </div>
                                    
                                    {subSector.projects.length > 0 ? (
                                        <div className="grid grid-cols-3 gap-4">
                                            {subSector.projects.slice(0, 3).map((project, projectIndex) => (
                                                <motion.div key={project.uid} className="border-2px border-black bg-white hover:bg-gray-50 transition-all duration-200" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (index * 0.1) + (projectIndex * 0.05), duration: 0.3 }}>
                                                    <TransitionLink href={`/sectors/${encodeURIComponent(sector.toLowerCase())}/${encodeURIComponent(subSector.name.toLowerCase())}/${project.uid}`} className="block">
                                                        <div className="h-32 border-b-2px border-black bg-white overflow-hidden">
                                                            {project.data.project_main_image?.url ? (
                                                                <PrismicNextImage field={project.data.project_main_image} sizes="(max-width: 768px) 33vw, 20vw" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                    <div className="text-gray-500 text-xs font-bold uppercase tracking-wider">NO IMAGE</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        
                                                        <div className="p-3">
                                                            <h3 className="text-xs font-bold uppercase tracking-wider text-black mb-2 line-clamp-2">{project.data.client_name || 'Untitled Project'}</h3>
                                                            <div className="border-t-2px border-black pt-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-600">{project.data.year || 'N/A'}</span>
                                                                    <div className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1">
                                                                        VIEW
                                                                        <span className="text-xs">▸</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TransitionLink>
                                                </motion.div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border-2px border-black bg-gray-100 p-8 text-center">
                                            <div className="border-2px border-gray-400 bg-white w-16 h-16 mx-auto flex items-center justify-center mb-4">
                                                <div className="text-2xl text-gray-400">📁</div>
                                            </div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-gray-600">NO PROJECTS AVAILABLE</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="border-t-2px border-black bg-black text-white p-4">
                <div className="flex justify-between items-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">SECTOR: {sector.toUpperCase()}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white">ARCHITECTURE DIRECTORY</div>
                </div>
            </div>
        </div>
    );
}