import React from "react";
import SubpageLayout from "@/components/site/SubpageLayout";

export default function About() {
  return (
    <SubpageLayout label="About" title="We built the" italicWord="command center.">
      <p>
        CloseTheOffer was born from a simple frustration: job searching for technical
        roles means juggling a spreadsheet, a notebook, your inbox, and three job
        boards — all at once. No single tool brought it together without charging
        $40/month for half the features.
      </p>
      <p>
        We set out to build one dashboard that tracks every application from first
        click to signed offer, syncs recruiter emails automatically, surfaces live
        listings from LinkedIn and Indeed, and gives you STAR-method interview prep
        cards before every conversation — all for $9/month.
      </p>
      <p>
        Today, over 500 engineers, architects, and tech professionals use
        CloseTheOffer to run a faster, more organized, and higher-converting job
        search. We're just getting started.
      </p>
    </SubpageLayout>
  );
}