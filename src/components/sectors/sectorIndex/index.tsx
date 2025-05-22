'use client';

import { Content } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { motion } from 'framer-motion';
import SectionHeader from '@/ui/sectionHeader/index';
import Card from '@/ui/card/index';

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
        <div className="w-full bg-white font-helvetica border-2px border-black">
            <div className="border-b-2px border-black bg-white p-6 sm:p-8 lg:p-12">
                <SectionHeader 
                    eyebrow="Expertise" 
                    title="Our Sectors" 
                    subtitle="Explore our comprehensive range of construction expertise across various sectors, from commercial properties to residential developments and specialized facilities." 
                />
            </div>

            <div className="p-6 sm:p-8 lg:p-12 bg-gray-50">
                <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer} initial="initial" animate="animate">
                    {sectors.map((sector, index) => (
                        <motion.div key={sector.uid} variants={fadeInUp} transition={{ delay: index * 0.05 }} className="border-2px border-black bg-white hover:bg-gray-50 transition-all duration-200">
                            <Card 
                                title={sector.data.name || ''} 
                                description={<PrismicRichText field={sector.data.description} />} 
                                imageSrc={sector.data.main_image?.url || ''} 
                                imageAlt={sector.data.main_image?.alt || sector.data.name || ''} 
                                href={`/sectors/${sector.uid}`} 
                                actionText="Explore Sector" 
                                variant="simple" 
                                aspectRatio="square" 
                            />
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            <div className="border-t-2px border-black bg-white p-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
                    <div className="text-sm font-bold uppercase tracking-wider text-black">
                        SECTORS DIRECTORY
                    </div>
                    <div className="sm:text-center">
                        <div className="border-2px border-black bg-gray-50 px-4 py-2 inline-block">
                            <div className="text-xs font-bold uppercase tracking-wider text-black">EXPERTISE</div>
                        </div>
                    </div>
                    <div className="sm:text-right">
                        <div className="text-sm font-bold uppercase tracking-wider text-black">
                            {sectors.length} ACTIVE SECTORS
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}