import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { motion } from 'framer-motion';
import TransitionLink from '@/animation/transitionLink';

interface ProjectCardProps {
    project: Content.ProjectPostDocument;
    url: string;
}

export default function ProjectCard({ project, url }: ProjectCardProps) {
    let sectorName: string | null = null;
    const sector = project.data.sector;

    if (typeof sector === 'string') {
        sectorName = sector;
    } else if (sector && typeof sector === 'object') {
        // @ts-expect-error - Handling dynamic data structure
        sectorName = sector.name || sector.data?.name || null;
    }

    return (
        <motion.article className="border-2px border-black bg-white hover:bg-gray-50 transition-all duration-200 font-helvetica group" transition={{ duration: 0.3, ease: [0.5, 0.75, 0, 1] }}>
            <TransitionLink href={url} className="block h-full">
                <div className="relative aspect-square border-b-2px border-black bg-white overflow-hidden">
                    {project.data.project_main_image?.url ? (
                        <PrismicNextImage field={project.data.project_main_image} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <div className="text-center">
                                <div className="border-2px border-gray-400 bg-white w-16 h-16 mx-auto flex items-center justify-center mb-3">
                                    <div className="text-2xl text-gray-400">📷</div>
                                </div>
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-500">PROJECT IMAGE</div>
                            </div>
                        </div>
                    )}
                    
                    <div className="absolute top-0 left-0 right-0 bg-white bg-opacity-90 border-b-2px border-black backdrop-blur-sm p-3">
                        <div className="flex items-center justify-between">
                            {sectorName && (
                                <div className="border-2px border-black bg-black text-white px-2 py-1">
                                    <div className="text-xs font-bold uppercase tracking-wider">{sectorName}</div>
                                </div>
                            )}
                            {project.data.year && (
                                <div className="border-2px border-black bg-white text-black px-2 py-1">
                                    <div className="text-xs font-bold uppercase tracking-wider">{project.data.year}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 border-t-2px border-black backdrop-blur-sm p-3">
                        <div className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 p-2 text-center group-hover:translate-y-[-2px] transform transition-transform duration-200">
                            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider">
                                <span>VIEW PROJECT</span>
                                <span className="text-sm">▸</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-black mb-3 line-clamp-2">{project.data.client_name}</h2>

                    {project.data.location && (
                        <div className="border-t-2px border-black pt-3">
                            <div className="flex items-center gap-2">
                                <div className="border-2px border-black bg-gray-50 w-6 h-6 flex items-center justify-center flex-shrink-0">
                                    <div className="w-3 h-3 border border-black rounded-full bg-black"></div>
                                </div>
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-600">{project.data.location}</div>
                            </div>
                        </div>
                    )}
                </div>
            </TransitionLink>
        </motion.article>
    );
}