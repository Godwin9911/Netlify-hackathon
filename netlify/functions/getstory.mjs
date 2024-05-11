import { getStore } from "@netlify/blobs";

export const handler = async (req, res) => {
  // console.log(req);
  const storyId = req.path.substring(req.path.lastIndexOf("/") + 1);

  const story = getStore({
    siteID: process.env.MY_SITE_ID,
    token: process.env.MY_SITE_TOKEN,
    name: "story",
  });
  console.log(storyId);
  const storyFound = await story.get(`storyData_${storyId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Story Gotten", storyFound }),
  };
};
