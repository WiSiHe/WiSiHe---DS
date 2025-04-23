import { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Test2",
  description: "Test2",
  robots: {
    index: false,
    follow: false,
    noimageindex: false,
    nocache: false,
    noarchive: false,
  },
};

export default function Test2Page() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white">
      <section className="grid grid-cols-2 gap-4 pt-20">
        <div className="flex items-center justify-center w-full bg-stone-50 aspect-square">
          <Script
            src="https://unpkg.com/@splinetool/viewer@1.9.85/build/spline-viewer.js"
            type="module"
            strategy="afterInteractive"
          />
          {/* <p>please give me a spline</p> */}
          {/* @ts-expect-error - Spline viewer is not supported in Next.js */}
          <spline-viewer
            loading-anim-type="spinner-small-dark"
            url="https://prod.spline.design/VeHLDRDrDnwErPUu/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="">
          <h1 className="">Mack isbjørn lite</h1>
          <p className="">
            Isbjørn LITE er brygget på en oppskrift som inneholder mindre malt
            enn Isbjørn, og det er derfor ølet har et lavere kaloriinnhold.
            Isbjørn LITE har 70 % færre karbohydrater og 30 % mindre sukker enn
            Isbjørn, men den gode smaken er den samme. Isbjørn LITE er et gluten
            fritt øl.
          </p>
        </div>
      </section>
    </main>
  );
}
