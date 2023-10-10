import React from "react";
import quebra_outline_animated from "../public/quebra_outline_animated.svg";
import Image from "next/image";

function Footer() {
  return (
    <div className="">
      <div className="mt-10 flex justify-center">
        <Image src={quebra_outline_animated} alt="" />
      </div>
      <div className="flex flex-col justify-center">
        <a
          href="mailto:contact@quebra.co"
          className="mt-5 text-center text-white"
        >
          Contact
        </a>
        <div className="mx-auto flex gap-2">
          <a
            href="CGU_quebra.pdf"
            className="mt-5 text-center font-mono text-xs text-white"
          >
            CGU
          </a>
          <span className="mt-5 text-center font-mono  text-xs text-white">
            -
          </span>
          <a
            href="Politique_de_Confidentialite_Quebra.pdf"
            className="mt-5 text-center font-mono  text-xs text-white"
          >
            RGPD
          </a>
          <span className="mt-5 text-center font-mono  text-xs text-white">
            -
          </span>
          <p className=" mt-5 mb-3 text-center font-mono text-xs">
            2023, Quebra.co
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
