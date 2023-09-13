import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { space } from "postcss/lib/list";

import { api } from "~/utils/api";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Home() {

  return (
    <>
      <Head>
        <title>Clemson.build</title>
        <meta name="description" content="Build @clemson" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-zinc-950">
        <Splash />
      </main>
    </>
  );
}

function Splash() {
    const { data, isLoading } = api.example.getNextMeeting.useQuery();

    return <div className="h-screen bg-[#0e1416]">
        <div className="w-full h-full overflow-hidden z-10" style={{ perspective: "50rem" }}>
            <div className="w-full h-full absolute z-20" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(14, 20, 22, 0) 0%, #0e1416 80%);" }}></div>
            <div className="w-full h-[200%] " style={{
                background: "linear-gradient(to right, rgba(0, 255, 255, 0.3) 1px, transparent 0), linear-gradient(to bottom, rgba(255, 255, 255, 0.3) 1px, transparent 0)",
                backgroundSize: "45px 30px",
                backgroundRepeat: "repeat",
                transformOrigin: "100% 0 0",
                animation: "play 10s linear infinite",
                }}></div>
            <div className="top-0 w-full h-full absolute flex flex-col items-center justify-center z-30">
                <Logo />
                <div className="mt-16">
                    {!data ? "Loading..." : <MeetingTime date={data.date} location={data.location} />}
                </div>
            </div>
        </div>
    </div>
}

function getTime(date: Date): string {
    const timeParts = date.toLocaleTimeString().split(":");
    const meridian = timeParts[2]?.split(" ")[1]?.toLowerCase();

    const time = `${timeParts[0]}:${timeParts[1]}${meridian}`;
    return time;
}

interface MeetingTimeProps {
    date: Date,
    location: string;
}
function MeetingTime({ date, location }: MeetingTimeProps) {
    const { data: sessionData } = useSession();


    const day = DAYS[date.getDay()];
    const dateParts = date.toLocaleDateString().split("/");
    const timeStart = getTime(date);
    const timeEnd = getTime(new Date(date.getTime() + 1000 * 60 * 60));

    return <div className="text-center font-mono">
        <h4 className="text-gray-400 text-2xl">Next Meeting</h4>
        <h2 className="text-orange-400 text-4xl mt-2">{`${day} (${dateParts[0]}/${dateParts[1]})`}</h2>
        <h2 className="text-orange-400 text-5xl mt-2">{timeStart}-{timeEnd}</h2>
        <h5 className="text-orange-600 mt-6 text-3xl">{"///"} <span className="mx-4 text-white">Room: {location}</span> {"///"}</h5>
        <div className="mt-6">
            {sessionData
            ? <Member />
            : <SignIn />
            }
        </div>
    </div>
}

function SignIn() {
    return <button
    className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
    onClick={() => void signIn()}
  >
    {"Sign in"}
  </button>
}

function Member() {
    const { data } = api.example.getNextMeetingLink.useQuery();
    return data ? data.slidesUrl ? <SlidesLink url={data.slidesUrl} /> : <span></span> : <span></span>;
}

interface SlidesLinkProps {
    url: string;
}
function SlidesLink({ url }: SlidesLinkProps) {
    return <a target="_blank" href={url}>
          <button
            className="rounded-full bg-orange-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-orange-500"
          >
            {"Slides"}
          </button>
      </a>
}

function Logo() {
    return <div className="text-orange-600 text-4xl font-semibold text-center">CLEMSON<br /><div className="mt-6"><span className="bg-orange-600 text-white p-4 text-6xl">.BUILD</span></div></div>
}
