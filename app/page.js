import { syncUser } from "@/lib/SyncUser";

export default async function Home() {
  await syncUser();
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
