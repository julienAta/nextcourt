import AllSessions from "~/components/AllSessions";
import { useSession } from "next-auth/react";

// Display Profile page
export default function Admin() {
  const { data: session, status } = useSession();
  if (status === "unauthenticated") {
    return <p className=" flex justify-center text-4xl">Access Denied</p>;
  }

  // Display user sessions
  return (
    <>
      <>
        <p className="my-8 mt-20 flex justify-center text-3xl font-medium text-darkest">
          Admin
        </p>
        <div className=" flex justify-center text-xl">
          <p>List of sessions programmed</p>
        </div>
        <div className="mt-10  flex justify-center">
          <AllSessions />
        </div>
      </>
    </>
  );
}
