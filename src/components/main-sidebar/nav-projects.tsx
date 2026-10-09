"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RiAddLine, RiFolder3Line } from "@remixicon/react";

import {
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useGetProjects,
    ProjectCreateModal,
    ProjectUpdateModal,
    ProjectActions,
    ProjectDeleteDialog,
    type ProjectItem,
} from "@/features/project";

export function NavProjects() {
    const params = useParams<{ workspaceId: string }>();
    const workspaceId = params?.workspaceId;
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [projectToUpdate, setProjectToUpdate] = useState<ProjectItem | null>(null);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const { data, isLoading } = useGetProjects(workspaceId, {
        page: 1,
        rowSize: 10,
    });

    const projects = data?.projects ?? [];
    const recentProjects = projects.slice(0, 10);

    const handleUpdateProject = (project: ProjectItem) => {
        setProjectToUpdate(project);
        setIsUpdateOpen(true);
    };

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>RECENT PROJECTS</SidebarGroupLabel>
            <SidebarGroupAction
                title="Add project"
                aria-label="Add project"
                onClick={() => setIsCreateOpen(true)}
                className="cursor-pointer"
            >
                <RiAddLine />
            </SidebarGroupAction>
            <SidebarGroupContent>
                {isLoading && recentProjects.length === 0 ? (
                    <SidebarMenu>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <SidebarMenuItem key={i} className="px-2 py-1">
                                <Skeleton className="h-6 w-full rounded-md" />
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                ) : recentProjects.length === 0 ? (
                    <p className="px-2 py-1.5 text-muted-foreground text-xs">
                        No projects yet.
                    </p>
                ) : (
                    <SidebarMenu>
                        {recentProjects.map((project) => (
                            <SidebarMenuItem key={project.id}>
                                <SidebarMenuButton
                                    tooltip={project.name}
                                    render={
                                        <Link
                                            href={`/workspaces/${workspaceId}/projects/${project.id}`}
                                        />
                                    }
                                >
                                    <RiFolder3Line className="size-4 shrink-0 text-muted-foreground" />
                                    <span className="truncate">
                                        {project.name}
                                    </span>
                                </SidebarMenuButton>
                                <ProjectDeleteDialog project={project}>
                                    {(confirmDelete) => (
                                        <ProjectActions
                                            project={project}
                                            asSidebarAction
                                            onUpdate={handleUpdateProject}
                                            onDelete={confirmDelete}
                                        />
                                    )}
                                </ProjectDeleteDialog>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                )}
            </SidebarGroupContent>

            {workspaceId && (
                <>
                    <ProjectCreateModal
                        workspaceId={workspaceId}
                        open={isCreateOpen}
                        onOpenChange={setIsCreateOpen}
                    />
                    <ProjectUpdateModal
                        project={projectToUpdate}
                        open={isUpdateOpen}
                        onOpenChange={setIsUpdateOpen}
                    />
                </>
            )}
        </SidebarGroup>
    );
}
