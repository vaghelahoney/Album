import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <h2 className="text-xl font-bold mb-4">Page Not Found</h2>
            <p className="mb-4">Could not find requested resource</p>
            <Link href="/" className="px-4 py-2 bg-black text-white rounded-lg">
                Return Home
            </Link>
        </div>
    );
}
