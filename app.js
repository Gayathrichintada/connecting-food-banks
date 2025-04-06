document.addEventListener("DOMContentLoaded", function () {
    const requestForm = document.getElementById("request-form");

    // Function to handle form submissions
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
                    if (response.ok) {
                        document.getElementById("responseMessage").innerText = result.message || "Submission Successful!";
                    } else {
                        document.getElementById("responseMessage").innerText = result.error || "Submission failed!";
                    }
                } catch (error) {
                    console.error("Error:", error);
                    document.getElementById("responseMessage").innerText = "Submission failed: Network error!";
                }
            });
        }
    }

    // Apply the function to each form
    handleFormSubmit("foodBankForm", "http://localhost:3001/foodbank/register");
    handleFormSubmit("donorForm", "http://localhost:3001/donor/register");
    handleFormSubmit("userForm", "http://localhost:3001/user/register");

    // Handle request form submission
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
                if (response.ok) {
                    alert("Request added successfully!");
                } else {
                    alert("Failed to add request: " + (result.error || "Unknown error"));
                }
            } catch (error) {
                console.error("Error adding request:", error);
                alert("Failed to add request: Network error!");
            }
        });
    }
        // Handle donation form submission
        const donationForm = document.getElementById("donation-form");

        if (donationForm) {
            donationForm.addEventListener("submit", async function (event) {
                event.preventDefault();
    
                const donorId = localStorage.getItem("userId"); // get logged-in userId
    
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
                    if (response.ok) {
                        alert("Donation successful!");
                    } else {
                        alert("Failed to donate: " + (result.error || "Unknown error"));
                    }
                } catch (error) {
                    console.error("Error donating:", error);
                    alert("Network error while donating.");
                }
            });
        }
    

    // Function to fetch and display requests
    function fetchRequests() {
        fetch("http://localhost:3001/requests")
            .then(response => response.json())
            .then(data => {
                console.log("Requests data:", data);
                displayRequests(data);
            })
            .catch(error => {
                console.error("Error fetching requests:", error);
            });
    }

    // Function to display requests in the frontend
    function displayRequests(requests) {
        console.log("Requests to display:", requests);
        const container = document.getElementById("requests-container");
        container.innerHTML = "";

        if (requests.length === 0) {
            container.textContent = "No requests found.";
            return;
        }

        const list = document.createElement("ul");
        requests.forEach(request => {
            const item = document.createElement("li");
            item.textContent = `User ID: ${request.user_id}, Food Item: ${request.food_item}`;
            list.appendChild(item);
        });

        container.appendChild(list);
    }

    // Fetch requests on page load (or when a button is clicked, etc.)
    fetchRequests();
    fetchAvailableDonations();

    // Example: Fetch requests on button click
    const fetchButton = document.getElementById("fetch-requests-button");
    if (fetchButton) {
        fetchButton.addEventListener("click", fetchRequests);
    }
    const fetchDonationsButton = document.getElementById("fetch-donations-button");
    if (fetchDonationsButton) {
        fetchDonationsButton.addEventListener("click", fetchAvailableDonations);
    }

});