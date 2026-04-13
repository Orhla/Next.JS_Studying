import Link from "next/link";

export default function Header() {
    return (
        <header>
            <nav className="flex justify-around p-4 bg-gray-100 w-full">
                <Link href="/" >Home</Link>
                <Link href="/about" >About</Link>
            </nav>
        </header>
    );
}