import React from "react";

function VerifyRequest() {
  return (
    <div className=" mx-4  rounded-lg bg-jam-light-transparent py-14 px-7 pb-12 md:m-20">
      <h1 className="mb-5 text-xl">
        ✨ Vérifiez vos emails{" "}
        <small className="font-mono text-xs normal-case">(et spam)</small>
      </h1>
      <p className=" text-center font-mono text-xs normal-case">
        📨 Un lien de connection temporaire vous a ete envoyé par email
      </p>
      <p className="px-4 pt-8 font-mono text-xs normal-case">
        ℹ️ : Redemandez un nouveau lien à chaque nouvelle connection{" "}
      </p>
    </div>
  );
}

export default VerifyRequest;
