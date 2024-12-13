// Store all passwords in a global variable to filter later
let allPasswords = [];

// Function to fetch and display the number of passwords
function fetchPasswords() {
    axios.get("https://crudcrud.com/api/2606a649ad8b42efb8ef61a48a7af0a6/passwords")
        .then(response => {
            allPasswords = response.data; // Store the fetched passwords

            const totalPasswords = allPasswords.length;

            // Update the text content of the paragraph with the total count
            const para = document.getElementById('count');
            para.textContent = `Total passwords: ${totalPasswords}`;  // Update the count text

            // Clear the current list before adding new data
            const ul = document.querySelector("#show ul");
            ul.innerHTML = ''; // Clear the list before adding new items

            // Add each password to the list
            allPasswords.forEach(password => {
                addPasswordToList(password);
            });
        })
        .catch(error => {
            console.error("Error fetching passwords:", error);
        });
}

// Fetch passwords when the page loads
window.onload = function() {
    fetchPasswords();

    // Add event listener to search input
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', handleSearch);
};

// Function to add a password to the list with Edit and Delete buttons
function addPasswordToList(passwordData) {
    const ul = document.querySelector("#show ul"); // Get the <ul> element
    const li = document.createElement("li"); // Create a new <li> element
    li.id = passwordData._id; // Use the password's unique ID to identify the li

    // Create the text content
    const passwordInfo = document.createElement('span');
    passwordInfo.textContent = `${passwordData.title}   ${passwordData.password} `;

    // Create Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = "delete"; 
    deleteBtn.onclick = function () {
        deletePassword(passwordData._id);
    };

    // Create Edit button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = "edit"; 

    editBtn.onclick = function () {
        editPassword(passwordData);
    };

    // Append elements to <li>
    li.appendChild(passwordInfo);
    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    // Append <li> to <ul>
    ul.appendChild(li);
}

// Function to delete a password from the list and the server
function deletePassword(passwordId) {
    axios.delete(`https://crudcrud.com/api/2606a649ad8b42efb8ef61a48a7af0a6/passwords/${passwordId}`)
        .then(response => {
            console.log("Password deleted:", response.data);
            // Remove the password from the list in the UI
            const li = document.getElementById(passwordId);
            li.remove();
            // Update the total password count
            fetchPasswords();
        })
        .catch(error => {
            console.error("Error deleting password:", error);
        });
}

// Function to edit a password
function editPassword(passwordData) {
    // Populate the input fields with current user details
    document.getElementById('title').value = passwordData.title;
    document.getElementById('password').value = passwordData.password;

    // Store the user's unique id for later use when submitting
    // document.getElementById('passwordForm').dataset.id = passwordData._id;
    axios.delete(`https://crudcrud.com/api/2606a649ad8b42efb8ef61a48a7af0a6/passwords/${passwordData._id}`)
        .then(() => {
            const li = document.getElementById(passwordData._id);
            li.remove();
            // Update the total password count
            fetchPasswords();
        })
        .catch((error) => console.log(error));
}

// Handle form submission (Edit or Add new password)
function handleOnSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('passwordForm');  // Reference the form element

    const title = document.getElementById('title').value;
    const password = document.getElementById('password').value;

    const passwordData = {
        title: title,
        password: password
    };

    axios.post("https://crudcrud.com/api/2606a649ad8b42efb8ef61a48a7af0a6/passwords", passwordData)
        .then(response => {
            console.log("Password added:", response.data);
            addPasswordToList(response.data); // Add new password to the list
            fetchPasswords(); // Re-fetch passwords to update total count
        })
        .catch(error => {
            console.error("Error adding password:", error);
        });
        document.getElementById('title').value="";
        document.getElementById('password').value="";
}

// Function to handle search input
function handleSearch(event) {
    const searchQuery = event.target.value.toLowerCase(); // Get the search query in lowercase
    const filteredPasswords = allPasswords.filter(password => {
        return password.title.toLowerCase().includes(searchQuery); // Filter based on title
    });

    // Clear the current list and display only the filtered passwords
    const ul = document.querySelector("#show ul");
    ul.innerHTML = '';

    filteredPasswords.forEach(password => {
        addPasswordToList(password); // Add each matching password to the list
    });
}
