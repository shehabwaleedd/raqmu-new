'use client';
import React, { useState, useEffect, useRef } from 'react';
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
    const [isScrolled, setIsScrolled] = useState(false);
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

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setActive(null);
        setIsMenuOpen(false);
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
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            setIsScrolled(currentScrollY > 20);
            setIsScrollingDown(currentScrollY > lastScrollY.current && currentScrollY > 100);
            
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        <div className="navigation-container">
            <AnimatePresence>
                {(isMenuOpen || isMobileMenuOpen) && (
                    <motion.div className="fixed inset-0 bg-black bg-opacity-30 z-40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={() => { setActive(null); setIsMobileMenuOpen(false); }} />
                )}
            </AnimatePresence>

            <motion.div className={`relative top-0 left-0 right-0 z-50 bg-white transition-all duration-300 border-[2px] border-b-0 border-black ${isScrollingDown ? '-translate-y-full' : 'translate-y-0'} ${isMenuOpen || isMobileMenuOpen ? '' : isScrolled ? 'shadow-lg' : ''}`} initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                <motion.div className="relative w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <div className="w-full px-8 flex items-center justify-between h-20 lg:h-24 ">
                        {settings.data.site_logo?.url && (
                            <TransitionLink href="/" className="flex items-center z-10 p-4 transition-all duration-200">
                                <Image src={settings.data.site_logo.url} alt={settings.data.site_title || 'Logo'} width={160} height={50} priority className="h-auto" />
                            </TransitionLink>
                        )}

                        <div className="hidden lg:flex items-center border-2px border-black bg-white" ref={navRef}>
                            <nav className="flex items-center navigation-text text-sm font-bold tracking-wider" onMouseLeave={handleMouseLeave}>
                                {mainNav.map((item, index) => {
                                    if (!item.title) return null;
                                    if (['sectors', 'projects'].includes(item.title.toLowerCase())) return null;

                                    return (
                                        <div key={`nav-${item.title}-${index}`} className="relative border-r-2px border-black last:border-r-0">
                                            <TransitionLink href={getLinkUrl(item.link)} className="navigation-title uppercase font-bold text-black hover:bg-black hover:text-white transition-all duration-200 px-6 py-4 block">
                                                {item.title}
                                            </TransitionLink>
                                        </div>
                                    );
                                })}

                                <div className={`relative border-r-2px border-black ${active === 'Sectors' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'} transition-all duration-200`} onMouseEnter={() => handleMouseEnter('Sectors')}>
                                    <span className="navigation-title uppercase font-bold flex items-center gap-2 px-6 py-4 cursor-pointer">
                                        Sectors
                                        <span className="text-sm font-black">■</span>
                                    </span>
                                </div>

                                <div className={`relative ${active === 'Projects' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'} transition-all duration-200`} onMouseEnter={() => handleMouseEnter('Projects')}>
                                    <span className="navigation-title uppercase font-bold flex items-center gap-2 px-6 py-4 cursor-pointer">
                                        Projects
                                        <span className="text-sm font-black">■</span>
                                    </span>
                                </div>
                            </nav>
                        </div>

                        <button className="lg:hidden w-12 h-12 border-2px border-black bg-white hover:bg-black hover:text-white transition-all duration-200 z-10 flex items-center justify-center" onClick={toggleMobileMenu}>
                            <div className="flex flex-col items-center justify-center">
                                <div className={`w-6 h-1 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : 'mb-1'}`}></div>
                                <div className={`w-6 h-1 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'mb-1'}`}></div>
                                <div className={`w-6 h-1 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
                            </div>
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {active && ['Sectors', 'Projects'].includes(active) && (
                            <motion.div ref={megaMenuRef} key={active} className="absolute top-full left-0 right-0 w-full bg-white border- overflow-hidden" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ height: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }, opacity: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }} onMouseEnter={handleMegaMenuMouseEnter} onMouseLeave={handleMouseLeave}>
                                {active === 'Sectors' && (
                                    <div className="w-full bg-white border-grid">
                                        <div className="grid grid-cols-12 min-h-96">
                                            <div className="col-span-4 border-r-2px border-black bg-gray-50">
                                                <div className="p-6 border-b-2px border-black bg-black text-white">
                                                    <div className="navigation-label text-white">FEATURED SECTORS</div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="grid grid-cols-1 gap-0 border-2px border-black">
                                                        {sectors.slice(0, 2).map((sector, idx) => (
                                                            <motion.div key={sector.uid} className={`${idx > 0 ? 'border-t-2px border-black' : ''}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1, duration: 0.3 }}>
                                                                <TransitionLink href={`/sectors/${sector.uid}`} className="block hover:bg-gray-100 transition-all duration-200">
                                                                    <div className="flex">
                                                                        <div className="w-32 h-32 border-r-2px border-black bg-white flex-shrink-0">
                                                                            {sector.main_image ? (
                                                                                <Image src={sector.main_image} alt={sector.name} width={128} height={128} className="w-full h-full object-cover" />
                                                                            ) : (
                                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                                    <div className="text-gray-500 text-xs font-bold">NO IMAGE</div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className="flex-1 p-4 flex flex-col justify-center">
                                                                            <div className="navigation-title text-lg font-bold mb-2">{sector.name}</div>
                                                                            <div className="navigation-text text-xs font-bold text-gray-600">VIEW SECTOR ▸</div>
                                                                        </div>
                                                                    </div>
                                                                </TransitionLink>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-3 border-r-2px border-black bg-white">
                                                <div className="p-6 border-b-2px border-black bg-black text-white">
                                                    <div className="navigation-label text-white">ALL SECTORS</div>
                                                </div>
                                                <div className="p-6">
                                                    <div className="border-2px border-black">
                                                        {sectors.map((sector, idx) => (
                                                            <motion.div key={sector.uid} className={`${idx > 0 ? 'border-t-2px border-black' : ''} ${activeSector === sector.uid ? 'bg-black text-white' : 'hover:bg-gray-100'} transition-all duration-200`} onMouseEnter={() => setActiveSector(sector.uid)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05, duration: 0.2 }}>
                                                                <TransitionLink href={`/sectors/${sector.uid}`} className="navigation-text text-sm font-bold block px-4 py-3">
                                                                    {sector.name}
                                                                </TransitionLink>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-span-5 bg-gray-50">
                                                <div className="p-6 border-b-2px border-black bg-black text-white">
                                                    <div className="navigation-label text-white">SUBSECTORS</div>
                                                </div>
                                                <div className="p-6">
                                                    <AnimatePresence mode="wait">
                                                        {activeSector && (
                                                            <motion.div key={activeSector} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="grid grid-cols-2 gap-4">
                                                                {sectors.find(s => s.uid === activeSector)?.subsectors.map((subsector, idx) => (
                                                                    <motion.div key={subsector.uid} className="border-2px border-black bg-white hover:bg-gray-100 transition-all duration-200" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05, duration: 0.2 }}>
                                                                        <TransitionLink href={`/sectors/${activeSector}/${subsector.uid}`} className="block">
                                                                            <div className="h-20 border-b-2px border-black bg-white">
                                                                                {subsector.main_image ? (
                                                                                    <Image src={subsector.main_image} alt={subsector.name} width={200} height={80} className="w-full h-full object-cover" />
                                                                                ) : (
                                                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                                        <div className="text-gray-500 text-xs font-bold">NO IMAGE</div>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="p-3">
                                                                                <div className="navigation-text text-xs font-bold mb-1">{subsector.name}</div>
                                                                                <div className="navigation-description text-xs font-bold text-gray-600">{subsector.projects.length} PROJECTS</div>
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
                                    <div className="w-full bg-white">
                                        <div className="p-6 border-b-2px border-black bg-black text-white">
                                            <div className="navigation-label text-white">FEATURED PROJECTS</div>
                                        </div>
                                        <div className="p-8 bg-gray-50">
                                            <div className="grid grid-cols-6 gap-4 mb-8">
                                                {featuredProjects.slice(0, 6).map((project, idx) => (
                                                    <motion.div key={project.uid} className="border-2px border-black bg-white hover:bg-gray-100 transition-all duration-200" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1, duration: 0.3 }}>
                                                        <TransitionLink href={`/projects/${project.uid}`} className="block">
                                                            <div className="h-32 border-b-2px border-black bg-white">
                                                                {project.main_image ? (
                                                                    <Image src={project.main_image} alt={project.name} width={200} height={128} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                        <div className="text-gray-500 text-xs font-bold">NO IMAGE</div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="p-3">
                                                                <div className="navigation-title text-xs font-bold truncate">{project.name}</div>
                                                            </div>
                                                        </TransitionLink>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            <div className="border-t-2px border-black pt-6 bg-white -mx-8 px-8">
                                                <TransitionLink href="/projects" className="navigation-text text-lg font-bold text-black hover:text-gray-700 transition-colors duration-200 inline-flex items-center gap-3 px-6 py-3 border-2px border-black hover:bg-black hover:text-white">
                                                    BROWSE ALL PROJECTS
                                                    <span className="text-xl">▸</span>
                                                </TransitionLink>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <motion.div className="absolute top-full left-0 right-0 w-full bg-white border-l-2px border-r-2px border-b-2px border-black lg:hidden z-40" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}>
                                <div className="bg-gray-50">
                                    <div className="border-b-2px border-black bg-black text-white p-4">
                                        <div className="navigation-label text-white">MENU</div>
                                    </div>
                                    <div className="p-6 space-y-0 border-2px border-black border-t-0 bg-white">
                                        {mainNav.map((item, index) => {
                                            if (!item.title) return null;
                                            if (['sectors', 'projects'].includes(item.title.toLowerCase())) return null;

                                            return (
                                                <div key={`mobile-nav-${item.title}-${index}`} className={`${index > 0 ? 'border-t-2px border-black' : ''}`}>
                                                    <TransitionLink href={getLinkUrl(item.link)} className="navigation-title text-lg font-bold text-black hover:bg-black hover:text-white transition-all duration-200 block px-4 py-4" onClick={() => setIsMobileMenuOpen(false)}>
                                                        {item.title}
                                                    </TransitionLink>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="p-6 bg-gray-50">
                                        <div className="border-b-2px border-black bg-black text-white p-4 mb-4">
                                            <div className="navigation-label text-white">SECTORS</div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {sectors.slice(0, 6).map((sector) => (
                                                <div key={sector.uid} className="border-2px border-black bg-white hover:bg-gray-100 transition-all duration-200">
                                                    <TransitionLink href={`/sectors/${sector.uid}`} className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                                        <div className="h-16 border-b-2px border-black bg-white">
                                                            {sector.main_image ? (
                                                                <Image src={sector.main_image} alt={sector.name} width={200} height={64} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                    <div className="text-gray-500 text-xs font-bold">NO IMAGE</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-3">
                                                            <div className="navigation-text text-xs font-bold">{sector.name}</div>
                                                        </div>
                                                    </TransitionLink>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-white border-t-2px border-black">
                                        <div className="border-b-2px border-black bg-black text-white p-4 mb-4">
                                            <div className="navigation-label text-white">PROJECTS</div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            {featuredProjects.slice(0, 6).map((project) => (
                                                <div key={project.uid} className="border-2px border-black bg-white hover:bg-gray-100 transition-all duration-200">
                                                    <TransitionLink href={`/projects/${project.uid}`} className="block" onClick={() => setIsMobileMenuOpen(false)}>
                                                        <div className="h-16 border-b-2px border-black bg-white">
                                                            {project.main_image ? (
                                                                <Image src={project.main_image} alt={project.name} width={150} height={64} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                    <div className="text-gray-500 text-xs font-bold">NO IMG</div>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-2">
                                                            <div className="navigation-title text-xs font-bold truncate">{project.name}</div>
                                                        </div>
                                                    </TransitionLink>
                                                </div>
                                            ))}
                                        </div>
                                        <TransitionLink href="/projects" className="navigation-text text-sm font-bold text-black hover:bg-black hover:text-white transition-all duration-200 inline-flex items-center gap-2 px-4 py-3 border-2px border-black" onClick={() => setIsMobileMenuOpen(false)}>
                                            VIEW ALL PROJECTS
                                            <span className="text-lg">▸</span>
                                        </TransitionLink>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Navigation;