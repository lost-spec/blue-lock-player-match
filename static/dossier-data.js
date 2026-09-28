/*
 * Player dossier data.
 *
 * PROVENANCE: every field below was retrieved from the player's own profile page
 * on bluelock.guide (see `source` on each entry). Nothing here was written from
 * memory. Where the source publishes no narrative, the field is null and
 * `researchNote` says so, rather than being filled in with invented text.
 *
 * `playLike` is the only derived field. It is practical coaching guidance
 * synthesised from each player's documented `weapon` and `position`. It is not
 * canon dialogue and is labelled as derived in the UI.
 *
 * Two other fields are deliberately separated:
 *   - `researchNote` describes a limitation of the SOURCE. It is shown to
 *     visitors, because "this source has no scouting report" is honest
 *     information they need.
 *   - `dataCorrection` records what the previous hand-written roster copy in
 *     chatbot.js got wrong. It is developer-facing changelog data and is NOT
 *     rendered on the page, so the old fabrications are never presented to
 *     visitors as if they were fact.
 *
 * Two source-side rendering bugs were repaired during extraction:
 *   - Reo's "Known as" renders as one run-together string
 *     `Chamilleonare" "Copycat*` -> split into two titles.
 *   - Shido's "Known as" renders as `Demon" "The Devil` -> split into two.
 * Reo's birthday carries a scrape artifact year ("2001") that no other entry has;
 * the year was dropped rather than reproduced.
 */
