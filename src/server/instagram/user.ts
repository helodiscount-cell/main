import {
  buildGraphApiUrl,
  ERROR_MESSAGES,
  GRAPH_API,
  GRAPH_API_FIELDS,
  RATE_LIMITS,
} from "@/server/config/instagram.config";
import { fetchWithTimeout } from "../utils/fetch-with-timeout";
import {
  InstagramPostsResponse,
  InstagramStoriesResponse,
} from "@dm-broo/common-types";

export const getUserPostsFromInstagram = async (
  instagramUserId: string,
  accessToken: string,
) => {
  const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.USER_MEDIA(instagramUserId));
  url.searchParams.set("fields", GRAPH_API_FIELDS.POSTS.join(","));
  url.searchParams.set("limit", RATE_LIMITS.POSTS_PER_REQUEST.toString());
  url.searchParams.set("access_token", accessToken);

  const result = await fetchWithTimeout<InstagramPostsResponse>(
    url.toString(),
    {
      method: "GET",
      instagramUserId,
    },
  );

  return result;
};

export const getUserStoriesFromInstagram = async (
  instagramUserId: string,
  accessToken: string,
) => {
  const url = buildGraphApiUrl(
    GRAPH_API.ENDPOINTS.USER_STORIES(instagramUserId),
  );
  url.searchParams.set("fields", GRAPH_API_FIELDS.STORIES.join(","));
  url.searchParams.set("limit", RATE_LIMITS.STORIES_PER_REQUEST.toString());
  url.searchParams.set("access_token", accessToken);

  const result = await fetchWithTimeout<InstagramStoriesResponse>(
    url.toString(),
    {
      method: "GET",
      instagramUserId,
    },
  );

  return result;
};
