import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";

export async function DeployButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;
  return (
    <>
      {user && (
        <Link href="/protected/task">
          <Button className="flex items-center gap-2" size="sm">
            <span>Go to task</span>
          </Button>
        </Link>
      )}
    </>
  );
}
