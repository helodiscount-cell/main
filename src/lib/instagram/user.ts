import { buildGraphApiUrl, ERROR_MESSAGES, GRAPH_API, GRAPH_API_FIELDS, RATE_LIMITS } from "@/config/instagram.config";
import { fetchWithTimeout } from "../utils/fetch-with-timeout";
import { InstagramPost } from "@dm-broo/common-types";

export const getUserPostsFromInstagram = async (instagramUserId: string, accessToken: string) => {
    const url = buildGraphApiUrl(GRAPH_API.ENDPOINTS.USER_MEDIA(instagramUserId));
    url.searchParams.set("fields", GRAPH_API_FIELDS.POSTS.join(","));
    url.searchParams.set("limit", RATE_LIMITS.POSTS_PER_REQUEST.toString());
    url.searchParams.set("access_token", accessToken);

    const result = await fetchWithTimeout<any>(url.toString(), {
        method: "GET",
    });

    const data = result.data;

    // Handles Instagram API error object
    if (data.error) {
        const readableError =
            data.error.message && typeof data.error.message === "string"
                ? data.error.message
                : ERROR_MESSAGES.API.GENERIC_ERROR;
        throw new Error(readableError);
    }

    // Checks for missing data
    if (!Array.isArray(data.data)) {
        throw new Error(ERROR_MESSAGES.API.INVALID_RESPONSE);
    }

    return {
        posts: data.data as InstagramPost[],
        paging: data.paging,
    };
};