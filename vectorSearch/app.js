// Centralized constants keep repeated values in one place so they are easy to
// update and easy to recognize when reading the file.
const SEARCH_API_ENDPOINT = "/api/search";
const MODELS_API_ENDPOINT = "/api/models";
const DEFAULT_REQUEST_TIMEOUT_MS = 15000;
const SELECTORS = {
  searchPanel: "#searchPanel",
  searchView: "#searchView",
  resultsView: "#resultsView",
  freeText: "#freeText",
  distanceInfoButton: "#distanceInfoButton",
  distanceInfoDialog: "#distanceInfoDialog",
  closeDistanceInfoButton: "#closeDistanceInfoButton",
  openModelPickerButton: "#openModelPickerButton",
  modelPickerDialog: "#modelPickerDialog",
  closeModelPickerButton: "#closeModelPickerButton",
  applyModelButton: "#applyModelButton",
  modelSelect: "#modelSelect",
  modelLoadStatus: "#modelLoadStatus",
  modelPickerStatus: "#modelPickerStatus",
  navButtons: "[data-nav-url]",
  submitButton: "#submitButton",
  restartButton: "#restartButton",
  resultsBody: "#resultsBody",
  statusMessage: "#statusMessage",
  resultsSummary: "#resultsSummary",
  quickPickLinks: "[data-query]"
};

const MESSAGES = {
  emptySearch: "Enter a search term.",
  searching: "Searching...",
  loadingModels: "Loading hosted models...",
  modelSelectedPrefix: "Using model: ",
  modelListUnavailablePrefix: "Model list unavailable. ",
  requestFailedPrefix: "Request failed. ",
  requestTimedOutPrefix: "Request timed out after ",
  requestTimedOutSuffix: " seconds."
};

const modelState = {
  defaultModelName: "",
  selectedModelName: "",
  items: [],
  isLoading: false
};

let previousActiveElement = null;
const elements = getElements();

initializeApp();

// Small helper for grabbing required DOM elements.
// Throwing here makes missing HTML wiring fail fast instead of causing a
// confusing "cannot read property ..." error later.
function selectElement(selector) {
  const element = document.querySelector(selector);

  if (!element) {
    throw new Error("Required element not found: " + selector);
  }

  return element;
}

function getElements() {
  const appRoot = document.querySelector(".app-desktop");

  if (!appRoot) {
    throw new Error("Required element not found: .app-desktop");
  }

  return {
    searchPanel: selectElement(SELECTORS.searchPanel),
    searchView: selectElement(SELECTORS.searchView),
    resultsView: selectElement(SELECTORS.resultsView),
    appRoot,
    freeText: selectElement(SELECTORS.freeText),
    distanceInfoButton: selectElement(SELECTORS.distanceInfoButton),
    distanceInfoDialog: selectElement(SELECTORS.distanceInfoDialog),
    closeDistanceInfoButton: selectElement(SELECTORS.closeDistanceInfoButton),
    openModelPickerButton: selectElement(SELECTORS.openModelPickerButton),
    modelPickerDialog: selectElement(SELECTORS.modelPickerDialog),
    closeModelPickerButton: selectElement(SELECTORS.closeModelPickerButton),
    applyModelButton: selectElement(SELECTORS.applyModelButton),
    modelSelect: selectElement(SELECTORS.modelSelect),
    modelLoadStatus: selectElement(SELECTORS.modelLoadStatus),
    modelPickerStatus: selectElement(SELECTORS.modelPickerStatus),
    navButtons: Array.from(document.querySelectorAll(SELECTORS.navButtons)),
    submitButton: selectElement(SELECTORS.submitButton),
    restartButton: selectElement(SELECTORS.restartButton),
    resultsBody: selectElement(SELECTORS.resultsBody),
    statusMessage: selectElement(SELECTORS.statusMessage),
    resultsSummary: selectElement(SELECTORS.resultsSummary),
    quickPickLinks: Array.from(document.querySelectorAll(SELECTORS.quickPickLinks))
  };
}

