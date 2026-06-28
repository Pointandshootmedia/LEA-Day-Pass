const CONFIG = {
  submissionEndpoint: "https://script.google.com/macros/s/AKfycbyDch5785lqyh1m71dCwPZNZlvbl8SIYxg1RJdSLQSSJRmaXKTQjX6BeboavDbGM4cojg/exec",
  businessName: "Lake Erie Arms",
};

const form = document.querySelector("#dayPassForm");
const formView = document.querySelector("#formView");
const passView = document.querySelector("#passView");
const formError = document.querySelector("#formError");
const passGuest = document.querySelector("#passGuest");
const passDate = document.querySelector("#passDate");
const passNumber = document.querySelector("#passNumber");
const passAccess = document.querySelector("#passAccess");
const savePassButton = document.querySelector("#savePassButton");

function getToday() {
  return new Date();
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function dateStamp(date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");
}

function makePassNumber(date) {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `LEA-${dateStamp(date)}-${randomPart}`;
}

function formDataToObject(formElement) {
  const values = Object.fromEntries(new FormData(formElement).entries());
  values.restaurantOnlyAcknowledged =
    formElement.restaurantOnlyAcknowledged.checked;
  values.marketingConsent = formElement.marketingConsent.checked;
  return values;
}

async function submitLead(payload) {
  if (!CONFIG.submissionEndpoint) {
    const existing = JSON.parse(localStorage.getItem("leaDayPassLeads") || "[]");
    existing.push(payload);
    localStorage.setItem("leaDayPassLeads", JSON.stringify(existing));
    return;
  }

  await fetch(CONFIG.submissionEndpoint, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });
}

function showPass(payload) {
  passGuest.textContent = `${payload.firstName} ${payload.lastName}`;
  passDate.textContent = formatDate(new Date(payload.createdAt));
  passNumber.textContent = payload.passNumber;
  passAccess.textContent = payload.visitType;

  formView.hidden = true;
  passView.hidden = false;
  document.body.classList.add("showing-pass");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.hidden = true;

  const submitButton = form.querySelector("button[type='submit']");
  submitButton.disabled = true;
  submitButton.textContent = "Creating Pass...";

  const now = getToday();
  const passId = makePassNumber(now);
  const payload = {
    ...formDataToObject(form),
    businessName: CONFIG.businessName,
    passNumber: passId,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
      .toISOString(),
  };

  try {
    await submitLead(payload);
    showPass(payload);
  } catch (error) {
    formError.textContent =
      "The pass could not be created. Please ask staff for assistance.";
    formError.hidden = false;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Create Day Pass";
  }
});

savePassButton.addEventListener("click", () => {
  window.print();
});
