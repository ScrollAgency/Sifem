import { useRouter } from "next/router";
import { useEffect } from "react";
import { usePlasmicAuthData } from "../utils/usePlasmicAuth";

export function withAuthProtection<P extends JSX.IntrinsicAttributes>(
  Component: React.ComponentType<P>
) {
  return function ProtectedPage(props: P) {
    const router = useRouter();
    const { isUserLoading, plasmicUser } = usePlasmicAuthData();

    useEffect(() => {
      if (!isUserLoading && !plasmicUser) {
        router.replace("/login");
      }
    }, [isUserLoading, plasmicUser, router]);

    if (isUserLoading || !plasmicUser) {
      return null; // ou un loader
    }

    return <Component {...props} />;
  };
}
