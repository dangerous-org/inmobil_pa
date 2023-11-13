import { OAuth2Client } from "google-auth-library";
const client = new OAuth2Client(process.env.ID_CLIENT_GOOGLE);
const googleVerify = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.ID_CLIENT_GOOGLE 
  });
  const payload = ticket.getPayload();
  const userid = payload["sub"];
  return {payload, userid};

};
export default googleVerify;