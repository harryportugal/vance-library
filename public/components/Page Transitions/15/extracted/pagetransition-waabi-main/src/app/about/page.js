import React from "react";

const page = () => {
  return (
    <header className="h-dvh w-full relative">
      <img
        src="/assets/img2.png"
        className="size-full object-cover object-bottom"
        alt=""
      />

      <div className="pointer-events-none absolute inset-0 z-10 bg-linear-to-t from-black/85 via black/0 to black/0 from-0% via-70% to-100%"></div>

      <div className="size-full absolute inset-0 z-11 flex items-end p-[7vw]">
        <h1 className="text-[12vw] tracking-tight leading-[.8]">
          Science seeks, <br /> answers unfold.
        </h1>
      </div>
    </header>
  );
};

export default page;