function initializeApp() {
  showSearchView();
  bindSearchFlow();
  bindQuickPickFlow();
  bindNavigationFlow();
  bindDialogFlow();
  bindModelPickerFlow();
  void loadAvailableModels();
}

function bindSearchFlow() {
  elements.searchView.addEventListener("submit", runSearch);
  elements.restartButton.addEventListener("click", restartSearch);
}

function bindQuickPickFlow() {
  elements.quickPickLinks.forEach((link) => {
    link.addEventListener("click", handleQuickPickClick);
  });
}

function bindNavigationFlow() {
  elements.navButtons.forEach((button) => {
    button.addEventListener("click", openNavDestination);
  });
}

function bindDialogFlow() {
  elements.distanceInfoButton.addEventListener("click", openDistanceInfoDialog);
  elements.closeDistanceInfoButton.addEventListener("click", closeDistanceInfoDialog);
  elements.distanceInfoDialog.addEventListener("click", handleDialogBackdropClick);
  elements.modelPickerDialog.addEventListener("click", handleDialogBackdropClick);
  document.addEventListener("keydown", handleDialogKeydown);
}

function bindModelPickerFlow() {
  elements.openModelPickerButton.addEventListener("click", openModelPickerDialog);
  elements.closeModelPickerButton.addEventListener("click", closeModelPickerDialog);
  elements.applyModelButton.addEventListener("click", applySelectedModel);
}

// Main form submit handler.
// This is where the browser validates input, calls the backend, and updates the
// screen based on success or failure.
async function runSearch(event) {
  event.preventDefault();

  const input = elements.freeText.value.trim();

  if (!input) {
    elements.statusMessage.textContent = MESSAGES.emptySearch;
    return;
  }

  elements.submitButton.disabled = true;
  elements.statusMessage.textContent = MESSAGES.searching;

  try {
    const searchResponse = await postSearch(buildSearchPayload(input));
    const rows = extractRows(searchResponse);
    showResultsView(rows, input, extractSelectedModelName(searchResponse));
  } catch (error) {
    elements.statusMessage.textContent = MESSAGES.requestFailedPrefix + error.message;
    setResultsSummary("Waiting for a search.");
  } finally {
    elements.submitButton.disabled = false;
  }
}

function restartSearch() {
  elements.freeText.value = "";
  elements.resultsBody.innerHTML = "";
  showSearchView("");
  elements.freeText.focus();
}

function handleQuickPickClick(event) {
  event.preventDefault();
  elements.freeText.value = event.currentTarget.dataset.query || "";
  showSearchView("");
  elements.freeText.focus();
}

function openNavDestination(event) {
  const button = event.currentTarget;
  const url = button.dataset.navUrl;
  const target = button.dataset.navTarget || "_self";

  if (!url) {
    return;
  }

  window.open(url, target, "noopener,noreferrer");
}

async function loadAvailableModels() {
  if (modelState.isLoading) {
    return;
  }

  modelState.isLoading = true;
  elements.openModelPickerButton.disabled = true;
  elements.modelLoadStatus.textContent = MESSAGES.loadingModels;
  elements.modelPickerStatus.textContent = MESSAGES.loadingModels;

  try {
    const response = await fetchAvailableModels();
    const items = extractModelRows(response);

    modelState.defaultModelName = extractDefaultModelName(response);
    modelState.items = items;
    modelState.selectedModelName = getInitialModelName(items);

    renderModelOptions();
    elements.modelLoadStatus.textContent = MESSAGES.modelSelectedPrefix + modelState.selectedModelName;
    elements.modelPickerStatus.textContent = "";
  } catch (error) {
    modelState.items = [];
    modelState.selectedModelName = modelState.defaultModelName || "";
    renderModelOptions();
    elements.modelLoadStatus.textContent =
      MESSAGES.modelListUnavailablePrefix + error.message;
    elements.modelPickerStatus.textContent =
      MESSAGES.modelListUnavailablePrefix + error.message;
  } finally {
    modelState.isLoading = false;
    elements.openModelPickerButton.disabled = false;
  }
}

