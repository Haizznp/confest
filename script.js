/* ============================================================
   ROMANTIC STUDY DATE — SCRIPT
   ============================================================

   EDIT THIS CONFIG OBJECT BEFORE SENDING THE WEBSITE.

   You should normally only need to change values here.
   The rest of the site reads from CONFIG automatically.

   ============================================================ */

const CONFIG = {
    /* ---------- PERSONAL DETAILS ---------- */

    herName: "[HER_NAME]",
    myName: "[MY_NAME]",

    /*
        Optional nickname.

        If you don't want to use one, leave this as:
        "[NICKNAME]"

        The current interface primarily uses herName,
        but this is available for your own custom messages.
    */
    nickname: "[NICKNAME]",

    /* ---------- STUDY DATE ---------- */

    location: "[FAVORITE_SPOT]",

    /*
        Human-readable text displayed on the page.
    */
    dateLabel: "This Friday",

    startTime: "8:00 AM",
    endTime: "11:00 AM",

    /*
        Exact date used by the "Add to Calendar" button.

        This Friday relative to August 19, 2026 is:
        August 21, 2026.

        IMPORTANT:
        Change this if you are using the page for a different Friday.

        Format:
        YYYY-MM-DD
    */
    eventDate: "2026-08-21",

    /*
        Calendar timezone.

        Examples:
        "Asia/Seoul"
        "Asia/Bangkok"

        If the study date is in Korea, Asia/Seoul is appropriate.
    */
    timeZone: "Asia/Seoul",

    /* ---------- OPTIONAL CALENDAR TEXT ---------- */

    calendarTitle: "Study date ♡",

    calendarDescription:
        "Study date — unfinished work, probably too many study breaks, and hopefully a very good morning.",

    /* ---------- ANIMATION / PACING ---------- */

    openingDelay: 450,

    /*
        Change to false if you want faster pacing.
    */
    cinematicPacing: true
};


/* ============================================================
   DOM REFERENCES
   ============================================================ */

const scenes = Array.from(
    document.querySelectorAll(".scene")
);

const progressItems = Array.from(
    document.querySelectorAll(".progress__item")
);

const particleLayer =
    document.getElementById("particleLayer");

const celebrationLayer =
    document.getElementById("celebrationLayer");

const cursorHeart =
    document.getElementById("cursorHeart");

const liveRegion =
    document.getElementById("liveRegion");


/* Buttons */

const openButton =
    document.getElementById("openButton");

const messageContinueButton =
    document.getElementById("messageContinueButton");

const questionButton =
    document.getElementById("questionButton");

const yesButton =
    document.getElementById("yesButton");

const maybeButton =
    document.getElementById("maybeButton");

const calendarButton =
    document.getElementById("calendarButton");

const easterEggButton =
    document.getElementById("easterEggButton");

const easterEggMessage =
    document.getElementById("easterEggMessage");


/* ============================================================
   STATE
   ============================================================ */

let currentScene = "scene1";

let scene2HasPlayed = false;
let sceneTransitionLocked = false;

const prefersReducedMotion =
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


/* ============================================================
   HELPER FUNCTIONS
   ============================================================ */

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}


function announce(message) {
    if (!liveRegion) return;

    liveRegion.textContent = "";

    window.setTimeout(() => {
        liveRegion.textContent = message;
    }, 50);
}


function hasPlaceholder(value) {
    return (
        typeof value === "string" &&
        /^\[.+\]$/.test(value.trim())
    );
}


/*
    Returns nickname if you replace [NICKNAME].
    Otherwise, it falls back to her name.

    You can use this later if you add your own personalized lines.
*/
function getPreferredName() {
    if (
        CONFIG.nickname &&
        !hasPlaceholder(CONFIG.nickname)
    ) {
        return CONFIG.nickname;
    }

    return CONFIG.herName;
}


/* ============================================================
   INSERT CONFIG VALUES INTO HTML
   ============================================================ */

function applyConfig() {
    const configElements =
        document.querySelectorAll("[data-config]");

    configElements.forEach(element => {
        const key = element.dataset.config;

        if (
            Object.prototype.hasOwnProperty.call(
                CONFIG,
                key
            )
        ) {
            element.textContent = CONFIG[key];
        }
    });

    /*
        Keep the page title subtle so a link preview does not
        immediately reveal the confession.
    */
    document.title = "A little something for you ♡";
}


