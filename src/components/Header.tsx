import Link from "next/link";
import "../app/globals.css";

export default function Header() {
    return (
        <header>
            <nav className="flex justify-around p-4 bg-light-gray w-full">
                <Link href="/" >Home</Link>
                <Link href="/about" >About</Link>
            </nav>
        </header>
    );
}