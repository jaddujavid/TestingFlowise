export default async function handler(req, res) {
  try {
    const { name, email } = req.body;

    // STEP 1: Get Access Token
    const tokenRes = await fetch(
      "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=" + process.env.ZOOM_ACCOUNT_ID,
      {
        method: "POST",
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              process.env.ZOOM_CLIENT_ID + ":" + process.env.ZOOM_CLIENT_SECRET
            ).toString("base64"),
        },
      }
    );

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // STEP 2: Register User
    const zoomRes = await fetch(
      `https://api.zoom.us/v2/webinars/${process.env.ZOOM_WEBINAR_ID}/registrants`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          first_name: name,
        }),
      }
    );

    const data = await zoomRes.json();

    res.status(200).json({
      success: true,
      join_url: data.join_url,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
