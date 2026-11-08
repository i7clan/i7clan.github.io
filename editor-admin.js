
/* =====================================================
   I7 CLAN — WEBSITE EDITOR
   Homepage + Members Page
===================================================== */

(() => {
  "use strict";

  let records = [];
  let editingId = null;
  let selectedPage = "index";
  let initialized = false;

  const style = document.createElement("style");

  style.textContent = `
    .site-editor-card {
      background: #111;
      border: 1px solid #292929;
      border-radius: 14px;
      padding: 27px;
      margin-bottom: 24px;
    }

    .editor-toolbar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
      margin-bottom: 22px;
    }

    .editor-toolbar select {
      max-width: 260px;
    }

    .editor-list {
      display: grid;
      gap: 12px;
      margin-bottom: 25px;
    }

    .editor-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 15px;
      background: #090909;
      border: 1px solid #292929;
      border-radius: 9px;
    }

    .editor-item-info {
      min-width: 0;
    }

    .editor-item-info strong {
      display: block;
      overflow-wrap: anywhere;
    }

    .editor-item-info small {
      color: #858585;
    }

    .editor-item-actions {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .editor-action {
      padding: 8px 10px;
      border: 1px solid #333;
      border-radius: 6px;
      background: transparent;
      color: white;
      font-size: 10px;
      font-weight: 800;
    }

    .editor-action:hover {
      border-color: #ff304f;
      color: #ff304f;
    }

    .editor-action.danger {
      color: #ff647b;
    }

    .editor-form {
      padding: 20px;
      background: #090909;
      border: 1px solid #292929;
      border-radius: 10px;
    }

    .editor-form textarea {
      width: 100%;
      min-height: 110px;
      resize: vertical;
      padding: 13px;
      background: #090909;
      color: white;
      border: 1px solid #292929;
      border-radius: 9px;
      font: inherit;
      font-size: 13px;
    }

    .editor-form textarea:focus {
      outline: none;
      border-color: #ff304f;
    }

    .editor-form .form-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 20px;
    }

    .editor-help {
      color: #858585;
      font-size: 12px;
      margin: 10px 0 20px;
    }

    .editor-status {
      min-height: 20px;
      margin-top: 12px;
      font-size: 12px;
    }

    .editor-status.success {
      color: #35e87a;
    }

    .editor-status.error {
      color: #ff647b;
    }

    @media(max-width: 600px) {
      .site-editor-card {
        padding: 17px;
      }

      .editor-item {
        align-items: flex-start;
        flex-direction: column;
      }

      .editor-toolbar select {
        max-width: none;
      }
    }
  `;

  document.head.appendChild(style);

  function createEditor() {
    if (initialized) return;

    const dashboard = document.getElementById("dashboardScreen");
    const stats = dashboard?.querySelector(".stats-grid");

    if (!dashboard || !stats) return;

    const card = document.createElement("section");

    card.className = "site-editor-card";
    card.id = "siteEditorCard";

    card.innerHTML = `
      <div class="section-heading">
        <div>
          <p class="eyebrow">WEBSITE CONTROL</p>
          <h2>Website Editor</h2>
          <p class="muted">
            Manage content on your homepage and members page.
          </p>
        </div>
      </div>

      <div class="editor-toolbar">
        <select id="editorPage">
          <option value="index">Homepage — index.html</option>
          <option value="member">Members — member.html</option>
        </select>

        <button
          type="button"
          class="primary-button"
          id="editorAddButton"
        >
          + ADD SECTION
        </button>
      </div>

      <p class="editor-help">
        Create text or call-to-action sections. You can edit,
        hide, reorder or delete them.
      </p>

      <div id="editorList" class="editor-list">
        Loading website content...
      </div>

      <form id="editorForm" class="editor-form hidden">
        <h3 id="editorFormTitle">Add Section</h3>

        <label for="editorTitle">Section heading</label>
        <input
          id="editorTitle"
          maxlength="120"
          required
          placeholder="Enter heading"
        >

        <label for="editorBody">Section description</label>
        <textarea
          id="editorBody"
          maxlength="3000"
          placeholder="Enter section description"
        ></textarea>

        <label for="editorType">Section style</label>
        <select id="editorType">
          <option value="text">Text Section</option>
          <option value="cta">Call To Action</option>
        </select>

        <label for="editorButtonText">Button text (optional)</label>
        <input
          id="editorButtonText"
          maxlength="60"
          placeholder="e.g. JOIN I7"
        >

        <label for="editorButtonUrl">Button link (optional)</label>
        <input
          id="editorButtonUrl"
          maxlength="500"
          placeholder="e.g. index.html#recruitment"
        >

        <div class="form-actions">
          <button
            type="submit"
            class="primary-button"
            id="editorSaveButton"
          >
            SAVE SECTION
          </button>

          <button
            type="button"
            class="secondary-button"
            id="editorCancelButton"
          >
            CANCEL
          </button>
        </div>

        <p id="editorStatus" class="editor-status"></p>
      </form>
    `;

    stats.insertAdjacentElement("afterend", card);

    initialized = true;

    document
      .getElementById("editorPage")
      .addEventListener("change", event => {
        selectedPage = event.target.value;
        resetForm();
        loadContent();
      });

    document
      .getElementById("editorAddButton")
      .addEventListener("click", () => {
        resetForm();

        document
          .getElementById("editorForm")
          .classList.remove("hidden");

        document.getElementById("editorFormTitle").textContent =
          "Add New Section";

        document.getElementById("editorTitle").focus();
      });

    document
      .getElementById("editorCancelButton")
      .addEventListener("click", resetForm);

    document
      .getElementById("editorForm")
      .addEventListener("submit", saveContent);

    loadContent();
  }

  function setStatus(message, type = "") {
    const element = document.getElementById("editorStatus");

    if (!element) return;

    element.textContent = message;
    element.className = "editor-status";

    if (type) {
      element.classList.add(type);
    }
  }

  function resetForm() {
    editingId = null;

    const form = document.getElementById("editorForm");

    if (!form) return;

    form.reset();
    form.classList.add("hidden");

    document.getElementById("editorFormTitle").textContent =
      "Add Section";

    document.getElementById("editorSaveButton").textContent =
      "SAVE SECTION";

    setStatus("");
  }

  async function loadContent() {
    const list = document.getElementById("editorList");

    if (!list) return;

    list.textContent = "Loading sections...";

    const { data, error } = await client
      .from("site_content")
      .select("*")
      .eq("page_key", selectedPage)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
      list.textContent = "Could not load website content: " + error.message;
      return;
    }

    records = data || [];

    renderList();
  }

  function renderList() {
    const list = document.getElementById("editorList");

    list.replaceChildren();

    if (!records.length) {
      list.textContent =
        "No custom sections yet. Click ADD SECTION to create one.";

      return;
    }

    records.forEach((record, index) => {
      const item = document.createElement("div");
      item.className = "editor-item";

      const info = document.createElement("div");
      info.className = "editor-item-info";

      const title = document.createElement("strong");
      title.textContent = record.title || "Untitled section";

      const details = document.createElement("small");

      details.textContent =
        `${record.section_type.toUpperCase()} • ` +
        `${record.is_visible ? "VISIBLE" : "HIDDEN"}`;

      info.append(title, details);

      const actions = document.createElement("div");
      actions.className = "editor-item-actions";

      function makeButton(label, callback, extraClass = "") {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "editor-action " + extraClass;
        button.textContent = label;
        button.addEventListener("click", callback);

        return button;
      }

      actions.append(
        makeButton("EDIT", () => editRecord(record)),
        makeButton(
          record.is_visible ? "HIDE" : "SHOW",
          () => toggleVisibility(record)
        ),
        makeButton(
          "↑",
          () => moveRecord(index, -1)
        ),
        makeButton(
          "↓",
          () => moveRecord(index, 1)
        ),
        makeButton(
          "DELETE",
          () => deleteRecord(record),
          "danger"
        )
      );

      item.append(info, actions);
      list.appendChild(item);
    });
  }

  function editRecord(record) {
    editingId = record.id;

    document.getElementById("editorTitle").value =
      record.title || "";

    document.getElementById("editorBody").value =
      record.body || "";

    document.getElementById("editorType").value =
      record.section_type || "text";

    document.getElementById("editorButtonText").value =
      record.button_text || "";

    document.getElementById("editorButtonUrl").value =
      record.button_url || "";

    document.getElementById("editorFormTitle").textContent =
      "Edit Section";

    document.getElementById("editorSaveButton").textContent =
      "UPDATE SECTION";

    document.getElementById("editorForm").classList.remove("hidden");

    setStatus("");

    document.getElementById("editorForm").scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }

  function safeButtonUrl(value) {
    if (!value) return true;

    const trimmed = value.trim();

    if (
      trimmed.startsWith("#") ||
      trimmed.startsWith("/") ||
      trimmed.startsWith("./") ||
      trimmed.startsWith("../")
    ) {
      return true;
    }

    try {
      const url = new URL(trimmed);

      return (
        url.protocol === "https:" &&
        (
          url.hostname === "roblox.com" ||
          url.hostname === "www.roblox.com" ||
          url.hostname === "discord.gg" ||
          url.hostname === "youtube.com" ||
          url.hostname === "www.youtube.com" ||
          url.hostname === "instagram.com" ||
          url.hostname === "www.instagram.com"
        )
      );
    } catch {
      return false;
    }
  }

  async function saveContent(event) {
    event.preventDefault();

    const title = document.getElementById("editorTitle").value.trim();
    const body = document.getElementById("editorBody").value.trim();
    const buttonText =
      document.getElementById("editorButtonText").value.trim();
    const buttonUrl =
      document.getElementById("editorButtonUrl").value.trim();

    if (!title) {
      setStatus("Please enter a section heading.", "error");
      return;
    }

    if (!safeButtonUrl(buttonUrl)) {
      setStatus("Use a valid HTTPS link or a page anchor.", "error");
      return;
    }

    const key = editingId
      ? records.find(item => item.id === editingId)?.section_key
      : `custom-${Date.now()}`;

    const existing = records.find(item => item.id === editingId);

    const payload = {
      page_key: selectedPage,
      section_key: key,
      section_type: document.getElementById("editorType").value,
      title,
      body,
      button_text: buttonText,
      button_url: buttonUrl,
      sort_order: existing
        ? existing.sort_order
        : records.length * 10,
      is_visible: existing
        ? existing.is_visible
        : true,
      is_custom: true,
      updated_at: new Date().toISOString()
    };

    const saveButton = document.getElementById("editorSaveButton");

    saveButton.disabled = true;
    saveButton.textContent = "SAVING...";

    try {
      let result;

      if (editingId) {
        result = await client
          .from("site_content")
          .update(payload)
          .eq("id", editingId);
      } else {
        result = await client
          .from("site_content")
          .insert(payload);
      }

      if (result.error) throw result.error;

      resetForm();
      await loadContent();

    } catch (error) {
      console.error("Website content save error:", error);
      setStatus("Could not save: " + error.message, "error");
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = editingId
        ? "UPDATE SECTION"
        : "SAVE SECTION";
    }
  }

  async function toggleVisibility(record) {
    const { error } = await client
      .from("site_content")
      .update({
        is_visible: !record.is_visible,
        updated_at: new Date().toISOString()
      })
      .eq("id", record.id);

    if (error) {
      alert("Could not update visibility: " + error.message);
      return;
    }

    await loadContent();
  }

  async function deleteRecord(record) {
    if (!record.is_custom) {
      alert("This section is protected.");
      return;
    }

    if (!window.confirm(`Delete "${record.title}" permanently?`)) {
      return;
    }

    const { error } = await client
      .from("site_content")
      .delete()
      .eq("id", record.id);

    if (error) {
      alert("Could not delete section: " + error.message);
      return;
    }

    await loadContent();
  }

  async function moveRecord(index, direction) {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= records.length) return;

    const first = records[index];
    const second = records[targetIndex];

    const firstOrder = first.sort_order;
    const secondOrder = second.sort_order;

    const firstUpdate = await client
      .from("site_content")
      .update({
        sort_order: secondOrder,
        updated_at: new Date().toISOString()
      })
      .eq("id", first.id);

    if (firstUpdate.error) {
      alert(firstUpdate.error.message);
      return;
    }

    const secondUpdate = await client
      .from("site_content")
      .update({
        sort_order: firstOrder,
        updated_at: new Date().toISOString()
      })
      .eq("id", second.id);

    if (secondUpdate.error) {
      alert(secondUpdate.error.message);
      return;
    }

    await loadContent();
  }

  async function checkOwnerAndInitialize(session) {
    if (!session?.user || session.user.id !== OWNER_UID) return;

    const { data, error } = await client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", session.user.id)
      .maybeSingle();

    if (error || !data) return;

    createEditor();
  }

  client.auth.getSession().then(({ data }) => {
    checkOwnerAndInitialize(data.session);
  });

  client.auth.onAuthStateChange((_event, session) => {
    if (session) {
      setTimeout(() => checkOwnerAndInitialize(session), 0);
    }
  });

})();

