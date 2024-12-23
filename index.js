
window.onload = function() {
    fetchPasswords();
};

let allPasswords = [];

function fetchPasswords() {
    axios.get("https://crudcrud.com/api/a0502528b8f14a63b7be90ce04287835/passwords")
        .then(response => {
            allPasswords = response.data; 

            const totalPasswords = allPasswords.length;

            const para = document.getElementById('count');
            para.innerHTML = `Total passwords: ${totalPasswords}`;  

            const ul = document.querySelector("#show ul");
            ul.innerHTML = ''; 
            allPasswords.forEach(password => {
                addPasswordToList(password);
            });
        })
        .catch(error => {
            console.error("Error fetching passwords:", error);
        });
}



function addPasswordToList(passwordData) {
    const ul = document.querySelector("#show ul"); 
    const li = document.createElement("li"); 
    li.id = passwordData._id; 

    li.textContent = `${passwordData.title}-  ${passwordData.password} `;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.className = "delete"; 
    deleteBtn.onclick = function () {
        deletePassword(passwordData._id);
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.className = "edit"; 

    editBtn.onclick = function () {
        editPassword(passwordData);
    };

    li.appendChild(deleteBtn);
    li.appendChild(editBtn);

    ul.appendChild(li);
}

function deletePassword(passwordId) {
    axios.delete(`https://crudcrud.com/api/a0502528b8f14a63b7be90ce04287835/passwords/${passwordId}`)
        .then(response => {
            console.log("Password deleted:", response.data);
            const li = document.getElementById(passwordId);
            li.remove();
            fetchPasswords();
        })
        .catch(error => {
            console.error("Error deleting password:", error);
        });
}

function editPassword(passwordData) {
    document.getElementById('title').value = passwordData.title;
    document.getElementById('password').value = passwordData.password;

    axios.delete(`https://crudcrud.com/api/a0502528b8f14a63b7be90ce04287835/passwords/${passwordData._id}`)
        .then(() => {
            const li = document.getElementById(passwordData._id);
            li.remove();
            fetchPasswords();
        })
        .catch((error) => console.log(error));
}

function handleOnSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const password = document.getElementById('password').value;

    const passwordData = {
        title: title,
        password: password
    };

    axios.post("https://crudcrud.com/api/a0502528b8f14a63b7be90ce04287835/passwords", passwordData)
        .then(response => {
            console.log("Password added:", response.data);
            addPasswordToList(response.data); 
            fetchPasswords(); 
        })
        .catch(error => {
            console.error("Error adding password:", error);
        });
        document.getElementById('title').value="";
        document.getElementById('password').value="";
}

function handleSearch(event) {
    const searchQuery = event.target.value.toLowerCase(); 
    const filteredPasswords = allPasswords.filter(password => {
        return password.title.toLowerCase().includes(searchQuery); 
    });

    const ul = document.querySelector("#show ul");
    ul.innerHTML = '';

    filteredPasswords.forEach(password => {
        addPasswordToList(password); 
    });
}
