import Image from "next/image"

export default function About() {
    return (
        <main>
            <div>About</div>
            <Image
                src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaDd1bHVuaWU1bGtsOHg5MjJteXA3Z2dyOG96ZDl6OXFwam4xNnlkaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Nx0rz3jtxtEre/giphy.gif"
                alt="Hello there!"
                width={500}
                height={500} />
        </main>
    )
}