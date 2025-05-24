'use client';
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SettingsDocument, ProjectPostDocument } from '../../../prismicio-types';
import { isFilled, LinkField } from '@prismicio/client';
import { createClient } from "@/prismicio";
import TransitionLink from '@/animation/transitionLink';
import Image from 'next/image';
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
    const [isScrollingDown, setIsScrollingDown] = useState(false);
    const [sectors, setSectors] = useState<SectorWithSubsectors[]>([]);
    const [featuredProjects, setFeaturedProjects] = useState<ProjectItem[]>([]);
    const [activeSector, setActiveSector] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navRef = useRef<HTMLDivElement>(null);
    const megaMenuRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastScrollY = useRef(0);

    const handleMouseEnter = useCallback((item: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setActive(item);
        setIsMenuOpen(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        closeTimeoutRef.current = setTimeout(() => {
            timeoutRef.current = setTimeout(() => {
                setActive(null);
                setIsMenuOpen(false);
            }, 100);
        }, 50);
    }, []);

    const handleMegaMenuMouseEnter = useCallback(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }, []);

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
        setActive(null);
        setIsMenuOpen(false);
    }, []);

    const toggleMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setActive(null);
        setIsMenuOpen(false);
    }, [isMobileMenuOpen]);

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
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrollingDown(currentScrollY > lastScrollY.current && currentScrollY > 100);
            lastScrollY.current = currentScrollY;
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActive(null);
                setIsMenuOpen(false);
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        async function fetchData() {
            try {
                const client = createClient();
                const [sectorsResponse, allSubsectors, allProjects] = await Promise.all([
                    client.getAllByType('sector_post'),
                    client.getAllByType('subsector_post'),
                    client.getAllByType('project_post')
                ]);

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
    }, [settings]);

    const getLinkUrl = useCallback((link: LinkField | null | undefined): string => {
        if (!link || !isFilled.link(link)) return '/';
        if (link.link_type === 'Web') return link.url || '/';
        if (link.link_type === 'Document') {
            if (link.type === 'page') return `/${link.uid}`;
            if (link.type === 'sector_post') return `/sectors/${link.uid}`;
            if (link.type === 'project_post') return `/projects/${link.uid}`;
        }
        return '/';
    }, []);

    const mainNav = useMemo(() => settings.data.main_navigation || [], [settings.data.main_navigation]);
    const filteredMainNav = useMemo(() => 
        mainNav.filter(item => item.title && !['sectors', 'projects'].includes(item.title.toLowerCase())),
        [mainNav]
    );

    return (
        <>
            <AnimatePresence>
                {(isMenuOpen || isMobileMenuOpen) && (
                    <motion.div className="fixed inset-0 bg-gray-900 bg-opacity-20 z-40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={closeMobileMenu} />
                )}
            </AnimatePresence>

            <motion.header 
                className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 ${isScrollingDown ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`} 
                initial={{ y: -100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
                <nav className="max-w-7xl mx-auto px-6" role="navigation" aria-label="Main navigation">
                    <div className="flex items-center justify-between h-16">
                        {settings.data.site_logo?.url && (
                            <TransitionLink href="/" className="flex items-center py-2 px-3 hover:opacity-80 transition-all duration-200 mix-blend-difference" aria-label="Go to homepage">
                                <Image src={settings.data.site_logo.url} alt={settings.data.site_title || 'Logo'} width={140} height={40} priority className="h-auto" />
                            </TransitionLink>
                        )}

                        <motion.div 
                            className="hidden lg:flex items-center bg-white/90 backdrop-blur-xl shadow-lg shadow-gray-900/5 rounded-2xl border border-gray-200/50" 
                            ref={navRef}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                        >
                            <ul className="flex items-center text-sm font-medium p-2" onMouseLeave={handleMouseLeave} role="menubar">
                                {filteredMainNav.map((item, index) => (
                                    <li key={`nav-${item.title}-${index}`} role="none">
                                        <TransitionLink href={getLinkUrl(item.link)} className="text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 transition-all duration-200 px-4 py-2.5 rounded-xl mx-1 font-medium" role="menuitem">
                                            {item.title}
                                        </TransitionLink>
                                    </li>
                                ))}

                                <li role="none">
                                    <button 
                                        className={`relative mx-1 ${active === 'Sectors' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'} transition-all duration-200 rounded-xl flex items-center gap-2 px-4 py-2.5 cursor-pointer font-medium`} 
                                        onMouseEnter={() => handleMouseEnter('Sectors')}
                                        aria-expanded={active === 'Sectors'}
                                        aria-haspopup="true"
                                        role="menuitem"
                                    >
                                        Sectors
                                        <motion.svg 
                                            className="w-4 h-4" 
                                            fill="currentColor" 
                                            viewBox="0 0 20 20" 
                                            aria-hidden="true"
                                            animate={{ rotate: active === 'Sectors' ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </motion.svg>
                                    </button>
                                </li>

                                <li role="none">
                                    <button 
                                        className={`relative mx-1 ${active === 'Projects' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100/70'} transition-all duration-200 rounded-xl flex items-center gap-2 px-4 py-2.5 cursor-pointer font-medium`} 
                                        onMouseEnter={() => handleMouseEnter('Projects')}
                                        aria-expanded={active === 'Projects'}
                                        aria-haspopup="true"
                                        role="menuitem"
                                    >
                                        Projects
                                        <motion.svg 
                                            className="w-4 h-4" 
                                            fill="currentColor" 
                                            viewBox="0 0 20 20" 
                                            aria-hidden="true"
                                            animate={{ rotate: active === 'Projects' ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </motion.svg>
                                    </button>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.button 
                            className="lg:hidden w-12 h-12 rounded-2xl bg-white/90 backdrop-blur-xl hover:bg-white transition-all duration-200 z-10 flex items-center justify-center shadow-lg shadow-gray-900/5 border border-gray-200/50" 
                            onClick={toggleMobileMenu}
                            aria-expanded={isMobileMenuOpen}
                            aria-label="Toggle mobile menu"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                        >
                            <div className="flex flex-col items-center justify-center">
                                <motion.div 
                                    className="w-5 h-0.5 bg-gray-700" 
                                    animate={{
                                        rotate: isMobileMenuOpen ? 45 : 0,
                                        y: isMobileMenuOpen ? 4 : 0
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.div 
                                    className="w-5 h-0.5 bg-gray-700 my-1" 
                                    animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
                                    transition={{ duration: 0.15 }}
                                />
                                <motion.div 
                                    className="w-5 h-0.5 bg-gray-700" 
                                    animate={{
                                        rotate: isMobileMenuOpen ? -45 : 0,
                                        y: isMobileMenuOpen ? -4 : 0
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                            </div>
                        </motion.button>
                    </div>

                    <AnimatePresence mode="wait">
                        {active && ['Sectors', 'Projects'].includes(active) && (
                            <motion.div 
                                ref={megaMenuRef} 
                                key={active} 
                                className="absolute top-full right-0 mt-4" 
                                initial={{ opacity: 0, y: -10, scale: 0.98 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: -10, scale: 0.98 }} 
                                transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }} 
                                onMouseEnter={handleMegaMenuMouseEnter} 
                                onMouseLeave={handleMouseLeave}
                                role="menu"
                                aria-label={`${active} submenu`}
                            >
                                <div className="bg-white/95 backdrop-blur-2xl shadow-2xl shadow-gray-900/10 rounded-3xl border border-gray-200/50 overflow-hidden">
                                    {active === 'Sectors' && (
                                        <div className="w-[850px] max-w-[calc(100vw-3rem)]">
                                            <div className="flex">
                                                <div className="w-60 bg-gray-50/80 border-r border-gray-200/50 p-6">
                                                    <div className="space-y-1 max-h-96 overflow-y-auto">
                                                        {sectors.map((sector, idx) => (
                                                            <motion.button 
                                                                key={sector.uid}
                                                                className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 text-sm font-medium ${activeSector === sector.uid ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'}`} 
                                                                onMouseEnter={() => setActiveSector(sector.uid)}
                                                                role="menuitem"
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.02, duration: 0.2 }}
                                                            >
                                                                {sector.name}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex-1 p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
                                                    <AnimatePresence mode="wait">
                                                        {activeSector && (
                                                            <motion.div 
                                                                key={activeSector} 
                                                                initial={{ opacity: 0, x: 20 }} 
                                                                animate={{ opacity: 1, x: 0 }} 
                                                                exit={{ opacity: 0, x: -20 }} 
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <div className="mb-6">
                                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                                        {sectors.find(s => s.uid === activeSector)?.name}
                                                                    </h3>
                                                                    <p className="text-gray-600 text-sm">
                                                                        Specialized services and expertise
                                                                    </p>
                                                                </div>
                                                                
                                                                <div className="grid grid-cols-2 gap-4 mb-6">
                                                                    {sectors.find(s => s.uid === activeSector)?.subsectors.map((subsector, idx) => (
                                                                        <motion.div 
                                                                            key={subsector.uid} 
                                                                            className="group" 
                                                                            initial={{ opacity: 0, y: 10 }} 
                                                                            animate={{ opacity: 1, y: 0 }} 
                                                                            transition={{ delay: idx * 0.03, duration: 0.2 }}
                                                                        >
                                                                            <TransitionLink 
                                                                                href={`/sectors/${activeSector}/${subsector.uid}`} 
                                                                                className="block p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group-hover:-translate-y-0.5"
                                                                                role="menuitem"
                                                                            >
                                                                                <div className="aspect-video w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                                                                                    {subsector.main_image ? (
                                                                                        <Image src={subsector.main_image} alt={subsector.name} width={200} height={120} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                                                    ) : (
                                                                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                                                            <div className="text-gray-400 text-xs">No Image</div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <h4 className="font-semibold text-gray-900 mb-1 text-sm">{subsector.name}</h4>
                                                                                <p className="text-xs text-gray-500">{subsector.projects.length} projects</p>
                                                                            </TransitionLink>
                                                                        </motion.div>
                                                                    ))}
                                                                </div>

                                                                <TransitionLink 
                                                                    href={`/sectors/${activeSector}`} 
                                                                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-all duration-200 hover:gap-3"
                                                                    role="menuitem"
                                                                >
                                                                    View all in {sectors.find(s => s.uid === activeSector)?.name}
                                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </TransitionLink>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {active === 'Projects' && (
                                        <div className="w-[700px] max-w-[calc(100vw-3rem)] p-6">
                                            <div className="mb-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">Featured Projects</h3>
                                                <p className="text-gray-600 text-sm">Our most impactful work</p>
                                            </div>
                                            
                                            <div className="grid grid-cols-3 gap-4 mb-6 max-h-80 overflow-y-auto">
                                                {featuredProjects.map((project, idx) => (
                                                    <motion.div 
                                                        key={project.uid} 
                                                        className="group" 
                                                        initial={{ opacity: 0, y: 15 }} 
                                                        animate={{ opacity: 1, y: 0 }} 
                                                        transition={{ delay: idx * 0.04, duration: 0.2 }}
                                                    >
                                                        <TransitionLink href={`/projects/${project.uid}`} className="block p-3 rounded-xl hover:bg-gray-50/80 transition-all duration-200 group-hover:-translate-y-0.5" role="menuitem">
                                                            <div className="aspect-video w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
                                                                {project.main_image ? (
                                                                    <Image src={project.main_image} alt={project.name} width={180} height={120} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                                        <div className="text-gray-400 text-xs">No Image</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900 truncate text-sm">{project.name}</h4>
                                                        </TransitionLink>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            
                                            <TransitionLink 
                                                href="/projects" 
                                                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-all duration-200 hover:gap-3"
                                                role="menuitem"
                                            >
                                                Browse all projects
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </TransitionLink>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div 
                                className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl shadow-gray-900/20 lg:hidden z-50 overflow-y-auto" 
                                initial={{ x: '100%' }} 
                                animate={{ x: 0 }} 
                                exit={{ x: '100%' }} 
                                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                                role="menu"
                                aria-label="Mobile navigation menu"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                        <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                                        <button 
                                            onClick={closeMobileMenu}
                                            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                                            aria-label="Close menu"
                                        >
                                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex-1 overflow-y-auto">
                                        <div className="p-6 space-y-8">
                                            <div>
                                                <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider px-2">Navigation</h3>
                                                <div className="space-y-1">
                                                    {filteredMainNav.map((item, index) => (
                                                        <motion.div
                                                            key={`mobile-nav-${item.title}-${index}`} 
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: index * 0.05, duration: 0.2 }}
                                                        >
                                                            <TransitionLink href={getLinkUrl(item.link)} className="flex items-center justify-between text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors duration-200 py-4 px-4 rounded-2xl hover:bg-gray-50 group" onClick={closeMobileMenu} role="menuitem">
                                                                {item.title}
                                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </TransitionLink>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider px-2">Sectors</h3>
                                                <div className="space-y-2">
                                                    {sectors.slice(0, 8).map((sector, idx) => (
                                                        <motion.div
                                                            key={sector.uid}
                                                            initial={{ opacity: 0, x: 20 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: (idx + 3) * 0.04, duration: 0.2 }}
                                                        >
                                                            <TransitionLink href={`/sectors/${sector.uid}`} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all duration-200 group" onClick={closeMobileMenu}>
                                                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                                    {sector.main_image ? (
                                                                        <Image src={sector.main_image} alt={sector.name} width={56} height={56} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                                            <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-semibold text-gray-900 text-base group-hover:text-gray-700 transition-colors duration-200 truncate">{sector.name}</h4>
                                                                    <p className="text-sm text-gray-500 mt-1">{sector.subsectors.length} subsectors</p>
                                                                </div>
                                                                <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </TransitionLink>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="flex items-center justify-between mb-4 px-2">
                                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Featured Projects</h3>
                                                    <TransitionLink href="/projects" className="text-xs text-gray-600 hover:text-gray-900 font-semibold transition-colors duration-200 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full" onClick={closeMobileMenu}>
                                                        View All
                                                    </TransitionLink>
                                                </div>
                                                <div className="space-y-3">
                                                    {featuredProjects.slice(0, 6).map((project, idx) => (
                                                        <motion.div
                                                            key={project.uid}
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: (idx + 11) * 0.04, duration: 0.2 }}
                                                        >
                                                            <TransitionLink href={`/projects/${project.uid}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-all duration-200 group" onClick={closeMobileMenu}>
                                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                                    {project.main_image ? (
                                                                        <Image src={project.main_image} alt={project.name} width={48} height={48} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                                    ) : (
                                                                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                            </svg>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-gray-700 transition-colors duration-200">{project.name}</h4>
                                                                </div>
                                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </TransitionLink>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </nav>
            </motion.header>
        </>
    );
};

export default Navigation;