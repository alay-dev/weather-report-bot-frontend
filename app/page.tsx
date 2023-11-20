"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/config/store";
import { useInitializeGoogleAuthentication } from "@/hooks/use-google-login";
// import { useInitializeGoogleAuthentication } from "@/hooks/use-google-login";
// import { setGoogleJWT } from "@/slices/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  Letter as EmailIcon,
  LockKeyhole as PasswordIcon,
} from "solar-icon-set";

export default function Home() {
  const initializeGoogle = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useInitializeGoogleAuthentication({
    prompt: true,
    button: initializeGoogle.current,
    onSuccess: async (response) => {
      try {
        // dispatch(setGoogleJWT(response));
        router.push("/dashboard");
      } catch (e) {}
    },
  });
  return (
    <main className="flex gap-3 h-screen p-5">
      <div className="overflow-hidden w-1/2 h-full rounded-xl bg-blue-600 p-5 md:flex hidden flex-col items-center relative ">
        <img
          className="w-[10rem] mt-auto mb-12"
          src="/images/weather.gif"
          alt=""
        />
        <h3 className="text-white text-3xl mb-2">Weather bot dashboard</h3>
        <p className="text-gray-300 mb-auto text-sm">
          Manage your weather bot.
        </p>
        <img
          className=" absolute -right-4 -bottom-3"
          src="/images/login/loginBgIcon.svg"
          alt=""
        />
      </div>
      <div className="flex flex-col justify-center lg:px-36 px-4 pt-20 w-full md:w-1/2 pb-20">
        <div className="md:hidden flex items-center mb-9 justify-center">
          <img
            src="/zocket.svg"
            alt="zocket"
            className="ring rounded-full ring-white ring-offset-2"
          />
          <h1 className="ml-4 font-medium text-xl text-black">Zocket</h1>
        </div>
        <h2 className="text-xl md:text-3xl font-semibold text-gray-800 mb-2">
          Log in to your account.
        </h2>
        <p className="text-sm text-gray-400">
          Enter your email and password to login
        </p>

        <div className="mt-10 flex justify-center relative h-10">
          <div
            ref={initializeGoogle}
            id="google-login"
            className="opacity-0 absolute left-1/2 z-10  -translate-x-1/2"
          ></div>
          <Button
            variant="outline"
            className="flex-shrink-0 w-max absolute space-x-2.5 font-medium text-sm top-0 left-1/2  -translate-x-1/2  bg-card hover:bg-card pointer-events-none"
          >
            <Image
              src="/images/google.svg"
              alt="Google"
              height={20}
              width={20}
              className="w-5 h-5 object-contain"
            />
            <span className="text-sm font-normal">Continue with Google</span>
          </Button>
        </div>
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-300" />
          <p className="text-gray-500">OR</p>
          <div className="flex-1 h-px bg-gray-300" />
        </div>
        <form className="mt-4 w-full">
          <div className="border rounded-md p-1 px-3 flex gap-1 items-center mb-4 bg-gray-50">
            <EmailIcon size={25} color="#9E9E9E" />
            <Input
              placeholder="your@email.com"
              type="email"
              className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:border-0"
            />
          </div>
          <div className="border rounded-md p-1 px-3 flex gap-1 items-center bg-gray-50">
            <PasswordIcon size={25} color="#9E9E9E" />
            <Input
              placeholder="Password"
              type="password"
              className="w-full bg-transparent border-none focus-visible:ring-0 focus-visible:border-0"
            />
          </div>
          <Button size="lg" className="mt-6 w-full">
            Login
          </Button>
        </form>
      </div>
    </main>
  );
}
