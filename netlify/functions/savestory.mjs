import { getStore } from "@netlify/blobs";

export const handler = async (req, res) => {
  req.body = JSON.parse(req.body);

  const story = getStore({
    siteID: process.env.MY_SITE_ID,
    token: process.env.MY_SITE_TOKEN,
    name: "story",
  });

  await story.setJSON(`storyData_${req.body.storyId}`, {
    storyId: req.body.storyId,
    storyData: req.body.storyData,
    ...req.body,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Story Saved" }),
  };
};
