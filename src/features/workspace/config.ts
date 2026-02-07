export const API_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT!;
export const STORAGE_ID = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!;
export const PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!;

export enum USER_ROLES {
  owner = "owner",
  admin = "admin",
  member = "member",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const USER_ROLES_WORKSPACE: Record<string, { [key: string]: any }> = {
  owner: {
    "workspace-permissions": {
      read: true,
      update: true,
      delete: true,
    },
    "project-permissions": {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    "team_member-permissions": {
      read: true,
      update: true,
      delete: true,
    },
  },
  admin: {
    "workspace-permissions": {
      read: true,
      update: false,
      delete: false,
    },
    "project-permissions": {
      create: true,
      read: true,
      update: true,
      delete: true,
    },
    "team_member-permissions": {
      read: true,
      update: true,
      delete: true,
    },
  },
  member: {
    "workspace-permissions": {
      read: true,
      update: false,
      delete: false,
    },
    "project-permissions": {
      create: false,
      read: true,
      update: false,
      delete: false,
    },
    "team_member-permissions": {
      read: true,
      update: false,
      delete: false,
    },
  },
};
