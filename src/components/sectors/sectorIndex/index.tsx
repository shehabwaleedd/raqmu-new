'use client';

import { Content } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { motion } from 'framer-motion';
import SectionHeader from '@/ui/sectionHeader/index';
import Card from '@/ui/card/index';
import styles from './style.module.scss';

interface SectorsIndexProps {
    sectors: Content.SectorPostDocument[];
}

export default function SectorsIndex({ sectors }: SectorsIndexProps) {
    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: [0.25, 0.8, 0.25, 1] }
    };

    return (
        <div className={styles.sectorsPage}>
            <div className={styles.container}>
                <SectionHeader eyebrow="Expertise" title="Our Sectors" subtitle="Explore our comprehensive range of construction expertise across various sectors, from commercial properties to residential developments and specialized facilities." />
                <motion.div className={styles.sectorsList} variants={staggerContainer} initial="initial" animate="animate">
                    {sectors.map((sector, index) => (
                        <motion.div key={sector.uid} variants={fadeInUp} transition={{ delay: index * 0.05 }} >
                            <Card title={sector.data.name || ''} description={<PrismicRichText field={sector.data.description} />} imageSrc={sector.data.main_image?.url || ''} imageAlt={sector.data.main_image?.alt || sector.data.name || ''} href={`/sectors/${sector.uid}`} actionText="Explore Sector" variant="simple" aspectRatio="square" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}