async function openModelPickerDialog() {
  if (!modelState.items.length) {
    await loadAvailableModels();
  }

  if (!modelState.items.length) {
    return;
  }

  renderModelOptions();
  openDialog(elements.modelPickerDialog, elements.modelSelect);
}

function applySelectedModel() {
  if (!elements.modelSelect.value) {
    elements.modelPickerStatus.textContent = "Select a model before continuing.";
    return;
  }

  modelState.selectedModelName = elements.modelSelect.value;
  elements.modelLoadStatus.textContent =
    MESSAGES.modelSelectedPrefix + modelState.selectedModelName;
  elements.modelPickerStatus.textContent =
    "Selected model: " + modelState.selectedModelName;
  closeModelPickerDialog();
}

function openDistanceInfoDialog() {
  openDialog(elements.distanceInfoDialog, elements.closeDistanceInfoButton);
}

function closeDistanceInfoDialog() {
  closeDialog(elements.distanceInfoDialog, elements.distanceInfoButton);
}

function closeModelPickerDialog() {
  closeDialog(elements.modelPickerDialog, elements.openModelPickerButton);
}

function openDialog(dialog, focusTarget) {
  previousActiveElement = document.activeElement;
  dialog.hidden = false;
  elements.appRoot.inert = true;
  elements.appRoot.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "hidden";
  focusTarget.focus();
}

function closeDialog(dialog, fallbackElement) {
  dialog.hidden = true;

  if (!getActiveDialog()) {
    elements.appRoot.inert = false;
    elements.appRoot.removeAttribute("aria-hidden");
    document.body.style.overflow = "";
  }

  if (previousActiveElement instanceof HTMLElement) {
    previousActiveElement.focus();
    previousActiveElement = null;
    return;
  }

  fallbackElement.focus();
}

function handleDialogBackdropClick(event) {
  if (event.target !== event.currentTarget) {
    return;
  }

  if (event.currentTarget === elements.distanceInfoDialog) {
    closeDistanceInfoDialog();
    return;
  }

  if (event.currentTarget === elements.modelPickerDialog) {
    closeModelPickerDialog();
  }
}

function handleDialogKeydown(event) {
  const activeDialog = getActiveDialog();

  if (!activeDialog) {
    return;
  }

  if (event.key === "Escape") {
    if (activeDialog === elements.distanceInfoDialog) {
      closeDistanceInfoDialog();
      return;
    }

    closeModelPickerDialog();
    return;
  }

  trapDialogFocus(event, activeDialog);
}

// Show the initial search form and optionally display a status message below it.
function showSearchView(message = "") {
  elements.searchPanel.hidden = false;
  elements.resultsView.hidden = true;
  elements.statusMessage.textContent = message;
  setResultsSummary("Waiting for a search.");
}

// Swap to the results screen after a successful search.
// If the search succeeded but returned no rows, we stay on the search form and
// show a helpful message instead.
function showResultsView(rows, query, modelName) {
  if (!rows.length) {
    showSearchView("No results found.");
    return;
  }

  renderResultsTable(rows);
  elements.searchPanel.hidden = true;
  elements.resultsView.hidden = false;
  elements.statusMessage.textContent = "";
  setResultsSummary(
    rows.length + ' result(s) for "' + query + '" using "' + modelName + '".'
  );
}

function setResultsSummary(message) {
  elements.resultsSummary.textContent = message;
}

// Build the table body from scratch for the latest search results.
// Each row gets four cells: score, park name, description, and a link.
function renderResultsTable(rows) {
  elements.resultsBody.innerHTML = "";

  rows.forEach((row) => {
    const tr = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent =
      row.similarity === null ? "N/A" : row.similarity.toFixed(3);

    const nameCell = document.createElement("td");
    nameCell.textContent = row.name;

    const descriptionCell = document.createElement("td");
    const description = document.createElement("p");
    description.textContent = row.description;
    descriptionCell.appendChild(description);

    const urlCell = document.createElement("td");
    if (row.url) {
      const link = document.createElement("a");
      link.href = row.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "btn";
      link.textContent = "Visit site";
      link.setAttribute("aria-label", "Visit " + row.name + " website");
      urlCell.appendChild(link);
    } else {
      urlCell.textContent = "No URL returned.";
    }

    tr.append(numberCell, nameCell, descriptionCell, urlCell);
    elements.resultsBody.appendChild(tr);
  });
}

