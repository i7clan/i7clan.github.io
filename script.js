
/* =====================================================
   I7 CLAN — COMPLETE JAVASCRIPT
===================================================== */


/* =====================================================
   LEADER DATA
===================================================== */

const leaders = {

    L1NK0: {
        name: "L1NK0",
        avatar: "L",
        description:
            "One of the leaders of i7 Clan. Profile information can be updated later.",
        roblox:
            "https://www.roblox.com/users/5197013711/profile"
    },

    i7_clan: {
        name: "i7_clan",
        avatar: "I7",
        description:
            "Leader of i7 Clan and one of the people behind the community.",
        roblox:
            "https://www.roblox.com/users/11163707583/profile"
    },

    Jaden: {
        name: "Jaden",
        avatar: "J",
        description:
            "One of the leaders of i7 Clan.",
        roblox:
            "https://www.roblox.com/users/10831159411/profile"
    }

};


/* =====================================================
   OPEN LEADER PROFILE
===================================================== */

function openLeader(username) {

    console.log("Opening leader:", username);

    const leader = leaders[username];

    if (!leader) {
        console.error("Leader not found:", username);
        return;
    }

    const profileName = document.getElementById("profileName");
    const profileAvatar = document.getElementById("profileAvatar");
    const profileDescription = document.getElementById("profileDescription");
    const robloxProfile = document.getElementById("robloxProfile");
    const leaderModal = document.getElementById("leaderModal");

    if (
        !profileName ||
        !profileAvatar ||
        !profileDescription ||
        !robloxProfile ||
        !leaderModal
    ) {
        console.error("One or more leader modal elements are missing.");
        return;
    }

    profileName.textContent = leader.name;
    profileAvatar.textContent = leader.avatar;
    profileDescription.textContent = leader.description;
    robloxProfile.href = leader.roblox;

    leaderModal.classList.add("active");

}


/* =====================================================
   CLOSE LEADER PROFILE
===================================================== */

function closeLeader() {

    const leaderModal = document.getElementById("leaderModal");

    if (!leaderModal) return;

    leaderModal.classList.remove("active");

}


/* =====================================================
   OPEN JOIN MODAL
===================================================== */

function openJoin() {

    const modal = document.getElementById("joinModal");

    if (!modal) return;

    const form = document.getElementById("joinForm");
    const success = document.getElementById("applicationSuccess");

    if (form) {
        form.reset();
        form.style.display = "flex";
    }

    if (success) {
        success.style.display = "none";
    }

    modal.classList.add("active");

}


/* =====================================================
   CLOSE JOIN MODAL
===================================================== */

function closeJoin() {

    const modal = document.getElementById("joinModal");

    if (!modal) return;

    modal.classList.remove("active");

}


/* =====================================================
   SUBMIT APPLICATION
===================================================== */

function submitApplication(event) {

    event.preventDefault();

    const usernameInput = document.getElementById("robloxUsername");

    if (!usernameInput) {
        console.error("Missing #robloxUsername");
        return;
    }

    const username = usernameInput.value.trim();

    if (username === "") {
        alert("Please enter your Roblox username.");
        return;
    }

    const form = document.getElementById("joinForm");
    const success = document.getElementById("applicationSuccess");

    if (form) {
        form.style.display = "none";
    }

    if (success) {
        success.style.display = "block";
    }

}


/* =====================================================
   CONNECT WITH I7 MODAL
===================================================== */

function openConnect() {

    const modal = document.getElementById("connectModal");

    if (!modal) return;

    modal.classList.add("active");

}


function closeConnect() {

    const modal = document.getElementById("connectModal");

    if (!modal) return;

    modal.classList.remove("active");

}


/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

window.addEventListener("click", function(event) {

    const leaderModal = document.getElementById("leaderModal");
    const joinModal = document.getElementById("joinModal");
    const connectModal = document.getElementById("connectModal");

    if (leaderModal && event.target === leaderModal) {
        closeLeader();
    }

    if (joinModal && event.target === joinModal) {
        closeJoin();
    }

    if (connectModal && event.target === connectModal) {
        closeConnect();
    }

});


/* =====================================================
   I7 NAVBAR — MOBILE MENU & DROPDOWNS
===================================================== */

function initializeI7Navbar() {

    const navbar = document.querySelector(".i7-navbar");
    const menuToggle = document.getElementById("menuToggle");

    if (!navbar) {
        console.error("I7 navbar not found!");
        return;
    }

    console.log("I7 navbar initialized successfully.");

    /* MOBILE MENU */

    if (menuToggle) {

        menuToggle.addEventListener("click", function() {

            const isOpen = navbar.classList.toggle("nav-open");

            menuToggle.textContent = isOpen ? "×" : "☰";

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    }


    /* MORE & ACCOUNT DROPDOWNS */

    const dropdowns = navbar.querySelectorAll(".nav-dropdown");

    dropdowns.forEach(function(dropdown) {

        const trigger = dropdown.querySelector(".dropdown-trigger");

        if (!trigger) {
            console.warn("Dropdown trigger missing:", dropdown);
            return;
        }

        trigger.addEventListener("click", function(event) {

            event.preventDefault();
            event.stopPropagation();

            // Close other dropdowns first

            dropdowns.forEach(function(other) {

                if (other !== dropdown) {

                    other.classList.remove("open");

                    const otherTrigger =
                        other.querySelector(".dropdown-trigger");

                    if (otherTrigger) {
                        otherTrigger.setAttribute("aria-expanded", "false");
                    }

                }

            });


            // Toggle the selected dropdown

            const isOpen = dropdown.classList.toggle("open");

            trigger.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        });

    });


    /* CLOSE DROPDOWNS WHEN CLICKING OUTSIDE */

    document.addEventListener("click", function(event) {

        if (!navbar.contains(event.target)) {

            dropdowns.forEach(function(dropdown) {

                dropdown.classList.remove("open");

                const trigger =
                    dropdown.querySelector(".dropdown-trigger");

                if (trigger) {
                    trigger.setAttribute("aria-expanded", "false");
                }

            });

        }

    });


    /* ESCAPE KEY */

    document.addEventListener("keydown", function(event) {

        if (event.key === "Escape") {

            navbar.classList.remove("nav-open");

            dropdowns.forEach(function(dropdown) {

                dropdown.classList.remove("open");

                const trigger =
                    dropdown.querySelector(".dropdown-trigger");

                if (trigger) {
                    trigger.setAttribute("aria-expanded", "false");
                }

            });

            if (menuToggle) {

                menuToggle.textContent = "☰";

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

            closeLeader();
            closeJoin();
            closeConnect();

        }

    });

}


/* =====================================================
   INITIALIZE WEBSITE
===================================================== */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initializeI7Navbar
    );

} else {

    initializeI7Navbar();

}


console.log("I7 Clan script.js loaded successfully.");
