import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <h1 className="text-6xl font-bold mb-4 text-[#4CAF50]">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="mb-8 text-gray-400">Sorry, the page you are looking for does not exist.</p>
      <Link href="/app">
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          Go back to Home
        </Button>
      </Link>
    </div>
  );
}