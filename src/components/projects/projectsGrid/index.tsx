'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Content } from '@prismicio/client';
import ProjectCard from '@/components/projects/projectCard';

interface ProjectsGridProps {
    projects: Content.ProjectPostDocument[];
    locations: string[];
    baseUrl: string;
}

export default function ProjectsGrid({ projects, locations, baseUrl }: ProjectsGridProps) {
    const [selectedLocation, setSelectedLocation] = useState<string>('');
    const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent');

    const filteredProjects = useMemo(() => {
        const filtered = projects.filter(project => {
            const projectLocation = project.data.location;
            const locationStr = typeof projectLocation === 'string' ? projectLocation : '';
            const matchesLocation = !selectedLocation || locationStr === selectedLocation;
            return matchesLocation;
        });

        if (sortBy === 'alphabetical') {
            filtered.sort((a, b) => {
                const aName = typeof a.data.client_name === 'string' ? a.data.client_name : '';
                const bName = typeof b.data.client_name === 'string' ? b.data.client_name : '';
                return aName.localeCompare(bName);
            });
        } else {
            filtered.sort((a, b) =>
                new Date(b.first_publication_date).getTime() - new Date(a.first_publication_date).getTime()
            );
        }

        return filtered;
    }, [projects, selectedLocation, sortBy]);

    const gridKey = `${selectedLocation}-${sortBy}`;

    return (
        <div className="w-full bg-white border-2px border-black font-helvetica">
            <div className="grid grid-cols-12 border-b-2px border-black">
                <div className="col-span-3 border-r-2px border-black bg-black text-white p-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">FILTER OPTIONS</div>
                </div>
                
                <div className="col-span-6 border-r-2px border-black bg-gray-50 p-6">
                    <div className="flex items-center gap-4">
                        {locations.length > 0 && (
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-black whitespace-nowrap">LOCATION:</label>
                                <div className="border-2px border-black bg-white">
                                    <select className="px-4 py-2 text-sm font-bold text-black bg-white border-none outline-none cursor-pointer hover:bg-gray-50 transition-colors duration-200 min-w-32" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                                        <option value="">ALL LOCATIONS</option>
                                        {locations.map(location => (
                                            <option key={location} value={location}>{location.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-black whitespace-nowrap">SORT BY:</label>
                            <div className="border-2px border-black bg-white">
                                <select className="px-4 py-2 text-sm font-bold text-black bg-white border-none outline-none cursor-pointer hover:bg-gray-50 transition-colors duration-200 min-w-32" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'alphabetical')}>
                                    <option value="recent">MOST RECENT</option>
                                    <option value="alphabetical">ALPHABETICAL</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-3 bg-white p-6 flex items-center justify-center">
                    <div className="border-2px border-black bg-black text-white px-6 py-3">
                        <div className="text-center">
                            <div className="text-2xl font-black text-white mb-1">{filteredProjects.length}</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-white">PROJECTS</div>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div key={gridKey} className="p-8 bg-gray-50 min-h-96" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProjects.map((project, index) => (
                            <motion.div key={project.uid} className="border-2px border-black bg-white hover:bg-gray-50 transition-all duration-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
                                <ProjectCard project={project} url={`${baseUrl}/${project.uid}`} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <motion.div className="flex flex-col items-center justify-center min-h-80 border-2px border-black bg-white" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
                        <div className="border-2px border-black bg-gray-100 w-24 h-24 flex items-center justify-center mb-6">
                            <div className="text-4xl">🔍</div>
                        </div>
                        <div className="text-center border-t-2px border-black pt-6 w-full max-w-md">
                            <div className="bg-black text-white p-4 mb-4">
                                <h3 className="text-lg font-bold uppercase tracking-wider text-white">NO PROJECTS FOUND</h3>
                            </div>
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider px-6 pb-6">
                                TRY ADJUSTING YOUR FILTERS TO FIND MORE PROJECTS
                            </p>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <div className="border-t-2px border-black bg-black text-white p-4">
                <div className="flex justify-between items-center">
                    <div className="text-xs font-bold uppercase tracking-wider text-white">PROJECT DIRECTORY</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-white">{new Date().getFullYear()}</div>
                </div>
            </div>
        </div>
    );
}