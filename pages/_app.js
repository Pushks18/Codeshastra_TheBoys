import { ThirdwebProvider } from "@thirdweb-dev/react";
import "../styles/globals.css";
import NavbarC from "../components/navbar";

// This is the chain your dApp will work on.
// Change this to the chain your app is built for.
// You can also import additional chains from `@thirdweb-dev/chains` and pass them directly.
const activeChain = "sepolia";

function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId={process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID}
      authConfig={{
        domain: process.env.DOMAIN || "",
        authUrl: "/api/auth",
      }}
    >
      <NavbarC />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
