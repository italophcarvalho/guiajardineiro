import { Suspense } from "react";
import { PostEditor } from "@/components/admin/PostEditor";

/**
 * Admin — Post editor.
 * PostEditor reads ?id= via useSearchParams, so it must run inside Suspense.
 */
export default function EditorPage() {
  return (
    <Suspense>
      <PostEditor />
    </Suspense>
  );
}
