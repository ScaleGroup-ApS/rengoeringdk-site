/**
 * All service categories. Each entry powers an SEO-optimised subpage at
 * /tjenester/$slug as well as the category listings on /privat, /erhverv
 * and /tjenester.
 *
 * To add or edit a service, modify this file — the dynamic route picks
 * everything up automatically and the sitemap is generated from this list.
 */

import { PHOTOS, type ServicePhoto } from "./photos";

export type Audience = "privat" | "erhverv" | "both";

export type ServiceSection = { heading: string; body: string };
export type ServiceFAQ = { q: string; a: string };

export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  metaTitle: string;
  metaDesc: string;
  audience: Audience;
  /** Used by the wizard to pre-select property type when arriving via ?service=slug */
  wizardType?: string;
  /** SVG <path d> string for the category icon */
  iconPath: string;
  /** One-sentence summary for cards */
  shortDesc: string;
  /** Two-sentence lead for the category hero */
  heroLead: string;
  photo: ServicePhoto;
  /** From-price (per visit, ekskl. moms) — privat sider multiplies with 1.25 */
  fromPrice: number;
  features: string[];
  sections: ServiceSection[];
  whyUs: string[];
  faqs: ServiceFAQ[];
  related: string[];
};

const ICON_OFFICE = "M3 21h18M5 21V7l8-4v18M19 21V11l-6-4";
const ICON_SHOP = "M3 9l1-5h16l1 5M4 9v11h16V9M4 9h16M9 20v-6h6v6";
const ICON_CLINIC_A = "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z";
const ICON_INDUSTRY = "M12 2L2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5";
const ICON_CONTAINER = "M2 8h20v8H2zM6 8v8M10 8v8M14 8v8M18 8v8";
const ICON_STAIRS = "M3 21h4v-4h4v-4h4V9h4V5";
const ICON_WINDOW = "M9 17H7A5 5 0 017 7h2m6 10h2a5 5 0 000-10h-2M12 7v10";
const ICON_MOVE = "M5 12H3l9-9 9 9h-2v7a2 2 0 01-2 2H7a2 2 0 01-2-2z";
const ICON_DEEP = "M3 9h18M3 15h18M9 3v18M15 3v18";
const ICON_HAMMER = "M14 6l-8 8 4 4 8-8M12 4l4 4M3 21l4-1";
const ICON_BUILDING = "M3 21h18M6 21V5a2 2 0 012-2h8a2 2 0 012 2v16M10 9h0M14 9h0M10 13h0M14 13h0M10 17h4";
const ICON_INSTITUTION = "M3 21h18M3 9l9-6 9 6M5 9v12M19 9v12M9 13v4M15 13v4";
const ICON_RESTAURANT = "M3 2v7c0 1 1 2 2 2s2-1 2-2V2M5 11v11M15 2c-1.5 0-3 2-3 5s1.5 4 3 4v11";
const ICON_HOTEL = "M2 22h20M3 22V8h18v14M6 12h0M10 12h0M14 12h0M18 12h0M6 17h12";
const ICON_WAREHOUSE = "M2 20V8l10-5 10 5v12M8 20v-6h8v6M2 12h20";
const ICON_PRODUCTION = "M4 22V8l5 3 5-3 5 3v11M4 22h16M9 18h0M13 18h0M17 18h0";
const ICON_COMMON = "M3 12h18M3 7h18M3 17h18M7 3v18M17 3v18";
const ICON_TOILET = "M5 4h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3V4zM8 20h8M10 16v4M14 16v4";

