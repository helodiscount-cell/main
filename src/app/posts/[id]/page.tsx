import { notFound } from "next/navigation";

type Comment = {
  id: string;
  username: string;
  text: string;
  timestamp: string;
};

async function getComments(postId: string) {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const url = `https://graph.instagram.com/${postId}/comments?fields=id,username,text,timestamp&access_token=${accessToken}`;
  const res = await fetch(url, { next: { revalidate: 60 } }); // ISR revalidation every minute
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const data = await getComments(params.id);
  if (!data) return notFound();

  const comments: Comment[] = data.data || [];

  return (
    <div className="container mx-auto px-4 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-6">
        Comments for Post {params.id}
      </h1>

      {comments.length === 0 ? (
        <p className="text-gray-400">No comments found.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="border border-gray-700 p-4 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <p className="font-medium">{comment.username}</p>
              <p className="text-gray-300">{comment.text}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(comment.timestamp).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
