// pages/index.js
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Welcome to the Text Editor App</h1>
      <Link href="/editor">Go to Editor</Link>
    </div>
  );
}
