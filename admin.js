
/* =====================================================
   I7 CLAN — ADMIN PANEL
   Supabase Authentication + Member Management
===================================================== */

// ================= SUPABASE CONFIG =================

const SUPABASE_URL = "https://ffraztjbqywsntmfftjb.supabase.co";

const SUPABASE_KEY = "sb_publishable_jpHu9S1s37hAZRkmMDrfpw_yAGupnrZ";

const OWNER_UID = "feec3934-468d-4782-90b1-22749561efb2";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// ================= ELEMENTS =================

const loginScreen = document.getElementById("loginScreen");
const dashboardScreen = document.getElementById("dashboardScreen");

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

const membersTable = document.getElementById("membersTable");
const dashboardMessage = document.getElementById("dashboardMessage");

const memberFormCard = document.getElementById("memberFormCard");
const memberForm = document.getElementById("memberForm");

const addMemberButton = document.getElementById("addMemberButton");
const cancelMemberButton = document.getElementById("cancelMemberButton");

const formTitle = document.getElementById("formTitle");
const saveMemberButton = document.getElementById("saveMemberButton");
const formMessage = document.getElementById("formMessage");

const memberIdInput = document.getElementById("memberId");
const memberNameInput = document.getElementById("memberName");
const memberRoleInput = document.getElementById("memberRole");
const memberStatusInput = document.getElementById("memberStatus");
const robloxUrlInput = document.getElementById("robloxUrl");

// ================= STATE =================

let currentMembers = [];
let currentUser = null;

// ================= MESSAGES =================

function showMessage(element, message, type = "") {
  element.textContent = message;
  element.className = "message";

  if (type) {
    element.classList.add(type);
  }
}

// ================= AUTHENTICATION =================

async function verifyOwner(user) {
  if (!user || user.id !== OWNER_UID) {
    return false;
  }

  const { data, error } = await client
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function showDashboard(user) {
  try {
    const isOwner = await verifyOwner(user);

    if (!isOwner) {
      await client.auth.signOut();

      loginScreen.classList.remove("hidden");
      dashboardScreen.classList.add("hidden");

      showMessage(
        loginMessage,
        "Access denied. Owner account required.",
        "error"
      );

      return;
    }

    currentUser = user;

    loginScreen.classList.add("hidden");
    dashboardScreen.classList.remove("hidden");

    await loadMembers();

  } catch (error) {
    console.error("Owner verification error:", error);

    loginScreen.classList.remove("hidden");
    dashboardScreen.classList.add("hidden");

    showMessage(
      loginMessage,
      "Could not verify owner access. Check your connection and database permissions.",
      "error"
    );
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  loginButton.disabled = true;
  loginButton.textContent = "SIGNING IN...";

  showMessage(loginMessage, "");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    await showDashboard(data.user);

  } catch (error) {
    console.error("Login error:", error);

    showMessage(
      loginMessage,
      "Login failed. Check your email and password.",
      "error"
    );
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "SIGN IN";
  }
});

// ================= LOG OUT =================

logoutButton.addEventListener("click", async () => {
  const { error } = await client.auth.signOut();

  if (error) {
    showMessage(
      dashboardMessage,
      "Could not sign out: " + error.message,
      "error"
    );
    return;
  }

  currentUser = null;
  currentMembers = [];

  dashboardScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");

  loginForm.reset();
  showMessage(loginMessage, "");
});

// ================= LOAD MEMBERS =================

async function loadMembers() {
  membersTable.innerHTML = `
    <tr>
      <td colspan="4">Loading members...</td>
    </tr>
  `;

  const { data, error } = await client
    .from("members")
    .select("id, username, roblox_id, role, status")
    .neq("username", "ufc55302")
    .order("id", { ascending: true });

  if (error) {
    console.error("Member loading error:", error);

    showMessage(
      dashboardMessage,
      "Could not load members: " + error.message,
      "error"
    );

    membersTable.innerHTML = `
      <tr>
        <td colspan="4">Unable to load members.</td>
      </tr>
    `;

    return;
  }

  currentMembers = data || [];

  renderMembers();
  updateStatistics();
}

// ================= RENDER MEMBERS =================

function renderMembers() {
  membersTable.replaceChildren();

  if (currentMembers.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = 4;
    cell.textContent = "No I7 members found.";

    row.appendChild(cell);
    membersTable.appendChild(row);

    return;
  }

  currentMembers.forEach((member) => {
    const row = document.createElement("tr");

    const memberCell = document.createElement("td");
    const avatar = document.createElement("span");
    const name = document.createElement("span");

    avatar.className = "member-avatar";
    avatar.textContent = member.username.charAt(0).toUpperCase();

    name.className = "member-name";
    name.textContent = member.username;

    memberCell.append(avatar, name);

    const roleCell = document.createElement("td");
    const roleBadge = document.createElement("span");

    roleBadge.className = "role-badge";
    roleBadge.textContent = member.role || "MEMBER";

    roleCell.appendChild(roleBadge);

    const statusCell = document.createElement("td");
    const statusBadge = document.createElement("span");

    statusBadge.className = "status-badge";

    const status = (member.status || "ACTIVE").toUpperCase();

    statusBadge.textContent = status;

    if (status !== "ACTIVE") {
      statusBadge.classList.add("inactive");
    }

    statusCell.appendChild(statusBadge);

    const actionsCell = document.createElement("td");
    const actions = document.createElement("div");

    actions.className = "action-buttons";

    const editButton = document.createElement("button");

    editButton.className = "edit-button";
    editButton.textContent = "EDIT";
    editButton.type = "button";

    editButton.addEventListener("click", () => {
      editMember(member.id);
    });

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-button";
    deleteButton.textContent = "DELETE";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", () => {
      deleteMember(member.id);
    });

    actions.append(editButton, deleteButton);
    actionsCell.appendChild(actions);

    row.append(
      memberCell,
      roleCell,
      statusCell,
      actionsCell
    );

    membersTable.appendChild(row);
  });
}

