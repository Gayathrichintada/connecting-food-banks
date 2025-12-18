document.addEventListener("DOMContentLoaded", function () {
    const requestForm = document.getElementById("request-form");
    const donationForm = document.getElementById("donation-form");

    // Universal form submission handler
    function handleFormSubmit(formId, apiUrl) {
        const form = document.getElementById(formId);

        if (form) {
            form.addEventListener("submit", async function (event) {
                event.preventDefault();

                const formData = {};
                const inputElements = form.querySelectorAll("input, textarea");
                inputElements.forEach(input => {
                    formData[input.name] = input.value;
                });

                try {
                    const response = await fetch(apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(formData),
                    });

                    const result = await response.json();
                    const messageEl = document.getElementById("responseMessage");
                    if (response.ok) {
                        if (messageEl) messageEl.innerText = result.message || "Submission Successful!";
                    } else {
                        if (messageEl) messageEl.innerText = result.error || "Submission failed!";
                    }
                } catch (error) {
                    console.error("Error:", error);
                    const messageEl = document.getElementById("responseMessage");
                    if (messageEl) messageEl.innerText = "Submission failed: Network error!";
                }
            });
        }
    }

    handleFormSubmit("foodBankForm", "http://localhost:3001/foodbank/register");
    handleFormSubmit("donorForm", "http://localhost:3001/donor/register");
    handleFormSubmit("userForm", "http://localhost:3001/user/register");

    // User request form
    if (requestForm) {
        requestForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = {
                user_id: document.getElementById("user_id").value,
                food_item: document.getElementById("food_item").value,
            };

            try {
                const response = await fetch("http://localhost:3001/request", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                alert(response.ok ? "Request added successfully!" : `Failed to add request: ${result.error || "Unknown error"}`);
            } catch (error) {
                console.error("Error adding request:", error);
                alert("Failed to add request: Network error!");
            }
        });
    }

    // Donation form
    if (donationForm) {
        donationForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const donorId = localStorage.getItem("userId");
            if (!donorId) {
                alert("Please log in first.");
                return;
            }

            const formData = {
                donor_id: donorId,
                food_item: document.getElementById("donation_food_item").value,
                quantity: document.getElementById("donation_quantity").value,
            };

            try {
                const response = await fetch("http://localhost:3001/donate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                alert(response.ok ? "Donation successful!" : `Failed to donate: ${result.error || "Unknown error"}`);
            } catch (error) {
                console.error("Error donating:", error);
                alert("Network error while donating.");
            }
        });
    }

    // Fetch and display requests
    function fetchRequests() {
        fetch("http://localhost:3001/requests")
            .then(res => res.json())
            .then(data => {
                const container = document.querySelector(".requests-list") || document.getElementById("requests-container");
                if (!container) return;
                container.innerHTML = "";

                if (data.length === 0) {
                    container.textContent = "No requests found.";
                    return;
                }

                const list = document.createElement("ul");
                data.forEach(req => {
                    const li = document.createElement("li");
                    li.textContent = `User ID: ${req.user_id}, Food Item: ${req.food_item}`;
                    list.appendChild(li);
                });
                container.appendChild(list);
            })
            .catch(error => {
                console.error("Error fetching requests:", error);
            });
    }

    // Fetch and display donations
    function fetchDonations() {
        fetch("http://localhost:3000/donations")
            .then(res => res.json())
            .then(data => {
                const container = document.querySelector(".donations-list") || document.getElementById("donations-container");
                if (!container) return;
                container.innerHTML = "";

                if (data.length === 0) {
                    container.textContent = "No donations found.";
                    return;
                }

                const list = document.createElement("ul");
                data.forEach(donation => {
                    const li = document.createElement("li");
                    li.textContent = `Donor ID: ${donation.donor_id}, Food Item: ${donation.food_item}, Quantity: ${donation.quantity}`;
                    list.appendChild(li);
                });
                container.appendChild(list);
            })
            .catch(error => {
                console.error("Error fetching donations:", error);
            });
    }

    // Bind buttons to fetch functions
    const fetchRequestBtn = document.getElementById("fetch-requests-button");
    const refreshRequestBtn = document.getElementById("refreshRequests");
    const fetchDonationsBtn = document.getElementById("fetch-donations-button");
    const refreshDonationsBtn = document.getElementById("refreshDonations");

    if (fetchRequestBtn) fetchRequestBtn.addEventListener("click", fetchRequests);
    if (refreshRequestBtn) refreshRequestBtn.addEventListener("click", fetchRequests);
    if (fetchDonationsBtn) fetchDonationsBtn.addEventListener("click", fetchDonations);
    if (refreshDonationsBtn) refreshDonationsBtn.addEventListener("click", fetchDonations);

    // Initial data load
    fetchRequests();
    fetchDonations();
     function notify(msg) {
        alert(msg);
    }
});
