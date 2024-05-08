import { getStore } from "@netlify/blobs";

export default async (req, res) => {
  const story = getStore("story");
  await story.setJSON(req.body.storyId, req.body.storyData);
  return new Response("Story Saved!", {
    headers: { "content-type": "text/html" },
  });
};