function renderModelOptions() {
  elements.modelSelect.innerHTML = "";

  modelState.items.forEach((model) => {
    const option = document.createElement("option");
    option.value = model.modelName;
    option.textContent = formatModelOptionLabel(model);

    if (model.modelName === modelState.selectedModelName) {
      option.selected = true;
    }

    elements.modelSelect.appendChild(option);
  });
}

function formatModelOptionLabel(model) {
  if (!model.algorithm) {
    return model.modelName;
  }

  return model.modelName + " (" + model.algorithm + ")";
}

function getInitialModelName(items) {
  const defaultModel = items.find((item) => item.modelName === modelState.defaultModelName);

  if (defaultModel) {
    return defaultModel.modelName;
  }

  if (items.length) {
    return items[0].modelName;
  }

  return modelState.defaultModelName || "";
}

function extractSelectedModelName(payload) {
  if (typeof payload?.modelName === "string" && payload.modelName.trim()) {
    return payload.modelName.trim();
  }

  return modelState.selectedModelName || modelState.defaultModelName || "default model";
}

function extractDefaultModelName(payload) {
  if (typeof payload?.defaultModelName === "string") {
    return payload.defaultModelName.trim();
  }

  return "";
}

function buildSearchPayload(text) {
  return {
    text,
    modelName: modelState.selectedModelName || undefined
  };
}

// Send the user's search text to the backend API.
// The browser does not talk to ORDS directly; it talks to this local Node
// server, which then handles authentication and search.
async function postSearch(payload) {
  const response = await fetchWithTimeout(SEARCH_API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const body = await readBody(response);

  if (!response.ok) {
    throw new Error(getProblemMessage(body));
  }

  return body;
}

async function fetchAvailableModels() {
  const response = await fetchWithTimeout(MODELS_API_ENDPOINT, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  const body = await readBody(response);

  if (!response.ok) {
    throw new Error(getProblemMessage(body));
  }

  return body;
}

// Wrap fetch() with an AbortController so the page does not hang forever if the
// network or backend becomes unresponsive.
async function fetchWithTimeout(url, options, timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        MESSAGES.requestTimedOutPrefix +
          Math.ceil(timeoutMs / 1000) +
          MESSAGES.requestTimedOutSuffix
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

// Responses are expected to use JSON, including `application/json+problem`
// error payloads.
async function readBody(response) {
  return response.json();
}

function getProblemMessage(problem) {
  return problem?.detail || problem?.title || JSON.stringify(problem, null, 2);
}

// The UI expects the backend to return an object with an `items` array.
// Validate that assumption here so downstream code can stay simple.
function extractRows(payload) {
  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  throw new Error("Search results not found in /api/search response.");
}

function extractModelRows(payload) {
  if (Array.isArray(payload?.items)) {
    return payload.items.filter(
      (item) => typeof item?.modelName === "string" && item.modelName
    );
  }

  throw new Error("Model list not found in /api/models response.");
}

function getActiveDialog() {
  if (!elements.modelPickerDialog.hidden) {
    return elements.modelPickerDialog;
  }

  if (!elements.distanceInfoDialog.hidden) {
    return elements.distanceInfoDialog;
  }

  return null;
}

function getDialogFocusableElements(dialog) {
  return Array.from(
    dialog.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

function trapDialogFocus(event, dialog) {
  if (event.key !== "Tab") {
    return;
  }

  const focusableElements = getDialogFocusableElements(dialog);

  if (!focusableElements.length) {
    event.preventDefault();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}
