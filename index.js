function makeTitleText(title, subtitle) {
  if (!title) {
    return "";
  }
  return subtitle ? `${title}: ${subtitle}` : title;
}

function makeAuthorsText(authors) {
  return authors ? authors.join(", ") : "";
}

function renderBookList(books) {
  if (!books) {
    return;
  }

  let listElm = document.createElement("ul");
  listElm.classList = ["book-list"];

  for (let i = 0; i <= books.length; i++) {
    let book = books[i];
    if (book) {
      let { title, subtitle, imageLinks, authors } = book.volumeInfo;

      let bookElm = document.createElement("li");
      bookElm.classList = ["book-list-item"];

      let linkElm = document.createElement("a");
      linkElm.href = `/book.html?id=${book.id}`;

      let coverImageElm = document.createElement("img");
      coverImageElm.src =
        (imageLinks && imageLinks.thumbnail) || "./default-book-cover.png";

      let detailsContainer = document.createElement("div");
      detailsContainer.classList = ["book-details"];

      let titleElm = document.createElement("h3");
      titleElm.innerHTML = makeTitleText(title, subtitle);

      let authorElm = document.createElement("p");
      authorElm.innerHTML = makeAuthorsText(authors);

      detailsContainer.appendChild(titleElm);
      detailsContainer.appendChild(authorElm);
      linkElm.appendChild(coverImageElm);
      linkElm.appendChild(detailsContainer);
      bookElm.appendChild(linkElm);
      listElm.appendChild(bookElm);
    }

    let listSectionElm = document.getElementById("finder-result-section");
    listSectionElm.replaceChildren(listElm);
  }
}

async function handleFinderFormSubmit(event) {
  event.preventDefault();

  let form = new FormData(event.target);
  let formData = Object.fromEntries(form);
  let keyword = formData.keyword;

  // guard against api call error
  if (keyword) {
    try {
      let listBookResponse = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=${formData.keyword}`
      );
      renderBookList(listBookResponse.data.items);
    } catch (error) {
      console.log(`Error`, error);
    }
  }
}

async function main() {
  let finderForm = document.getElementById("finder-form");
  finderForm.addEventListener("submit", handleFinderFormSubmit);
}

main();
