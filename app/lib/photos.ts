/**
 * Stock photo URLs from Unsplash (free for commercial use, no attribution required).
 * Each entry is a stable Unsplash CDN URL with width/quality params.
 * To swap, replace the photo id — keep the same key.
 */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  // hero — bright modern office (legacy, kept for compatibility)
  hero: u("1497366754035-f200968a6e72", 1200),
  // privat / erhverv splash images
  heroPrivat: u("1556909114-f6e7ad7d3136", 1200),
  heroErhverv: u("1497366811353-6870744d04b2", 1200),

  // service category photos
  svcKontor: u("1497366811353-6870744d04b2"),
  svcButik: u("1604719312566-8912e9227c6a"),
  svcKlinik: u("1629909613654-28e377c37b09"),
  svcIndustri: u("1553413077-190dd305871c"),
  svcSkurvogn: u("1581094288338-2314dddb7ece"),
  svcTrappe: u("1497366216548-37526070297c"),
  svcVinduer: u("1527515637462-cff94eecc1ac"),
  svcFlytte: u("1486406146926-c627a92ad1ab"),
  svcHoved: u("1581578731548-c64695cc6952"),
  svcHaandvaerker: u("1581094288338-2314dddb7ece"),
  svcEjendom: u("1486325212027-8081e485255e"),
  svcInstitution: u("1503676260728-1c00da094a0b"),
  svcRestaurant: u("1559339352-11d035aa65de"),
  svcHotel: u("1566073771259-6a8506099945"),
  svcLager: u("1553413077-190dd305871c"),
  svcProduktion: u("1565008576549-57569a49371d"),
  svcFaelles: u("1564540583246-934409427776"),
  svcToilet: u("1552321554-5fefe8c9ef14"),

  // om-os story
  story: u("1556761175-5973dc0f32e7"),
} as const;

export type ServicePhoto = keyof typeof PHOTOS;
