import { CommentsAutomationForm } from "./_components/CommentsAutomationForm";

interface PageProps {
  params: Promise<{ post_id: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { post_id } = await params;

  return <CommentsAutomationForm post_id={post_id} />;
};

export default Page;