/* ============================================================
   PROGRESS
   ============================================================ */

function updateProgress(step) {
    progressItems.forEach((item, index) => {
        const itemStep = index + 1;

        item.classList.toggle(
            "is-active",
            itemStep === step
        );

        item.classList.toggle(
            "is-complete",
            itemStep < step
        );
    });
}


/* ============================================================
   SCENE TRANSITIONS
   ============================================================ */

async function showScene(
    targetSceneId,
    progressStep
) {
    if (sceneTransitionLocked) {
        return;
    }

    const current =
        document.getElementById(currentScene);

    const target =
        document.getElementById(targetSceneId);

    if (!target || target === current) {
        return;
    }

    sceneTransitionLocked = true;

    if (current) {
        current.classList.add("is-leaving");
    }

    if (!prefersReducedMotion) {
        await sleep(420);
    }

    scenes.forEach(scene => {
        scene.classList.remove(
            "is-active",
            "is-leaving"
        );
    });

    target.scrollTop = 0;
    target.classList.add("is-active");

    currentScene = targetSceneId;

    updateProgress(progressStep);

    if (!prefersReducedMotion) {
        await sleep(100);
    }

    sceneTransitionLocked = false;

    /*
        Move focus into the new scene for keyboard users
        without visibly drawing a focus ring.
    */
    const heading =
        target.querySelector(
            "h1, h2, [role='heading']"
        );

    if (heading) {
        heading.setAttribute("tabindex", "-1");
        heading.focus({
            preventScroll: true
        });
    }

    /*
        Special behavior when entering Scene 2.
    */
    if (
        targetSceneId === "scene2" &&
        !scene2HasPlayed
    ) {
        scene2HasPlayed = true;

        await playScene2();
    }
}


/* ============================================================
   SCENE 1 — OPENING SEQUENCE
   ============================================================ */

async function playOpening() {
    const reveals = [
        document.querySelector(
            ".opening-reveal--1"
        ),
        document.querySelector(
            ".opening-reveal--2"
        ),
        document.querySelector(
            ".opening-reveal--3"
        ),
        document.querySelector(
            ".opening-reveal--4"
        ),
        document.querySelector(
            ".opening-reveal--5"
        )
    ];

    if (prefersReducedMotion) {
        reveals.forEach(element => {
            element?.classList.add("is-visible");
        });

        return;
    }

    await sleep(CONFIG.openingDelay);

    for (
        let index = 0;
        index < reveals.length;
        index++
    ) {
        const element = reveals[index];

        if (!element) {
            continue;
        }

        element.classList.add("is-visible");

        /*
            Slightly different timing creates
            more natural pacing.
        */
        const delay =
            index === 1
                ? 900
                : index === 2
                    ? 1100
                    : index === 3
                        ? 1150
                        : 650;

        await sleep(delay);
    }
}


/* ============================================================
   SCENE 2 — MESSAGE SEQUENCE
   ============================================================ */

async function playScene2() {
    const storyElements = Array.from(
        document.querySelectorAll(
            "#scene2 [data-story-line]"
        )
    );

    const normalDelay =
        CONFIG.cinematicPacing
            ? 1800
            : 900;

    if (prefersReducedMotion) {
        storyElements.forEach(element => {
            element.classList.add("is-visible");
        });

        revealConfessionWords(true);

        messageContinueButton.classList.add(
            "is-visible"
        );

        return;
    }

    /*
        Give the new card a moment to settle.
    */
    await sleep(700);

    for (
        let index = 0;
        index < storyElements.length;
        index++
    ) {
        const element = storyElements[index];

        element.classList.add("is-visible");

        /*
            The confession gets its own special word animation.
        */
        if (element.id === "confession") {
            await sleep(500);

            await revealConfessionWords(false);

            /*
                Make a few hearts rise at the confession moment.
            */
            miniHeartBurst(
                window.innerWidth / 2,
                window.innerHeight * 0.56,
                7
            );

            await sleep(
                CONFIG.cinematicPacing
                    ? 1700
                    : 700
            );
        } else {
            const isPause =
                element.classList.contains(
                    "dramatic-pause"
                );

            await sleep(
                isPause
                    ? (
                        CONFIG.cinematicPacing
                            ? 1500
                            : 700
                    )
                    : normalDelay
            );
        }
    }

    messageContinueButton.classList.add(
        "is-visible"
    );
}


/* ============================================================
   CONFESSION WORD-BY-WORD ANIMATION
   ============================================================ */

