'use client';

import { useState, useMemo } from 'react';
import { Content } from '@prismicio/client';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '@/components/projects/projectCard';

interface ProjectsClientProps {
    projects: Content.ProjectPostDocument[];
    sectors: string[];
    subSectors: string[];
    locations: string[];
}

interface ActiveFilters {
    sectors: string[];
    subSectors: string[];
    locations: string[];
}

export default function ProjectsClient({
    projects,
    sectors = [],
    subSectors = [],
    locations = []
}: ProjectsClientProps) {
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        sectors: [],
        subSectors: [],
        locations: []
    });
    const [sortBy, setSortBy] = useState<'recent' | 'alphabetical'>('recent');
    const [showFilters, setShowFilters] = useState(false);

    const filteredProjects = useMemo(() => {
        const filtered = projects.filter(project => {
            let projectSector = '';
            const sector = project.data.sector;
            if (typeof sector === 'string') {
                projectSector = sector;
            } else if (sector && typeof sector === 'object') {
                if ('uid' in sector) {
                    projectSector = (sector.uid as string) || '';
                }
            }

            let projectSubSector = '';
            const subsector = project.data.subsector;
            if (typeof subsector === 'string') {
                projectSubSector = subsector;
            } else if (subsector && typeof subsector === 'object') {
                if ('uid' in subsector) {
                    projectSubSector = (subsector.uid as string) || '';
                }
            }

            const projectLocation = project.data.location || '';

            const matchesSector = activeFilters.sectors.length === 0 || activeFilters.sectors.includes(projectSector);
            const matchesSubSector = activeFilters.subSectors.length === 0 || activeFilters.subSectors.includes(projectSubSector);
            const matchesLocation = activeFilters.locations.length === 0 || activeFilters.locations.includes(projectLocation);

            return matchesSector && matchesSubSector && matchesLocation;
        });

        if (sortBy === 'alphabetical') {
            filtered.sort((a, b) => {
                const aName = a.data.client_name || '';
                const bName = b.data.client_name || '';
                return aName.toString().localeCompare(bName.toString());
            });
        } else {
            filtered.sort((a, b) =>
                new Date(b.first_publication_date).getTime() - new Date(a.first_publication_date).getTime()
            );
        }

        return filtered;
    }, [projects, activeFilters, sortBy]);

    const addFilter = (type: keyof ActiveFilters, value: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [type]: [...prev[type], value]
        }));
    };

    const removeFilter = (type: keyof ActiveFilters, value: string) => {
        setActiveFilters(prev => ({
            ...prev,
            [type]: prev[type].filter(item => item !== value)
        }));
    };

    const clearAllFilters = () => {
        setActiveFilters({ sectors: [], subSectors: [], locations: [] });
    };

    const totalActiveFilters = activeFilters.sectors.length + activeFilters.subSectors.length + activeFilters.locations.length;
    const gridKey = `${activeFilters.sectors.join(',')}-${activeFilters.subSectors.join(',')}-${activeFilters.locations.join(',')}-${sortBy}`;

    return (
        <div className="w-full bg-white font-helvetica">
            <div className="border-b-2px border-black bg-white">
                <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-8 border-b-2px md:border-b-0 md:border-r-2px border-black p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <motion.button className={`border-2px border-black p-3 transition-all duration-200 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider ${showFilters ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-50'}`} onClick={() => setShowFilters(!showFilters)}>
                                <motion.div className="w-4 h-4 flex flex-col items-center justify-center gap-1" animate={{ rotate: showFilters ? 90 : 0 }}>
                                    <div className="w-4 h-0.5 bg-current"></div>
                                    <div className="w-3 h-0.5 bg-current"></div>
                                    <div className="w-2 h-0.5 bg-current"></div>
                                </motion.div>
                                <span>FILTERS</span>
                                {totalActiveFilters > 0 && (
                                    <div className="border-2px border-current bg-current text-white px-2 py-0.5 text-xs font-bold">
                                        {totalActiveFilters}
                                    </div>
                                )}
                            </motion.button>

                            <div className="border-2px border-black bg-white">
                                <select className="px-4 py-3 text-sm font-bold text-black bg-white border-none outline-none cursor-pointer hover:bg-gray-50 transition-colors duration-200" value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'alphabetical')}>
                                    <option value="recent">MOST RECENT</option>
                                    <option value="alphabetical">ALPHABETICAL</option>
                                </select>
                            </div>
                        </div>

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div className="mt-6 border-2px border-black bg-gray-50" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                                    <div className="p-6 space-y-6">
                                        {sectors.length > 0 && (
                                            <div>
                                                <div className="border-2px border-black bg-white px-3 py-2 inline-block mb-4">
                                                    <div className="text-xs font-bold uppercase tracking-wider text-black">SECTORS</div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {sectors.map(sector => (
                                                        <button key={sector} className={`border-2px border-black px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeFilters.sectors.includes(sector) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`} onClick={() => activeFilters.sectors.includes(sector) ? removeFilter('sectors', sector) : addFilter('sectors', sector)}>
                                                            {sector}
                                                            {activeFilters.sectors.includes(sector) && (
                                                                <span className="ml-2">×</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {subSectors.length > 0 && (
                                            <div>
                                                <div className="border-2px border-black bg-white px-3 py-2 inline-block mb-4">
                                                    <div className="text-xs font-bold uppercase tracking-wider text-black">SUBSECTORS</div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {subSectors.map(subSector => (
                                                        <button key={subSector} className={`border-2px border-black px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeFilters.subSectors.includes(subSector) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`} onClick={() => activeFilters.subSectors.includes(subSector) ? removeFilter('subSectors', subSector) : addFilter('subSectors', subSector)}>
                                                            {subSector}
                                                            {activeFilters.subSectors.includes(subSector) && (
                                                                <span className="ml-2">×</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {locations.length > 0 && (
                                            <div>
                                                <div className="border-2px border-black bg-white px-3 py-2 inline-block mb-4">
                                                    <div className="text-xs font-bold uppercase tracking-wider text-black">LOCATIONS</div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {locations.map(location => (
                                                        <button key={location} className={`border-2px border-black px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${activeFilters.locations.includes(location) ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`} onClick={() => activeFilters.locations.includes(location) ? removeFilter('locations', location) : addFilter('locations', location)}>
                                                            {location}
                                                            {activeFilters.locations.includes(location) && (
                                                                <span className="ml-2">×</span>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {totalActiveFilters > 0 && (
                                            <div className="border-t-2px border-black pt-4">
                                                <button className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 px-4 py-2 text-xs font-bold uppercase tracking-wider" onClick={clearAllFilters}>
                                                    CLEAR ALL FILTERS
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="col-span-12 md:col-span-4 bg-white p-4 sm:p-6 flex items-center justify-center">
                        <div className="border-2px border-black bg-gray-50 p-4 text-center">
                            <div className="text-2xl font-black text-black mb-1">{filteredProjects.length}</div>
                            <div className="text-xs font-bold uppercase tracking-wider text-black">PROJECTS FOUND</div>
                        </div>
                    </div>
                </div>
            </div>

            <motion.div key={gridKey} className="p-6 sm:p-8 bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                {filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProjects.map((project, index) => {
                            let sectorUid = '';
                            const sector = project.data.sector;
                            if (typeof sector === 'string') {
                                sectorUid = sector;
                            } else if (sector && typeof sector === 'object' && 'uid' in sector) {
                                sectorUid = (sector.uid as string) || '';
                            }

                            let subsectorUid = '';
                            const subsector = project.data.subsector;
                            if (typeof subsector === 'string') {
                                subsectorUid = subsector;
                            } else if (subsector && typeof subsector === 'object' && 'uid' in subsector) {
                                subsectorUid = (subsector.uid as string) || '';
                            }

                            return (
                                <motion.div key={project.uid} className="border-2px border-black bg-white hover:bg-gray-50 transition-all duration-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
                                    <ProjectCard project={project} url={`/sectors/${sectorUid}/${subsectorUid}/${project.uid}`} />
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <motion.div className="border-2px border-black bg-white p-12 text-center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                        <div className="border-2px border-gray-400 bg-gray-50 w-20 h-20 mx-auto flex items-center justify-center mb-6">
                            <div className="text-3xl">🔍</div>
                        </div>
                        <div className="border-b-2px border-black pb-6 mb-6">
                            <h3 className="text-xl font-bold uppercase tracking-wider text-black mb-2">NO PROJECTS FOUND</h3>
                            <p className="text-sm font-medium text-gray-600">Try adjusting your filters to find more projects</p>
                        </div>
                        <button className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 px-6 py-3 text-sm font-bold uppercase tracking-wider" onClick={clearAllFilters}>
                            CLEAR FILTERS
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}