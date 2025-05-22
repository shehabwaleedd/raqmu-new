'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Content, isFilled } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import Button from '@/ui/button';
import styles from './style.module.scss';

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
    const titleY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    const [activeSubsector, setActiveSubsector] = useState<string | null>(
        subsectors.length > 0 ? subsectors[0].uid : null
    );


    return (
        <motion.div className={styles.sectorPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <section ref={heroRef} className={styles.heroSection}>
                <motion.div>
                    {isFilled.image(sector.data.main_image) && (
                        <PrismicNextImage field={sector.data.main_image} sizes="100vw" priority fill />)}
                    <div className={styles.heroOverlay} />
                </motion.div>

                <div className={styles.container}>
                    <motion.div className={styles.heroContent} style={{ y: titleY }}>
                        <motion.h1 className={styles.sectorTitle} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            {sector.data.name}
                        </motion.h1>

                        <motion.div className={styles.sectorDescription} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                            <PrismicRichText field={sector.data.description} />
                        </motion.div>

                        <motion.div className={styles.heroButtons} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
                            <Button href="#areas" variant="primary" size="lg" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}>
                                Explore Areas
                            </Button>

                            <Button href="/contact" variant="outline" size="lg" className={styles.whiteOutline}>
                                Get in Touch
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {subsectors.length > 0 && (
                <section id="areas" className={styles.areasSection}>
                    <div className={styles.container}>
                        <motion.div className={styles.sectionHeader} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true, margin: "-100px" }}>
                            <span className={styles.sectionEyebrow}>Our Expertise</span>
                            <h2 className={styles.sectionTitle}>Specialized Areas</h2>
                            <p className={styles.sectionSubtitle}>
                                Explore our comprehensive range of specialized services within the {sector.data.name} sector.
                            </p>
                        </motion.div>

                        <motion.div className={styles.areasTabs} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true, margin: "-100px" }}>
                            {subsectors.map((subsector) => (
                                <button key={subsector.uid} className={`${styles.areaTab} ${activeSubsector === subsector.uid ? styles.active : ''}`} onClick={() => setActiveSubsector(subsector.uid)}>
                                    {subsector.data.name}
                                    {activeSubsector === subsector.uid && (<motion.div className={styles.activeIndicator} layoutId="activeAreaIndicator" transition={{ type: "spring", duration: 0.5 }} />)}
                                </button>
                            ))}
                        </motion.div>

                        <div className={styles.areasContent}>
                            {subsectors.map((subsector) => (
                                <motion.div key={subsector.uid} className={styles.areaPanel} initial={false} animate={{ opacity: activeSubsector === subsector.uid ? 1 : 0, display: activeSubsector === subsector.uid ? 'flex' : 'none' }} transition={{ duration: 0.4 }}>
                                    <div className={styles.areaInfo}>
                                        <h3 className={styles.areaTitle}>{subsector.data.name}</h3>

                                        <div className={styles.areaDescription}>
                                            <PrismicRichText field={subsector.data.description} />
                                        </div>

                                        <Button href={`/sectors/${sector.uid}/${subsector.uid}`} variant="primary" size="lg" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}>
                                            View Projects
                                        </Button>
                                    </div>

                                    <div className={styles.areaImageContainer}>
                                        {isFilled.image(subsector.data.main_image) && (
                                            <div className={styles.areaImage}>
                                                <PrismicNextImage field={subsector.data.main_image} sizes="(max-width: 768px) 100vw, 50vw" fill />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </motion.div>
    );
}