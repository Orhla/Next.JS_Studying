import "../app/globals.css";

export default function Footer() {
    return (
        <footer className="text-center p-4 bg-light-gray w-full">
            <p>{new Date().getFullYear()} Евгения Кузечкина</p>
        </footer>
    );
}