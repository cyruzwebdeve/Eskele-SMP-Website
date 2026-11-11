import kiematchaSkin from "../assets/skins/kiematcha.png";
import pandaSkin from "../assets/skins/iPandaBanana.png";
import tadashiSkin from "../assets/skins/Tadashimvp.png";
import modsBadge from "../assets/mods.png";

const moderators = [
  { ign: "kiematcha", skin: kiematchaSkin },
  { ign: "iPandaBanana", skin: pandaSkin },
  { ign: "Tadashimvp", skin: tadashiSkin },
];

export default function ModsGrid() {
  return (
    <div className="mods-grid">
      {moderators.map((member) => (
        <article className="staff-card mods-card" key={member.ign}>
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
            <span className="staff-role">Moderator</span>
          </div>
          <div className="staff-details">
            <span className="staff-eyebrow">IN-GAME NAME</span>
            <div className="staff-identity">
              <img
                className="staff-rank"
                src={modsBadge}
                alt="Moderator rank badge"
                width={324}
                height={124}
                loading="lazy"
                decoding="async"
              />
              <h3>{member.ign}</h3>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
