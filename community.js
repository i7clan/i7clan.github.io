// =========================================
// I7 CLAN — COMMUNITY CHAT
// =========================================

const messagesBox = document.getElementById("messages");
const messageForm = document.getElementById("messageForm");
const messageInput = document.getElementById("messageInput");
const messageStatus = document.getElementById("messageStatus");
const userStatus = document.getElementById("userStatus");
const logoutBtn = document.getElementById("logoutBtn");

let currentUser = null;


// =========================================
// START COMMUNITY
// =========================================

async function startCommunity() {

    // Check if someone is logged in
    const { data, error } = await supabaseClient.auth.getUser();

    if (error || !data.user) {
        window.location.href = "login.html?redirect=community.html";
        return;
    }

    currentUser = data.user;

    // Show account information
    const username =
        currentUser.user_metadata?.username ||
        currentUser.email?.split("@")[0] ||
        "User";

    userStatus.textContent = `Logged in as ${username}`;

    // Load existing messages
    await loadMessages();

    // Start live updates
    setupRealtime();

    messageInput.focus();
}


// =========================================
// LOAD MESSAGES
// =========================================

async function loadMessages() {

    messagesBox.innerHTML = `
        <div class="loading">
            Loading messages...
        </div>
    `;

    const { data, error } = await supabaseClient
        .from("messages")
        .select("*")
        .order("created_at", {
            ascending: true
        })
        .limit(100);

    if (error) {
        console.error("Message loading error:", error);

        messagesBox.innerHTML = `
            <div class="empty-chat">
                Could not load messages.
            </div>
        `;

        return;
    }

    if (!data || data.length === 0) {

        messagesBox.innerHTML = `
            <div class="empty-chat">
                No messages yet.<br>
                Be the first to say something!
            </div>
        `;

        return;
    }

    messagesBox.innerHTML = "";

    data.forEach(message => {
        displayMessage(message);
    });

    scrollToBottom();
}


// =========================================
// DISPLAY MESSAGE
// =========================================

function displayMessage(message) {

    const username =
        message.user_id === currentUser.id
            ? (
                currentUser.user_metadata?.username ||
                currentUser.email?.split("@")[0] ||
                "You"
            )
            : "I7 Member";

    const messageElement = document.createElement("div");

    const isMine =
        message.user_id === currentUser.id;

    messageElement.className =
        `message ${isMine ? "mine" : "other"}`;


    // Username
    const usernameElement =
        document.createElement("div");

    usernameElement.className =
        "message-user";

    usernameElement.textContent =
        isMine ? "You" : username;


    // Message text
    const contentElement =
        document.createElement("div");

    contentElement.className =
        "message-content";

    // textContent prevents HTML/code from being executed
    contentElement.textContent =
        message.content;


    // Time
    const timeElement =
        document.createElement("div");

    timeElement.className =
        "message-time";

    timeElement.textContent =
        formatTime(message.created_at);


    messageElement.appendChild(usernameElement);
    messageElement.appendChild(contentElement);
    messageElement.appendChild(timeElement);

    messagesBox.appendChild(messageElement);
}


// =========================================
// SEND MESSAGE
// =========================================

messageForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const content =
        messageInput.value.trim();

    if (!content) {
        return;
    }

    if (content.length > 500) {
        messageStatus.textContent =
            "Message must be 500 characters or less.";

        return;
    }

    const sendButton =
        messageForm.querySelector("button");

    sendButton.disabled = true;

    messageStatus.textContent =
        "Sending...";


    const { error } = await supabaseClient
        .from("messages")
        .insert({
            user_id: currentUser.id,
            content: content
        });


    if (error) {

        console.error("Send message error:", error);

        messageStatus.textContent =
            "Could not send message.";

        sendButton.disabled = false;

        return;
    }


    // Clear input
    messageInput.value = "";

    messageStatus.textContent = "";

    sendButton.disabled = false;

    messageInput.focus();
});


// =========================================
// REALTIME CHAT
// =========================================

function setupRealtime() {

    supabaseClient
        .channel("i7-community-chat")
        .on(
            "postgres_changes",
            {
                event: "INSERT",
                schema: "public",
                table: "messages"
            },
            function(payload) {

                // Prevent duplicate messages
                const alreadyShown =
                    [...messagesBox.children].some(element =>
                        element.dataset.messageId ===
                        String(payload.new.id)
                    );

                if (alreadyShown) {
                    return;
                }

                displayMessage(payload.new);

                // Store ID on the last message
                const lastMessage =
                    messagesBox.lastElementChild;

                if (lastMessage) {
                    lastMessage.dataset.messageId =
                        payload.new.id;
                }

                scrollToBottom();
            }
        )
        .subscribe();
}


// =========================================
// FORMAT TIME
// =========================================

function formatTime(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleString([], {
        hour: "2-digit",
        minute: "2-digit"
    });
}


// =========================================
// SCROLL TO BOTTOM
// =========================================

function scrollToBottom() {

    messagesBox.scrollTop =
        messagesBox.scrollHeight;
}


// =========================================
// LOGOUT
// =========================================

if (logoutBtn) {

    logoutBtn.addEventListener("click", async function() {

        await logoutUser();

    });

}


// =========================================
// START
// =========================================

startCommunity();