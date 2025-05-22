'use client';

import { Content, isFilled } from '@prismicio/client';
import { PrismicRichText } from '@prismicio/react';
import { PrismicNextImage } from '@prismicio/next';
import Gallery from '@/components/projects/gallery';
import TransitionLink from '@/animation/transitionLink';
import Breadcrumbs, { BreadcrumbItem } from '@/components/breadCrumbs';
import { createClient } from '@/prismicio';
import { motion } from 'framer-motion';

interface ProjectDetailProps {
    project: Content.ProjectPostDocument;
    sector: Content.SectorPostDocument;
    subsector: Content.SubsectorPostDocument;
}

export default function ProjectDetail({ project, sector, subsector }: ProjectDetailProps) {
    const { data } = project;

    const breadcrumbItems: BreadcrumbItem[] = [
        { label: 'Home', href: '/' },
        { label: 'Sectors', href: '/sectors' },
        { label: sector.data.name || '', href: `/sectors/${sector.uid}` },
        { label: subsector.data.name || '', href: `/sectors/${sector.uid}/${subsector.uid}` },
        { label: data.client_name || '', href: `/sectors/${sector.uid}/${subsector.uid}/${project.uid}`, current: true }
    ];

    return (
        <motion.div className="w-full bg-white font-helvetica border-2px border-black" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <div className="border-b-2px border-black bg-white p-4 sm:p-6">
                <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12">
                <aside className="xl:col-span-3 border-b-2px xl:border-b-0 xl:border-r-2px border-black bg-gray-50">
                    <div className="border-b-2px border-black bg-white p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-bold uppercase tracking-wider text-black">PROJECT DETAILS</div>
                            <div className="border-2px border-black bg-gray-50 px-3 py-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">{data.year}</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 space-y-0">
                        <div className="border-2px border-black bg-white">
                            <div className="border-b-2px border-black bg-gray-50 p-3 sm:p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">CLIENT</div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="text-lg font-bold uppercase tracking-wider text-black">{data.client_name}</div>
                            </div>
                        </div>

                        <div className="border-2px border-black border-t-0 bg-white">
                            <div className="border-b-2px border-black bg-gray-50 p-3 sm:p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">ROLE</div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="text-sm font-bold uppercase tracking-wider text-black">{data.role}</div>
                            </div>
                        </div>

                        <div className="border-2px border-black border-t-0 bg-white">
                            <div className="border-b-2px border-black bg-gray-50 p-3 sm:p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">SECTOR</div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <TransitionLink href={`/sectors/${sector.uid}`} className="text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors duration-200">
                                    {sector.data.name || ''}
                                </TransitionLink>
                            </div>
                        </div>

                        <div className="border-2px border-black border-t-0 bg-white">
                            <div className="border-b-2px border-black bg-gray-50 p-3 sm:p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">SUBSECTOR</div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <TransitionLink href={`/sectors/${sector.uid}/${subsector.uid}`} className="text-sm font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors duration-200">
                                    {subsector.data.name || ''}
                                </TransitionLink>
                            </div>
                        </div>

                        <div className="border-2px border-black border-t-0 bg-white">
                            <div className="border-b-2px border-black bg-gray-50 p-3 sm:p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">LOCATION</div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="text-sm font-bold uppercase tracking-wider text-black">{data.location}</div>
                            </div>
                        </div>

                        <div className="border-2px border-black border-t-0 bg-white">
                            <div className="border-b-2px border-black bg-gray-50 p-3 sm:p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">YEAR</div>
                            </div>
                            <div className="p-3 sm:p-4">
                                <div className="text-sm font-bold uppercase tracking-wider text-black">{data.year}</div>
                            </div>
                        </div>
                    </div>

                    <div className="border-t-2px border-black bg-white p-4 sm:p-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="border-2px border-black bg-gray-50 p-3">
                                <div className="text-lg font-black text-black mb-1">01</div>
                                <div className="text-xs font-bold uppercase tracking-wider text-black">PROJECT</div>
                            </div>
                            <div className="border-2px border-black bg-white p-3">
                                <div className="text-lg font-black text-black mb-1">•</div>
                                <div className="text-xs font-bold uppercase tracking-wider text-black">ACTIVE</div>
                            </div>
                        </div>
                    </div>
                </aside>

                <main className="xl:col-span-9 bg-white">
                    <div className="border-b-2px border-black bg-white p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-sm font-bold uppercase tracking-wider text-black">PROJECT SHOWCASE</div>
                            <div className="border-2px border-black bg-gray-50 px-3 py-1">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">MAIN</div>
                            </div>
                        </div>
                    </div>

                    <div className="p-4 sm:p-6 lg:p-8">
                        <motion.div className="border-2px border-black bg-white mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                            <div className="border-b-2px border-black bg-gray-50 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm font-bold uppercase tracking-wider text-black">PRIMARY IMAGE</div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-600">HERO</div>
                                </div>
                            </div>

                            <div className="aspect-video sm:aspect-[16/10] bg-white relative overflow-hidden">
                                {isFilled.image(data.project_main_image) ? (
                                    <PrismicNextImage field={data.project_main_image} sizes="(max-width: 768px) 100vw, 70vw" priority fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="border-2px border-gray-400 bg-white w-20 h-20 mx-auto flex items-center justify-center mb-4">
                                                <div className="text-3xl text-gray-400">📷</div>
                                            </div>
                                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">PROJECT IMAGE</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        <motion.div className="border-2px border-black bg-white mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                            <div className="border-b-2px border-black bg-gray-50 p-4">
                                <div className="text-sm font-bold uppercase tracking-wider text-black">PROJECT DESCRIPTION</div>
                            </div>

                            <div className="p-6 sm:p-8">
                                <div className="prose prose-lg max-w-none text-black leading-relaxed [&>p]:mb-6 [&>p]:text-base sm:[&>p]:text-lg [&>p]:font-medium [&>p]:leading-relaxed [&>p]:text-gray-800 [&>h2]:text-xl sm:[&>h2]:text-2xl [&>h2]:font-black [&>h2]:uppercase [&>h2]:tracking-wider [&>h2]:text-black [&>h2]:mb-4 [&>h3]:text-lg sm:[&>h3]:text-xl [&>h3]:font-bold [&>h3]:uppercase [&>h3]:tracking-wider [&>h3]:text-black [&>h3]:mb-3 [&>ul]:space-y-2 [&>ul>li]:text-base [&>ul>li]:font-medium [&>ul>li]:text-gray-800">
                                    <PrismicRichText field={data.description} />
                                </div>
                            </div>
                        </motion.div>

                        {data.gallery_images && data.gallery_images.length > 0 && (
                            <Gallery images={data.gallery_images} />
                        )}
                    </div>

                    <div className="border-t-2px border-black bg-white p-4 sm:p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center sm:text-left">
                            <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                                PROJECT: {data.client_name?.toUpperCase()}
                            </div>
                            <div className="sm:text-center">
                                <div className="border-2px border-black bg-gray-50 px-3 py-1 sm:px-4 sm:py-2 inline-block">
                                    <div className="text-xs font-bold uppercase tracking-wider text-black">PORTFOLIO</div>
                                </div>
                            </div>
                            <div className="sm:text-right">
                                <div className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                                    {data.year} • {data.location?.toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {isFilled.contentRelationship(data.next_project) && data.next_project.uid && (
                <NextProjectLink nextProjectUid={data.next_project.uid as string} />
            )}
        </motion.div>
    );
}

interface NextProjectLinkProps {
    nextProjectUid: string;
}

async function NextProjectLink({ nextProjectUid }: NextProjectLinkProps) {
    const client = createClient();

    try {
        const nextProject = await client.getByUID<Content.ProjectPostDocument>('project_post', nextProjectUid);
        let sectorUid = '';
        let subsectorUid = '';

        if (isFilled.contentRelationship(nextProject.data.sector)) {
            const sector = await client.getByID(nextProject.data.sector.id) as Content.SectorPostDocument;
            sectorUid = sector.uid;
        }

        if (isFilled.contentRelationship(nextProject.data.subsector)) {
            const subsector = await client.getByID(nextProject.data.subsector.id) as Content.SubsectorPostDocument;
            subsectorUid = subsector.uid;
        }

        const nextProjectUrl = `/sectors/${sectorUid}/${subsectorUid}/${nextProject.uid}`;

        return (
            <div className="border-t-2px border-black bg-white">
                <TransitionLink href={nextProjectUrl} className="block group">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        <div className="lg:col-span-1 border-b-2px lg:border-b-0 lg:border-r-2px border-black bg-gray-50 p-6 sm:p-8 flex flex-col justify-center">
                            <div className="border-2px border-black bg-white px-4 py-2 inline-block mb-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-black">NEXT PROJECT</div>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black uppercase tracking-wider text-black leading-tight mb-4">
                                {nextProject.data.client_name}
                            </h2>
                            <div className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 p-4 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wider group-hover:translate-x-1 transform transition-transform duration-200">
                                <span>VIEW PROJECT</span>
                                <span className="text-lg">▸</span>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white relative overflow-hidden">
                            <div className="h-64 sm:h-80 lg:h-96 relative">
                                {isFilled.image(nextProject.data.project_main_image) ? (
                                    <>
                                        <PrismicNextImage field={nextProject.data.project_main_image} sizes="(max-width: 1024px) 100vw, 66vw" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="border-2px border-gray-400 bg-white w-24 h-24 mx-auto flex items-center justify-center mb-4">
                                                <div className="text-4xl text-gray-400">📷</div>
                                            </div>
                                            <div className="text-sm font-bold uppercase tracking-wider text-gray-500">NEXT PROJECT IMAGE</div>
                                        </div>
                                    </div>
                                )}

                                <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t-2px border-black backdrop-blur-sm p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="text-xs font-bold uppercase tracking-wider text-black">
                                            {nextProject.data.client_name}
                                        </div>
                                        <div className="border-2px border-black bg-black text-white px-3 py-1 group-hover:bg-white group-hover:text-black transition-all duration-200">
                                            <div className="text-xs font-bold uppercase tracking-wider">NEXT</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TransitionLink>
            </div>
        );
    } catch (error) {
        console.error('Error fetching next project:', error);
        return null;
    }
}