function prepareConfessionWords() {
    const confessionText =
        document.getElementById(
            "confessionText"
        );

    if (!confessionText) {
        return [];
    }

    const originalText =
        confessionText.textContent.trim();

    const words =
        originalText.split(/\s+/);

    confessionText.innerHTML = "";

    return words.map((word, index) => {
        const span =
            document.createElement("span");

        span.className =
            "confession-word";

        /*
            Include the space inside each span
            except after the final word.
        */
        span.textContent =
            index === words.length - 1
                ? word
                : `${word} `;

        confessionText.appendChild(span);

        return span;
    });
}


let confessionWords =
    prepareConfessionWords();


async function revealConfessionWords(immediate) {
    if (!confessionWords.length) {
        confessionWords =
            prepareConfessionWords();
    }

    if (immediate) {
        confessionWords.forEach(word => {
            word.classList.add("is-visible");
        });

        return;
    }

    for (
        const word
        of confessionWords
    ) {
        word.classList.add("is-visible");

        await sleep(125);
    }
}


/* ============================================================
   BACKGROUND PARTICLES
   ============================================================ */

function createParticles() {
    if (
        !particleLayer ||
        prefersReducedMotion
    ) {
        return;
    }

    /*
        Keep particle count deliberately low
        for good mobile performance.
    */
    const amount =
        window.innerWidth < 500
            ? 15
            : 22;

    const symbols = [
        "♡",
        "·",
        "✦"
    ];

    for (
        let i = 0;
        i < amount;
        i++
    ) {
        const particle =
            document.createElement("span");

        const symbol =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        particle.classList.add(
            "particle"
        );

        if (symbol === "♡") {
            particle.classList.add(
                "particle--heart"
            );
        } else if (symbol === "✦") {
            particle.classList.add(
                "particle--star"
            );
        } else {
            particle.classList.add(
                "particle--dot"
            );
        }

        particle.textContent =
            symbol === "·"
                ? ""
                : symbol;

        const x =
            Math.random() * 100;

        const y =
            Math.random() * 100;

        const duration =
            8 + Math.random() * 8;

        const delay =
            -Math.random() * duration;

        const opacity =
            0.13 + Math.random() * 0.28;

        const driftX =
            -20 + Math.random() * 40;

        const driftY =
            -18 - Math.random() * 35;

        const rotation =
            -20 + Math.random() * 40;

        const size =
            7 + Math.random() * 8;

        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;

        particle.style.setProperty(
            "--duration",
            `${duration}s`
        );

        particle.style.setProperty(
            "--delay",
            `${delay}s`
        );

        particle.style.setProperty(
            "--particle-opacity",
            opacity
        );

        particle.style.setProperty(
            "--drift-x",
            `${driftX}px`
        );

        particle.style.setProperty(
            "--drift-y",
            `${driftY}px`
        );

        particle.style.setProperty(
            "--rotation",
            `${rotation}deg`
        );

        particle.style.setProperty(
            "--particle-size",
            `${size}px`
        );

        particleLayer.appendChild(
            particle
        );
    }
}


/* ============================================================
   SMALL HEART BURST
   Used at confession / taps.
   ============================================================ */