// ================= STATISTICS =================

function updateStatistics() {
  document.getElementById("totalCount").textContent =
    currentMembers.length;

  document.getElementById("leaderCount").textContent =
    currentMembers.filter(
      member => member.role === "LEADER"
    ).length;

  document.getElementById("teacherCount").textContent =
    currentMembers.filter(
      member => member.role === "TEACHER"
    ).length;

  document.getElementById("playerCount").textContent =
    currentMembers.filter(
      member => member.role === "MEMBER"
    ).length;
}

// ================= OPEN ADD FORM =================

addMemberButton.addEventListener("click", () => {
  memberForm.reset();

  memberIdInput.value = "";
  memberRoleInput.value = "MEMBER";
  memberStatusInput.value = "ACTIVE";

  formTitle.textContent = "Add Member";
  saveMemberButton.textContent = "SAVE MEMBER";

  showMessage(formMessage, "");

  memberFormCard.classList.remove("hidden");

  memberFormCard.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

// ================= EDIT MEMBER =================

function editMember(id) {
  const member = currentMembers.find(
    item => String(item.id) === String(id)
  );

  if (!member) return;

  memberIdInput.value = member.id;
  memberNameInput.value = member.username;
  memberRoleInput.value = member.role || "MEMBER";
  memberStatusInput.value = member.status || "ACTIVE";
  robloxUrlInput.value = member.roblox_id;

  formTitle.textContent = "Edit Member";
  saveMemberButton.textContent = "UPDATE MEMBER";

  showMessage(formMessage, "");

  memberFormCard.classList.remove("hidden");

  memberFormCard.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

// ================= CANCEL FORM =================

cancelMemberButton.addEventListener("click", () => {
  memberForm.reset();

  memberIdInput.value = "";

  memberFormCard.classList.add("hidden");

  showMessage(formMessage, "");
});

// ================= VALIDATE ROBLOX URL =================

function validateRobloxUrl(value) {
  try {
    const url = new URL(value);

    const validHost =
      url.hostname === "roblox.com" ||
      url.hostname === "www.roblox.com";

    const validPath =
      /^\/users\/\d+\/profile\/?$/.test(url.pathname);

    return url.protocol === "https:" && validHost && validPath;

  } catch {
    return false;
  }
}

// ================= SAVE MEMBER =================

memberForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!currentUser) {
    showMessage(formMessage, "Please sign in again.", "error");
    return;
  }

  const username = memberNameInput.value.trim();
  const robloxUrl = robloxUrlInput.value.trim();

  if (!validateRobloxUrl(robloxUrl)) {
    showMessage(
      formMessage,
      "Enter a valid Roblox profile URL.",
      "error"
    );
    return;
  }

  const memberData = {
    username,
    roblox_id: robloxUrl,
    role: memberRoleInput.value,
    status: memberStatusInput.value,
    avatar: username.charAt(0).toUpperCase()
  };

  saveMemberButton.disabled = true;
  saveMemberButton.textContent = "SAVING...";

  showMessage(formMessage, "");

  try {
    const existingId = memberIdInput.value;

    let result;

    if (existingId) {
      result = await client
        .from("members")
        .update(memberData)
        .eq("id", existingId)
        .select()
        .single();

    } else {
      result = await client
        .from("members")
        .insert(memberData)
        .select()
        .single();
    }

    if (result.error) {
      throw result.error;
    }

    showMessage(
      dashboardMessage,
      existingId
        ? "Member updated successfully."
        : "Member added successfully.",
      "success"
    );

    memberForm.reset();
    memberIdInput.value = "";

    memberFormCard.classList.add("hidden");

    await loadMembers();

  } catch (error) {
    console.error("Save member error:", error);

    showMessage(
      formMessage,
      "Could not save member: " + error.message,
      "error"
    );
  } finally {
    saveMemberButton.disabled = false;
    saveMemberButton.textContent = memberIdInput.value
      ? "UPDATE MEMBER"
      : "SAVE MEMBER";
  }
});

// ================= DELETE MEMBER =================

async function deleteMember(id) {
  const member = currentMembers.find(
    item => String(item.id) === String(id)
  );

  if (!member) return;

  const confirmed = window.confirm(
    `Are you sure you want to delete ${member.username} from I7?`
  );

  if (!confirmed) return;

  try {
    const { error } = await client
      .from("members")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    showMessage(
      dashboardMessage,
      `${member.username} deleted successfully.`,
      "success"
    );

    await loadMembers();

  } catch (error) {
    console.error("Delete member error:", error);

    showMessage(
      dashboardMessage,
      "Could not delete member: " + error.message,
      "error"
    );
  }
}

// ================= INITIALIZE =================

async function initializeAdmin() {
  try {
    const { data, error } = await client.auth.getSession();

    if (error) throw error;

    if (data.session) {
      await showDashboard(data.session.user);
    }

  } catch (error) {
    console.error("Admin initialization error:", error);

    showMessage(
      loginMessage,
      "Could not connect to Supabase. Please refresh.",
      "error"
    );
  }
}

initializeAdmin();

