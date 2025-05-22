'use client';

import { Content } from '@prismicio/client';
import ProjectsClient from '../ProjectsClient';

interface ProjectsIndexProps {
    projects: Content.ProjectPostDocument[];
}

export default function ProjectsIndex({ projects }: ProjectsIndexProps) {
    const locations = [...new Set(
        projects
            .map(p => p.data.location as string)
            .filter(Boolean)
    )];

    return (
        <ProjectsClient projects={projects} locations={locations} sectors={[]} subSectors={[]} />
    );
}