import React from "react";
import quebra_outline_animated from "../public/quebra_outline_animated.svg";
import Image from "next/image";

function Footer() {
  return (
    <div className="">
      <div className="flex justify-center mt-10">
        <Image src={quebra_outline_animated} alt="" />
      </div>
      <div className="flex flex-col justify-center">
        <a
          href="mailto:contact@quebra.co"
          className="text-white text-center mt-5"
        >
          Contact
        </a>
        <p className=" font-mono text-xs text-center mt-5 mb-3">
          2023 - Quebra.co
        </p>
      </div>
    </div>
  );
}

export default Footer;
