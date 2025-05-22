'use client';
import React, { useState, useEffect, useRef } from 'react';
import { SettingsDocument, ProjectPostDocument } from '../../../prismicio-types';
import { isFilled, LinkField } from '@prismicio/client';
import { createClient } from "@/prismicio";
import TransitionLink from '@/animation/transitionLink';
import Image from 'next/image';
import styles from './style.module.scss';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationProps {
    settings: SettingsDocument;
}

interface SectorWithSubsectors {
    uid: string;
    name: string;
    main_image?: string;
    subsectors: Array<{
        uid: string;
        name: string;
        main_image?: string;
        projects: Array<{
            uid: string;
            name: string;
            main_image?: string;
        }>;
    }>;
}

interface ProjectItem {
    uid: string;
    name: string;
    sectorUid: string;
    subsectorUid: string;
    main_image?: string;
}

const Navigation: React.FC<NavigationProps> = ({ settings }) => {
    const [active, setActive] = useState<string | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [sectors, setSectors] = useState<SectorWithSubsectors[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([]);
    const [activeSector, setActiveSector] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navRef = useRef<HTMLDivElement>(null);
    const megaMenuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (item: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setActive(item);
        setIsMenuOpen(true);
    };

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            timeoutRef.current = setTimeout(() => {
                setActive(null);
                setIsMenuOpen(false);
            }, 150);
        }, 50);
    };

    const handleMegaMenuMouseEnter = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };

    useEffect(() => {
        if (active === 'Sectors' && !activeSector && sectors.length > 0) {
            setActiveSector(sectors[0].uid);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, [active, sectors, activeSector]);

    useEffect(() => {
        async function fetchData() {
            try {
                const client = createClient();
                const sectorsResponse = await client.getAllByType('sector_post');
                const allSubsectors = await client.getAllByType('subsector_post');
                const allProjects = await client.getAllByType('project_post');

                const processedSectors = sectorsResponse.map((sector) => {
                    const sectorSubsectors = allSubsectors.filter(subsector =>
                        isFilled.contentRelationship(subsector.data.parent_sector) &&
                        subsector.data.parent_sector.id === sector.id
                    );

                    return {
                        uid: sector.uid,
                        name: sector.data.name || sector.uid,
                        main_image: sector.data.main_image?.url || '',
                        subsectors: sectorSubsectors.map(s => ({
                            uid: s.uid,
                            name: s.data.name || s.uid,
                            main_image: s.data.main_image?.url || '',
                            projects: allProjects.filter(project =>
                                isFilled.contentRelationship(project.data.subsector) &&
                                project.data.subsector.id === s.id
                            ).map(p => ({
                                uid: p.uid,
                                name: p.data.client_name || p.uid,
                                main_image: p.data.project_main_image?.url || ''
                            }))
                        }))
                    };
                });

                setSectors(processedSectors);

                if (settings.data.product_categories?.length) {
                    const projectPromises = settings.data.product_categories
                        .filter(category => isFilled.contentRelationship(category.project))
                        .map(async (category) => {
                            try {
                                if (!isFilled.contentRelationship(category.project)) return null;

                                const projectDoc = await client.getByID(category.project.id) as ProjectPostDocument;
                                let sectorUid = '';
                                let subsectorUid = '';

                                if (projectDoc.data.sector && isFilled.contentRelationship(projectDoc.data.sector)) {
                                    sectorUid = projectDoc.data.sector.uid || '';

                                    if (projectDoc.data.subsector && isFilled.contentRelationship(projectDoc.data.subsector)) {
                                        subsectorUid = projectDoc.data.subsector.uid || '';
                                    }
                                }

                                return {
                                    uid: projectDoc.uid,
                                    name: projectDoc.data.client_name || projectDoc.uid,
                                    sectorUid,
                                    subsectorUid,
                                    main_image: projectDoc.data.project_main_image?.url || ''
                                };
                            } catch {
                                return null;
                            }
                        });

                    const fetchedProjects = (await Promise.all(projectPromises)).filter(Boolean);
                    setFeaturedProjects(fetchedProjects as ProjectItem[]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();

        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [settings]);

    const getLinkUrl = (link: LinkField | null | undefined): string => {
        if (!link || !isFilled.link(link)) return '/';
        if (link.link_type === 'Web') return link.url || '/';
        if (link.link_type === 'Document') {
            if (link.type === 'page') return `/${link.uid}`;
            if (link.type === 'sector_post') return `/sectors/${link.uid}`;
            if (link.type === 'project_post') return `/projects/${link.uid}`;
        }
        return '/';
    };

    const mainNav = settings.data.main_navigation || [];

    return (
        <>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div className={styles.overlay} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setActive(null)} />
                )}
            </AnimatePresence>

            <motion.div className={`${styles.navWrapper} ${isScrolled ? styles.scrolled : ''}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}>
                <motion.div className={styles.navbar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <div className={styles.container}>
                        {settings.data.site_logo?.url && (
                            <TransitionLink href="/" className={styles.logo}>
                                <Image src={settings.data.site_logo.url} alt={settings.data.site_title || 'Logo'} width={150} height={55} priority />
                            </TransitionLink>
                        )}

                        <div ref={navRef} className={styles.mainNavContainer}>
                            <nav className={styles.mainNav} onMouseLeave={handleMouseLeave}>
                                {mainNav.map((item, index) => {
                                    if (!item.title) return null;
                                    if (['sectors', 'projects'].includes(item.title.toLowerCase())) return null;

                                    return (
                                        <div key={`nav-${item.title}-${index}`} className={styles.navItem}>
                                            <TransitionLink href={getLinkUrl(item.link)}>
                                                {item.title}
                                            </TransitionLink>
                                        </div>
                                    );
                                })}

                                <div
                                    className={`${styles.navItem} ${active === 'Sectors' ? styles.active : ''}`}
                                    onMouseEnter={() => handleMouseEnter('Sectors')}
                                >
                                    <span className={active === 'Sectors' ? styles.active : ''}>
                                        Sectors
                                        <span className={styles.navArrow} style={{ transform: active === 'Sectors' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                                    </span>
                                </div>

                                <div className={`${styles.navItem} ${active === 'Projects' ? styles.active : ''}`} onMouseEnter={() => handleMouseEnter('Projects')} >
                                    <span className={active === 'Projects' ? styles.active : ''}>
                                        Projects
                                        <span className={styles.navArrow} style={{ transform: active === 'Projects' ? 'rotate(180deg)' : 'rotate(0deg)' }}>▾</span>
                                    </span>
                                </div>
                            </nav>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {active && ['Sectors', 'Projects'].includes(active) && (
                            <motion.div ref={megaMenuRef} key={active} className={styles.megaMenu} initial={{ height: 0, opacity: 0, y: -10 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -10 }} transition={{ height: { duration: 0.5, ease: [0.5, 0.75, 0, 1] }, opacity: { duration: 0.4, ease: [0.5, 0.75, 0, 1] }, y: { duration: 0.4, ease: [0.5, 0.75, 0, 1] } }} onMouseEnter={handleMegaMenuMouseEnter} onMouseLeave={handleMouseLeave}>
                                {active === 'Sectors' && (
                                    <div className={styles.megaMenuContent}>
                                        <div className={styles.sectorsLayout}>
                                            <div className={styles.sectorImages}>
                                                {sectors.slice(0, 2).map((sector, idx) => (
                                                    <motion.div key={sector.uid} className={styles.sectorImageContainer} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.3 }} whileHover={{ y: -5 }}>
                                                        <TransitionLink href={`/sectors/${sector.uid}`}>
                                                            {sector.main_image ? (
                                                                <div className={styles.sectorImageWrapper}>
                                                                    <Image src={sector.main_image} alt={sector.name} fill sizes="400px" style={{ objectFit: 'cover' }} />
                                                                    <div className={styles.sectorOverlay}>
                                                                        <h3>{sector.name}</h3>
                                                                        <span className={styles.viewSector}>View Sector →</span>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className={styles.sectorImagePlaceholder}>
                                                                    <h3>{sector.name}</h3>
                                                                </div>
                                                            )}
                                                        </TransitionLink>
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className={styles.sectorsListing}>
                                                <div className={styles.allSectors}>
                                                    <h3 className={styles.columnTitle}>All Sectors</h3>
                                                    <div className={styles.sectorsList}>
                                                        {sectors.map((sector, idx) => (
                                                            <motion.div key={sector.uid} className={`${styles.sectorItem} ${activeSector === sector.uid ? styles.activeSector : ''}`} onMouseEnter={() => setActiveSector(sector.uid)} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04, duration: 0.3 }} whileHover={{ x: 3 }}>
                                                                <TransitionLink href={`/sectors/${sector.uid}`}>
                                                                    {sector.name}
                                                                </TransitionLink>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className={styles.subsectorsList}>
                                                    <h3 className={styles.columnTitle}>Subsectors</h3>
                                                    <AnimatePresence mode="wait">
                                                        {activeSector && (
                                                            <motion.div key={activeSector} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.25 }} className={styles.subsectorsGrid}>
                                                                {sectors.find(s => s.uid === activeSector)?.subsectors.map((subsector, idx) => (
                                                                    <motion.div key={subsector.uid} className={styles.subsectorItem} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03, duration: 0.2 }} whileHover={{ y: -3 }}>
                                                                        <TransitionLink href={`/sectors/${activeSector}/${subsector.uid}`}>
                                                                            <div className={styles.subsectorContent}>
                                                                                {subsector.main_image && (
                                                                                    <div className={styles.subsectorImage}>
                                                                                        <Image src={subsector.main_image} alt={subsector.name} fill sizes="60px" style={{ objectFit: 'cover' }} />
                                                                                    </div>
                                                                                )}
                                                                                <div className={styles.subsectorInfo}>
                                                                                    <span className={styles.subsectorName}>{subsector.name}</span>
                                                                                    <span className={styles.itemCount}>{subsector.projects.length}</span>
                                                                                </div>
                                                                            </div>
                                                                        </TransitionLink>
                                                                    </motion.div>
                                                                ))}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {active === 'Projects' && (
                                    <div className={styles.megaMenuContent}>
                                        <div className={styles.projectsLayout}>
                                            <div className={styles.projectsGrid}>
                                                {featuredProjects.slice(0, 6).map((project, idx) => (
                                                    <motion.div key={project.uid} className={styles.projectCard} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05, duration: 0.3 }} whileHover={{ y: -5 }}>
                                                        <TransitionLink href={`/projects/${project.uid}`}>
                                                            <div className={styles.projectImageWrapper}>
                                                                {project.main_image ? (
                                                                    <Image src={project.main_image} alt={project.name} fill sizes="300px" style={{ objectFit: 'cover' }} />
                                                                ) : (
                                                                    <div className={styles.projectImagePlaceholder} />
                                                                )}
                                                                <div className={styles.projectOverlay}>
                                                                    <span className={styles.viewProject}>View Project</span>
                                                                </div>
                                                            </div>
                                                            <h4 className={styles.projectName}>{project.name}</h4>
                                                        </TransitionLink>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <motion.div className={styles.viewAllLink} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} whileHover={{ y: -3 }}>
                                                <TransitionLink href="/projects">
                                                    Browse All Projects
                                                    <span className={styles.viewAllArrow}>→</span>
                                                </TransitionLink>
                                            </motion.div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Navigation;