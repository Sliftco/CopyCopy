function showInputForm() {
    document.getElementById("submitBtn").textContent = "Add Item"
    document.getElementById("submitBtn").onclick = addItem
    document.getElementById("modal").classList.remove("hidden")
    document.getElementById("inputTitle").focus()
}

// Add the event listener for the keyboard shortcut
document.addEventListener("keydown", (event) => {
    if (event.shiftKey && (event.ctrlKey || event.metaKey) && event.key === "i") {
        event.preventDefault() // Prevent the default behavior
        showInputForm()
    }
})

function cancel() {
    document.getElementById("inputTitle").value = ""
    document.getElementById("inputValue").value = ""
    document.getElementById("modal").classList.add("hidden")
}

// function addItem() {
//     const inputTitle = document.getElementById("inputTitle").value
//     const inputValue = document.getElementById("inputValue").value

//     if (inputValue) {
//         const newItem = document.createElement("div")
//         newItem.classList.add("grid-item")
//         newItem.innerHTML = `
// 		<h3>${inputTitle}</h3>
// 		<p>${inputValue}</p>
// 	  `

//         const copyButton = document.createElement("button")
//         copyButton.textContent = "Copy"
//         copyButton.classList.add("primary-bt", "copy-bt")
//         copyButton.addEventListener("click", () => {
//             copyToClipboard(inputValue)
//         })
//         newItem.appendChild(copyButton)
//         document.getElementById("grid").appendChild(newItem)
//     }

//     document.getElementById("inputTitle").value = ""
//     document.getElementById("inputValue").value = ""
//     document.getElementById("modal").classList.add("hidden")
// }

// Load items from localStorage when the page is loaded
window.addEventListener("DOMContentLoaded", loadItems)

function loadItems() {
    const storedItems = JSON.parse(localStorage.getItem("gridItems")) || []
    storedItems.forEach((item, index) => createItem(item.title, item.value, index))
}

function createItem(title, value, index) {
    const newItem = document.createElement("div")
    newItem.classList.add("grid-item")
    newItem.innerHTML = `
    <h3>${title}</h3>
    <p>${value}</p>
  `

    const copyButton = document.createElement("button")
    copyButton.textContent = "Copy"
    copyButton.classList.add("primary-bt", "copy-bt")
    copyButton.addEventListener("click", () => {
        copyToClipboard(value)
    })

    const editButton = document.createElement("button")
    editButton.textContent = "Edit"
    editButton.classList.add("primary-bt", "edit-bt")
    editButton.addEventListener("click", () => {
        editItem(index)
    })

    const deleteButton = document.createElement("button")
    deleteButton.innerHTML = `
  <svg class="delete-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
  </svg>`
    deleteButton.addEventListener("click", () => {
        deleteItem(index)
    })

    const cta = document.createElement("div")
    cta.classList.add("cta")
    cta.append(copyButton, editButton, deleteButton)

    newItem.appendChild(cta)
    document.getElementById("grid").appendChild(newItem)
}

function editItem(index) {
    const storedItems = JSON.parse(localStorage.getItem("gridItems")) || []
    const itemToEdit = storedItems[index]

    document.getElementById("inputTitle").value = itemToEdit.title
    document.getElementById("inputValue").value = itemToEdit.value
    document.getElementById("modal").classList.remove("hidden")
    document.getElementById("inputTitle").focus()

    document.getElementById("submitBtn").textContent = "Update" // Change the button text
    document.getElementById("submitBtn").onclick = () => {
        updateItem(index)
    }
}

function updateItem(index) {
    const updatedTitle = document.getElementById("inputTitle").value
    const updatedValue = document.getElementById("inputValue").value

    if (updatedTitle && updatedValue) {
        let storedItems = JSON.parse(localStorage.getItem("gridItems")) || []
        storedItems[index] = { title: updatedTitle, value: updatedValue }
        localStorage.setItem("gridItems", JSON.stringify(storedItems))

        document.getElementById("grid").innerHTML = ""
        storedItems.forEach((item, newIndex) => createItem(item.title, item.value, newIndex))
    }

    document.getElementById("inputTitle").value = ""
    document.getElementById("inputValue").value = ""
    document.getElementById("modal").classList.add("hidden")
    document.querySelector('button[onclick="updateItem(index)"]').onclick = () => {
        addItem()
    }
}

function deleteItem(index) {
    if (confirm("Do you really want to delete this item?")) {
        let storedItems = JSON.parse(localStorage.getItem("gridItems")) || []
        storedItems.splice(index, 1)
        localStorage.setItem("gridItems", JSON.stringify(storedItems))

        document.getElementById("grid").innerHTML = ""
        storedItems.forEach((item, newIndex) => createItem(item.title, item.value, newIndex))
    }
}

function addItem() {
    const inputTitle = document.getElementById("inputTitle").value
    const inputValue = document.getElementById("inputValue").value

    if (inputValue) {
        let gridItems = JSON.parse(localStorage.getItem("gridItems")) || []
        gridItems.push({ title: inputTitle, value: inputValue })
        localStorage.setItem("gridItems", JSON.stringify(gridItems))

        createItem(inputTitle, inputValue, gridItems.length - 1)
    }

    document.getElementById("inputTitle").value = ""
    document.getElementById("inputValue").value = ""
    document.getElementById("modal").classList.add("hidden")
}

function copyToClipboard(value) {
    navigator.clipboard
        .writeText(value)
        .then(() => {
            alert("Value copied to clipboard")
        })
        .catch((err) => {
            console.error("Error copying to clipboard:", err)
        })
}