function miniHeartBurst(
    x,
    y,
    amount = 5
) {
    if (prefersReducedMotion) {
        return;
    }

    for (
        let i = 0;
        i < amount;
        i++
    ) {
        const heart =
            document.createElement("span");

        heart.className =
            "tap-heart";

        heart.textContent =
            Math.random() > 0.25
                ? "♡"
                : "♥";

        const offsetX =
            -35 + Math.random() * 70;

        const offsetY =
            -12 + Math.random() * 28;

        heart.style.left =
            `${x + offsetX}px`;

        heart.style.top =
            `${y + offsetY}px`;

        heart.style.fontSize =
            `${12 + Math.random() * 10}px`;

        document.body.appendChild(
            heart
        );

        window.setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}


/* ============================================================
   TOUCH-FRIENDLY HEART EFFECT
   ============================================================ */

function initializeTouchHearts() {
    window.addEventListener(
        "pointerdown",
        event => {
            if (event.pointerType === "mouse") {
                return;
            }

            /*
                One subtle heart per touch.
                Not enough to become distracting.
            */
            miniHeartBurst(
                event.clientX,
                event.clientY,
                1
            );
        },
        {
            passive: true
        }
    );
}


/* ============================================================
   CURSOR HEART — DESKTOP
   ============================================================ */

function initializeCursorHeart() {
    if (
        !cursorHeart ||
        prefersReducedMotion
    ) {
        return;
    }

    const hasFinePointer =
        window.matchMedia(
            "(pointer: fine)"
        ).matches;

    if (!hasFinePointer) {
        return;
    }

    let pointerX = -50;
    let pointerY = -50;

    let currentX = -50;
    let currentY = -50;

    let animationFrame;

    window.addEventListener(
        "mousemove",
        event => {
            pointerX = event.clientX;
            pointerY = event.clientY;
        },
        {
            passive: true
        }
    );

    function animate() {
        /*
            Slight lag makes the heart gently follow
            rather than stick directly to the pointer.
        */
        currentX +=
            (pointerX - currentX) * 0.16;

        currentY +=
            (pointerY - currentY) * 0.16;

        cursorHeart.style.transform =
            `translate3d(
                ${currentX + 13}px,
                ${currentY + 11}px,
                0
            )`;

        animationFrame =
            requestAnimationFrame(
                animate
            );
    }

    animationFrame =
        requestAnimationFrame(
            animate
        );

    window.addEventListener(
        "pagehide",
        () => {
            cancelAnimationFrame(
                animationFrame
            );
        }
    );
}


/* ============================================================
   YES CELEBRATION
   ============================================================ */

function celebrateYes() {
    if (
        !celebrationLayer ||
        prefersReducedMotion
    ) {
        return;
    }

    celebrationLayer.innerHTML = "";

    const symbols = [
        "♡",
        "♥",
        "✦",
        "♡",
        "♡"
    ];

    const amount =
        window.innerWidth < 500
            ? 30
            : 45;

    for (
        let i = 0;
        i < amount;
        i++
    ) {
        const piece =
            document.createElement("span");

        piece.className =
            "celebration-piece";

        piece.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];

        const x =
            Math.random() * 100;

        const size =
            10 + Math.random() * 16;

        const duration =
            2.5 + Math.random() * 2;

        const delay =
            Math.random() * 1.2;

        const drift =
            -80 + Math.random() * 160;

        const spin =
            -200 + Math.random() * 400;

        piece.style.setProperty(
            "--x",
            `${x}%`
        );

        piece.style.setProperty(
            "--size",
            `${size}px`
        );

        piece.style.setProperty(
            "--duration",
            `${duration}s`
        );

        piece.style.setProperty(
            "--delay",
            `${delay}s`
        );

        piece.style.setProperty(
            "--drift",
            `${drift}px`
        );

        piece.style.setProperty(
            "--spin",
            `${spin}deg`
        );

        celebrationLayer.appendChild(
            piece
        );
    }

    /*
        Clean up after the animation.
    */
    window.setTimeout(() => {
        celebrationLayer.innerHTML = "";
    }, 6000);
}


/* ============================================================
   CALENDAR EVENT (.ICS)
   ============================================================ */

/*
    Converts e.g.:
    "8:00 AM" -> "080000"
    "11:00 AM" -> "110000"
*/
function timeToICS(timeString) {
    const match =
        timeString
            .trim()
            .match(
                /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i
            );

    if (!match) {
        return null;
    }

    let hours =
        Number(match[1]);

    const minutes =
        match[2];

    const period =
        match[3].toUpperCase();

    if (
        period === "PM" &&
        hours !== 12
    ) {
        hours += 12;
    }

    if (
        period === "AM" &&
        hours === 12
    ) {
        hours = 0;
    }

    return (
        String(hours)
            .padStart(2, "0")
        +
        minutes
        +
        "00"
    );
}


function dateToICS(dateString) {
    const valid =
        /^\d{4}-\d{2}-\d{2}$/.test(
            dateString
        );

    if (!valid) {
        return null;
    }

    return dateString.replaceAll("-", "");
}


/*
    Escapes text according to the basic ICS format.
*/
function escapeICS(text) {
    return String(text)
        .replaceAll("\\", "\\\\")
        .replaceAll(";", "\\;")
        .replaceAll(",", "\\,")
        .replace(/\r?\n/g, "\\n");
}


