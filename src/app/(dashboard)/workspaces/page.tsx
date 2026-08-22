import { createClient } from "@/lib/supabase/server";

export default async function WorkspacesPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  console.log(data);

  return (
    <div>
      {data ? (
        <h1 className="text-foreground text-2xl font-semibold">
          Welcome back{" "}
          <b className="text-primary font-extrabold">
            {data.claims.user_metadata?.full_name}
          </b>
        </h1>
      ) : (
        <h1 className="text-foreground text-2xl font-semibold">
          Unauthenticated...
        </h1>
      )}
    </div>
  );
}
