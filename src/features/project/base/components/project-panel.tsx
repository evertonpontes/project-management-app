"use client";

import { useState } from "react";
import { useGetProjects } from "../hooks";
import { ProjectHeader } from "./project-header";
import { ProjectGrid } from "./project-grid";
import { ProjectPagination } from "./project-pagination";
import { ProjectCreateModal } from "./project-create-modal";
import { ProjectUpdateModal } from "./project-update-modal";
import type { ProjectItem } from "../types";

export interface ProjectPanelProps {
    workspaceId: string;
    title?: string;
    description?: string;
    initialProjects?: ProjectItem[];
    className?: string;
}

export function ProjectPanel({
    workspaceId,
    title = "Projects",
    description = "Manage and collaborate on projects within this workspace.",
    initialProjects,
    className = "",
}: ProjectPanelProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [projectToUpdate, setProjectToUpdate] = useState<ProjectItem | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 9;

    const { data, isLoading } = useGetProjects(workspaceId, {
        page,
        rowSize: pageSize,
    });

    const projects: ProjectItem[] =
        data?.projects || initialProjects || [];
    const totalProjects = data?.pagination.total ?? projects.length;
    const totalPages = data?.pagination.totalPages ?? Math.ceil(totalProjects / pageSize);

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            setPage((prev) => prev + 1);
        }
    };

    const handlePageSelect = (selectedPage: number) => {
        setPage(selectedPage);
    };

    const handleOpenUpdateModal = (project: ProjectItem) => {
        setProjectToUpdate(project);
        setIsUpdateModalOpen(true);
    };

    return (
        <div
            className={`flex flex-col w-full space-y-6 ${className}`}
            data-slot="project-panel"
        >
            <ProjectHeader
                title={title}
                description={description}
                totalProjects={totalProjects}
                onAddProject={() => setIsCreateModalOpen(true)}
            />

            <ProjectGrid
                projects={projects}
                workspaceId={workspaceId}
                isLoading={isLoading && projects.length === 0}
                onAddProject={() => setIsCreateModalOpen(true)}
                onUpdateProject={handleOpenUpdateModal}
            />

            {totalProjects > 0 && (
                <ProjectPagination
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    totalRows={totalProjects}
                    canPreviousPage={page > 1}
                    canNextPage={page < totalPages}
                    onPreviousPage={handlePreviousPage}
                    onNextPage={handleNextPage}
                    onPageSelect={handlePageSelect}
                />
            )}

            <ProjectCreateModal
                workspaceId={workspaceId}
                open={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
            />

            <ProjectUpdateModal
                project={projectToUpdate}
                open={isUpdateModalOpen}
                onOpenChange={setIsUpdateModalOpen}
            />
        </div>
    );
}

export default ProjectPanel;