function generateCalendarEvent() {
    const eventDate =
        dateToICS(CONFIG.eventDate);

    const start =
        timeToICS(CONFIG.startTime);

    const end =
        timeToICS(CONFIG.endTime);

    if (
        !eventDate ||
        !start ||
        !end
    ) {
        alert(
            "The calendar event needs a valid eventDate, startTime, and endTime in CONFIG."
        );

        return;
    }

    const timestamp =
        new Date()
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}/, "");

    const uid =
        `study-date-${Date.now()}@romantic-invite`;

    const description =
        `${CONFIG.calendarDescription}\n\nFrom ${CONFIG.myName} ♡`;

    /*
        Calendar format intentionally uses TZID so the planned
        morning time stays associated with the intended timezone.
    */
    const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Study Date Invitation//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",

        "BEGIN:VEVENT",

        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,

        `DTSTART;TZID=${CONFIG.timeZone}:${eventDate}T${start}`,
        `DTEND;TZID=${CONFIG.timeZone}:${eventDate}T${end}`,

        `SUMMARY:${escapeICS(CONFIG.calendarTitle)}`,

        `LOCATION:${escapeICS(CONFIG.location)}`,

        `DESCRIPTION:${escapeICS(description)}`,

        "STATUS:CONFIRMED",

        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const blob =
        new Blob(
            [ics],
            {
                type:
                    "text/calendar;charset=utf-8"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download =
        "study-date.ics";

    document.body.appendChild(link);

    link.click();
    link.remove();

    window.setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);

    announce(
        "Calendar event created."
    );
}


/* ============================================================
   EASTER EGG
   ============================================================ */

function initializeEasterEgg() {
    if (
        !easterEggButton ||
        !easterEggMessage
    ) {
        return;
    }

    easterEggButton.addEventListener(
        "click",
        () => {
            const isVisible =
                easterEggMessage
                    .classList
                    .toggle("is-visible");

            easterEggButton.setAttribute(
                "aria-expanded",
                String(isVisible)
            );

            if (isVisible) {
                /*
                    Optional nickname personalization.
                    If nickname is configured, subtly use it.
                */
                const preferredName =
                    getPreferredName();

                if (
                    preferredName &&
                    !hasPlaceholder(
                        preferredName
                    )
                ) {
                    easterEggMessage.textContent =
                        `psst, ${preferredName}... yes, I spent way too long making this.`;
                } else {
                    easterEggMessage.textContent =
                        "psst... yes, I spent way too long making this.";
                }

                miniHeartBurst(
                    window.innerWidth - 32,
                    window.innerHeight - 40,
                    3
                );
            }
        }
    );

    /*
        Clicking elsewhere closes the message.
    */
    document.addEventListener(
        "pointerdown",
        event => {
            const clickedInside =
                event.target.closest(
                    ".easter-egg"
                );

            if (!clickedInside) {
                easterEggMessage
                    .classList
                    .remove("is-visible");

                easterEggButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        }
    );
}


/* ============================================================
   BUTTON EVENTS
   ============================================================ */

function initializeButtons() {
    openButton?.addEventListener(
        "click",
        () => {
            showScene(
                "scene2",
                2
            );
        }
    );


    messageContinueButton?.addEventListener(
        "click",
        () => {
            showScene(
                "scene3",
                3
            );
        }
    );


    questionButton?.addEventListener(
        "click",
        () => {
            showScene(
                "scene4",
                4
            );
        }
    );


    yesButton?.addEventListener(
        "click",
        async () => {
            /*
                Celebration intentionally happens only
                after she willingly presses Yes.
            */
            celebrateYes();

            await showScene(
                "sceneYes",
                5
            );

            announce(
                "It's a date."
            );
        }
    );


    maybeButton?.addEventListener(
        "click",
        async () => {
            /*
                No tricks. No moving button.
                No guilt-tripping.
                Her choice is respected immediately.
            */
            await showScene(
                "sceneMaybe",
                5
            );

            announce(
                "That's completely okay."
            );
        }
    );


    calendarButton?.addEventListener(
        "click",
        generateCalendarEvent
    );
}


/* ============================================================
   INITIALIZATION
   ============================================================ */

function initialize() {
    applyConfig();

    createParticles();

    initializeButtons();

    initializeTouchHearts();

    initializeCursorHeart();

    initializeEasterEgg();

    updateProgress(1);

    playOpening();
}


/*
    The script is loaded at the bottom of the HTML,
    but DOMContentLoaded keeps initialization robust
    if you later move the script into the <head>.
*/
if (
    document.readyState === "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );
} else {
    initialize();
}