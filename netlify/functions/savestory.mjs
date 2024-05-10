import { getStore } from "@netlify/blobs";

export const handler = async (req, res) => {
  const story = getStore({
    siteID: process.env.MY_SITE_ID,
    token: process.env.MY_SITE_TOKEN,
    name: "story",
  });
  await story.setJSON("storyData", {
    storyId: req.body.storyId,
    storyData: req.body.storyData,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Story Saved" }),
  };
};
