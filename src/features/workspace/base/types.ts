import { Database } from "@/lib/supabase/database.types";

export type Workspace = Database["public"]["Tables"]["workspaces"]["Row"];
