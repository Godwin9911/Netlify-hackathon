import { getStore } from "@netlify/blobs";

export const handler = async (req, res) => {
  // console.log(req);
  const fileId = req.path.substring(req.path.lastIndexOf("/") + 1);

  const story = getStore({
    siteID: process.env.MY_SITE_ID,
    token: process.env.MY_SITE_TOKEN,
    name: "story",
  });
  const file = await story.get(`file_${fileId}`);

  return {
    statusCode: 200,
    "Content-type": "image/png",
    isBase64Encoded: true,
    body: file,
  };
};
