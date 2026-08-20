import { useMemo, useRef, useState, type PointerEvent } from "react";
import {
  Glass,
  GlassBadge,
  GlassButton,
  GlassCard,
  GlassDock,
  GlassIconButton,
  GlassInput,
  GlassMenu,
  GlassModal,
  GlassPanel,
  GlassSegmented,
  GlassSlider,
  GlassSwitch,
} from "glass-effect";
import {
  BellIcon,
  CameraIcon,
  ChevronIcon,
  GridIcon,
  LockIcon,
  MessageIcon,
  MoonIcon,
  MusicIcon,
  SafariIcon,
  SearchIcon,
  WindowsIcon,
} from "./icons";

interface Optics {
  refraction: number;
  depth: number;
  dispersion: number;
  frost: number;
  lightAngle: number;
  lightIntensity: number;
}

const initialOptics: Optics = {
  refraction: 100,
  depth: 71,
  dispersion: 100,
  frost: 0,
  lightAngle: -45,
  lightIntensity: 0.55,
};

export default function App() {
  return (
    <div className="page">
      <Nav />
      <Hero />
      <OpticsLab />
      <LensTypography />
      <Kit />
      <footer className="foot">
        Apple-inspired Liquid Glass · real SVG refraction · MIT
      </footer>
    </div>
  );
}

function Nav() {
  return (
    <header className="nav">
      <Glass radius="pill" className="nav-pill" material="regular">
        <strong>glass-effect</strong>
        <span>React · Liquid Glass</span>
      </Glass>
      <a className="nav-link" href="#kit">
        Components
      </a>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-sky" />
      <div className="hero-copy">
        <p className="eyebrow">iOS 26 / visionOS material</p>
        <h1>Liquid Glass for React</h1>
        <p className="lede">
          Reflects and refracts what’s beneath it in real time, dynamically
          adapting to your content — the same optical idea as Apple’s Liquid
          Glass, built with SVG displacement maps.
        </p>
      </div>
      <ControlCenter />
    </section>
  );
}

function ControlCenter() {
  return (
    <div className="control-center">
      <GlassIconButton material="tinted" aria-label="Lock">
        <LockIcon />
      </GlassIconButton>
      <GlassIconButton aria-label="Windows">
        <WindowsIcon />
      </GlassIconButton>
      <GlassIconButton aria-label="Focus mode">
        <MoonIcon />
      </GlassIconButton>
      <GlassIconButton material="tinted" aria-label="Notifications">
        <BellIcon />
      </GlassIconButton>
      <Glass
        as="button"
        interactive
        radius="pill"
        className="focus-pill"
        material="regular"
      >
        <MoonIcon width={18} height={18} />
        Focus
        <ChevronIcon />
      </Glass>
      <GlassIconButton aria-label="Apps">
        <GridIcon />
      </GlassIconButton>
    </div>
  );
}

function OpticsLab() {
  const [optics, setOptics] = useState<Optics>(initialOptics);
  const set = (key: keyof Optics) => (value: number) =>
    setOptics((prev) => ({ ...prev, [key]: value }));

  return (
    <section className="lab">
      <div className="lab-copy">
        <p className="eyebrow">Optics</p>
        <h2>A real lens, not a blur overlay</h2>
        <p>
          Each surface builds a signed-distance displacement map, then bends
          the live backdrop through three chromatic passes. Drag the controls
          the same way Apple’s glass inspector does.
        </p>
      </div>
      <div className="lab-stage">
        <div className="stripes">
          <Glass
            radius="circle"
            material="lens"
            className="orb"
            refraction={optics.refraction}
            depth={optics.depth}
            dispersion={optics.dispersion}
            frost={optics.frost}
            lightAngle={optics.lightAngle}
            lightIntensity={optics.lightIntensity}
            magnify={42}
          />
        </div>
        <GlassPanel className="inspector" radius={28} material="regular">
          <div className="inspector-head">
            <span>Glass</span>
            <GlassBadge>beta</GlassBadge>
          </div>
          <InspectorSlider
            label="Refraction"
            value={optics.refraction}
            onChange={set("refraction")}
          />
          <InspectorSlider
            label="Depth"
            value={optics.depth}
            onChange={set("depth")}
          />
          <InspectorSlider
            label="Dispersion"
            value={optics.dispersion}
            onChange={set("dispersion")}
          />
          <InspectorSlider
            label="Frost"
            value={optics.frost}
            onChange={set("frost")}
          />
          <div className="light-row">
            <div>
              <div className="inspector-label">
                <span>Angle</span>
                <b>{Math.round(optics.lightAngle)}°</b>
              </div>
              <LightPad
                angle={optics.lightAngle}
                intensity={optics.lightIntensity}
                onChange={(angle, intensity) =>
                  setOptics((prev) => ({
                    ...prev,
                    lightAngle: angle,
                    lightIntensity: intensity,
                  }))
                }
              />
            </div>
            <div className="light-meta">
              <div className="inspector-label">
                <span>Intensity</span>
                <b>{Math.round(optics.lightIntensity * 100)}%</b>
              </div>
              <GlassSlider
                value={optics.lightIntensity * 100}
                onChange={(v) => set("lightIntensity")(v / 100)}
              />
            </div>
          </div>
        </GlassPanel>
      </div>
    </section>
  );
}

function InspectorSlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="inspector-field">
      <div className="inspector-label">
        <span>{label}</span>
        <b>{Math.round(value)}</b>
      </div>
      <GlassSlider value={value} onChange={onChange} />
    </label>
  );
}

function LightPad({
  angle,
  intensity,
  onChange,
}: {
  angle: number;
  intensity: number;
  onChange: (angle: number, intensity: number) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const point = useMemo(() => {
    const rad = ((angle - 90) * Math.PI) / 180;
    const r = 0.18 + intensity * 0.32;
    return {
      x: 50 + Math.cos(rad) * r * 100,
      y: 50 + Math.sin(rad) * r * 100,
    };
  }, [angle, intensity]);

  const update = (event: PointerEvent<HTMLDivElement>) => {
    const box = ref.current?.getBoundingClientRect();
    if (!box) return;
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    const nextAngle = (Math.atan2(y, x) * 180) / Math.PI + 90;
    const nextIntensity = Math.min(1, Math.hypot(x, y) * 2);
    onChange(nextAngle, nextIntensity);
  };

  return (
    <div
      ref={ref}
      className="light-pad"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        update(event);
      }}
      onPointerMove={(event) => {
        if (event.currentTarget.hasPointerCapture(event.pointerId)) update(event);
      }}
    >
      <span style={{ left: `${point.x}%`, top: `${point.y}%` }} />
    </div>
  );
}

function LensTypography() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState({ x: 42, y: 38 });
  const dragging = useRef(false);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const box = stageRef.current?.getBoundingClientRect();
    if (!box) return;
    setPos({
      x: ((event.clientX - box.left) / box.width) * 100,
      y: ((event.clientY - box.top) / box.height) * 100,
    });
  };

  return (
    <section className="type-section">
      <p className="eyebrow">Refraction</p>
      <h2>Drag the lens across the type</h2>
      <div
        className="type-stage"
        ref={stageRef}
        onPointerDown={(event) => {
          dragging.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
          move(event);
        }}
        onPointerMove={(event) => {
          if (dragging.current) move(event);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
      >
        <div className="type-word">Liquid Glass</div>
        <Glass
          radius="pill"
          material="lens"
          className="type-lens"
          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          frost={4}
          refraction={92}
          dispersion={36}
          depth={70}
        />
      </div>
    </section>
  );
}

function Kit() {
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(62);
  const [tab, setTab] = useState<"music" | "photo" | "focus">("music");

  return (
    <section className="kit" id="kit">
      <div className="lab-copy">
        <p className="eyebrow">UI kit</p>
        <h2>Buttons, switches, menus, docks</h2>
        <p>
          Every component is the same `Glass` primitive — rounded, pill, or
          circular — with shared optics so a Control Center tile and a modal
          feel like one material.
        </p>
      </div>

      <div className="kit-grid">
        <GlassCard className="kit-card">
          <div className="kit-row">
            <h3>Notification</h3>
            <GlassBadge>Live</GlassBadge>
          </div>
          <GlassModal
            title="“Photos” Would Like to Access the Camera"
            confirmLabel="Allow"
            cancelLabel="Don’t Allow"
          >
            This lets you take photos and record video from the Control Center
            module.
          </GlassModal>
        </GlassCard>

        <GlassCard className="kit-card">
          <h3>Controls</h3>
          <div className="stack">
            <div className="kit-row">
              <span>Do Not Disturb</span>
              <GlassSwitch checked={enabled} onChange={setEnabled} />
            </div>
            <div>
              <div className="kit-row">
                <span>Volume</span>
                <b>{Math.round(volume)}</b>
              </div>
              <GlassSlider value={volume} onChange={setVolume} />
            </div>
            <GlassSegmented
              value={tab}
              onChange={setTab}
              options={[
                { value: "music", label: "Music" },
                { value: "photo", label: "Photo" },
                { value: "focus", label: "Focus" },
              ]}
            />
            <GlassInput icon={<SearchIcon width={16} height={16} />} placeholder="Search" />
            <div className="kit-row">
              <GlassButton size="sm">Cancel</GlassButton>
              <GlassButton size="sm" variant="primary">
                Continue
              </GlassButton>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="kit-card">
          <h3>Menu</h3>
          <GlassMenu
            items={[
              { id: "new", label: "New Folder" },
              { id: "get", label: "Get Info" },
              { id: "sep", label: "", separator: true },
              { id: "dup", label: "Duplicate" },
              { id: "share", label: "Share…" },
            ]}
          />
        </GlassCard>
      </div>

      <div className="dock-wrap">
        <GlassDock
          items={[
            { id: "safari", label: "Safari", icon: <SafariIcon /> },
            { id: "msg", label: "Messages", icon: <MessageIcon /> },
            { id: "music", label: "Music", icon: <MusicIcon /> },
            { id: "cam", label: "Camera", icon: <CameraIcon /> },
          ]}
        />
      </div>

      <pre className="usage">{`import { Glass, GlassButton } from "glass-effect";
import "glass-effect/styles.css";

<Glass radius={28} material="regular">
  <GlassButton variant="primary">Continue</GlassButton>
</Glass>`}</pre>
    </section>
  );
}