export const SERVICES: Service[] = [
  {
    slug: "kontorrengoering",
    title: "Kontorrengøring",
    shortTitle: "Kontor",
    metaTitle: "Kontorrengøring — fast team, fleksible aftaler | Define Cleaning",
    metaDesc:
      "Professionel kontorrengøring i hele Danmark. Fast team, dokumenteret kvalitet og fleksible aftaler — så I møder ind til et frisk kontor hver dag.",
    audience: "erhverv",
    wizardType: "Kontor",
    iconPath: ICON_OFFICE,
    shortDesc: "Fast eller fleksibel rengøring af kontorlokaler, mødelokaler og fællesarealer.",
    heroLead:
      "Et rent kontor signalerer professionalisme og holder medarbejderne sunde og produktive. Vi tilrettelægger rengøringen efter jeres rytme — uden for arbejdstid, om morgenen eller ind i mellem møderne.",
    photo: "svcKontor",
    fromPrice: 349,
    features: [
      "Skriveborde, tastatur og kontaktflader",
      "Mødelokaler og fællesarealer",
      "Køkken, kantine og kaffeområder",
      "Toiletter, vådrum og sanitet",
      "Gulve — støvsugning, mopning og polish",
      "Affald, papir og pant sorteret korrekt",
    ],
    sections: [
      {
        heading: "Sådan arbejder vi med kontorrengøring",
        body:
          "Vi starter altid med en gennemgang af jeres lokaler, så vi forstår, hvor I arbejder tæt, hvor støvet samler sig, og hvilke områder der har særlige krav. Derefter tildeler vi et fast team med en navngiven kontaktperson — så det er de samme medarbejdere, der kender jeres kontor og kommer hver gang. Vi arbejder efter en tjekliste, der dokumenteres ved hvert besøg, og vi tilpasser løbende, hvis behovene ændrer sig. Resultatet er en rengøring, der ikke bare ser flot ud, men også reducerer sygefravær og bevarer indeklimaet.",
      },
      {
        heading: "Hvad indebærer professionel kontorrengøring?",
        body:
          "Daglig eller ugentlig kontorrengøring omfatter typisk gulvbehandling (støvsugning og mopning), aftørring af alle vandrette flader, kontaktflader som dørhåndtag og lyskontakter, samt grundig rengøring af køkken og toiletter. Vi bruger svanemærkede produkter og mikrofibrer, der binder bakterier og pollen i stedet for at sprede dem. Tunge opgaver som vinduespolering, gulvbehandling med polish og hovedrengøring kan lægges ind som faste intervaller — eller løses ad hoc, når behovet opstår.",
      },
      {
        heading: "Hvornår skal kontoret rengøres?",
        body:
          "De fleste virksomheder vælger rengøring uden for arbejdstid — enten tidligt om morgenen før første medarbejder møder ind, eller efter lukketid om aftenen. Vi har faste teams, der arbejder både i tidsrummene 05.30–08.00 og 17.00–21.00, og vi kan også løse opgaver i weekenden uden tillæg, hvis det er nødvendigt. For mindre kontorer med færre end ti medarbejdere er ugentlig eller hver-14.-dags rengøring ofte tilstrækkeligt — for større kontorer med kantine og højt persontryk anbefaler vi 2–5 besøg pr. uge.",
      },
    ],
    whyUs: [
      "Fast team — samme mennesker, der kender jeres kontor",
      "Dokumentation efter hvert besøg via tjekliste",
      "Svanemærkede produkter — bedre for indeklima og miljø",
      "Direkte nummer til jeres kontaktperson, ikke en hotline",
    ],
    faqs: [
      {
        q: "Hvor ofte bør vi få rengjort kontoret?",
        a: "Det afhænger af antal medarbejdere, om I har kantine, og hvor meget kundebesøg I har. For de fleste kontorer mellem 100 og 500 m² er ugentlig eller 2-gange-om-ugen passende. Vi anbefaler altid efter en gennemgang af jeres lokaler.",
      },
      {
        q: "Skal vi selv stille rengøringsmidler til rådighed?",
        a: "Nej. Vi medbringer alt — midler, klude, mopper, støvsugere og udstyr. Vi bruger udelukkende svanemærkede produkter, der er skånsomme over for mennesker og miljø.",
      },
      {
        q: "Hvad sker der, hvis vi er utilfredse med en rengøring?",
        a: "Så kommer vi tilbage og gør det om — gratis. Vi har en kvalitetsgaranti, der betyder, at vi retter op inden for 24 timer uden ekstra omkostninger.",
      },
      {
        q: "Kan vi opsige aftalen, hvis vores behov ændrer sig?",
        a: "Ja. Faste aftaler kan opsiges med en måneds varsel, og enkelte besøg kan ændres op til 48 timer før uden beregning.",
      },
    ],
    related: ["vinduespudsning", "toilet-og-sanitetsrengoering", "hovedrengoering"],
  },
  {
    slug: "butiksrengoering",
    title: "Butiksrengøring",
    shortTitle: "Butik",
    metaTitle: "Butiksrengøring — rene butiksruder & gulve | Define Cleaning",
    metaDesc:
      "Professionel butiksrengøring i hele Danmark. Fra prøverum til kasselinje — rene gulve, klare ruder og en velkomst, der får kunder tilbage.",
    audience: "erhverv",
    wizardType: "Butik",
    iconPath: ICON_SHOP,
    shortDesc: "Rengøring af butikker, prøverum, kasselinjer og lagerområde.",
    heroLead:
      "Den første ting kunder lægger mærke til, er hvor rent der er. Vi tilpasser rengøringen efter åbningstider og kundeflow, så butikken altid fremstår indbydende — uanset om I sælger tøj, fødevarer eller elektronik.",
    photo: "svcButik",
    fromPrice: 379,
    features: [
      "Butiksgulve — daglig pleje og polering",
      "Butiksruder, døre og facader",
      "Prøverum og kundeområder",
      "Kasselinje, betalingsterminaler og diske",
      "Lagerområde og personalefaciliteter",
      "Affaldshåndtering og pantkrukker",
    ],
    sections: [
      {
        heading: "Butiksrengøring tilpasset jeres åbningstider",
        body:
          "Butikker har sjældent tid til, at rengøringen står i vejen for kunderne. Vi løser opgaven enten tidligt om morgenen, før I åbner, eller sent på aftenen, efter I lukker — så jeres butiksgulv altid skinner, når den første kunde træder ind. For større butikker med høj omsætning kan vi løse mindre opgaver i åbningstiden uden at forstyrre kunderne, fx pleje af prøverum mellem aftaler.",
      },
      {
        heading: "Særligt fokus på kundeoplevelse",
        body:
          "I detailhandel er rengøringen en del af brandet. Vi går ekstra grundigt til værks i de zoner, hvor kunderne mærker forskellen — ved indgangen, omkring prøverum, ved kassen og på toiletterne. Vi har erfaring med fødevarebutikker (særlige krav til hygiejne og temperatur), tøjbutikker (støv på beklædning, prøverum), elektronikbutikker (skærme og montre), og hverdagsbutikker som apoteker og kiosker.",
      },
      {
        heading: "Vinduespolering som fast tilvalg",
        body:
          "Klare ruder er afgørende for butikker. Vi tilbyder fast vinduespolering — typisk ugentligt eller hver 14. dag — så facaden altid signalerer kvalitet. For butikker med store glaspartier kan vi også løse svær adgang og højde-arbejde.",
      },
    ],
    whyUs: [
      "Fleksible tidspunkter — vi tilpasser os åbningstiden",
      "Diskret personale i butikstøj eller uniform efter ønske",
      "Hurtig udrykning ved spild eller hændelser",
      "Branchekendskab fra fødevarer til mode",
    ],
    faqs: [
      {
        q: "Kan I rengøre under åbningstid uden at forstyrre kunder?",
        a: "Ja, vi har personale uddannet i at arbejde diskret midt blandt kunder. Vi anbefaler dog at lægge tunge opgaver uden for åbningstid.",
      },
      {
        q: "Tager I os ved hændelser som spildte varer eller knust glas?",
        a: "Ja. Vi har akutudkald i hele landet og kan typisk være fremme inden for 2–4 timer i hverdage og 4–6 timer i weekender.",
      },
      {
        q: "Skal vi selv håndtere affald og pant?",
        a: "Nej, det er en del af pakken. Vi tømmer affald og pantkrukker, og bringer dem ud til opsamlingsstedet i jeres opgang eller bygning.",
      },
    ],
    related: ["vinduespudsning", "fællesarealer", "toilet-og-sanitetsrengoering"],
  },
  {
    slug: "klinikrengoering",
    title: "Klinikrengøring",
    shortTitle: "Klinik",
    metaTitle: "Klinikrengøring & hygiejne — dokumenteret kvalitet | Define Cleaning",
    metaDesc:
      "Hygiejnerengøring til klinikker, tandlæger og sundhedscentre. Farvekodet udstyr, fuld dokumentation og fast team — fordi hygiejne ikke kan overlades til tilfældigheder.",
    audience: "erhverv",
    wizardType: "Klinik",
    iconPath: ICON_CLINIC_A,
    shortDesc: "Hygiejnesikret rengøring af klinikker, tandlæger og sundhedshuse.",
    heroLead:
      "Klinikker har skærpede krav til hygiejne og dokumentation. Vi arbejder efter klare procedurer, farvekodet udstyr og loggede tjeklister — så I kan dokumentere kvaliteten over for myndigheder, patienter og forsikringsselskaber.",
    photo: "svcKlinik",
    fromPrice: 499,
    features: [
      "Behandlingsrum og operationsstuer",
      "Venteværelse, reception og indgang",
      "Toiletter med skærpede hygiejnekrav",
      "Farvekodet udstyr — ingen krydskontaminering",
      "Afspritning af alle kontaktflader",
      "Dokumentation pr. besøg",
    ],
    sections: [
      {
        heading: "Hygiejnerengøring efter klinikkens behov",
        body:
          "Klinikker, tandlæger, fysioterapeuter og lægehuse har alle deres egne hygiejnezoner. Vi opdeler typisk klinikken i tre zoner: ren (behandlingsrum, operationsstuer), neutral (reception, gange) og uren (toiletter, affaldsrum) — og vi bruger farvekodet udstyr, så der aldrig sker krydskontaminering mellem zonerne. Vores personale er specifikt uddannet i klinikrengøring og kender forskellen på rengøring og desinfektion.",
      },
      {
        heading: "Dokumentation, der holder ved tilsyn",
        body:
          "Hver rengøring dokumenteres med tjekliste, tidspunkt og hvilke rum der er behandlet. I får adgang til en oversigt, der kan vises ved Styrelsen for Patientsikkerhed eller forsikringsselskabet, hvis det skulle blive nødvendigt. Vi arbejder efter INSTA 800, der er den nordiske kvalitetsstandard for rengøring, og vi følger Sundhedsstyrelsens vejledning til hygiejne i klinikker.",
      },
      {
        heading: "Tilpasset jeres åbningstider",
        body:
          "De fleste klinikker har deres rengøring lagt til tidlig morgen eller sen aften, så behandlingsrum er friske til første patient. Vi kan også løse mellemrengøring i frokostpausen for klinikker med højt patientflow. For tandlæger og kirurgiske klinikker tilbyder vi ekstra grundige procedurer med dampdesinfektion af kontaktflader, hvis det ønskes.",
      },
    ],
    whyUs: [
      "Personale uddannet specifikt i klinikrengøring",
      "Farvekodet udstyr — fuld zoneadskillelse",
      "Tjekliste og logning ved hvert besøg",
      "Erfaring med tilsyn fra Styrelsen for Patientsikkerhed",
    ],
    faqs: [
      {
        q: "Kan I dokumentere rengøringen til vores tilsyn?",
        a: "Ja. Vi udleverer en logfil med dato, klokkeslæt, ansvarlig medarbejder og udførte opgaver pr. besøg. Den kan tages med direkte til Styrelsen for Patientsikkerhed eller forsikringsselskabet.",
      },
      {
        q: "Bruger I autoriserede desinfektionsmidler?",
        a: "Ja, vi bruger godkendte desinfektionsmidler, der lever op til kravene i Sundhedsstyrelsens vejledning. Til daglig rengøring bruger vi svanemærkede midler, der er skånsomme over for patienter med allergi.",
      },
      {
        q: "Kan I løse ekstra rengøring efter særlige indgreb?",
        a: "Ja. Vi har akutudkald og kan komme med kort varsel — typisk samme dag i hverdage — hvis der er behov for ekstra grundig rengøring efter særlige procedurer.",
      },
    ],
    related: ["toilet-og-sanitetsrengoering", "hovedrengoering", "institutionsrengoering"],
  },
  {
    slug: "industrirengoering",
    title: "Industrirengøring",
    shortTitle: "Industri",
    metaTitle: "Industrirengøring — tungt udstyr & sikkerhed | Define Cleaning",
    metaDesc:
      "Specialrengøring af produktionshaller, maskiner og industrielle anlæg. Sikkerhedsklart personale, tungt udstyr og dokumentation, der holder ved revision.",
    audience: "erhverv",
    wizardType: "Lager / industri",
    iconPath: ICON_INDUSTRY,
    shortDesc: "Specialrengøring af produktionshaller, maskiner og industrianlæg.",
    heroLead:
      "Industri stiller særlige krav til både udstyr og sikkerhed. Vi har tungt udstyr, certificeret personale og erfaring med alt fra fødevareproduktion til maskinhaller — så driften kan fortsætte uden afbrydelse.",
    photo: "svcIndustri",
    fromPrice: 549,
    features: [
      "Produktions- og lagerhaller",
      "Højtryksrensning og industristøvsugning",
      "Maskinrengøring efter producenters specifikationer",
      "Gulvbehandling i syrebestandige malinger",
      "Sikkerhedscertificeret personale",
      "Dokumentation efter ISO og branchekrav",
    ],
    sections: [
      {
        heading: "Industrirengøring med branchekendskab",
        body:
          "Industrirengøring kan ikke leveres med samme udstyr som kontorrengøring. Vi har tunge industristøvsugere, højtryksanlæg, scrubber-maskiner og adgang til lift og højderedningsudstyr, hvis det er nødvendigt. Personalet er certificeret i højde-arbejde (op til 12 m), og vi har erfaring med både fødevarestandarder (BRC, IFS), pharma-grade rengøring og produktionshaller med kemikaliekrav.",
      },
      {
        heading: "Planlagt rengøring uden driftstop",
        body:
          "Vi planlægger rengøringen efter jeres produktionsplan — typisk i forbindelse med planlagte stop, om natten eller i weekender. For større anlæg etablerer vi en fast årsplan med daglig, ugentlig, månedlig og årlig rengøring, så hver del af anlægget får den nødvendige opmærksomhed uden at standse driften. Vi udfører også opstartsrengøring efter byggeri eller maskininstallationer.",
      },
      {
        heading: "Dokumentation til revision og audits",
        body:
          "Industri er ofte underlagt branchespecifikke krav (BRC, ISO 22000, IFS, GMP). Vi dokumenterer hver rengøring med foto, tidspunkt, medarbejder og brugte midler, så I står godt ved interne revisioner og myndighedstilsyn. Vores arbejde lever op til INSTA 800 (kvalitetsstandard) og vi har erfaring med ISO 9001-certificerede virksomheder.",
      },
    ],
    whyUs: [
      "Tungt udstyr — industristøvsugere, scrubber, højtryk",
      "Højde-certificeret personale op til 12 m",
      "Erfaring med fødevare-, pharma- og maskinindustri",
      "Dokumentation, der lever op til BRC, IFS og ISO",
    ],
    faqs: [
      {
        q: "Kan I løse rengøring i en aktiv produktion?",
        a: "Ja, men vi anbefaler at lægge tunge opgaver til planlagte stop. Vi kan løse løbende rengøring (fx affald og kontaktflader) i drift, men maskinrengøring og gulvbehandling kræver typisk stop.",
      },
      {
        q: "Har I sikkerhedscertificeret personale?",
        a: "Ja. Alle vores industri-medarbejdere har sikkerhedskursus, og dem der arbejder i højde har gennemført sele- og højde-kursus efter Arbejdstilsynets krav.",
      },
      {
        q: "Kan I tilpasse jer fødevarestandarder?",
        a: "Ja. Vi har erfaring med BRC, IFS og lokale fødevareregler. Vi bruger godkendte fødevarestandarder for midler i produktionsområder med fødevarekontakt.",
      },
    ],
    related: ["produktionsrengoering", "lager-og-logistikrengoering", "hovedrengoering"],
  },
  {
    slug: "skurvognsrengoering",
    title: "Skurvognsrengøring",
    shortTitle: "Skurvogn",
    metaTitle: "Skurvognsrengøring på byggepladser | Define Cleaning",
    metaDesc:
      "Fast rengøring af skurvogne, mandskabsvogne og pavilloner på byggepladser. Vi sikrer hygiejne, orden og overholdelse af Arbejdstilsynets krav.",
    audience: "erhverv",
    wizardType: "Lager / industri",
    iconPath: ICON_CONTAINER,
    shortDesc: "Rengøring af skurvogne, mandskabsfaciliteter og toiletter på byggepladser.",
    heroLead:
      "Skurvogne er medarbejdernes hjem på pladsen. Vi sørger for, at de altid er rene, hygiejniske og lovlige — så I overholder Arbejdstilsynets krav og holder pladsen i god ro.",
    photo: "svcSkurvogn",
    fromPrice: 295,
    features: [
      "Mandskabsskurvogne og spiseskure",
      "Toilet- og badeskure",
      "Omklædningsrum og garderober",
      "Køkken- og kaffeområde",
      "Tømning af affald og spildevand",
      "Ugentligt eller hyppigere efter behov",
    ],
    sections: [
      {
        heading: "Byggepladsrengøring efter Arbejdstilsynets krav",
        body:
          "Arbejdstilsynet stiller specifikke krav til rengøring og hygiejne i skurvogne og mandskabsfaciliteter på byggepladser. Vi kender kravene og leverer dokumenteret rengøring, så I står godt ved tilsyn. Vores team kommer typisk ugentligt — eller hyppigere på større pladser — og rengør spiseskure, toilet- og badeskure, omklædningsrum samt fælles kaffeområder.",
      },
      {
        heading: "Fast aftale gennem hele byggeperioden",
        body:
          "Vi indgår faste aftaler for hele byggeperioden, så I ikke skal tænke på rengøringen i planlægningen. Når byggeriet flytter, flytter vi med. Vi har erfaring med både små renoveringsprojekter og store anlægsbyggerier med flere hundrede mand på pladsen — og vi tilpasser rengøringen efter, hvor mange skurvogne der er, og hvor mange mennesker der bruger dem.",
      },
      {
        heading: "Tømning af affald og forbrugsstoffer",
        body:
          "Vi tømmer affald, fylder sæbe og papir op, og kontrollerer, om der er behov for ekstra forsyninger. Hvis der er noget, der ikke virker — fx en defekt vandhane eller et tilstoppet afløb — giver vi besked, så I kan få det udbedret. Det forhindrer småirritationer i at vokse til større problemer på pladsen.",
      },
    ],
    whyUs: [
      "Erfaring med Arbejdstilsynets krav på byggepladser",
      "Faste ugentlige eller hyppigere besøg",
      "Flytter med jeres pladser i hele landet",
      "Tjekliste og logning ved hvert besøg",
    ],
    faqs: [
      {
        q: "Hvor ofte bør skurvognene rengøres?",
        a: "Arbejdstilsynet kræver løbende rengøring, men i praksis afhænger frekvensen af antal medarbejdere og pladsens størrelse. For pladser med 10–30 mand anbefaler vi ugentlig rengøring. For større pladser typisk 2–3 gange om ugen.",
      },
      {
        q: "Kan I flytte med, når pladsen flytter?",
        a: "Ja. Vi har teams i hele Danmark og kan typisk overtage en ny plads inden for en uge.",
      },
      {
        q: "Hvad gør I, hvis der er noget, der ikke virker?",
        a: "Vi noterer det i tjeklisten og giver besked direkte til pladsleder, så I kan få det udbedret. Vi har erfaring med, at små fejl ellers vokser til store irritationsmomenter.",
      },
    ],
    related: ["haandvaerkerrengoering", "flytterengoering", "toilet-og-sanitetsrengoering"],
  },
  {
    slug: "trappevask",
    title: "Trappevask",
    shortTitle: "Trappe",
    metaTitle: "Trappevask til ejendomme & boligforeninger | Define Cleaning",
    metaDesc:
      "Fast trappevask til ejendomme og boligforeninger i hele Danmark. Rene trapper, elevatorer og fællesarealer — uge efter uge, år efter år.",
    audience: "both",
    wizardType: "Ejendom / trappe",
    iconPath: ICON_STAIRS,
    shortDesc: "Fast trappevask for ejendomme, boligforeninger og udlejere.",
    heroLead:
      "Trapper og opgange er det første beboere og besøgende ser. Vi leverer fast trappevask til ejendomme i hele landet — med samme team år efter år, så beboerne lærer os at kende og opgangen altid lugter af rent.",
    photo: "svcTrappe",
    fromPrice: 269,
    features: [
      "Trapper og reposer fra kælder til loft",
      "Elevatorer indvendigt — også spejle og knapper",
      "Indgangspartier og entreer",
      "Vinduer i opgange og trappetårne",
      "Fællesarealer som tørrerum og cykelkælder",
      "Postkasser og navneskilte",
    ],
    sections: [
      {
        heading: "Fast trappevask til ejendomme og boligforeninger",
        body:
          "Trappevask leveres typisk ugentligt eller hver 14. dag, og er en af de mest synlige rengøringsopgaver for beboere. Vi har faste teams, der kommer på samme dag og tidspunkt hver gang, så beboerne ved, hvornår de skal forvente os. Vores arbejde dækker hele opgangen — fra postkasser i stueetagen til den øverste repos — og inkluderer aftørring af håndlister, gelændere og kontaktflader.",
      },
      {
        heading: "Vinduer og elevator som fast tilvalg",
        body:
          "De fleste foreninger lægger vinduer i opgangen ind som fast tilvalg — typisk kvartalsvist eller halvårligt. Elevatorer rengøres ved hvert besøg, både gulv, spejle og knapper, så de fremstår rene og trygge at træde ind i. For ejendomme med store glaspartier i indgangen tilbyder vi også professionel vinduespolering, så facaden altid signalerer kvalitet.",
      },
      {
        heading: "Rapportering til bestyrelse og administrator",
        body:
          "Vi logger hvert besøg og kan rapportere direkte til bestyrelse eller ejendomsadministrator — så I altid kan dokumentere, at rengøringen er udført. Hvis vi ser noget, der trænger til reparation (et knækket trin, en defekt lampe, en lugtende kælder), giver vi besked, så det kan blive ordnet, før beboerne klager.",
      },
    ],
    whyUs: [
      "Samme team hver gang — beboerne lærer os at kende",
      "Faste dage og tidspunkter, så I ved hvad I får",
      "Direkte rapportering til bestyrelse og administrator",
      "Vi gør opmærksom på reparationsbehov løbende",
    ],
    faqs: [
      {
        q: "Hvor ofte bør trappen vaskes?",
        a: "For de fleste boligforeninger er ugentlig eller hver-14.-dags trappevask passende. Ejendomme med mange beboere eller adgang til gaden kan have behov for hyppigere besøg — vi anbefaler altid efter en gennemgang.",
      },
      {
        q: "Vasker I også vinduer i opgangen?",
        a: "Ja, det er et af vores mest populære tilvalg. De fleste foreninger lægger vinduespolering ind kvartalsvist.",
      },
      {
        q: "Kan I sende månedlig rapport til bestyrelsen?",
        a: "Ja. Vi udleverer en oversigt over alle besøg pr. måned, inkl. eventuelle observationer om behov for reparationer eller særlig opmærksomhed.",
      },
    ],
    related: ["faellesarealer", "vinduespudsning", "ejendomsservice"],
  },
  {
    slug: "vinduespudsning",
    title: "Vinduespudsning",
    shortTitle: "Vinduer",
    metaTitle: "Vinduespudsning til erhverv & private | Define Cleaning",
    metaDesc:
      "Professionel vinduespudsning — indvendigt og udvendigt, også i højde. Faste intervaller eller efter behov for både private og virksomheder.",
    audience: "both",
    iconPath: ICON_WINDOW,
    shortDesc: "Streg- og pletfri vinduer indvendigt og udvendigt — også i højde.",
    heroLead:
      "Klare vinduer giver lys, åbenhed og et professionelt indtryk. Vi pudser vinduer for både private og virksomheder — fra rækkehuse og villaer til facader og glaspartier i flere etager.",
    photo: "svcVinduer",
    fromPrice: 295,
    features: [
      "Vinduer ude og inde — også karme",
      "Glaspartier, døre og facader",
      "Højde- og svær adgang",
      "Sprosser og kitfuger aftørres",
      "Polering uden striber",
      "Faste intervaller eller engang",
    ],
    sections: [
      {
        heading: "Vinduespudsning til private hjem",
        body:
          "For private hjem leverer vi vinduespudsning typisk kvartalsvist eller halvårligt. Vi kommer på en aftalt dag, pudser alle vinduer indefra og udefra, aftørrer karme og sprosser, og sikrer at glasset er pudset uden striber. Vi har stiger og udstyr til at nå selv høje vinduer i tagetagen, og vi arbejder hurtigt og professionelt — typisk er vi færdige på 1–2 timer for et almindeligt parcelhus.",
      },
      {
        heading: "Vinduespudsning til erhverv",
        body:
          "For erhverv leverer vi typisk fast vinduespudsning hver 14. dag, månedligt eller kvartalsvist — afhængigt af hvor synlige ruderne er, og hvor meget vejr og trafik der er omkring bygningen. Butikker med store facader vælger ofte ugentlig polering, mens kontorer typisk er fint dækket med månedlig pudsning. Vi har erfaring med både små butiksruder og store glaspartier på 4–6 meter, hvor vi bruger teleskopstænger eller lift.",
      },
      {
        heading: "Højde og svær adgang",
        body:
          "Vinduer i højde kræver særligt udstyr og sikkerhedscertificeret personale. Vi har erfaring med både stiger op til 6 meter, teleskopstænger op til 10 meter, og indlejet lift for vinduer i flere etager. Vores medarbejdere er sikkerhedscertificeret til højde-arbejde, og vi har den nødvendige forsikring, hvis der skulle ske skader.",
      },
    ],
    whyUs: [
      "Pudsning uden striber — også på store glasflader",
      "Højde-certificeret personale til facader",
      "Faste intervaller — eller engang efter behov",
      "Inkluderer karme, sprosser og kitfuger",
    ],
    faqs: [
      {
        q: "Hvor ofte bør vinduer pudses?",
        a: "For private hjem typisk 2–4 gange om året. For butikker ofte ugentligt eller hver 14. dag. For kontorer typisk månedligt eller kvartalsvist. Vi anbefaler altid efter en gennemgang af bygningen og dens placering.",
      },
      {
        q: "Kan I pudse vinduer i højde?",
        a: "Ja. Vi har stiger, teleskopstænger og lift, og vores personale er sikkerhedscertificeret til højde-arbejde op til 12 meter.",
      },
      {
        q: "Hvad gør I, hvis vejret er dårligt på pudsedagen?",
        a: "Vi pudser i alt vejr undtagen frost (under 4 grader) og kraftig regn — men hvis vejret er meget dårligt, omlægger vi til næste mulige dag uden tillæg.",
      },
    ],
    related: ["kontorrengoering", "butiksrengoering", "ejendomsservice"],
  },
  {
    slug: "flytterengoering",
    title: "Flytterengøring",
    shortTitle: "Flytte",
    metaTitle: "Flytterengøring med garanti for godkendelse | Define Cleaning",
    metaDesc:
      "Grundig flytterengøring til både private boliger og erhvervslejemål. Garanti for godkendelse ved syn — eller vi kommer tilbage og gør det om gratis.",
    audience: "both",
    wizardType: "Flytterengøring",
    iconPath: ICON_MOVE,
    shortDesc: "Grundig flytterengøring med garanti for godkendelse ved syn.",
    heroLead:
      "En grundig flytterengøring kan være forskellen på at få depositum tilbage og ikke. Vi leverer flytterengøring efter de standarder, der kræves ved syn — og vi giver garanti: hvis udlejer ikke godkender, kommer vi tilbage gratis.",
    photo: "svcFlytte",
    fromPrice: 1995,
    features: [
      "Køkken — også bag køleskab og komfur",
      "Hvidevarer ind- og udvendigt (ovn, kogeplader)",
      "Badeværelse — fuger, fliser, afløb",
      "Vinduer, karme og sålbænke",
      "Gulve — afvaskning og polering",
      "Skabe ind- og udvendigt",
    ],
    sections: [
      {
        heading: "Flytterengøring der består synet",
        body:
          "Flytterengøring er ikke almindelig rengøring — det er dybderengøring efter de standarder, som udlejer eller boligforening kræver. Vi går grundigt til værks og rengør områder, der normalt ikke nås: bag og under hvidevarer, top af skabe, fuger i badeværelset, ovn ind- og udvendigt, emhætte med filter, og vinduer med karme og sålbænke. Vi har erfaring med både private udlejninger, almene boliger og erhvervslejemål, og vi kender de standarder, der typisk kræves.",
      },
      {
        heading: "Garanti for godkendelse",
        body:
          "Vi giver garanti på, at vores flytterengøring lever op til de krav, der typisk stilles ved fraflytning. Hvis udlejer eller administrator ikke godkender rengøringen — og påviser konkrete mangler — kommer vi tilbage gratis og udbedrer dem. Det giver dig ro i maven i en hektisk flytteperiode.",
      },
      {
        heading: "Hurtig levering — også med kort varsel",
        body:
          "Flytninger sker ofte med kort varsel. Vi kan typisk levere flytterengøring inden for 2–5 dage, og i hovedstadsområdet ofte næste dag, hvis der er åbne tider. Vi tilpasser os jeres flyttedato og er klar med team, udstyr og midler — du skal kun stå for at give os adgang.",
      },
    ],
    whyUs: [
      "Garanti for godkendelse — vi kommer gratis tilbage",
      "Erfaring med alle typer udlejninger",
      "Hurtig levering — også med kort varsel",
      "Fast pris fra start — ingen overraskelser",
    ],
    faqs: [
      {
        q: "Hvad koster en flytterengøring?",
        a: "Det afhænger af boligens størrelse og tilstand. For en typisk 2-værelses lejlighed på 60–80 m² ligger prisen mellem 2.500–3.800 kr. For større boliger op til 150 m² typisk 4.000–6.000 kr. Vi giver altid fast pris efter en kort gennemgang.",
      },
      {
        q: "Hvor lang tid tager en flytterengøring?",
        a: "For en almindelig 2-værelses tager det 4–6 timer med to medarbejdere. For større boliger 6–10 timer. Vi planlægger, så I kan flytte ind eller ud uden at vente på os.",
      },
      {
        q: "Hvad er inkluderet i prisen?",
        a: "Alt udstyr, midler og medarbejdere. Vi medbringer industristøvsuger, mopper, klude, ovnrens, kalkfjerner og polering — du skal kun give os adgang og strøm.",
      },
    ],
    related: ["hovedrengoering", "haandvaerkerrengoering", "vinduespudsning"],
  },
  {
    slug: "hovedrengoering",
    title: "Hovedrengøring",
    shortTitle: "Hovedrengøring",
    metaTitle: "Hovedrengøring til hjem & kontor | Define Cleaning",
    metaDesc:
      "Grundig hovedrengøring til private hjem og virksomheder. Vi rengør områder, der normalt overses — og giver lokalerne en frisk start.",
    audience: "both",
    wizardType: "Hus",
    iconPath: ICON_DEEP,
    shortDesc: "Grundig hovedrengøring der når områder, som normalt overses.",
    heroLead:
      "En hovedrengøring giver hjemmet eller kontoret en frisk start. Vi går grundigt til værks i alle hjørner — bag møbler, top af skabe, fuger og loftslamper — så lokalet fremstår som nyt.",
    photo: "svcHoved",
    fromPrice: 1495,
    features: [
      "Bag og under møbler og hvidevarer",
      "Top af skabe, kogt og hængelamper",
      "Fuger, fliser og kantlister",
      "Vinduer indvendigt med karme",
      "Lyssensorer, lyskontakter og dørhåndtag",
      "Trapper og reposer — også hjørner",
    ],
    sections: [
      {
        heading: "Hovedrengøring til private hjem",
        body:
          "Mange familier bestiller en hovedrengøring 1–2 gange om året — typisk inden jul, inden påske, eller i forbindelse med større begivenheder hjemme. Vi går grundigt til værks i alle rum og rengør områder, der ikke nås ved almindelig rengøring: bag og under tunge møbler, top af skabe og kogt, lampekupler, kontakter og fodlister. Hovedrengøring tager typisk 4–8 timer afhængigt af boligens størrelse, og resultatet holder længe.",
      },
      {
        heading: "Hovedrengøring til kontorer og butikker",
        body:
          "For virksomheder leverer vi typisk hovedrengøring 1–2 gange om året, ofte i forbindelse med ferielukning eller skiftedato. Vi rengør alt, der normalt ikke nås — herunder ventilationsriste, top af skabe, bag og under møbler, alle vinduer indvendigt, samt tæpper og polstrede møbler med damp eller dybderens. Det giver lokalerne et løft, der både medarbejdere og besøgende mærker.",
      },
      {
        heading: "Tilpasset jeres ønsker",
        body:
          "Hovedrengøring er ikke en standardvare. Vi tilpasser opgaven efter, hvad I særligt ønsker — fx en grundig rengøring af køkkenet, dybderens af tæpper, polering af gulve, eller hovedrengøring af badeværelset med kalk- og skimmelfjernelse. Vi giver altid fast pris efter en gennemgang, så I ved præcis hvad I får.",
      },
    ],
    whyUs: [
      "Vi når områder, der normalt overses",
      "Fast pris fra start — ingen overraskelser",
      "Tilpasset efter jeres særlige ønsker",
      "Hovedrengøring eller hovedrengøring + faste besøg",
    ],
    faqs: [
      {
        q: "Hvor ofte bør man få hovedrengøring?",
        a: "For private hjem typisk 1–2 gange om året. For virksomheder også 1–2 gange — ofte i forbindelse med ferielukning. Hvis I har faste rengøringsbesøg, bliver behovet for hovedrengøring mindre.",
      },
      {
        q: "Hvad koster en hovedrengøring?",
        a: "For en almindelig bolig 80–120 m² typisk 1.800–2.800 kr. For større boliger eller særligt grundig hovedrengøring op til 4.500 kr. For kontorer afhænger det af areal og tilvalg.",
      },
      {
        q: "Hvor lang tid tager det?",
        a: "Typisk 4–8 timer for en almindelig bolig. For større boliger eller kontorer 8–16 timer. Vi sender altid et passende team, så vi kan være færdige på én dag.",
      },
    ],
    related: ["flytterengoering", "vinduespudsning", "haandvaerkerrengoering"],
  },
  {
    slug: "haandvaerkerrengoering",
    title: "Håndværkerrengøring",
    shortTitle: "Håndværker",
    metaTitle: "Håndværkerrengøring efter renovering | Define Cleaning",
    metaDesc:
      "Grundig håndværkerrengøring efter byggearbejde, renovering eller maleropgaver. Vi fjerner støv, maling og snavs — så boligen er klar til indflytning.",
    audience: "both",
    wizardType: "Hus",
    iconPath: ICON_HAMMER,
    shortDesc: "Rengøring efter håndværkere, malere og renoveringer.",
    heroLead:
      "Efter et byggeprojekt eller en renovering ligger der støv overalt — også i kroge, du ikke vidste eksisterede. Vi rydder op efter håndværkerne, så I kan flytte ind eller bruge lokalerne med det samme.",
    photo: "svcHaandvaerker",
    fromPrice: 1395,
    features: [
      "Byggestøv fra alle overflader",
      "Maling- og kalkstænk på gulve og vinduer",
      "Rengøring af nye hvidevarer og armaturer",
      "Vinduer indvendigt og udvendigt",
      "Skabe, døre og lister grundigt aftørret",
      "Endelig støvsugning og polering",
    ],
    sections: [
      {
        heading: "Håndværkerrengøring efter byggeri og renovering",
        body:
          "Selv den mest ordentlige håndværker efterlader støv og snavs. Byggestøv har en særlig egenskab — det trænger ind i alle revner og kroge, og det skal fjernes systematisk for ikke at komme tilbage. Vi går igennem alle rum og rengør oppefra og ned: lofter, skabe, ventilationsriste, lamper, vægge, vinduer, hvidevarer, gulve. Vi bruger HEPA-filtrerede industristøvsugere, der binder finsupport, og mikrofibrer, der binder restpartikler.",
      },
      {
        heading: "Klar til indflytning eller brug samme dag",
        body:
          "Mange håndværkerrengøringer leveres dagen før indflytning eller åbning. Vi tilpasser os jeres tidsplan og kan typisk levere rengøringen inden for 2–5 dage efter aftale. For større projekter med flere lejligheder eller etager planlægger vi, så hver del leveres, lige når den er klar.",
      },
      {
        heading: "Maling, kalk og restmateriale",
        body:
          "Vi har erfaring med at fjerne malingstænk, kalk, fugemateriale og andet rest fra renoveringer. For særligt vanskelige rester (fx malingstænk på gulv) kan det kræve specialudstyr, og vi giver altid besked, hvis vi ser noget, der kræver ekstra tid. Vi rengør også vinduer, der ofte er særligt udsatte for kalk og malingstænk under byggeriet.",
      },
    ],
    whyUs: [
      "Industristøvsugere med HEPA-filter — binder finsupport",
      "Erfaring med alle typer byggestøv og rester",
      "Vi tilpasser os byggeriets tidsplan",
      "Garanti for godkendelse ved overdragelse",
    ],
    faqs: [
      {
        q: "Hvor hurtigt efter byggeriet kan I rengøre?",
        a: "Vi anbefaler at vente, indtil håndværkerne er endeligt færdige — også med små opretninger. Vi kan typisk levere inden for 2–5 dage efter aftale.",
      },
      {
        q: "Kan I fjerne malingstænk og kalkrester?",
        a: "Ja, det er en del af opgaven. For særligt vanskelige rester kan det kræve ekstra tid eller specialudstyr — vi giver altid besked på forhånd.",
      },
      {
        q: "Skal vi selv stille noget til rådighed?",
        a: "Nej — vi medbringer alt: industristøvsuger, HEPA-filter, mikrofibrer, ovnrens, kalkfjerner og polering. Vi har kun brug for adgang og strøm.",
      },
    ],
    related: ["flytterengoering", "hovedrengoering", "vinduespudsning"],
  },
  {
    slug: "ejendomsservice",
    title: "Ejendomsservice",
    shortTitle: "Ejendom",
    metaTitle: "Ejendomsservice & vicevært | Define Cleaning",
    metaDesc:
      "Total ejendomsservice for udlejere, boligforeninger og erhvervsejendomme. Trappevask, fællesarealer, vinduer, viceværtsopgaver og småreparationer.",
    audience: "erhverv",
    wizardType: "Ejendom / trappe",
    iconPath: ICON_BUILDING,
    shortDesc: "Total ejendomsservice — fra trappevask til småreparationer og viceværtsopgaver.",
    heroLead:
      "En ejendom kræver løbende pleje for at holde værdi og signalere kvalitet. Vi leverer total ejendomsservice — rengøring, vinduer, fællesarealer og småreparationer — så bestyrelsen kun har én leverandør at forholde sig til.",
    photo: "svcEjendom",
    fromPrice: 449,
    features: [
      "Trappevask og opgangsrengøring",
      "Fællesarealer, cykelkælder og affaldsrum",
      "Vinduer i opgange og fællesrum",
      "Småreparationer og pærer i fællesrum",
      "Snerydning og glatførebekæmpelse",
      "Månedlig rapportering til bestyrelse",
    ],
    sections: [
      {
        heading: "Én leverandør til hele ejendommen",
        body:
          "Mange ejendomme har flere leverandører — én til trappevask, én til vinduer, én til snerydning og en vicevært. Vi samler det hele under én aftale, så I kun har én kontakt og én faktura. Vi har faste teams, der dækker alt fra ugentlig trappevask til årlig hovedrengøring af opgange, og som kan tage småreparationer og almindelige viceværtsopgaver i samme besøg.",
      },
      {
        heading: "Rapportering til bestyrelse og administrator",
        body:
          "Vi udleverer månedlig rapport over alle udførte opgaver — med dato, tidspunkt, ansvarlig medarbejder, og eventuelle observationer om behov for reparationer. Det giver bestyrelsen fuld dokumentation og letter samarbejdet med ejendomsadministrator. Hvis vi ser noget, der trænger til reparation, giver vi besked direkte, så det kan blive ordnet, før beboerne klager.",
      },
      {
        heading: "Sæsonopgaver og særlige aftaler",
        body:
          "Ud over de faste opgaver tilbyder vi sæsonopgaver — snerydning og glatførebekæmpelse om vinteren, ukrudtsbekæmpelse om sommeren, blade og oprydning om efteråret. Vi kan også løse engangsopgaver som hovedrengøring af opgange, polering af gulve, eller rengøring efter renoveringer.",
      },
    ],
    whyUs: [
      "Én aftale, én kontakt, én faktura",
      "Månedlig rapport til bestyrelse og administrator",
      "Faste teams, der lærer ejendommen at kende",
      "Sæsonopgaver og småreparationer i samme besøg",
    ],
    faqs: [
      {
        q: "Kan I overtage alle vores ejendomsopgaver?",
        a: "Ja. Vi har erfaring med både små ejendomme og større boligselskaber med flere ejendomme. Vi laver en samlet aftale, der dækker alt fra ugentlig trappevask til årlige sæsonopgaver.",
      },
      {
        q: "Tilbyder I også snerydning?",
        a: "Ja, snerydning og glatførebekæmpelse er et af vores fast tilvalg. Vi har faste vagter i vintersæsonen og kan tilkaldes ved sne med kort varsel.",
      },
      {
        q: "Kan vi få fast vicevært ud over rengøringen?",
        a: "Ja. Vi kan tilknytte fast vicevært, der løser småreparationer, skift af pærer, kontrol af tekniske rum osv. — efter aftale.",
      },
    ],
    related: ["trappevask", "faellesarealer", "vinduespudsning"],
  },
  {
    slug: "institutionsrengoering",
    title: "Institutionsrengøring",
    shortTitle: "Institution",
    metaTitle: "Institutionsrengøring — skoler & daginstitutioner | Define Cleaning",
    metaDesc:
      "Børnesikker rengøring af daginstitutioner, skoler og uddannelsessteder. Svanemærkede midler, faste teams og dokumentation, der overholder Sundhedsstyrelsens krav.",
    audience: "erhverv",
    wizardType: "Klinik",
    iconPath: ICON_INSTITUTION,
    shortDesc: "Hygiejnerengøring til daginstitutioner, skoler og uddannelsessteder.",
    heroLead:
      "Institutioner stiller særlige krav — mange små hænder, sårbar hygiejne og høje krav til miljø og dokumentation. Vi leverer rengøring med svanemærkede midler, faste teams og fuld dokumentation, så I står godt ved tilsyn.",
    photo: "svcInstitution",
    fromPrice: 449,
    features: [
      "Klasselokaler, grupperum og legearealer",
      "Toiletter og puslerum",
      "Køkkener og spiseområder",
      "Fællesarealer, gange og garderober",
      "Legetøj og kontaktflader desinficeret",
      "Svanemærkede midler — børnesikre",
    ],
    sections: [
      {
        heading: "Børnesikker rengøring med svanemærkede midler",
        body:
          "Vi bruger udelukkende svanemærkede midler i institutioner — også til desinfektion. Det betyder, at midlerne er testet for sikkerhed over for børn og personale, samtidig med at de er effektive mod bakterier og virus. Vi har erfaring med vuggestuer, børnehaver, dagplejere, folkeskoler, gymnasier og højere uddannelser — og vi tilpasser rengøringen efter alder og brug.",
      },
      {
        heading: "Hygiejnedokumentation til tilsyn",
        body:
          "Daginstitutioner og skoler er underlagt tilsyn fra både kommune og Sundhedsstyrelse. Vi dokumenterer hver rengøring med tjekliste, tidspunkt og ansvarlig medarbejder — så I altid kan vise, at rengøringen er udført efter forskrifterne. For institutioner med skærpede krav (fx i forbindelse med sygdomsudbrud) tilbyder vi ekstra grundig desinfektion af kontaktflader og legetøj.",
      },
      {
        heading: "Tilpasset åbningstider og pasning",
        body:
          "Vi løser rengøringen uden for åbningstider — typisk tidligt om morgenen eller sent på eftermiddagen. For institutioner med døgnpleje eller særlige behov tilbyder vi også fleksible løsninger. Vores personale møder altid ind med tydelig ID, så personalet ved, hvem der kommer.",
      },
    ],
    whyUs: [
      "Svanemærkede midler — sikre for børn og personale",
      "Dokumentation til kommune- og sundhedstilsyn",
      "Fast team — samme ansigter hver gang",
      "Erfaring fra vuggestue til universitet",
    ],
    faqs: [
      {
        q: "Bruger I midler, der er sikre for børn?",
        a: "Ja. Vi bruger udelukkende svanemærkede midler i institutioner, og vi har erfaring med, hvordan vi rengør effektivt uden at efterlade rester, der kan irritere børn med allergi.",
      },
      {
        q: "Kan I dokumentere rengøringen til kommune-tilsyn?",
        a: "Ja, vi udleverer logfiler over hver rengøring, der kan vises ved tilsyn.",
      },
      {
        q: "Kan I gå ekstra grundigt til værks ved sygdomsudbrud?",
        a: "Ja. Vi har akutpakker til desinfektion ved fx maveinfluenza eller forkølelsesudbrud, hvor vi rengør alle kontaktflader og legetøj ekstra grundigt.",
      },
    ],
    related: ["klinikrengoering", "toilet-og-sanitetsrengoering", "hovedrengoering"],
  },
  {
    slug: "restaurantrengoering",
    title: "Restaurantrengøring",
    shortTitle: "Restaurant",
    metaTitle: "Restaurantrengøring — hygiejne for café & køkken | Define Cleaning",
    metaDesc:
      "Hygiejnerengøring for restauranter, caféer og catering. Vi kender Fødevarestyrelsens krav og dokumenterer hver rengøring, så I står godt ved smiley-kontrol.",
    audience: "erhverv",
    wizardType: "Butik",
    iconPath: ICON_RESTAURANT,
    shortDesc: "Hygiejnerengøring efter Fødevarestyrelsens standarder.",
    heroLead:
      "Restauranter, caféer og catering har skærpede krav til både køkken og gæstearealer. Vi leverer rengøring, der lever op til Fødevarestyrelsens standarder — og som dokumenteres ved hvert besøg, så I står godt ved smiley-kontrol.",
    photo: "svcRestaurant",
    fromPrice: 549,
    features: [
      "Gæstearealer, borde og stole",
      "Køkken efter Fødevarestyrelsens krav",
      "Emhætter, ovne og frituregryder",
      "Køl, frys og opbevaring",
      "Toiletter med høje hygiejnekrav",
      "Gulve med antiskridbehandling",
    ],
    sections: [
      {
        heading: "Restaurantrengøring efter smiley-kravene",
        body:
          "Fødevarestyrelsens smiley-system stiller klare krav til rengøring i restauranter og caféer. Vi kender kravene og leverer rengøring, der dokumenteres ved hvert besøg, så I står godt ved kontrollen. Vi arbejder oppefra og ned: emhætter, ovne, frituregryder, arbejdsborde, gulve, køl og frys — og vi har erfaring med både moderne caféer, traditionelle restauranter, fastfood-kæder og catering-køkkener.",
      },
      {
        heading: "Tilpasset jeres åbningstider",
        body:
          "De fleste restauranter får rengøring efter lukketid — typisk mellem 23.00 og 06.00 — så lokalerne er klar til åbning næste dag. Vi har faste natterhold, der kender restauranterne, og vi tilpasser os jeres åbningstider også i højsæsoner. For større kæder med flere afdelinger tilbyder vi samlet aftale med rapportering pr. afdeling.",
      },
      {
        heading: "Køkken og emhætter som specialopgave",
        body:
          "Køkken-rengøring kræver særligt udstyr og kemikalier. Vi har erfaring med opløsning af fedt fra emhætter og frituregryder, kalkfjernelse fra opvaskemaskiner, og dybderens af ovne. Vi bruger fødevaregodkendte midler og dokumenterer rengøringen pr. besøg, så I har sporbarhed på, hvornår fx emhætten sidst er renset.",
      },
    ],
    whyUs: [
      "Kendskab til Fødevarestyrelsens krav og smiley-system",
      "Fødevaregodkendte midler — også i køkken",
      "Erfaring fra fastfood til Michelin-niveau",
      "Dokumentation til kontrol pr. besøg",
    ],
    faqs: [
      {
        q: "Kender I Fødevarestyrelsens krav?",
        a: "Ja. Vores team uddannes specifikt i hygiejne efter Fødevarestyrelsens vejledninger, og vi dokumenterer hver rengøring, så I står godt ved smiley-kontrol.",
      },
      {
        q: "Kan I rengøre efter lukketid?",
        a: "Ja, det er normalen. Vi har natterhold, der typisk arbejder mellem 23.00 og 06.00.",
      },
      {
        q: "Tager I os af emhætter og fedt?",
        a: "Ja, det er en af vores specialopgaver. Vi anbefaler dybderens af emhætter månedligt eller kvartalsvist, afhængigt af brug.",
      },
    ],
    related: ["hotelrengoering", "butiksrengoering", "toilet-og-sanitetsrengoering"],
  },
  {
    slug: "hotelrengoering",
    title: "Hotelrengøring",
    shortTitle: "Hotel",
    metaTitle: "Hotelrengøring — værelser & fællesarealer | Define Cleaning",
    metaDesc:
      "Hotelrengøring og housekeeping til hoteller, B&B og feriehuse. Hurtig vending mellem gæster, fast personale og dokumenteret kvalitet.",
    audience: "erhverv",
    wizardType: "Klinik",
    iconPath: ICON_HOTEL,
    shortDesc: "Værelser, fællesarealer og hurtig vending mellem gæster.",
    heroLead:
      "Hoteller har én chance ved hver gæst — og det første indtryk afgøres af, hvor rent værelset er. Vi leverer hurtig og grundig housekeeping med fast team og dokumentation, så jeres anmeldelser holder.",
    photo: "svcHotel",
    fromPrice: 199,
    features: [
      "Værelser med ny linned og redt seng",
      "Badeværelser med antikalk og fast tilvalg af amenities",
      "Fællesarealer, lounge og reception",
      "Restaurant og morgenmadssal",
      "Mødelokaler og fitnesscenter",
      "Hurtig vending mellem gæster",
    ],
    sections: [
      {
        heading: "Hotel-housekeeping i dansk standard",
        body:
          "Hotelrengøring kræver hurtighed og præcision — og en evne til at levere samme kvalitet på 50 værelser, som hvis det kun var ét. Vi har faste hotelmedarbejdere, der kender standarden og kan vende et værelse på 20–30 minutter inkl. linned, bad og fyldte amenities. For større hoteller tilbyder vi samlet aftale med leveringsgaranti, så jeres reception ved præcis hvornår alle værelser er klar til check-in.",
      },
      {
        heading: "Fællesarealer og restaurant",
        body:
          "Ud over værelser leverer vi rengøring af fællesarealer — lounge, reception, restaurant, morgenmadssal, mødelokaler, fitnesscenter, pool og wellness. Vi tilpasser tidspunkterne, så vi ikke står i vejen for gæsterne — typisk tidligt om morgenen for lounge og restaurant, og om eftermiddagen for fitness og wellness.",
      },
      {
        heading: "Linned, amenities og forbrugsstoffer",
        body:
          "Vi kan også overtage håndteringen af linned, håndklæder, amenities og forbrugsstoffer — så I ikke selv skal stå for lager og bestilling. Vi har samarbejdsaftaler med vaskerier og leverandører, og vi sørger for, at jeres lager altid er fyldt op. Det reducerer arbejdspresset på reception og gør housekeeping mere effektiv.",
      },
    ],
    whyUs: [
      "Faste hotelmedarbejdere med vending-erfaring",
      "Leveringsgaranti pr. værelse — også i højsæson",
      "Vi kan også håndtere linned og amenities",
      "Erfaring med både små B&B og store kæder",
    ],
    faqs: [
      {
        q: "Hvor hurtigt kan I vende et værelse?",
        a: "Typisk 20–30 minutter inkl. linned, bad og amenities. For særligt komplicerede værelser eller suiter op til 45 minutter.",
      },
      {
        q: "Kan I håndtere linned og amenities for os?",
        a: "Ja, det er en af vores specialopgaver. Vi har samarbejdsaftaler med vaskerier og leverandører, så vi kan overtage hele forsyningskæden.",
      },
      {
        q: "Hvad gør I, hvis en gæst klager over rengøringen?",
        a: "Vi har akut-vending — vi kan typisk være på værelset inden for 15 minutter og rette op. Gæsteoplevelsen er vores ansvar, og vi behandler klager med højeste prioritet.",
      },
    ],
    related: ["restaurantrengoering", "vinduespudsning", "toilet-og-sanitetsrengoering"],
  },
  {
    slug: "lager-og-logistikrengoering",
    title: "Lager- og logistikrengøring",
    shortTitle: "Lager",
    metaTitle: "Lager- og logistikrengøring | Define Cleaning",
    metaDesc:
      "Rengøring af lager, distributionscentre og logistikfaciliteter. Industristøvsugere, scrubber og dokumentation til kvalitetscertificering.",
    audience: "erhverv",
    wizardType: "Lager / industri",
    iconPath: ICON_WAREHOUSE,
    shortDesc: "Rengøring af lager, distributionscentre og logistikfaciliteter.",
    heroLead:
      "Lager og logistik genererer enorme mængder støv, dæktryksrester og affald. Vi har det tunge udstyr og personale, der skal til — og vi tilpasser os jeres pickflow, så vi ikke står i vejen for driften.",
    photo: "svcLager",
    fromPrice: 449,
    features: [
      "Pickområder, gange og reolområder",
      "Lastoområder og kajer",
      "Lagergulve med scrubber-maskine",
      "Pakke- og forsendelsesområder",
      "Personalefaciliteter og spiseskure",
      "Affaldsområder og pant",
    ],
    sections: [
      {
        heading: "Industri-grad rengøring til lager",
        body:
          "Lagre kræver tungt udstyr — almindelig støvsuger og mop rækker ikke. Vi har industristøvsugere med HEPA-filter, scrubber-maskiner til store gulvarealer og højtryksanlæg til lastoområder. Vores personale er certificeret i højde-arbejde, så vi også kan rengøre øvre reol-niveauer og taghænge i haller op til 12 meter.",
      },
      {
        heading: "Tilpasset jeres pickflow",
        body:
          "Lager kører ofte 24/7 eller med to skift, så rengøring må ikke stå i vejen. Vi tilpasser os jeres pickflow og løser opgaverne i de stille perioder — typisk nat eller weekend. For større anlæg etablerer vi en zoneplan, hvor vi rengør én sektion ad gangen, så driften kan fortsætte uafbrudt.",
      },
      {
        heading: "Dokumentation til ISO og audit",
        body:
          "Mange logistikvirksomheder er ISO-certificeret eller arbejder med kunder, der kræver dokumenteret hygiejne (fx fødevare- og pharma-distributører). Vi dokumenterer hver rengøring med foto, tidspunkt og udførte opgaver, så I står godt ved interne og eksterne audits.",
      },
    ],
    whyUs: [
      "Industristøvsugere, scrubber og højtryksanlæg",
      "Højde-certificeret personale",
      "Rengøring tilpasset jeres pickflow",
      "Dokumentation til ISO og kunde-audits",
    ],
    faqs: [
      {
        q: "Kan I løse rengøring i en aktiv pickdrift?",
        a: "Ja, vi tilpasser os jeres flow og rengør zone for zone, så driften ikke afbrydes. For tunge opgaver anbefaler vi dog at planlægge med jeres pause-skift.",
      },
      {
        q: "Kan I rengøre høje reoler og taghænge?",
        a: "Ja. Vores personale er højde-certificeret, og vi har lift og sele-udstyr til arbejde op til 12 meter.",
      },
      {
        q: "Kan I tilpasse rengøringen til fødevare- eller pharma-standarder?",
        a: "Ja. Vi har erfaring med fødevarestandard (BRC, IFS) og pharma-grade rengøring, hvor sporbarhed og specifikke midler er afgørende.",
      },
    ],
    related: ["industrirengoering", "produktionsrengoering", "skurvognsrengoering"],
  },
  {
    slug: "produktionsrengoering",
    title: "Produktionsrengøring",
    shortTitle: "Produktion",
    metaTitle: "Produktionsrengøring til fødevarer & pharma | Define Cleaning",
    metaDesc:
      "Specialrengøring af produktionsanlæg inden for fødevarer, pharma og industri. Sporbart udstyr, godkendte midler og dokumentation til kvalitetscertificering.",
    audience: "erhverv",
    wizardType: "Lager / industri",
    iconPath: ICON_PRODUCTION,
    shortDesc: "Specialrengøring af produktionsanlæg med dokumenteret kvalitet.",
    heroLead:
      "Produktionsanlæg har de højeste krav til rengøring — særligt inden for fødevarer og pharma. Vi har personale med branchecertificering, godkendte midler og dokumentation, der lever op til BRC, IFS og GMP.",
    photo: "svcProduktion",
    fromPrice: 649,
    features: [
      "Produktionslinjer og maskinrengøring",
      "Sporbart udstyr og godkendte midler",
      "Fødevarestandarder BRC og IFS",
      "Pharma-grade GMP-procedurer",
      "Dybderens af tank, rør og transport",
      "Dokumentation pr. besøg",
    ],
    sections: [
      {
        heading: "Produktionsrengøring efter branchestandarder",
        body:
          "Produktion stiller branchespecifikke krav. For fødevareproduktion arbejder vi efter BRC, IFS og lokale fødevareregler — vi bruger godkendte midler og dokumenterer hver rengøring med foto og tidsstempel. For pharma-produktion arbejder vi efter GMP (Good Manufacturing Practice), hvor sporbarhed, kontrol og specifikke procedurer er afgørende. Vores personale er specifikt uddannet i branchestandarderne og kender de specifikke kontaminationsrisici.",
      },
      {
        heading: "Planlagt og akut rengøring",
        body:
          "Vi indgår faste aftaler for løbende produktionsrengøring — typisk med daglig, ugentlig, månedlig og årlig rengøring efter en samlet plan. Ud over den planlagte rengøring tilbyder vi akut udkald ved hændelser (spild, kontamination, smitterisiko), hvor vi kan være fremme inden for 2–6 timer i hverdage.",
      },
      {
        heading: "Sporbarhed og dokumentation",
        body:
          "Hver rengøring dokumenteres med tidspunkt, ansvarlig medarbejder, brugte midler og udførte opgaver. Dokumentationen leveres som en digital logfil, der kan vises ved interne og eksterne audits. For pharma-virksomheder tilbyder vi også foto-dokumentation af kritiske rum og udstyr.",
      },
    ],
    whyUs: [
      "Branchecertificeret personale (BRC, IFS, GMP)",
      "Godkendte midler — fødevare- og pharma-grade",
      "Sporbart udstyr — ingen krydskontaminering",
      "Akut udkald inden for 2–6 timer",
    ],
    faqs: [
      {
        q: "Lever jeres rengøring op til BRC og IFS?",
        a: "Ja. Vi har personale specifikt uddannet i fødevarestandarderne og dokumenterer hver rengøring efter kravene.",
      },
      {
        q: "Kan I rengøre efter GMP-procedurer?",
        a: "Ja, vi har erfaring med pharma-grade rengøring efter GMP, herunder sporbart udstyr, specifikke midler og foto-dokumentation.",
      },
      {
        q: "Hvor hurtigt kan I rykke ud ved hændelser?",
        a: "Akut udkald inden for 2–4 timer i hverdage og 4–6 timer i weekender og om natten.",
      },
    ],
    related: ["industrirengoering", "lager-og-logistikrengoering", "klinikrengoering"],
  },
  {
    slug: "faellesarealer",
    title: "Fællesarealer",
    shortTitle: "Fælles",
    metaTitle: "Rengøring af fællesarealer i ejendomme | Define Cleaning",
    metaDesc:
      "Fast rengøring af fællesarealer i ejendomme og boligforeninger — cykelkælder, tørrerum, affaldsrum, vaskeri og udeareal.",
    audience: "erhverv",
    wizardType: "Ejendom / trappe",
    iconPath: ICON_COMMON,
    shortDesc: "Cykelkælder, tørrerum, vaskeri og andre fællesarealer.",
    heroLead:
      "Fællesarealer bliver ofte glemt — men de er det, der adskiller en god ejendom fra en kedelig. Vi rengør cykelkældre, tørrerum, vaskerier og udearealer, så beboerne har lyst til at bruge dem.",
    photo: "svcFaelles",
    fromPrice: 295,
    features: [
      "Cykelkælder og garage",
      "Tørrerum og vaskeri",
      "Affaldsrum og pant",
      "Pulterrum og fælles gange",
      "Udeareal og indgangsparti",
      "Postkasser og navneskilte",
    ],
    sections: [
      {
        heading: "Fællesarealer der er værd at bruge",
        body:
          "Mange foreninger har fællesarealer, som ingen rigtig vil bruge — fordi de er beskidte, lugter, eller virker uhumske. Vi vender det. Vi rengør cykelkældre, tørrerum, vaskerier, affaldsrum og pulterrum, så beboerne har lyst til at bruge dem. Det øger trivslen og signalerer, at ejendommen passes på.",
      },
      {
        heading: "Affald og pant som specialopgave",
        body:
          "Affaldsrum og pantområder er ofte de mest besværlige områder. Vi tømmer, rengør, fjerner pantflasker, og giver besked, hvis der er problemer med skadedyr eller lugt. For ejendomme med mange beboere anbefaler vi ugentlig grundig rengøring af affaldsrummet — det forhindrer langtidsproblemer.",
      },
      {
        heading: "Udeareal og indgangsparti",
        body:
          "Det første indtryk af ejendommen er udearealet og indgangspartiet. Vi sørger for, at indgangen altid er ren og indbydende — feje blade, vaske indgangsmåtter, polere navneskilte og postkasser. For ejendomme med haver kan vi også tilknytte gartner og snerydning i samme aftale.",
      },
    ],
    whyUs: [
      "Vi rengør de områder, andre glemmer",
      "Faste teams, der kender ejendommen",
      "Akut udrykning ved fx skadedyr eller lugt",
      "Kan kombineres med trappevask og vinduer",
    ],
    faqs: [
      {
        q: "Hvor ofte bør fællesarealer rengøres?",
        a: "Cykelkælder, tørrerum og pulterrum typisk 1–2 gange om måneden. Affaldsrum gerne ugentligt. Udeareal og indgangsparti minimum ugentligt.",
      },
      {
        q: "Tager I os af pantflasker og affald?",
        a: "Ja. Vi sorterer pant og bringer affald til opsamlingssted i opgang eller på vej.",
      },
      {
        q: "Kan I rapportere skadedyrsproblemer?",
        a: "Ja. Hvis vi observerer rotter, mus, insekter eller andre skadedyr, giver vi besked til bestyrelse eller administrator, så det kan blive håndteret.",
      },
    ],
    related: ["trappevask", "ejendomsservice", "toilet-og-sanitetsrengoering"],
  },
  {
    slug: "toilet-og-sanitetsrengoering",
    title: "Toilet- og sanitetsrengøring",
    shortTitle: "Toilet",
    metaTitle: "Toilet- og sanitetsrengøring — hygiejne der mærkes | Define Cleaning",
    metaDesc:
      "Hygiejnisk rengøring af toiletter, badeværelser og sanitære faciliteter. Antikalk, antibakteriel og fyldt med papir og sæbe — så besøgende oplever omsorg.",
    audience: "erhverv",
    iconPath: ICON_TOILET,
    shortDesc: "Hygiejnerengøring af toiletter, badeværelser og vådrum.",
    heroLead:
      "Toiletter er det område, gæster vurderer dit sted hårdest på. Vi leverer hygiejnerengøring, der ikke bare ser rent ud — men også er bakterifrit, lugter friskt og altid har papir og sæbe.",
    photo: "svcToilet",
    fromPrice: 199,
    features: [
      "Toiletskåle, kummer og urinaler",
      "Vaske, armaturer og spejle",
      "Gulve, fuger og fliser",
      "Antikalk og antibakterielt",
      "Påfyldning af sæbe og papir",
      "Affald og hygiejnebind",
    ],
    sections: [
      {
        heading: "Hygiejnerengøring der mærkes",
        body:
          "Toiletter kræver særlig opmærksomhed — det er her, gæster danner sig et indtryk af din virksomhed. Vi bruger antibakterielle midler, der dræber 99,9% af alle bakterier, og vi fokuserer på de områder, der typisk overses: bag toilettet, fuger og fliser, ventilation og lyssensorer. Resultatet er et toilet, der ikke bare ser rent ud, men også lugter friskt og er hygiejnisk sikkert.",
      },
      {
        heading: "Påfyldning og forbrugsstoffer",
        body:
          "Vi tjekker og påfylder altid sæbe, håndklæder, papir og hygiejnebind. For større faciliteter med mange brugere kan vi også overtage håndteringen af lageret — så I ikke selv skal stå for bestilling. Det reducerer småirritationer og giver et bedre indtryk for brugerne.",
      },
      {
        heading: "Antikalk og specialrengøring",
        body:
          "Kalk er et af de største problemer på toiletter — særligt i hårde vandområder. Vi bruger professionelle antikalk-midler, der fjerner kalk uden at skade overfladen, og vi anbefaler periodisk afkalkning af toiletter, vaske og fliser, så de bevarer udseendet over tid.",
      },
    ],
    whyUs: [
      "Antibakterielle midler — dræber 99,9% af bakterier",
      "Påfyldning og lager-håndtering som tilvalg",
      "Antikalk og dybderens som specialopgave",
      "Dokumentation pr. besøg",
    ],
    faqs: [
      {
        q: "Hvor ofte bør toiletter rengøres?",
        a: "For kontorer typisk 2–5 gange om ugen afhængigt af brug. For restauranter, butikker og institutioner med højt brug typisk dagligt.",
      },
      {
        q: "Tager I os af påfyldning af sæbe og papir?",
        a: "Ja, det er standard. Vi kan også overtage hele lager-håndteringen.",
      },
      {
        q: "Hvad gør I ved skader på toiletter (fx defekte armaturer)?",
        a: "Vi giver besked direkte til driftansvarlig, så det kan blive udbedret. For ejendomme med vicevært kan vi også selv håndtere mindre reparationer.",
      },
    ],
    related: ["klinikrengoering", "institutionsrengoering", "faellesarealer"],
  },
];

export const SERVICES_BY_SLUG: Record<string, Service> = SERVICES.reduce(
  (acc, s) => {
    acc[s.slug] = s;
    return acc;
  },
  {} as Record<string, Service>,
);

export function servicesFor(audience: Audience): Service[] {
  if (audience === "privat") return SERVICES.filter((s) => s.audience === "privat" || s.audience === "both");
  if (audience === "erhverv") return SERVICES.filter((s) => s.audience === "erhverv" || s.audience === "both");
  return SERVICES;
}
