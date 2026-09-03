// =========================================
// I7 CLAN — PROFILE
// =========================================

const usernameElement =
    document.getElementById("username");

const profileUsername =
    document.getElementById("profileUsername");

const profileEmail =
    document.getElementById("profileEmail");

const profileJoined =
    document.getElementById("profileJoined");

const messageCount =
    document.getElementById("messageCount");

const avatar =
    document.getElementById("avatar");

const logoutBtn =
    document.getElementById("logoutBtn");


// =========================================
// LOAD PROFILE
// =========================================

async function loadProfile() {

    // Get currently logged-in user
    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error || !data.user) {

        window.location.href =
            "login.html?redirect=profile.html";

        return;
    }

    const user = data.user;


    // =====================================
    // USERNAME
    // =====================================

    const username =
        user.user_metadata?.username ||
        user.email?.split("@")[0] ||
        "User";


    usernameElement.textContent =
        username;

    profileUsername.textContent =
        username;


    // =====================================
    // EMAIL
    // =====================================

    profileEmail.textContent =
        user.email || "Not available";


    // =====================================
    // AVATAR
    // =====================================

    avatar.textContent =
        username.charAt(0).toUpperCase();


    // =====================================
    // JOIN DATE
    // =====================================

    const joinedDate =
        new Date(user.created_at);

    profileJoined.textContent =
        joinedDate.toLocaleDateString([], {
            year: "numeric",
            month: "long",
            day: "numeric"
        });


    // =====================================
    // MESSAGE COUNT
    // =====================================

    const { count, error: countError } =
        await supabaseClient
            .from("messages")
            .select("*", {
                count: "exact",
                head: true
            })
            .eq("user_id", user.id);


    if (countError) {

        console.error(
            "Message count error:",
            countError
        );

        messageCount.textContent =
            "Unavailable";

    } else {

        messageCount.textContent =
            count ?? 0;

    }

}


// =========================================
// LOGOUT
// =========================================

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            await logoutUser();

        }
    );

}


// =========================================
// START
// =========================================

loadProfile();