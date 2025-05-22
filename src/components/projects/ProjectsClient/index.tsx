'use client';

import { useState, useMemo } from 'react';
import { Content } from '@prismicio/client';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '@/components/projects/projectCard';
import Button from '@/ui/button';
import styles from './style.module.scss';

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

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4, ease: [0.5, 0.75, 0, 1] }
};

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
                } else if ('data' in sector && sector.data && typeof sector.data === 'object' && 'uid' in sector.data) {
                    projectSector = (sector.data.uid as string) || '';
                }
            }

            let projectSubSector = '';
            const subsector = project.data.subsector;
            if (typeof subsector === 'string') {
                projectSubSector = subsector;
            } else if (subsector && typeof subsector === 'object') {
                if ('uid' in subsector) {
                    projectSubSector = (subsector.uid as string) || '';
                } else if ('data' in subsector && subsector.data && typeof subsector.data === 'object' && 'uid' in subsector.data) {
                    projectSubSector = (subsector.data.uid as string) || '';
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
        <div className={styles.projectsContainer}>
            <motion.div className={styles.toolbar} {...fadeInUp}>
                <div className={styles.toolbarLeft}>
                    <div className={styles.filtersContainer}>
                        <motion.button className={`${styles.filterToggle} ${showFilters ? styles.active : ''}`}onClick={() => setShowFilters(!showFilters)}whileHover={{ scale: 1.02 }}whileTap={{ scale: 0.98 }}>
                            <motion.svg width="20"height="20"viewBox="0 0 24 24"fill="none"animate={{ rotate: showFilters ? 180 : 0 }}>
                                <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </motion.svg>
                            Filters
                            {totalActiveFilters > 0 && (
                                <span className={styles.filterCount}>{totalActiveFilters}</span>
                            )}
                        </motion.button>

                        <AnimatePresence mode="wait">
                            {showFilters && (
                                <motion.div className={styles.filtersPanel} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                    <div className={styles.filterSection}>
                                        <h3 className={styles.filterTitle}>Sectors</h3>
                                        <div className={styles.filterTags}>
                                            {(sectors || []).map(sector => (
                                                <button key={sector} className={`${styles.filterTag} ${activeFilters.sectors.includes(sector) ? styles.active : ''}`} onClick={() => activeFilters.sectors.includes(sector) ? removeFilter('sectors', sector) : addFilter('sectors', sector)}>
                                                    {sector}
                                                    {activeFilters.sectors.includes(sector) && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.filterSection}>
                                        <h3 className={styles.filterTitle}>Sub Sectors</h3>
                                        <div className={styles.filterTags}>
                                            {(subSectors || []).map(subSector => (
                                                <button key={subSector} className={`${styles.filterTag} ${activeFilters.subSectors.includes(subSector) ? styles.active : ''}`} onClick={() => activeFilters.subSectors.includes(subSector) ? removeFilter('subSectors', subSector) : addFilter('subSectors', subSector)}>
                                                    {subSector}
                                                    {activeFilters.subSectors.includes(subSector) && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.filterSection}>
                                        <h3 className={styles.filterTitle}>Locations</h3>
                                        <div className={styles.filterTags}>
                                            {(locations || []).map(location => (
                                                <button key={location} className={`${styles.filterTag} ${activeFilters.locations.includes(location) ? styles.active : ''}`} onClick={() => activeFilters.locations.includes(location) ? removeFilter('locations', location) : addFilter('locations', location)}>
                                                    {location}
                                                    {activeFilters.locations.includes(location) && (
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {totalActiveFilters > 0 && (
                                        <div className={styles.filterActions}>
                                            <Button variant="secondary" size="sm" onClick={clearAllFilters}>
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className={styles.results}>
                        <span className={styles.count}>
                            <span className={styles.number}>{filteredProjects.length}</span> projects
                        </span>
                    </div>
                </div>

                <div className={styles.sortContainer}>
                    <label htmlFor="sort-select" className={styles.sortLabel}>Sort by:</label>
                    <div className={styles.customSelect}>
                        <select id="sort-select" className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value as 'recent' | 'alphabetical')}>
                            <option value="recent">Most Recent</option>
                            <option value="alphabetical">Alphabetical</option>
                        </select>
                        <div className={styles.selectArrow}></div>
                    </div>
                </div>
            </motion.div>

            <motion.div key={gridKey} className={styles.projectsGrid} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => {

                        let sectorUid = '';
                        const sector = project.data.sector;
                        if (typeof sector === 'string') {
                            sectorUid = sector;
                        } else if (sector && typeof sector === 'object') {

                            if ('uid' in sector) {
                                sectorUid = (sector.uid as string) || '';
                            } else if ('data' in sector && sector.data && typeof sector.data === 'object' && 'uid' in sector.data) {
                                sectorUid = (sector.data.uid as string) || '';
                            }
                        }

                        let subsectorUid = '';
                        const subsector = project.data.subsector;
                        if (typeof subsector === 'string') {
                            subsectorUid = subsector;
                        } else if (subsector && typeof subsector === 'object') {
                            if ('uid' in subsector) {
                                subsectorUid = (subsector.uid as string) || '';
                            } else if ('data' in subsector && subsector.data && typeof subsector.data === 'object' && 'uid' in subsector.data) {
                                subsectorUid = (subsector.data.uid as string) || '';
                            }
                        }

                        return (
                            <ProjectCard key={project.uid} project={project} url={`/sectors/${sectorUid}/${subsectorUid}/${project.uid}`} />
                        );
                    })
                ) : (
                    <motion.div className={styles.emptyState} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
                        <div className={styles.emptyIcon}>🔍</div>
                        <h3 className={styles.emptyTitle}>No projects found</h3>
                        <p className={styles.emptyText}>Try adjusting your filters to find more projects</p>
                        <Button variant="primary"onClick={clearAllFilters}className={styles.emptyButton}>
                            Clear Filters
                        </Button>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}