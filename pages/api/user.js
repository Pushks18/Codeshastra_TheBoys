import { getUser } from "./auth/[...thirdweb]";

const handler = async (req, res) => {
  // Get the user off the request
  const user = await getUser(req);

  // Check if the user is authenticated
  if (!user) {
    return res.status(401).json({
      message: "Not authorized.",
    });
  }

  // Return the secret message to the authenticated user
  return res.status(200).json({
    user: user,
  });
};

export default handler;
