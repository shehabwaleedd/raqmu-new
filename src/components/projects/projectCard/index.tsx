import { Content } from '@prismicio/client';
import { PrismicNextImage } from '@prismicio/next';
import { motion } from 'framer-motion';
import TransitionLink from '@/animation/transitionLink';
import styles from './style.module.scss';

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
        <motion.article className={styles.card} transition={{ duration: 0.3, ease: [0.5, 0.75, 0, 1] }}>
            <TransitionLink href={url} className={styles.link}>
                <div className={styles.imageWrapper}>
                    <PrismicNextImage
                        field={project.data.project_main_image}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={styles.image}
                    />

                    <div className={styles.imageOverlay}>
                        {sectorName && (
                            <div className={styles.tag}>
                                {sectorName}
                            </div>
                        )}

                        {project.data.year && (
                            <div className={styles.year}>{project.data.year}</div>
                        )}
                    </div>
                </div>
                <div className={styles.action}>
                    View Project
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className={styles.content}>
                    <h2 className={styles.title}>{project.data.client_name}</h2>

                    {project.data.location && (
                        <div className={styles.location}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {project.data.location}
                        </div>
                    )}
                </div>


            </TransitionLink>
        </motion.article>
    );
}