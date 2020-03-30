// General Variables
const myLibrary = [];
let bookID = 0;
const table = document.getElementById("library-table")
const bookForm = document.getElementById("book-form")


// Book Constructor
class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read ? "Yes" : "No";
        this.bookID = bookID;
        Book.addBookToLibrary(this)
    }

    static addBookToLibrary(book) {
        myLibrary.push(book)
        bookID += 1
    }
}


// Adds Books to Table
function addBooktoTable(book) {
    let newRow = document.createElement("tr");
    Object.keys(book).forEach(e => {
        let column = document.createElement("td");
        column.textContent = book[e];
        column.setAttribute("class", `${e}`)
        newRow.appendChild(column);
    });
    newRow.removeChild(newRow.lastElementChild);
    newRow.appendChild(addRemoveButton());
    table.appendChild(newRow);

    function addRemoveButton() {
        let removeButton = document.createElement("button");
        removeButton.setAttribute("data-id", bookID);
        removeButton.setAttribute("class", "removeButton");
        let buttonContainer = document.createElement("td");
        buttonContainer.appendChild(removeButton)
        return buttonContainer;
    }
}


// This should render pre-existing libraries, but they don't exist at the moment
(function render() {
    myLibrary.forEach(e => {
        addBooktoTable(e)
    })
})()


// Removes the "Empty Library" message when adding a book
function removeEmptyMessage() {
    if (myLibrary.length > 0) {
        document.getElementById("empty-library").style.display = "none";
    } else {
        document.getElementById("empty-library").style.display = "flex";
    }
}


// The following functions are related to the Statistics section of the website
function stats() {
    (function statsTotal() {
        document.getElementById("total-books").lastChild.textContent = myLibrary.length;
    })();

    (function statsRead() {
        let booksRead = 0
        if (myLibrary.length > 0) {
            for (element of myLibrary) {
                if (element.read == "Yes") {
                    booksRead++
                }
            }
            document.getElementById("read-books").lastChild.textContent = `${Math.round(booksRead / myLibrary.length * 100)}% (${booksRead}/${myLibrary.length})`
        } else {
            document.getElementById("read-books").lastChild.textContent = 0
        }
    })();

    (function statsTotalPages() {
        let totalPages = 0;
        for (element of myLibrary) {
            totalPages += parseInt(element.pages)
        }
        document.getElementById("total-pages").lastChild.textContent = totalPages
    })();

    (function statsPagesAverage() {
        let totalPages = 0;
        if (myLibrary.length > 0) {
            for (element of myLibrary) {
                totalPages += parseInt(element.pages)
            }
            document.getElementById("average-pages").lastChild.textContent = Math.round(totalPages / myLibrary.length)
        } else {
            document.getElementById("average-pages").lastChild.textContent = 0
        }
    })();

    (function statsLongest() {
        if (myLibrary.length > 0) {
            sorted = JSON.parse(JSON.stringify(myLibrary))
            sorted.sort(function (a, b) {
                if (parseInt(a.pages) > parseInt(b.pages)) {
                    return -1;
                } else {
                    return 1
                }
            })
            document.getElementById("longest-book").lastChild.textContent = sorted[0].title
        } else {
            document.getElementById("longest-book").lastChild.textContent = "There are no books in your library"
        }
    })();

    (function statsShortest() {
        if (myLibrary.length > 0) {
            sorted = JSON.parse(JSON.stringify(myLibrary))
            sorted.sort(function (a, b) {
                if (parseInt(a.pages) > parseInt(b.pages)) {
                    return 1;
                } else {
                    return -1
                }
            })
            document.getElementById("shortest-book").lastChild.textContent = sorted[0].title
        } else {
            document.getElementById("shortest-book").lastChild.textContent = "There are no books in your library"
        }
    })();

    (function statsTotalAuthors() {
        let uniqueAuthors = [];
        if (myLibrary.length > 0) {
            let authors = [];
            for (element of myLibrary) {
                authors.push(element.author)
            }
            uniqueAuthors = [...new Set(authors)];
        } document.getElementById("total-authors").lastChild.textContent = uniqueAuthors.length
    })();


    (function statsPreferredAuthor() {
        let authors = []
        if (myLibrary.length > 0) {
            for (element of myLibrary) {
                authors.push(element.author)
            }
            let counts = authors.reduce((a, author) => {
                a[author] = (a[author] || 0) + 1;
                return a;
            }, {});
            let maxCount = Math.max(...Object.values(counts));
            let mostFrequent = Object.keys(counts).filter(k => counts[k] === maxCount);
            document.getElementById("preferred-author").lastChild.textContent = mostFrequent
        } else {
            document.getElementById("preferred-author").lastChild.textContent = "There are no books in your library"
        }
    })()
}


// This function sorts elements alphabetically when clicking the table headers
function sortTable(n) {
    let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("library-table");
    switching = true;
    dir = "asc";
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[n];
            y = rows[i + 1].getElementsByTagName("td")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}


// Event Listeners
bookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let title = document.getElementById("book-title").value
    let author = document.getElementById("book-author").value
    let pages = document.getElementById("book-pages").value
    let read = document.getElementById("book-read").checked

    let newBook = new Book(title, author, pages, read);
    bookForm.reset();
    addBooktoTable(newBook);
    removeEmptyMessage();
    stats();
})

table.addEventListener("click", (e) => {
    if (e.target.hasAttribute("data-id")) {
        let index = e.target.getAttribute("data-id");
        for (let i = 0; i < myLibrary.length; i++) {
            if (myLibrary[i].bookID === index - 1) {
                myLibrary.splice(index - 1, 1)
            }
        }
        e.target.parentNode.parentNode.remove();
        removeEmptyMessage();
        stats();
    }
})

table.addEventListener("click", (e) => {
    if (e.target.classList.contains("read")) {
        switch (e.target.textContent) {
            case "Yes":
                e.target.textContent = "No";
                index = e.target.nextSibling.firstChild.getAttribute("data-id");
                myLibrary[index - 1].read = e.target.textContent;
                stats();
                break;
            case "No":
                e.target.textContent = "Yes";
                index = e.target.nextSibling.firstChild.getAttribute("data-id");
                myLibrary[index - 1].read = e.target.textContent;
                stats();
                break;
        }
    }
})
