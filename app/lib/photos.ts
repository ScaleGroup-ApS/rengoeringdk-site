/**
 * Stock photo URLs from Unsplash (free for commercial use, no attribution required).
 * Each entry is a stable Unsplash CDN URL with width/quality params.
 * If you want to swap any, replace the URL — keep the same key.
 */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  // hero — bright modern office
  hero: u("1497366754035-f200968a6e72", 1000),

  // service rows (tjenester)
  svcKontor: u("1497366811353-6870744d04b2"),
  svcVinduer: u("1527515637462-cff94eecc1ac"),
  svcKlinik: u("1629909613654-28e377c37b09"),
  svcTrappe: u("1497366216548-37526070297c"),
  svcFlytte: u("1486406146926-c627a92ad1ab"),
  svcIndustri: u("1553413077-190dd305871c"),

  // om-os story
  story: u("1556761175-5973dc0f32e7"),

  // team portraits (square)
  team1: u("1507003211169-0a1dd7228f2d", 400),
  team2: u("1494790108377-be9c29b29330", 400),
  team3: u("1500648767791-00dcc994a43e", 400),
  team4: u("1438761681033-6461ffad8d80", 400),
} as const;
