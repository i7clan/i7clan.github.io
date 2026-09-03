// ==========================================
// I7 CLAN - SUPABASE AUTHENTICATION
// ==========================================

// Supabase project information
const SUPABASE_URL = "https://wwqpvmfayxxbjomvnarn.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_48lWgW1tvXXqy-4x1XS7DQ_QfbirUOG";

// Create Supabase client
const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// ==========================================
// SIGN UP
// ==========================================

const signupForm = document.getElementById("signup-form");

if (signupForm) {

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirm-password").value;

        const message = document.getElementById("message");

        // Check passwords
        if (password !== confirmPassword) {
            message.textContent = "Passwords do not match.";
            return;
        }

        message.textContent = "Creating your account...";

        try {

            const { data, error } = await supabaseClient.auth.signUp({

                email: email,
                password: password,

                options: {
                    data: {
                        username: username
                    }
                }

            });

            if (error) {
                message.textContent = error.message;
                return;
            }

            message.textContent =
                "Account created! Check your email to verify your account.";

            signupForm.reset();

        } catch (error) {

            console.error(error);

            message.textContent =
                "Something went wrong. Please try again.";
        }

    });

}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        const message = document.getElementById("message");

        message.textContent = "Logging in...";

        try {

            const { data, error } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,
                    password: password

                });

            if (error) {
                message.textContent = error.message;
                return;
            }

            message.textContent = "Login successful!";

            // Check where the user came from
            const params = new URLSearchParams(window.location.search);
            const redirectPage = params.get("redirect");

            setTimeout(() => {

                if (redirectPage) {
                    window.location.href = redirectPage;
                } else {
                    window.location.href = "index.html";
                }

            }, 700);

        } catch (error) {

            console.error(error);

            message.textContent =
                "Something went wrong. Please try again.";
        }

    });

}

// ==========================================
// LOGOUT FUNCTION
// ==========================================

async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {

        console.error("Logout error:", error);
        return;

    }

    window.location.href = "index.html";
}


// ==========================================
// GET CURRENT USER
// ==========================================

async function getCurrentUser() {

    const { data, error } =
        await supabaseClient.auth.getUser();

    if (error) {
        return null;
    }

    return data.user;
}