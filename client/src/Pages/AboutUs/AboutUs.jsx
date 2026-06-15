import { useState } from "react";
import AboutStory from "./AboutStory";
import AboutMission from "./AboutMission";
import AboutSuccess from "./AboutSuccess";
import AboutTeam from "./AboutTeam";

const AboutUs = () => {
  const [active, setActive] = useState("story");

  const tabs = [
    { key: "story", label: "Story" },
    { key: "mission", label: "Mission" },
    { key: "success", label: "Success" },
    { key: "team", label: "Team" },
  ];

  return (
    <div className="py-10 mx-auto px-8">
      {/* Tabs */}
      <div role="tablist" className="tabs tabs-bordered mb-6">
        {tabs.map((tab) => (
          <a
            key={tab.key}
            href="#"
            role="tab"
            onClick={(e) => {
              e.preventDefault();
              setActive(tab.key);
            }}
            className={`tab ${active === tab.key ? "tab-active font-bold" : ""}focus:outline-none focus:bg-transparent active:bg-transparent

`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {/* Dynamic Component Rendering */}
      <div className="mt-4">
        {active === "story" && <AboutStory />}
        {active === "mission" && <AboutMission />}
        {active === "success" && <AboutSuccess />}
        {active === "team" && <AboutTeam />}
      </div>
    </div>
  );
};

export default AboutUs;