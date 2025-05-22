'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Content, isFilled } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import Breadcrumbs from '@/components/breadCrumbs';
import ProjectsClient from '@/components/projects/ProjectsClient';
import Button from '@/ui/button';
import styles from './style.module.scss';

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

    const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const titleY = useTransform(scrollYProgress, [0, 1], [0, 20]);

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
        <motion.div className={styles.sectorPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <section ref={heroRef} className={styles.heroSection}>
                <motion.div className={styles.heroImage} style={{ scale: heroScale, y }}>
                    {isFilled.image(subsector.data.main_image) ? (
                        <PrismicNextImage field={subsector.data.main_image} sizes="100vw" priority fill />
                    ) : isFilled.image(sector.data.main_image) ? (
                        <PrismicNextImage field={sector.data.main_image} sizes="100vw" priority fill />
                    ) : null}
                    <div className={styles.heroOverlay} />
                </motion.div>

                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <motion.div className={styles.breadcrumbWrapper} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <Breadcrumbs items={breadcrumbItems} />
                        </motion.div>

                        <motion.div className={styles.titleContainer} style={{ y: titleY }}>
                            <motion.span className={styles.sectorName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                                {sector.data.name}
                            </motion.span>

                            <motion.h1 className={styles.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                                {subsector.data.name}
                            </motion.h1>

                            <motion.div className={styles.description} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <PrismicRichText field={subsector.data.description} />
                            </motion.div>

                            <motion.div className={styles.heroActions} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                                <Button href="#projects" variant="primary" size="md" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}>
                                    Explore Projects
                                </Button>

                                <Button href={`/sectors/${sector.uid}`} variant="outline" size="md" className={styles.whiteOutline}>
                                    Back to {sector.data.name}
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section id="projects" className={styles.projectsSection}>
                <motion.div className={styles.projectsContainer} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} viewport={{ once: true, margin: "-100px" }}>
                    <ProjectsClient projects={projects} sectors={[]} subSectors={[]} locations={locations} />
                </motion.div>
            </section>
        </motion.div>
    );
}