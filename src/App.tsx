import { useEffect, useRef, useState } from "react";
import { discordInviteUrl } from "./site-config";
import fabricHero from "./assets/fabric-adventures-hero.png";
import fabricWordmark from "./assets/eskele-fabric-wordmark.png";
import peacefulCrest from "./assets/eskele-peaceful-crest.png";
import peacefulWordmark from "./assets/eskele-peaceful-wordmark.png";
import discordMark from "./assets/discord-mark.svg";
import ScreenshotCarousel from "./components/ScreenshotCarousel";
import StaffCarousel from "./components/StaffCarousel";
import ModsGrid from "./components/ModsGrid";
import communityAdmins from "./assets/admins.png";
import communityOwner from "./assets/owner.png";
import NetheriteCursor from "./components/NetheriteCursor";
import BackToTop from "./components/BackToTop";

type Server = {
  id: "peaceful" | "fabric";
  number: string;
  name: string;
  label: string;
  platform: string;
  host: string;
  access: string;
  description: string;
  accent: string;
};

const servers: Server[] = [
  {
    id: "peaceful",
    number: "01",
    name: "Peaceful SMP",
    label: "VANILLA+",
    platform: "PaperMC",
    host: "Apex Hosting",
    access: "Java + Bedrock",
    description:
      "The classic survival experience, tuned for community play. Build, explore, and settle in with full crossplay support.",
    accent: "#cc39ff",
  },
  {
    id: "fabric",
    number: "02",
    name: "Fabric Adventures",
    label: "MODDED ERA",
    platform: "Fabric",
    host: "BisectHosting",
    access: "Java Edition",
    description:
      "A carefully curated modded world with new systems, deeper progression, and an entire era of adventures to uncover.",
    accent: "#e6a63a",
  },
];

