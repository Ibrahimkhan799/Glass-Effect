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
  useGlass,
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

export function ControlCenter() {
  return (
    <div className="control-center">
      <GlassIconButton size={82} material="tinted" aria-label="Lock">
        <LockIcon />
      </GlassIconButton>
      <GlassIconButton size={82} aria-label="Windows">
        <WindowsIcon />
      </GlassIconButton>
      <GlassIconButton size={82} aria-label="Focus mode">
        <MoonIcon />
      </GlassIconButton>
      <GlassIconButton size={82} material="tinted" aria-label="Notifications">
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
      <GlassIconButton size={82} aria-label="Apps">
        <GridIcon />
      </GlassIconButton>
    </div>
  );
}

export function OpticsLab() {
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

export function LensTypography() {
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

export function BringYourOwn() {
  const weather = useGlass({ material: "regular", radius: 28 });

  return (
    <section className="byo" id="byo">
      <div className="lab-copy">
        <p className="eyebrow">Bring your own UI</p>
        <h2>Drop glass onto layouts you already have</h2>
        <p>
          Keep your markup, CSS, and components. Wrap them, merge onto an
          existing node with `asChild`, or spread `useGlass()` onto any element.
        </p>
      </div>
      <div className="byo-grid">
        <Glass asChild>
          <aside className="your-sidebar">
            <h3>Your sidebar</h3>
            <nav>
              <a href="#byo">Library</a>
              <a href="#byo">Projects</a>
              <a href="#kit">Settings</a>
            </nav>
            <GlassButton size="sm" variant="primary">
              New file
            </GlassButton>
          </aside>
        </Glass>

        <div {...weather.props} className={`${weather.props.className} your-weather`}>
          {weather.filter}
          <span>San Francisco</span>
          <strong>68°</strong>
          <span>Clear · your widget, our material</span>
        </div>
      </div>
    </section>
  );
}

export function Kit() {
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
    </section>
  );
}
