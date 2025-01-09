import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="flex flex-col bg-slate-200 h-screen items-center justify-center">
      <div className="flex flex-col max-w-[500px] items-center justify-center bg-zinc-100 p-[30px] rounded-lg gap-2">
        <p className="text-center text-slate-900 text-sm md:text-lg">
          Start chatting with your documents for free <br />
          Start right here!
        </p>
        <Button className="bg-yellow-400 hover:bg-yellow-500">
          <Link to="/chat" className="text-zinc-600">Start Now for Free</Link>
        </Button>
      </div>
    </section>
  );
};

export default Home;
