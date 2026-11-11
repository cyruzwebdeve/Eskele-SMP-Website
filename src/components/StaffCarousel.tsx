import type { CSSProperties } from "react";
import amiSkin from "../assets/skins/ami.png";
import albSkin from "../assets/skins/alb.png";
import ghosteSkin from "../assets/skins/ghoste.png";
import madweedSkin from "../assets/skins/Madweed.png";
import shamiSkin from "../assets/skins/shami.png";
import tendSkin from "../assets/skins/tend.png";
import rankBadge from "../assets/ESK Rank badge.png";
import InfiniteCarousel from "./InfiniteCarousel";

const staff = [
  { ign: "EL_MADWEED", skin: madweedSkin, role: "Owner" },
  { ign: "albqt01", skin: albSkin, role: "Admin" },
  { ign: "Tendou_u", skin: tendSkin, role: "Admin" },
  { ign: "Shamimon", skin: shamiSkin, role: "Admin" },
  { ign: "AmiAzurite", skin: amiSkin, role: "Admin" },
  { ign: "GhosteOfDixon", skin: ghosteSkin, role: "Admin" },
];

export default function StaffCarousel() {
  return (
    <InfiniteCarousel
      id="staff-track"
      label="Eskele owner and admins"
      itemLabel="staff member"
      slideClassName="staff-slide"
      toolbarNote="THE TEAM THAT KEEPS US BUILDING"
      slides={staff.map((member) => ({
        id: member.ign,
        label: `${member.ign}, ${member.role}`,
        style: {
          "--staff-accent": member.role === "Owner" ? "#e6a63a" : "#cc39ff",
        } as CSSProperties,
        content: (
          <article className={`staff-card ${member.role === "Owner" ? "staff-owner" : ""}`}>
            <div className="staff-portrait">
              <img
                className="staff-skin"
                src={member.skin}
                alt={`${member.ign}'s Minecraft skin`}
                width={1280}
                height={960}
                loading="lazy"
                decoding="async"
              />
              <span className="staff-role">{member.role}</span>
            </div>
            <div className="staff-details">
              <span className="staff-eyebrow">IN-GAME NAME</span>
              <div className="staff-identity">
                <img
                  className="staff-rank"
                  src={rankBadge}
                  alt="Eskele rank badge"
                  width={505}
                  height={128}
                />
                <h3>{member.ign}</h3>
              </div>
            </div>
          </article>
        ),
      }))}
    />
  );
}