window.PLAYER_MATCH_DOSSIER_DATA = {
  meta: {
    researchedOn: "2026-09-27",
    primarySource: "bluelock.guide",
    sourceIndex: "https://www.bluelock.guide/characters",
    secondarySources: [
      "https://en.wikipedia.org/wiki/List_of_Blue_Lock_characters",
      "https://blue-lock.fandom.com/wiki/List_of_Characters",
    ],
    method:
      "Each player's bluelock.guide profile page was fetched and its own " +
      '"Scouting report", "Weapons", "Known as", "Record" and "Personal Data" ' +
      "sections were transcribed. Cross-checked against Wikipedia and the " +
      "Fandom character list where the primary page was thin.",
    caveats: [
      "bluelock.guide publishes no scouting report for Jyubei Aryu, Charles Chevalier, Hugo or Don Lorenzo. Those entries carry only what the source documents (position, rank, weapons, titles, personal data). Their philosophy/biography/mindset are null on purpose.",
      "Michael Kaiser's scouting report is explicitly a placeholder: the source states the anime 'has only begun to show' him, so his philosophy is presented as positioning, not characterisation.",
      "No source page contains verbatim character dialogue, so there are no quotes to cite.",
      "bluelock.guide is a fan-maintained site, not official. Titles and rankings track the anime/manga as published up to the retrieval date.",
    ],
  },

  players: [
    {
      id: "isagi",
      name: "Yoichi Isagi",
      position: ["Forward", "Offensive Midfielder", "Right Wing", "Right Midfielder"],
      rank: "#1",
      club: "Japan U-20 (Starter)",
      age: "16",
      height: "175 cm (5'9\")",
      birthday: "April 1",
      bloodType: "B",
      relatives: ["Iyo Isagi (mother)", "Issei Isagi (father)"],
      weapon: ["Spatial Awareness", "Metavision"],
      titles: [
        "Demon King of Blue Lock",
        "The Shadow King of Blue Lock",
        "Heart of Blue Lock",
        "The Neo-Egoist",
        "Egoist Machine",
        "Genius of Adaptation",
        "Blue Lock's Shining Savior",
        "Blue Lock's Prodigy",
        "Logic Demon",
        "Young Ace of the Blue Lock",
        "Soccer Machine",
      ],
      philosophy:
        "Blue Lock asks him one question over and over: do you want to score, or do you want an excuse? What makes him dangerous is not speed or power but the 'smell of the goal', a habit of reading everyone on the pitch at once that sharpens across the selections into full spatial awareness, metavision. He steals good ideas shamelessly and rebuilds his game after every loss. Rin beats him, so he studies Rin; the World Five humiliate him, so he studies them.",
      biography:
        "Isagi's story starts with a pass. In the prefectural final he gives up a clear shot to feed a teammate, the teammate misses, his team loses, and the boy who did the correct thing gets an invitation to a facility built on the idea that the correct thing is worthless. He walked into Blue Lock as the 299th-ranked nobody, and revealed his spatial awareness against Team X before awakening the direct-shot formula in the Blue Lock Man training room. Against the Top 3 his team lost and Bachira was taken; he then beat Baro, then Chigiri's trio, then Rin/Bachira/Aryu/Tokimitsu. He walks out of the U-20 match as the man the geniuses have to chase, having arrived on the loose ball and buried the last-second winner.",
      mindset:
        "He treats every loss as a rebuild rather than a verdict, studying whoever just beat him. He pairs his vision with a first-time direct shot that needs only a sliver of space. Ego is not something he guards; it is fuel, sharpened by humiliation and turned back on the field.",
      moments: [
        "Prefectural final: sacrifices a clear shot to feed a teammate, the teammate misses and his team loses",
        "First Selection, Team Z vs Team X: catches the 'smell of the goal' and reveals Spatial Awareness / Metavision",
        "First Selection, Team Z vs Team V: finds 'the final piece' of his evolution during Kuon's self-sacrificing foul",
        "Third Selection, Blue Lock vs U-20 Japan: buries the last-second winner off the loose ball",
      ],
      playLike: [
        "Scan before you receive the ball, not after. His weapon is reading the whole field at once.",
        "Offer the pass you wish someone had given you.",
        "Rebuild your game after every loss instead of defending it.",
        "Shoot first time from a sliver of space rather than waiting for a perfect setup.",
        "Steal good ideas openly. He is documented as doing exactly that.",
      ],
      source: "https://www.bluelock.guide/characters/yoichi-isagi",
      researchNote: null,
    },

    {
      id: "rin",
      name: "Rin Itoshi",
      position: ["Forward"],
      rank: "#1",
      club: "Japan U-20 (Starter)",
      age: "16",
      height: "187 cm (6'2\")",
      birthday: "September 9",
      bloodType: "A",
      relatives: ["Sae Itoshi (older brother)", "Unnamed father", "Unnamed mother"],
      weapon: ["Kick Accuracy", "Spatial Awareness", "Off the Ball Movements", "Dribbling"],
      titles: [
        "Blue Lock's Strongest Striker",
        "The Beast",
        "Destroyer",
        "Revenger",
        "Puppet Master",
        "Cheat Code Monster",
      ],
      philosophy:
        "His flawless football reads as joyless: perfect scanning, perfect technique, a long-range shot that bends physics, all of it in service of 'destroying everything'. He has been trying to erase his brother Sae ever since Sae returned from Spain and told him their plan was garbage. He is obsessed with surpassing Sae, and Isagi is the first opponent who improves fast enough that Rin cannot dismiss him.",
      biography:
        "Rin learned football worshipping his older brother Sae, the genius who left for Spain promising they would be the world's best striker and the world's best midfielder together. The brother who came back was a stranger who told him the plan was garbage, and Rin has been trying to erase him ever since. He debuted in the Second Selection as Blue Lock's #1 ranked player and crushed Isagi's trio in the rivalry battle almost as a demonstration. Against Sae in the U-20 match he played on pure grudge, outplaying his brother in stretches, but ended it watching Isagi, not himself, take the final goal.",
      mindset:
        "He crushes opponents almost as a demonstration, then watches in silence as they climb back toward him. Watching Isagi improve match after match is the first thing that has made him look twice. The U-20 match takes him off the machine and onto pure grudge, and he carries both the outplay and the stolen final goal out of it.",
      moments: [
        "Second Selection, Isagi/Bachira/Nagi vs Rin/Aryu/Tokimitsu (Top 3): Rin's team wins decisively and Bachira is taken",
        "Second Selection, final 4v4 corners: total-field dominance, reading skills, ball, positioning and tactics simultaneously",
        "Third Selection, Sae Itoshi vs Rin Itoshi one-shot match: Sae wins",
        "Third Selection, Blue Lock vs U-20 Japan: plays on pure grudge, outplays Sae in stretches but Isagi takes the final goal",
      ],
      playLike: [
        "Demand the ball. His documented style is built on being the focal point, not a supporting runner.",
        "Shoot from distance. His weapon is kick accuracy; he does not need a clean chance.",
        "Scan constantly, then move off the ball into space rather than standing on it.",
        "Treat a perfect performance as a baseline, not an achievement.",
      ],
      source: "https://www.bluelock.guide/characters/rin-itoshi",
      researchNote: null,
    },

    {
      id: "bachira",
      name: "Meguru Bachira",
      position: ["Forward", "Left Midfielder", "Side Back", "Left Wing"],
      rank: "#5",
      club: "FC Barcha (Starter) / Japan U-20 (Starter)",
      age: "17",
      height: "176 cm (5'9\")",
      birthday: "August 8",
      bloodType: "AB",
      relatives: ["Yu Bachira (mother)"],
      weapon: ["Monster Dribbling"],
      titles: ["Monster", "Bumblebee"],
      philosophy:
        "Bachira comes to Blue Lock looking for people who play at the level of his imagination, and he attaches himself to Isagi the moment he senses one. He lets go of the 'monster' he had been chasing, accepts that he has to find his own goal, and starts playing as himself. That freer, scarier version of him no longer needs a partner to be whole, but he wants one anyway, which is exactly why he keeps hunting Isagi.",
      biography:
        "Bachira grew up with a monster. Other kids found his dribbling creepy and his talk of a voice inside him weirder still, so the monster became his only teammate and he spent years playing football that needed nobody else. In Team Z he is the engine, a dribbler who carries the ball through three defenders like they are cones. Against Nagi and Reo in the Team V match his play 'sets fire on the ego' in their hearts, starting the first chain of awakenings in Blue Lock and revealing his weapon, Monster Dribbling. He was then taken onto Rin's team after beating Isagi, stopped hearing the monster, and the rematch against Isagi forced the truth out; he awakened his own ego in the final 4v4 of the second selection.",
      mindset:
        "He treats a striker as the engine of a team and his dribbling as something that cannot be taught or dismissed. Being isolated as a child did not make him selfish; it made him hunt for the one player he senses can match his imagination. Losing the monster cost him the joy first, and getting it back meant taking ownership of his own ego rather than borrowing an imaginary one.",
      moments: [
        "First Selection, Team Z vs Team X: Team Z loses",
        "First Selection, Team Z vs Team V: weapon reveal, Monster Dribbling sets fire on the ego and carries Team Z back from collapse",
        "Second Selection, Isagi/Bachira/Nagi vs Rin/Aryu/Tokimitsu (Top 3): his team loses and he is taken onto Rin's side",
        "Second Selection, final 4v4: shakes off his ideal and awakens his own ego against Isagi, Nagi, Baro and Chigiri",
      ],
      playLike: [
        "Take the one-on-one nobody else wants. That is his entire documented weapon.",
        "Keep the ball glued to your foot through multiple defenders.",
        "Dribble to create, not to score. The carry itself is the play.",
        "Find the one player in the room who matches your ambition and go to them.",
      ],
      source: "https://www.bluelock.guide/characters/meguru-bachira",
      researchNote: null,
    },

    {
      id: "barou",
      name: "Shoei Barou",
      position: ["Forward", "Right Wing", "Left Wing"],
      rank: "#4",
      club: "Ubers (Starter) / Japan U-20 (Sub)",
      age: "18",
      height: "187 cm (6'2\")",
      birthday: "June 27",
      bloodType: "A",
      relatives: [
        "Unnamed mother",
        "Unnamed father",
        "Two unnamed younger sisters",
      ],
      weapon: ["Solitary King", "Lonely King"],
      titles: ["King"],
      philosophy:
        "Baro calls himself the King: sharing is for subjects, passing is for cowards, and he dribbles through people because going around them would be a concession. Watching Isagi and Nagi link up, he realizes he cannot out-protagonist Isagi, so he stops trying to be the hero of the match and becomes its villain instead. The new Baro is meaner, sharper, and finally a teammate, in the sense that a shark and a diver share the same water.",
      biography:
        "In the first selection he plays like the title is self-evident, Team X's battering ram who bulldozes Team Z alone, establishing his weapon as raw, untouchable individual goal-scoring power. Isagi's team then knocked him out of the rivalry battle and drafted him, and the King became a stolen piece on someone else's board. His king-ego collapsed into the ground when Isagi took the lead of the field from him. He awakened as a 'villain on the field', and his ego finally clicked into chemical reaction with Isagi's, winning the Top 3 revenge. He fought his way into the U-20 match squad and plays exactly the role he chose.",
      mindset:
        "Being knocked out does not shrink him; it remakes him. He converts a crushed ego into a sharper, antagonistic role rather than accepting a supporting part. Nobody in Blue Lock likes him, and everybody wants him on their side.",
      moments: [
        "First Selection, Team Z vs Team X: reveals Solitary King / Lonely King, bulldozing Team Z alone",
        "Second Selection, Isagi/Nagi vs Baro/Naruhaya: Isagi's team wins and Baro is knocked out of the rivalry battle",
        "Second Selection, episode 18: kneels after losing the 'king of the field' role when Isagi takes the lead from him",
        "Second Selection, episode 19: awakens as a 'villain on the field' and wins the Top 3 revenge",
      ],
      playLike: [
        "Do not pass. His documented belief is that passing is for cowards.",
        "Shoot from anywhere rather than walking it in. Going around a defender would be a concession.",
        "If you cannot be the hero of the match, become its villain. He made that switch deliberately.",
        "Channel being disliked into a sharper role instead of shrinking from it.",
      ],
      source: "https://www.bluelock.guide/characters/shoei-baro",
      researchNote:
        "The slug bluelock.guide/characters/shoei-barou returns 404; the working page is .../shoei-baro. The site spells the name 'Baro'.",
    },

    {
      id: "kaiser",
      name: "Michael Kaiser",
      position: ["Forward"],
      rank: null,
      club: "Bastard München (Starter) / Germany U-20 (Starter)",
      age: "19",
      height: "186 cm (6'1\")",
      birthday: "December 25",
      bloodType: "A",
      relatives: ["Alice Love (mother)", "Frederick Kaiser (father)"],
      weapon: ["Off the Ball Movements", "Spatial Awareness", "Metavision", "Predator Eye"],
      titles: ["German Prodigy", "Blue Rose", "Emperor", "Superstar"],
      philosophy:
        "The source is explicit that this is thin: Kaiser is presented as a promise rather than a developed character, the striker already standing where Isagi wants to be, young enough to be a rival and decorated enough to be a destination. Everything Blue Lock's egoists fought each other for, Kaiser already has. The page notes that what he is actually like, the anime has only begun to show, and that the arrogance arrives well before he does.",
      biography:
        "When the U-20 match ends and Ego announces the Neo Egoist League, the survivors learn they will train inside Europe's five super-clubs. The name attached to Bastard München is a German prodigy with a blue rose inked up his neck and a reputation as his generation's finished article, and he already has Metavision and a Predator Eye. He made his manga debut in chapter 149 and his anime debut in episode 38.",
      mindset:
        "The source does not detail his handling of defeat, rivals or ego, only that the arrogance precedes his appearance and that he is positioned as the destination rather than the challenger. Nothing further is documented, so nothing is asserted here.",
      moments: [],
      playLike: [
        "Work off the ball. His documented weapons are Predator Eye, spatial awareness and off-the-ball movement.",
        "Time runs so the ball arrives where you are going to be, not where you are.",
        "Arrive already established. The source presents him as finished, not developing.",
      ],
      source: "https://www.bluelock.guide/characters/michael-kaiser",
      researchNote:
        "The source states 'This character has no published Blue Lock ranking', so rank is null. Its scouting report is an acknowledged placeholder, not a characterisation. Manga debut ch.149, anime debut ep.38.",
    },

    {
      id: "aiku",
      name: "Oliver Aiku",
      position: ["Center Back"],
      rank: "#10",
      club: "Ubers (Starter) / Japan U-20 (Starter)",
      age: "19",
      height: "190 cm (6'3\")",
      birthday: "June 30",
      bloodType: "B",
      relatives: [
        "Unnamed father",
        "Unnamed mother",
        "Unnamed older sister",
        "Unnamed younger sister",
      ],
      weapon: ["Physique", "Spatial Awareness", "Reflex", "Metavision"],
      titles: [],
      philosophy:
        "Aiku loves football enough to accept what he is, a defender in a country obsessed with producing a striker, and he thinks self-knowledge beats self-belief. Loving yourself, in his telling, means knowing exactly what you are and betting on it anyway. He is the best defender in Japan's youth system and its most cheerful cynic, treating criticism as professional rather than personal.",
      biography:
        "Aiku made his first appearance in episode 25 as U-20 Japan's captain, the defender who takes on Blue Lock in the final match, with Sae Itoshi captaining the side and Chairman Buratsuta ordering coach Hoichi and Aiku to crush Blue Lock. As captain he spends the buildup to the match publicly rating Blue Lock a farce, then spends the match itself proving the assessment was professional by shutting down attack after attack with positioning, timing, and a complete absence of panic. Blue Lock beats his team.",
      mindset:
        "He meets defeat with the same crooked grin he wore at kickoff, and of everyone on the losing side he looks least like a man whose worldview just lost the argument. Defenders are used to being scored on eventually.",
      moments: [
        "Episode 25, Third Selection: first appearance as U-20 Japan captain, the defender who takes on Blue Lock in the final match",
        "Episode 25, Third Selection: publicly rates Blue Lock a farce during the buildup to the U-20 match",
        "Episode 25, Third Selection: shuts down attack after attack with positioning, timing, and no panic against Blue Lock",
      ],
      playLike: [
        "Read the striker, not the ball. His weapons are spatial awareness, reflex and metavision rather than pace.",
        "Win the first contact. Physique is a documented part of his game.",
        "Know exactly what you are and commit to it. His documented philosophy is self-knowledge over self-belief.",
        "Treat a public prediction as a professional assessment, then go prove it.",
      ],
      source: "https://www.bluelock.guide/characters/oliver-aiku",
      researchNote:
        "The source has no 'Known as' section for Aiku, so he has no listed titles. Do not substitute the unofficial 'Dragon' epithet found on fan wikis.",
    },

    {
      id: "aryu",
      name: "Jyubei Aryu",
      position: ["Center Back", "Forward"],
      rank: "#13",
      club: "Japan U-20 (Starter)",
      age: "18",
      height: "195 cm (6'5\")",
      birthday: "November 3",
      bloodType: "A",
      relatives: ["Unnamed father", "Unnamed mother"],
      weapon: ["Jumping Power", "Long Reach", "Headers", "Spacing"],
      titles: ["God of Glam"],
      philosophy:
        null,
      biography:
        "The source publishes no scouting report for Aryu. What it does record: he debuts in Episode 12 of the Second Selection as the #2 ranked player, described as 'obsessed with glamour' and 'Rin's reluctant Top 3 teammate'. His record lists a manga debut in Chapter 1 and an anime debut in Episode 1, with clubs including Goko High, Team Red, Blue Lock Eleven, Ubers and a Japan U-20 start.",
      mindset:
        null,
      moments: [
        "Episode 12 (Second Selection): debut, #2 ranked, described as obsessed with 'glamour'",
        "Episode 13 (Second Selection): Isagi/Bachira/Nagi vs Rin/Aryu/Tokimitsu (Top 3), Isagi's team loses and Bachira is taken",
      ],
      playLike: [
        "Attack the ball in the air. Jumping Power, Long Reach and Headers are his entire documented weapon set.",
        "Use your reach. At 195 cm his physical reach is the primary asset.",
        "Own the spacing around you. 'Spacing' is listed as a distinct ability, not a by-product.",
      ],
      source: "https://www.bluelock.guide/characters/jyubei-aryu",
      researchNote:
        "The source states plainly: 'No scouting report is available for this character.' Philosophy and mindset are therefore null. The 'obsessed with glamour' line is the source's own key-events description. Ranking history runs from #2 (ch.44) to #13 (ch.298).",
      dataCorrection: null,
    },

    {
      id: "ness",
      name: "Alexis Ness",
      position: ["Offensive Midfielder"],
      rank: null,
      club: "Bastard München (Starter)",
      age: "18",
      height: "181 cm (5'11\")",
      birthday: "March 16",
      bloodType: "AB",
      relatives: [
        "Unnamed father",
        "Unnamed mother",
        "Unnamed older brother",
        "Unnamed older sister",
      ],
      weapon: ["Flexible Ankles", "Dribbling", "Passing", "Flow State"],
      titles: ["The Magician"],
      philosophy:
        "Ness is Michael Kaiser's shadow at Bastard München, a playmaker whose football exists in orbit around his striker. He is the delivery system, the midfielder trusted to put the ball on the exact blade of grass Kaiser's run demands. While Kaiser is the Neo Egoist League's advertised monster, Ness's game is defined by absolute devotion pointed at one person.",
      biography:
        "The anime has shown only the edge of the partnership, set up at the end of Season 2 as part of the world waiting for the Blue Lock survivors. His record lists a manga debut in Chapter 156, squad number 8 for Bastard München and 20 at the Bastard München tryouts, and no listed match history.",
      mindset:
        "Even in glimpses the dynamic is clear: absolute devotion pointed at one person, in a story that keeps asking what happens to players who build their game on somebody else. The scouting report frames that as an open question, noting Blue Lock has already answered it once with Reo and Nagi and that Ness is the question asked again, at a much higher level.",
      moments: [],
      playLike: [
        "Serve the striker, not the space. His documented role is Kaiser's delivery system.",
        "Use flexible ankles to play passes that look impossible.",
        "Reach flow state. It is a listed weapon, not a mood.",
        "Build your game around one person and accept the dependency. The source is explicit that this is the question being asked about him.",
      ],
      source: "https://www.bluelock.guide/characters/alexis-ness",
      researchNote:
        "No listed match history and no 'This character has no published Blue Lock ranking' note, so rank is null. Manga debut ch.156; the anime has only set up the partnership as of retrieval.",
    },

    {
      id: "karasu",
      name: "Tabito Karasu",
      position: ["Defensive Midfielder", "Midfielder", "Forward"],
      rank: "#11",
      club: "Paris X Gen (Starter) / Japan U-20 (Starter)",
      age: "18",
      height: "183 cm (6')",
      birthday: "August 15",
      bloodType: "A",
      relatives: [
        "Unnamed father",
        "Unnamed mother",
        "Unnamed grandmother",
        "Unnamed older sister",
      ],
      weapon: ["Analytical Ability", "Ball Control", "Feints", "Metavision"],
      titles: ["Assassin"],
      philosophy:
        "Karasu's game is built on anticipation and needle: bait a player into the choice they were always going to make, take the ball, and narrate their failure to them while jogging away. He reads opponents the way Isagi reads space, and against Isagi he is a genuine wall, one of the few players whose thinking speed matches his, which makes their duels less about tricks and more about who blinks first. He does the unglamorous work that lets the monsters up front eat, and would describe himself the same way before adding that the monsters would starve without him.",
      biography:
        "Karasu comes in with the Top Six in the third selection, a Kansai smart-mouth, debuting as Top Six #3 and a tactical generalist paired with Otoya. Paired with Otoya he forms the most functional duo in the tryouts, pragmatic football wrapped in constant trash talk, and the crow motif is not subtle and he leans into it. He made his debut in episode 24, having played in the first selection's Team V match, and went on to make the U-20 squad.",
      mindset:
        "He treats a match as a problem of prediction rather than a contest of tricks, using other players' inevitable choices against them. His identity is functional rather than decorative: he would call himself the unglamorous worker, then insist the stars are dependent on him.",
      moments: [
        "Episode 9, First Selection, Team Z vs Team V: Team Z wins",
        "Episode 25, Third Selection: Ego announces the Top Six of Blue Lock and Karasu is among them, Top Six #3",
        "Episode 24, Third Selection: first appearance as the tactical generalist paired with Otoya",
      ],
      playLike: [
        "Bait the choice they were always going to make, then take the ball.",
        "Do the unglamorous work that makes the dangerous players possible.",
        "Read opponents as a prediction problem, not a tricks contest.",
        "Play close enough to the ball that your thinking is a weapon in itself.",
      ],
      source: "https://www.bluelock.guide/characters/tabito-karasu",
      researchNote: null,
    },

    {
      id: "sae",
      name: "Sae Itoshi",
      position: ["Central Midfielder", "Offensive Midfielder"],
      rank: null,
      club: "Japan U-20",
      age: "18",
      height: "180 cm (5'11\")",
      birthday: "October 10",
      bloodType: "A",
      relatives: ["Rin Itoshi (younger brother)", "Unnamed father", "Unnamed mother"],
      weapon: [
        "Perfect Kick Technique (Passing & Shooting)",
        "Dribbling",
        "Reflex",
        "Metavision",
      ],
      titles: ["The Prodigy", "Boy Genius", "Underlashes Senior", "Japan's Greatest Treasure"],
      philosophy:
        "Sae downgraded his own dream from world's best player to world's best midfielder, because a midfielder is only as good as the striker finishing his passes, and he saw nobody in Japan worth serving. On the pitch he is casually cruel, a playmaker whose control and passing are a full tier above everyone else in the U-20 squad he headlines. His belief that Japan cannot produce a striker worth passing to is exactly what Blue Lock's win contradicts.",
      biography:
        "Sae left Japan at twelve as its greatest prodigy and came back from Spain with a verdict: Japan cannot produce a striker worth passing to. He debuted in Episode 2 / Chapter 4, beat Rin in a one-shot match in the third selection, and was named captain of U-20 Japan. Across the U-20 game he gets the duel he claims to despise and loses his composure for the first time on screen, trading blows with the brother he wrote off.",
      mindset:
        "The little brother who idolized him got the harshest version of that verdict to his face. Blue Lock's win costs him the argument, since there are strikers in Japan now, and what he does with that is a question the anime leaves open.",
      moments: [
        "Episode 25 (Third Selection): Sae Itoshi vs Rin Itoshi one-shot match, Sae wins",
        "Episode 25 (Third Selection): Blue Lock vs U-20 Japan announced, match set for three weeks' time",
        "Episode 25 (Third Selection): Sae named U-20 Japan captain; Chairman Buratsuta orders coach Hoichi and captain Aiku to crush Blue Lock",
      ],
      playLike: [
        "Pass to where the striker will be, not where he currently is.",
        "Refuse to serve a striker you do not believe in. That refusal is his defining documented choice.",
        "Treat a pass as only as good as the finisher, and hold the finisher to that standard.",
        "Recognise when your own certainty has been proven wrong. The U-20 match is documented as the first time his composure breaks on screen.",
      ],
      source: "https://www.bluelock.guide/characters/sae-itoshi",
      researchNote:
        "No published Blue Lock ranking (he is a U-20 Japan player, not a Blue Lock entrant), so rank is null.",
    },

    {
      id: "hugo",
      name: "Hugo",
      position: ["Center Midfielder"],
      rank: null,
      club: "France U-20",
      age: null,
      height: null,
      birthday: null,
      bloodType: null,
      relatives: null,
      weapon: ["Game Reading", "Passing", "Metavision"],
      titles: [],
      philosophy: null,
      biography: null,
      mindset: null,
      moments: [],
      playLike: [
        "Read the game first. 'Game Reading' is the first listed weapon.",
        "Use metavision as a midfield organising tool rather than a attacking one.",
      ],
      source: "https://www.bluelock.guide/characters/hugo",
      researchNote:
        "The source publishes no scouting report, no personal data and no 'Known as' section: 'No scouting report is available for this character.' The character is a mononym, listed only as Romaji 'Yūgō' (ユーゴー), affiliated with France New Generation World XI and France U-20, manga debut ch.326.",
      dataCorrection:
        "The previous roster copy for this player ('luck based genius', 'studious and detached, shown coolly analyzing rivals') is not supported by any source and was unverified invention.",
    },

    {
      id: "reo",
      name: "Reo Mikage",
      position: [
        "Center-back",
        "Sideback",
        "Defensive Midfielder",
        "Center Midfielder",
        "Right Midfielder",
        "Attacking Midfielder",
        "Forward",
      ],
      rank: "#7",
      club: "Japan U-20 (Starter)",
      age: "17",
      height: "185 cm (6'1\")",
      birthday: "August 12",
      bloodType: "B",
      relatives: ["Unnamed father", "Unnamed mother"],
      weapon: ["Dexterity", "Copycat", "Metavision", "Flow State"],
      titles: ["Chameleonare", "Copycat"],
      philosophy:
        "Reo wanted the one thing his family could not buy him: a World Cup. He built his plan around Nagi, the genius he discovered on a rooftop, bankrolled by devotion rather than money, and Blue Lock was supposed to be their story. Without a genius to orbit, he discovered his own weapon: he copies people, with perfect mimicry of any skill he has seen, one at a time, a chameleon in a facility full of specialists.",
      biography:
        "Reo is the heir to a fortune, and his record lists an unnamed father and mother and a start at Hakuho High before Blue Lock. He debuted in Episode 9 / Chapter 1 as Team V's captain, the wealthy son who introduced Nagi to football and built the Nagi-Reo pair. His published ranking rose from #250 in the Nagi episode to #10 by Chapter 59, and Nagi leaving him for Isagi in the second selection is the first loss he has ever taken.",
      mindset:
        "What gets him up after that first loss is spite, and then something better than spite. The player who audits everyone else's tools turns out to have the widest toolbox in Blue Lock, and his reunion with Nagi in the third selection tryouts is prickly, unsentimental and honest in a way their partnership never was: Reo stops being a wallet with a dream and starts being a footballer, and the dream survives the demotion.",
      moments: [
        "Episode 9 (First Selection): Team Z vs Team V, Team Z wins",
        "Episode 9 (First Selection): debut as Team V's captain who introduced Nagi to football and built the Nagi-Reo pair",
        "Episode 17 (Second Selection): Isagi/Nagi/Baro vs Chigiri/Kunigami/Mikage, Isagi's team wins",
      ],
      playLike: [
        "Steal a skill. Copycat with perfect mimicry of anything you have seen is his documented weapon.",
        "Learn one thing at a time from the best player in the room.",
        "Use your range. He is documented across seven positions, so refuse to be pigeonholed.",
        "Recover from the first loss with spite, then convert it into something better.",
      ],
      source: "https://www.bluelock.guide/characters/reo-mikage",
      researchNote:
        "The source's 'Known as' field is corrupted by a rendering bug, rendering as the single string `Chamilleonare\" \"Copycat*`; it was split into two titles. The source also attaches a year to his birthday ('August 12, 2001') that no other entry has; the year was dropped as a scrape artifact.",
    },

    {
      id: "yukimiya",
      name: "Kenyu Yukimiya",
      position: ["Offensive Midfielder", "Sideback", "Left Wing", "Forward"],
      rank: "#14",
      club: "Japan U-20 (Reserve)",
      age: "18",
      height: "184 cm (6')",
      birthday: "April 28",
      bloodType: "O",
      relatives: ["Unnamed mother", "Unnamed father"],
      weapon: ["Dribbling", "Speed", "Gyro Shot", "Sword Screw"],
      titles: ["One On One Emperor", "Mud Boat", "The Envoy of Victory"],
      philosophy:
        "He treats Blue Lock as a proving ground in the most literal sense: a place to demonstrate, match by match, that the pretty boy tag undersells him. The elegance of a working model is real but it is not the weapon, and underneath the styling is a ruthlessly complete forward, comfortable with both feet, strong in duels, and better in the air than anyone his size has a right to be.",
      biography:
        "Yukimiya is the Top Six member with a life outside the building, a working fashion model who plays football like he is being photographed doing it. He debuted in Episode 24 / Chapter 93 and was named one of Ego's Top Six in Episode 25 as the #5 ranked player, a precision wing player paired with Nagi. He makes the U-20 squad, and his record lists spells at Soranin High, Blue Lock Eleven, Bastard München and Team C before joining Japan U-20 as a reserve.",
      mindset:
        "In the third selection tryouts he is a stern examiner for the players auditioning alongside him, generous with craft and stingy with approval. He gives the U-20 eleven something no one else offers, a forward who wins the ball back like a defender and finishes like a poacher. The modeling contracts can wait.",
      moments: [
        "Episode 25 (Third Selection): Ego announces the Top Six of Blue Lock, with Yukimiya named among them",
        "Episode 25 (Third Selection): debut as Top Six #5, precision wing player paired with Nagi",
      ],
      playLike: [
        "Isolate your defender. 'One On One Emperor' is his documented title and Dribbling plus Speed is the weapon behind it.",
        "Win the ball back like a defender. The source describes him doing exactly this for the U-20 eleven.",
        "Use both feet comfortably, and win more than your share of aerial duels.",
        "Be precise. Gyro Shot and Sword Screw are documented as named techniques, not general skill.",
      ],
      source: "https://www.bluelock.guide/characters/kenyu-yukimiya",
      researchNote:
        "The slug kenu-yukimiya returns 404; kenyu-yukimiya is the working page. Japan U-20 (Reserve) is the source's own designation for his current club.",
      dataCorrection:
        "Previously recorded as 'Yukimiya Yukikazu' (his name is Kenyū), tagged 'street dribbler', described as 'not naturally gifted, but the hardest worker in the programme' with trait 'Work rate'. The source documents none of that: he is a Top Six pick and a working fashion model, titled 'One On One Emperor'.",
    },

    {
      id: "otoya",
      name: "Eita Otoya",
      position: ["Right Wing", "Forward", "Sideback"],
      rank: "#9",
      club: "Japan U-20 (Reserve)",
      age: "17 at Blue Lock start, 18 for most of the first selection",
      height: "177 cm (5'10\")",
      birthday: "December 3",
      bloodType: "O",
      relatives: [
        "Unnamed father",
        "Unnamed mother",
        "Unnamed older sister",
        "Unnamed younger sister",
      ],
      weapon: ["Speed", "Off-the-Ball Movements"],
      titles: ["Ninja"],
      philosophy:
        "Otoya plays football the way a knife works: no wasted motion, no warning. He is the self-styled ninja of the Top Six, a winger who touches the ball as little as possible and hurts you every time he does, all darting runs, blindside cuts, and finishes that need half a meter of space. He is also the squad's least complicated person, cheerfully shallow and allergic to introspection in a cast that does little else.",
      biography:
        "He played in the First Selection, where Team Z beat his Team V, and debuted in the third selection as Top Six #4, the 'ninja' trickster paired with Karasu. His partnership with Karasu carries their side of the third selection tryouts, Karasu supplying the reads and Otoya supplying the blade. He slots into the U-20 match as a specialist, and his record lists a Blue Lock Eleven and FC Barcha spell before Japan U-20 as a reserve.",
      mindset:
        "Off the ball he is almost invisible, which is the point, and the show treats that simplicity as its own kind of strength. The scouting report argues that not every ego in Blue Lock needs a tragic engine: Otoya runs on instinct and runs fine.",
      moments: [
        "Episode 9 (First Selection): Team Z vs Team V, Team Z wins",
        "Episode 25 (Third Selection): Ego announces the Top Six of Blue Lock, with Otoya named among them",
        "Episode 25 (Third Selection): debut as Top Six #4, 'ninja' trickster paired with Karasu",
      ],
      playLike: [
        "Touch the ball as little as possible. Every touch is a chance to waste something.",
        "Make the run nobody sees. Off-the-ball movement and speed are the entire weapon.",
        "Finish from half a metre of space. You do not need more than that.",
        "Do not overthink it. The source is explicit that he runs on instinct and that not every ego needs a tragic engine.",
      ],
      source: "https://www.bluelock.guide/characters/eita-otoya",
      researchNote: null,
      dataCorrection:
        "Previously recorded as 'the team-first creator' whose style is 'looking for the pass that releases a teammate rather than the one that looks best himself', 'happy taking the second pass', traits Creativity/Selflessness/Vision. The source contradicts this on every point: Otoya is a winger whose game is minimising touches and punishing blindside runs, and the source explicitly calls him 'cheerfully shallow and allergic to introspection'. His title 'Ninja' was also missing.",
    },

    {
      id: "niko",
      name: "Ikki Niko",
      position: [
        "Forward",
        "Center-Back",
        "Defensive Midfielder",
        "Offensive Midfielder",
      ],
      rank: "#15",
      club: "Japan U-20 (Starter)",
      age: "15",
      height: "173 cm (5'8\")",
      birthday: "February 5",
      bloodType: "O",
      relatives: ["Unnamed father", "Unnamed mother"],
      weapon: ["Playmaker reading", "One Time Kill Counter"],
      titles: ["The Watchtower"],
      philosophy:
        "Niko set out to survive Blue Lock using the skills he already had rather than chasing a weapon of his own. Losing to Yoichi Isagi in the First Selection changed that: he decided to stop being afraid and to change in order to get better so he could survive. His weapon is playmaker reading, whole-field vision and a final strategy called 'One Time Kill Counter'.",
      biography:
        "Niko came to Blue Lock from Wasurenagusa High School's football team and debuted in manga Chapter 1 / anime Episode 4. In the First Selection he was part of Team Y, where he served as the playmaker and the first whole-field reader Isagi outduelled. His weapon was revealed in Episode 5 during the Team Z vs Team Y match, which Team Z won. The page records him as a member of Team Red, Team White, Team Y and Team B (3rd Game) before a Blue Lock Eleven (5th Clear Team) and Ubers stint, and he currently starts for the Japan U-20.",
      mindset:
        "He came in determined to survive on the skills he already possessed. Losing to Yoichi Isagi in the First Selection made him decide to stop being afraid and to change in order to get better. The source describes him as a supporting character of the Blue Lock.",
      moments: [
        "Episode 5 - weapon reveal: Playmaker reading, whole-field vision and 'One Time Kill Counter' shown in the duel with Isagi for Team Y",
        "Episode 5 - debut: first appearance as Team Y's playmaker, the first whole-field reader Isagi outduels",
        "Episode 5 - match: Team Z vs Team Y, Team Z wins",
      ],
      playLike: [
        "Read the whole field before you touch the ball. Playmaker reading is his documented weapon.",
        "Use what you already have rather than waiting for a new talent to arrive.",
        "Change specifically because you lost. His documented turning point is a defeat by Isagi.",
        "Age 15: he is the youngest player in the quiz roster by a wide margin.",
      ],
      source: "https://www.bluelock.guide/characters/ikki-niko",
      researchNote:
        "The source describes him as a supporting character of the Blue Lock. His recorded age of 15 makes him the youngest player in this roster.",
      dataCorrection:
        "Previously recorded as 'the creative wildcard' who 'plays football like it is a prank', traits Flair/Impulsiveness/Dribbling, position Defender. The source documents the opposite temperament: cautious, survival-minded, a playmaker who came to Blue Lock to get by with the skills he already had. His title 'The Watchtower' was missing.",
    },

    {
      id: "di lorenzo",
      name: "Don Lorenzo",
      position: ["Center Back", "Center Midfielder"],
      rank: null,
      club: "Ubers / Italy U-20",
      age: "19",
      height: "190 cm (6'3\")",
      birthday: "July 4",
      bloodType: "O",
      relatives: [
        "Unnamed father",
        "Unnamed mother",
        "Two unnamed older brothers",
      ],
      weapon: ["Dribbling", "Man-Marking", "Physique"],
      titles: ["The Ace Eater", "Zombie"],
      philosophy: null,
      biography: null,
      mindset: null,
      moments: [],
      playLike: [
        "Man-mark. It is the middle entry in his documented weapon list, which is unusual for a centre back.",
        "Dribble. A centre back with 'Dribbling' listed as a weapon is the notable part of his profile.",
        "Use physique to recover: the source titles him 'Zombie'.",
      ],
      source: "https://www.bluelock.guide/characters/don-lorenzo",
      researchNote:
        "The source publishes no scouting report, no match history and no Blue Lock ranking. The character is Don Lorenzo (ドン・ロレンゾ), Ubers / Italy U-20, centre back and centre midfielder, manga debut ch.209. 'Man-Marking' and 'Dribbling' are both listed as abilities, which is the notable part of a centre back's profile.",
      dataCorrection:
        "Previously recorded as 'Di Lorenzo Bruno' of 'Japan U-20', 'the veteran leader', traits Experience/Discipline/Leadership. The name, the nationality, the club and the characterisation were all wrong; 'Ace Eater' and 'Zombie' were missing entirely.",
    },

    {
      id: "charles",
      name: "Charles Chevalier",
      position: ["Midfielder"],
      rank: null,
      club: "Paris X Gen (Starter) / France U-20",
      age: "15",
      height: "174 cm (5'9\")",
      birthday: "February 22",
      bloodType: "B",
      relatives: [
        "Unnamed father",
        "Unnamed mother",
        "Unnamed older sister",
        "Unnamed older brother",
        "Three unnamed younger sisters",
        "Three unnamed younger brothers",
      ],
      weapon: ["Off the Ball Movements", "Passing", "Metavision", "Flow State"],
      titles: ["PXG's Heart", "Imp", "Contrarian"],
      philosophy: null,
      biography: null,
      mindset: null,
      moments: [],
      playLike: [
        "Work off the ball and pass. Those are the first two documented weapons.",
        "Use metavision. At 15 he is one of the two youngest players in the roster.",
      ],
      source: "https://www.bluelock.guide/characters/charles-chevalier",
      researchNote:
        "The source publishes no scouting report and no match history for this character, and gives no Blue Lock ranking. The character is Charles Chevalier of Paris X Gen / France U-20, aged 15, which makes him one of the two youngest players in this roster. A search of Wikipedia, Fandom and bluelock.guide found no Blue Lock character under the name this entry previously used.",
      dataCorrection:
        "Previously recorded as 'Charles Martinez' of 'Japan U-20', 'the steady hand', traits Positional sense/Composure/Reliability. The name, the nationality and the club were all wrong, and the characterisation has no source behind it.",
    },

    {
      id: "chigiri",
      name: "Hyoma Chigiri",
      position: ["Left Wing", "Forward", "Right Back"],
      rank: "#6",
      club: "Manshine City (Starter) / Japan U-20 (Starter)",
      age: "16",
      height: "177 cm (5'10\")",
      birthday: "December 23",
      bloodType: "A",
      relatives: [
        "Unnamed father",
        "Neneko Chigiri (mother)",
        "Koyuki Chigiri (older sister)",
      ],
      weapon: ["Speed"],
      titles: ["Red Panther", "Princess"],
      philosophy:
        "Chigiri was a youth prodigy whose whole game was speed, until his knee gave out and the doctors told him one wrong sprint could end football for good. He came to Blue Lock half-hoping to be cut, playing at walking pace and flinching from every duel, daring the project to give him a reason to quit. Kuon's betrayal in the Team W match gave him the opposite: a moment where holding back means losing everything anyway, so he runs. His problem changes from courage to craft: what does a one-weapon player do when the weapon is scouted?",
      biography:
        "Chigiri debuted in manga Chapter 1 / anime Episode 1 as a former Wanima-twins teammate carrying a knee-injury trauma and a speed weapon he had sealed away. He played for Team Z in the First Selection, losing to Team X (Episode 3) and beating Team Y (Episode 5). In Episode 7 he unsealed his speed weapon and tore through Team W while Team Z was losing 3-4, and he also featured in the Team Z vs Team V win in Episode 9. In the Second Selection he was part of the Chigiri/Kunigami/Mikage 3v3 that lost to Isagi/Nagi/Baro, and later joined Isagi/Nagi/Baro/Chigiri in the win over Rin/Bachira/Aryu/Tokimitsu. He came from Rakosute Business High School, and the page records him as a former Blue Lock Eleven starter and Team Blue Lock 2nd Clear Team member before making the Japan U-20 squad on merit.",
      mindset:
        "He arrived half-wanting to be dismissed, playing at walking pace and flinching from duels, and it took Kuon's betrayal in the Team W match to make holding back feel like losing everything. The Team V match was the unsealing, a first full sprint in years that showed the fear was heavier than the injury. The hair still gets him called princess, and the knee holds; he spends the later selections adding timing and angles to raw pace.",
      moments: [
        "Episode 6 - debut: former Wanima-twins teammate carrying a knee-injury trauma, speed weapon he had sealed away",
        "Episode 7 - weapon reveal: unseals Speed and tears through Team W while Team Z is losing 3-4",
        "Episode 9 - Team Z vs Team V, Team Z wins",
        "Episode 17 - 3v3 Second Selection: Isagi/Nagi/Baro vs Chigiri/Kunigami/Mikage, Isagi's team wins",
      ],
      playLike: [
        "Attack the space behind the defence. Speed is his only documented weapon, so it has to be the whole plan.",
        "Add timing and angles to raw pace. The source says he spends the later selections doing exactly this, because a one-weapon player gets scouted.",
        "Do not hold back out of fear. His documented turning point is realising restraint costs everything anyway.",
        "Play the full ninety. The source names sustaining effort as the real challenge, not talent.",
      ],
      source: "https://www.bluelock.guide/characters/hyoma-chigiri",
      researchNote: null,
    },

    {
      id: "shidou",
      name: "Ryusei Shido",
      position: ["Forward", "Right Wing"],
      rank: "#3",
      club: "Japan U-20 (Sub)",
      age: "18",
      height: "185 cm (6'1\")",
      birthday: "July 7",
      bloodType: "AB",
      relatives: null,
      weapon: ["Physique", "Spatial Awareness", "Acceleration", "Reflex"],
      titles: ["Demon", "The Devil"],
      philosophy:
        "The source frames Shido as what Blue Lock would produce if it had no safety rails: pure scoring instinct wired to a personality that treats violence and football as adjacent hobbies. He is described as the squad's argument that ego does not have to be earned through suffering, because some people are just born pointed at the goal. Both Rin's hatred of him and Sae's rating of him delight him equally.",
      biography:
        "Shido appears in the Second Selection, where he brawls with Rin within minutes of meeting him. Ego shelves him not for lacking talent but for having too much of it in an unusable shape, and he is listed as team history including Team Red, Team White, Team Blue Lock (7th Clear Team) and Team A (Top 6) after Paris X Gen. He made his manga debut in Chapter 88 and anime debut in Episode 24, and Ego named him among the Top Six of Blue Lock in Episode 25. The source describes the U-20 match as where the shape finds a use: sent on when Blue Lock needs chaos, he detonates the game as an acrobatic finisher who scores from angles that should not produce shots.",
      mindset:
        "He treats violence and football as adjacent hobbies and shows up ready to brawl. Sent on when Blue Lock needs chaos, he celebrates like the stadium owes him money, and he enjoys both Rin's hatred and Sae's approval equally. He is the squad's argument that ego does not have to be earned through suffering.",
      moments: [
        "Episode 25 - revelation: Ego announces the Top Six of Blue Lock, listing Rin Itoshi, Ryusei Shido, Tabito Karasu, Eita Otoya, Kenyu Yukimiya and Seishiro Nagi",
        "Episode 25 - debut: first appearance as Blue Lock's #2 in the Third Selection ranking, the 'biological need' striker who eliminated Kunigami",
        "U-20 match - sent on when Blue Lock needs chaos, an acrobatic finisher scoring from angles that should not produce shots",
      ],
      playLike: [
        "Shoot from angles that should not produce a shot. That is his documented U-20 role.",
        "Be the chaos option. The source says he is sent on specifically to detonate a game.",
        "Do not wait for talent to be shaped. Ego shelved him for having talent in an unusable shape, not for lacking it.",
        "Accept that some egos are innate rather than earned through suffering.",
      ],
      source: "https://www.bluelock.guide/characters/ryusei-shido",
      researchNote:
        "The source spells the name 'Shido' (士道 龍聖); 'Shidou' is a common transliteration variant and the quiz roster uses it. The source's 'Known as' field renders as the corrupted string `Demon\" \"The Devil` and was split into two titles. The source lists no matches in his match history.",
    },

    {
      id: "kunigami",
      name: "Rensuke Kunigami",
      position: ["Forward", "Defensive Midfielder", "Centre Midfielder"],
      rank: "#8",
      club: "Japan U-20 (Sub)",
      age: "16",
      height: "188 cm (6'2\")",
      birthday: "March 11",
      bloodType: "O",
      relatives: [
        "Unnamed mother",
        "Unnamed father",
        "Unnamed older sister",
        "Unnamed younger sister",
      ],
      weapon: ["Physique", "Left Shot"],
      titles: [
        "Burlygami",
        "Hero",
        "Fallen Hero",
        "Cyborg",
        "Wild Card",
        "Superhero",
      ],
      philosophy:
        "Kunigami arrived as Blue Lock's most old-fashioned player, a power striker with a hero complex who talked about fair play in a facility explicitly designed to burn that idea out of people. He is later reshaped into a man with one rule: win, whatever it costs. The source frames him as the striker wearing his number being exactly what Ego wanted all along, and the nicest player in Blue Lock being gone.",
      biography:
        "Kunigami came to Blue Lock from Seido Academy, debuting in manga Chapter 1 / anime Episode 1 as Team Z's physically dominant left-footed striker. In the First Selection he played Team Z's matches against Team X, Y, W and V, then in the Second Selection he teamed with Chigiri and Mikage in the 3v3 and revealed his weapon, Physique / Left Shot, in Episode 17. The second selection ends him: he loses, gets eliminated, and disappears from the story. He returns through the Wild Card, a last-chance program the show keeps deliberately dark, back with buzzed hair and dead eyes, and by Episode 25 Igarashi reveals that Shido eliminated him and that the highly skilled player was cut before the U-20 selection. The page records a Bastard München (Starter) stint and notes the anime leaves the details of what the Wild Card did to him unspoken.",
      mindset:
        "He began as the easiest person in the building to root for, carrying Team Z with his left foot and his physique while talking about fair play. Losing and being eliminated in the second selection taught him that being good and being chosen are different things. What comes back from the Wild Card runs on a single rule: win, whatever it costs.",
      moments: [
        "Episode 17 - weapon reveal: Physique / Left Shot shown in the 3v3 with Chigiri and Mikage",
        "Episode 17 - 3v3 Second Selection: Isagi/Nagi/Baro vs Chigiri/Kunigami/Mikage, Isagi's team wins",
        "Second Selection - loses, is eliminated and disappears from the story",
        "Episode 25 - elimination revealed: Igarashi reveals Shido eliminated Kunigami, cut before the U-20 selection",
      ],
      playLike: [
        "Hit it with the left foot. 'Left Shot' is half of his documented weapon.",
        "Win the physical duel. Physique is the other half.",
        "Notice that being good and being chosen are different things. That is the documented lesson of his elimination.",
        "Reduce it to one rule: win, whatever it costs. That is what the source says the Wild Card left behind.",
      ],
      source: "https://www.bluelock.guide/characters/rensuke-kunigami",
      researchNote:
        "The source leaves the details of the Wild Card program deliberately unspoken, so nothing is asserted about his time there.",
    },
  ],
};
