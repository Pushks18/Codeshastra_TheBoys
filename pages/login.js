import {
  ConnectEmbed,
  useAddress,
  useShowConnectEmbed,
} from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const loginOptional = false;

const Login = () => {
  const showConnectEmbed = useShowConnectEmbed();
  const address = useAddress();
  const router = useRouter();

  useEffect(() => {
    if (address) {
      router.push("/profile");
    }
  }, [address, router]);
  return (
    <section className="flex justify-center">
      <div className="">
        {/* <h1 className="text-slate-700">Login</h1> */}
        {showConnectEmbed ? (
          <ConnectEmbed
            className="mt-10"
            auth={{
              loginOptional,
              onLogin() {
                console.log("login");
              },
              onLogout() {
                console.log("logout");
              },
            }}
          />
        ) : (
          <p>Signing in...</p>
        )}
      </div>
    </section>
  );
};
export default Login;
