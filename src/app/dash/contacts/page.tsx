export default function Page() {
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center gap-4 text-center">
      <div className="text-6xl animate-bounce">🚧</div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Work in Progress
      </h1>
      <p className="text-lg text-gray-500 max-w-md">
        We are currently building this feature. Check back soon for updates!
      </p>
    </div>
  );
}
