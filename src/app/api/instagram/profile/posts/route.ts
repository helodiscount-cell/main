/**
 * Instagram Posts Endpoint
 * Retrieves Instagram posts for the authenticated user
 */

import { getUserPosts } from "@/server/services/instagram/instagram.service";
import { runWithErrorHandling } from "@/server/middleware/errors";

/**
 * This endpoint should not be spammed, hit it once and then store the data in local storage of the browser
 * and then use the data from the local storage for the rest of the session until the user logs out or clicks refresh
 */

export async function GET() {
  return runWithErrorHandling(async (clerkId) => {
    // return await getUserPosts(clerkId);
    return {
      data: {
        data: [
          // {
          //   id: "18304626976275378",
          //   media_type: "VIDEO",
          //   media_url:
          //     "https://instagram.fudr3-3.fna.fbcdn.net/o1/v/t16/f2/m69/AQMlMg_SfL47pz3ZGN0c0sf24tqGGewCqLWJrIFGGe8zyqlnzAJRaJR17NNsJJYwQ7emDN7NxGmM1pSAvIfhxNhK.mp4?strext=1&_nc_cat=100&_nc_oc=AdkZBbXFWemPyQadqof-OR_T-of70ltwSZUUCO47UjGnXQPlHyI_QNjGiCN3GBW7xXDY7u1RA5CeaqBqBsnCCF_z&_nc_sid=5e9851&_nc_ht=instagram.fudr3-3.fna.fbcdn.net&_nc_ohc=9i7K_P1Oa1gQ7kNvwHsJ4Gt&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNjQwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6MTc4NjI1NTM4MDk1OTA0MjEsImFzc2V0X2FnZV9kYXlzIjoxNywidmlfdXNlY2FzZV9pZCI6MTAwOTksImR1cmF0aW9uX3MiOjExLCJ1cmxnZW5fc291cmNlIjoid3d3In0%3D&ccb=17-1&_nc_gid=b1FcjvRpRaYH6nJf-MIaow&edm=ANo9K5cEAAAA&_nc_zt=28&_nc_tpa=Q5bMBQFHP0rEKBx3M2Jueh3bP5QdlSBvirWgMojUE32v1dF36_ok_yo7UYT4biZI33Dofz5Fzvv-Ic_UBw&vs=1825e1bb1546532&_nc_vs=HBkcFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HSDdJYmlWamMyVWZMdElGQUpmUG9TbkxjYnNkYnNwVEFRQUYVAALIARIAKAAYABsCiAd1c2Vfb2lsATEScHJvZ3Jlc3NpdmVfcmVjaXBlATEVAAAmquLQ6bz5uj8VAigCQzMsF0AmzMzMzMzNGBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX-B2XmnQEA&oh=00_AfthA6ely8tp8Hk1vZQj83NuB2SwaG2kdycxgyUoPFQgrQ&oe=69A38E58",
          //   permalink: "https://www.instagram.com/reel/DUdCgm8EU0-/",
          //   timestamp: "2026-02-07T10:42:42+0000",
          //   like_count: 1,
          //   comments_count: 0,
          //   media_product_type: "REELS",
          // },
          {
            id: "18156297028400873",
            caption: "Testing api",
            media_type: "IMAGE",
            media_url:
              "https://scontent.cdninstagram.com/v/t51.82787-15/569901879_17846831193590421_5157430767648546934_n.webp?stp=dst-jpg_e35_tt6&_nc_cat=100&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiRkVFRC5iZXN0X2ltYWdlX3VybGdlbi5DMyJ9&_nc_ohc=Vz5kr1qYRmYQ7kNvwERJ9qn&_nc_oc=Adnebj0W11xGdOlW5t3gpr1RC_OcC7OXQAUpAcNV5DjbCazwbn4VGJqr4K6jejncsvCje55Y9L_ZTA51BGFM19NA&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&edm=ANo9K5cEAAAA&_nc_gid=b1FcjvRpRaYH6nJf-MIaow&_nc_tpa=Q5bMBQHi0lowUymjhH9GfL_sZXunWE3hGmNJ5GqJDwhC0evTuB5mbUzu6bRsQeBj5AfbdhgvCLA6LAcR-w&oh=00_Afu4Toj2b12U6NmTVn5Vzfbl_H_pJXtaZe5pTUSK9VtuJg&oe=69A3A65B",
            permalink: "https://www.instagram.com/p/DQMVQJDiUs6/",
            timestamp: "2025-10-24T12:53:35+0000",
            like_count: 1,
            comments_count: 7,
            media_product_type: "FEED",
          },
        ],
        paging: {
          cursors: {
            before:
              "QVFIU3U2Mm5uLXBXVU9xSTcxelA2UGplaElyS3ItTll5dWFKR0djcWZA5MmJaTS1aUGhuSkFwM05oczNiLV9LT3c5VjNKUzh4eWl6VzItREZARZAFhpRGNHT2F3",
            after:
              "QVFIU1JLTXdOM24yOE1ZAMVF4eDNkUTY2dW9sV0liYnVwTm13MF9ER3VtVU9wSGh4ZAWVuMy1WNTdGdVljWTBqb19EbWYwcnF0aXdPLUl0TmtueG4zblB0ZAnRn",
          },
        },
      },
      status: 200,
      statusText: "OK",
    };
  });
}
