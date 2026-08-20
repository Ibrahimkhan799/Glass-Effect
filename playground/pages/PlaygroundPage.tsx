import {
  BringYourOwn,
  ControlCenter,
  Kit,
  LensTypography,
  OpticsLab,
} from "../showcase";

export function PlaygroundPage() {
  return (
    <>
      <section className="hero hero--playground">
        <div className="hero-sky" />
        <div className="hero-copy">
          <p className="eyebrow">Live playground</p>
          <h1>Tune the lens</h1>
          <p className="lede">
            Drag refraction, frost, and light. The backdrop is the page itself
            — not a static screenshot.
          </p>
        </div>
        <ControlCenter />
      </section>
      <OpticsLab />
      <LensTypography />
      <BringYourOwn />
      <Kit />
    </>
  );
}
