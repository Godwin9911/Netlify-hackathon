import { getStore } from "@netlify/blobs";

export const handler = async (req, res) => {
  const fileId = req.path.substring(req.path.lastIndexOf("/") + 1);

  const story = getStore({
    siteID: process.env.MY_SITE_ID,
    token: process.env.MY_SITE_TOKEN,
    name: "story",
  });

  await story.set(`file_${fileId}`, req.body);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "File Saved" }),
  };
};