function PixelMark({ className = "" }: { className?: string }) {
  return (
    <span className={`pixel-mark ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

export default function App() {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!selectedServer) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedServer]);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const closeServerDetails = () => {
    dialogRef.current?.close();
    setSelectedServer(null);
  };

  const scrollToWorlds = () => {
    document.querySelector("#worlds")?.scrollIntoView({ behavior: "auto" });
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#07090b] text-[#f5f1e8]">
      <NetheriteCursor />
      <BackToTop />
      <nav className="site-nav" aria-label="Main navigation">
        <a href="#top" className="nav-brand" aria-label="Eskele SMP home">
          <img className="nav-logo" src={peacefulCrest} alt="" width={44} height={44} />
          <span>
            <b>ESKELE</b>
            <small>SURVIVAL NETWORK</small>
          </span>
        </a>

        <button
          ref={menuButtonRef}
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          aria-controls="navigation-links"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div id="navigation-links" className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <a href="#worlds" onClick={() => setMenuOpen(false)}>
            Worlds
          </a>
          <a href="#gallery" onClick={() => setMenuOpen(false)}>
            Gallery
          </a>
          <a href="#community" onClick={() => setMenuOpen(false)}>
            Community
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About
          </a>
          <a href="#team" onClick={() => setMenuOpen(false)}>
            Team
          </a>
          <a
            className="nav-cta"
            href={discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            Join Discord
          </a>
        </div>
      </nav>

      <section id="top" className="hero" tabIndex={-1}>
        <div className="hero-art" aria-hidden="true">
          <div className="hero-world hero-world-peaceful">
            <img src={peacefulCrest} alt="" />
          </div>
          <div className="hero-world hero-world-fabric">
            <img src={fabricHero} alt="" />
          </div>
        </div>
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-vignette" aria-hidden="true" />

        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            PH-based • Online 24/7
          </div>
          <h1>
            TWO WORLDS.
            <br />
            <span>ONE COMMUNITY.</span>
          </h1>
          <p>
            High-performance Minecraft survival without the lag, crashes, or compromise. Choose your
            era and make your mark.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={scrollToWorlds}>
              <span>Choose your world</span>
              <b aria-hidden="true">→</b>
            </button>
            <a className="text-link" href="#about">
              Why Eskele? <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>

        <a
          className="server-pulse"
          href={discordInviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Check network updates on Discord"
        >
          <span className="pulse-icon" aria-hidden="true">
            <img src={discordMark} alt="" width={127} height={96} />
          </span>
          <span>
            <small>NETWORK UPDATES</small>
            <b>CHECK DISCORD</b>
          </span>
          <span className="pulse-bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </a>

        <div className="hero-index" aria-hidden="true">
          <span>ESK—001</span>
          <span>14.5995° N / 120.9842° E</span>
        </div>
      </section>

      <section id="worlds" className="worlds-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              <PixelMark /> SELECT WORLD
            </span>
            <h2>CHOOSE YOUR ERA</h2>
          </div>
          <p>
            Two distinct experiences. One shared standard: premium hardware, zero grief, and a
            community worth joining.
          </p>
        </div>

        <div className="world-grid">
          {servers.map((server) => (
            <article
              className={`world-card ${server.id}`}
              key={server.id}
              style={{ "--accent": server.accent } as React.CSSProperties}
            >
              <div className="world-visual">
                <img
                  className="world-bg"
                  src={server.id === "peaceful" ? peacefulCrest : fabricHero}
                  alt=""
                />
                <img
                  className="world-logo"
                  src={server.id === "peaceful" ? peacefulWordmark : fabricWordmark}
                  alt={`Eskele ${server.name}`}
                />
                <span className="world-number">{server.number}</span>
                <span className="world-label">{server.label}</span>
              </div>

              <div className="world-copy">
                <div className="world-meta">
                  <span>{server.platform}</span>
                  <span>{server.access}</span>
                </div>
                <h3>{server.name}</h3>
                <p>{server.description}</p>
                <div className="card-footer">
                  <div>
                    <small>POWERED BY</small>
                    <b>{server.host}</b>
                  </div>
                  <button
                    onClick={() => setSelectedServer(server)}
                    aria-label={`View ${server.name}`}
                  >
                    <span>View server</span>
                    <b aria-hidden="true">↗</b>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="gallery" className="gallery-section" aria-labelledby="gallery-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              <PixelMark /> LIFE ON ESKELE
            </span>
            <h2 id="gallery-title">BEYOND THE SPAWN</h2>
          </div>
          <p>
            Player builds, shared adventures, and the moments between. Take a look around our
            worlds.
          </p>
        </div>
        <ScreenshotCarousel />
      </section>

      <section id="about" className="promise-section">
        <div className="promise-intro">
          <span className="section-kicker">
            <PixelMark /> THE ESKELE STANDARD
          </span>
          <h2>
            BUILT TO RUN.
            <br />
            BUILT TO LAST.
          </h2>
          <p>
            No free-host limitations. No oversold hardware. Just a dedicated network engineered for
            smooth chunks, stable ticks, and long-term worlds.
          </p>
        </div>
        <div className="promise-list">
          <article>
            <span>01</span>
            <div>
              <h3>Hard mode, always</h3>
              <p>A real survival challenge with earned progress and memorable wins.</p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Peaceful by design</h3>
              <p>A mature, non-toxic community where you can build, explore, and chill.</p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Your builds stay safe</h3>
              <p>Strict anti-grief rules with zero tolerance for stealing or destruction.</p>
            </div>
          </article>
        </div>
      </section>

      <section id="team" className="staff-section" aria-labelledby="staff-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              <PixelMark /> THE PEOPLE BEHIND ESKELE
            </span>
            <h2 id="staff-title">MEET THE TEAM</h2>
          </div>
          <p>
            The owner and admins who help keep Eskele welcoming, fair, and ready for your next
            adventure.
          </p>
        </div>
        <StaffCarousel />
      </section>

      <section id="mods" className="staff-section mods-section" aria-labelledby="mods-title">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              <PixelMark /> HERE TO HELP
            </span>
            <h2 id="mods-title">MEET THE MODS</h2>
          </div>
          <p>
            Our moderators help players, keep the peace, and make Eskele a welcoming place to play.
          </p>
        </div>
        <ModsGrid />
      </section>

      <section id="community" className="community-section">
        <div className="community-art" aria-hidden="true">
          <svg
            className="community-owner"
            viewBox="487 185 308 591"
            width="308"
            height="591"
            focusable="false"
          >
            <image href={communityOwner} width="1280" height="960" />
          </svg>
          <svg
            className="community-admins"
            viewBox="141 230 1068 429"
            width="1068"
            height="429"
            focusable="false"
          >
            <image href={communityAdmins} width="1280" height="960" />
          </svg>
        </div>
        <div className="community-shade" aria-hidden="true" />
        <div className="community-grid" aria-hidden="true" />
        <div className="community-content">
          <span className="section-kicker">
            <PixelMark /> START YOUR STORY
          </span>
          <h2>READY TO SPAWN IN?</h2>
          <p>
            Join our Discord community, read the server rules, and request access to your world. Get
            connection details and the Fabric modpack from the team before you spawn in.
          </p>
          <a
            className="light-button"
            href={discordInviteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the community <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <footer>
        <a href="#top" className="footer-brand">
          ESKELE <span>SMP</span>
        </a>
        <p>Premium Minecraft survival, proudly hosted for the Philippine community.</p>
        <div>
          <span>JAVA</span>
          <span>BEDROCK</span>
          <span>24/7</span>
        </div>
      </footer>

      {selectedServer && (
        <dialog
          ref={dialogRef}
          className="modal-backdrop"
          aria-labelledby="server-modal-title"
          aria-describedby="server-modal-description"
          onCancel={(event) => {
            event.preventDefault();
            closeServerDetails();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeServerDetails();
          }}
        >
          <section
            className="server-modal"
            style={{ "--accent": selectedServer.accent } as React.CSSProperties}
          >
            <button
              className="modal-close"
              onClick={closeServerDetails}
              aria-label="Close server details"
            >
              ×
            </button>
            <span className="modal-kicker">SERVER {selectedServer.number} / CONNECTION HUB</span>
            <h2 id="server-modal-title">{selectedServer.name}</h2>
            <p id="server-modal-description">{selectedServer.description}</p>
            <div className="modal-specs">
              <div>
                <small>ENGINE</small>
                <b>{selectedServer.platform}</b>
              </div>
              <div>
                <small>ACCESS</small>
                <b>{selectedServer.access}</b>
              </div>
              <div>
                <small>DIFFICULTY</small>
                <b>Hard</b>
              </div>
              <div>
                <small>UPTIME</small>
                <b>24 / 7</b>
              </div>
            </div>
            <div className="hub-notice">
              <span className="live-dot" />
              <p>
                Join Discord, read the rules, and ask the team for {selectedServer.name} access.
                {selectedServer.id === "fabric"
                  ? " Get the approved modpack, matching Minecraft version, and server address before connecting."
                  : " Get the supported Minecraft version and Java address or Bedrock address and port before connecting."}
              </p>
            </div>
            <a
              className="primary-button modal-button"
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Join Discord Server</span>
              <b aria-hidden="true">↗</b>
            </a>
          </section>
        </dialog>
      )}
    </main>
  );
}
