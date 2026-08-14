/* =====================================================
   I7 CLAN — JAVASCRIPT
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

        console.error(
            "Leader not found:",
            username
        );

        return;
    }


    const profileName =
        document.getElementById("profileName");

    const profileAvatar =
        document.getElementById("profileAvatar");

    const profileDescription =
        document.getElementById("profileDescription");

    const robloxProfile =
        document.getElementById("robloxProfile");

    const leaderModal =
        document.getElementById("leaderModal");


    if (!profileName) {
        console.error("Missing #profileName");
        return;
    }

    if (!profileAvatar) {
        console.error("Missing #profileAvatar");
        return;
    }

    if (!profileDescription) {
        console.error("Missing #profileDescription");
        return;
    }

    if (!robloxProfile) {
        console.error("Missing #robloxProfile");
        return;
    }

    if (!leaderModal) {
        console.error("Missing #leaderModal");
        return;
    }


    profileName.textContent =
        leader.name;


    profileAvatar.textContent =
        leader.avatar;


    profileDescription.textContent =
        leader.description;


    robloxProfile.href =
        leader.roblox;


    leaderModal.classList.add("active");

}



/* =====================================================
   CLOSE LEADER PROFILE
===================================================== */

function closeLeader() {

    const leaderModal =
        document.getElementById("leaderModal");

    if (!leaderModal) return;

    leaderModal.classList.remove("active");

}



/* =====================================================
   OPEN JOIN MODAL
===================================================== */

function openJoin() {

    const modal =
        document.getElementById("joinModal");

    if (!modal) return;


    const form =
        document.getElementById("joinForm");

    const success =
        document.getElementById(
            "applicationSuccess"
        );


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

    const modal =
        document.getElementById("joinModal");

    if (!modal) return;

    modal.classList.remove("active");

}



/* =====================================================
   SUBMIT APPLICATION
===================================================== */

function submitApplication(event) {

    event.preventDefault();


    const usernameInput =
        document.getElementById(
            "robloxUsername"
        );


    if (!usernameInput) {

        console.error(
            "Missing #robloxUsername"
        );

        return;

    }


    const username =
        usernameInput.value.trim();


    if (username === "") {

        alert(
            "Please enter your Roblox username."
        );

        return;

    }


    const form =
        document.getElementById("joinForm");

    const success =
        document.getElementById(
            "applicationSuccess"
        );


    if (form) {

        form.style.display = "none";

    }


    if (success) {

        success.style.display = "block";

    }

}



/* =====================================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
===================================================== */

window.addEventListener(
    "click",
    function(event) {

        const leaderModal =
            document.getElementById(
                "leaderModal"
            );

        const joinModal =
            document.getElementById(
                "joinModal"
            );


        if (
            leaderModal &&
            event.target === leaderModal
        ) {

            closeLeader();

        }


        if (
            joinModal &&
            event.target === joinModal
        ) {

            closeJoin();

        }

    }
);



/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {

            closeLeader();

            closeJoin();

        }

    }
);



/* =====================================================
   SCRIPT LOADED CHECK
===================================================== */

console.log(
    "I7 Clan script.js loaded successfully."
);


function openConnect() {
    document.getElementById("connectModal").classList.add("active");
}

function closeConnect() {
    document.getElementById("connectModal").classList.remove("active");
}
