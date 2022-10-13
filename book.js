function getSearchParam(queryString, name) {
  let params = new URLSearchParams(queryString);
  return params.get(name);
}

function makeTitleText(title, subtitle) {
  if (!title) {
    return "";
  }
  return subtitle ? `${title}: ${subtitle}` : title;
}

function makeAuthorsText(authors) {
  return authors ? authors.join(", ") : "";
}

function createCategoryListElement(categories) {
  let categoryListElm = document.createElement("div");
  categoryListElm.classList = ["category-list"];
  for (let category of categories) {
    let categoryElm = document.createElement("div");
    categoryElm.classList = ["category"];
    categoryElm.innerText = category;
    categoryListElm.appendChild(categoryElm);
  }
  return categoryListElm;
}

function renderMainBook(title, coverImageSrc, author, categories) {
  let bookElm = document.createElement("div");
  bookElm.classList = ["main-book"];

  let coverImageElm = document.createElement("img");
  coverImageElm.src = coverImageSrc;

  let detailsContainer = document.createElement("div");
  detailsContainer.classList = ["book-details"];

  let titleElm = document.createElement("h2");
  titleElm.innerHTML = title;

  let authorElm = document.createElement("p");
  authorElm.innerHTML = author;

  let categoryListElm = createCategoryListElement(categories);

  bookElm.appendChild(coverImageElm);
  detailsContainer.appendChild(titleElm);
  detailsContainer.appendChild(authorElm);
  detailsContainer.appendChild(categoryListElm);
  bookElm.appendChild(detailsContainer);

  let section = document.getElementById("main-book-section");
  section.replaceChildren(bookElm);
}

function renderNextBookList(books) {
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
  }
  let sectionTitleElm = document.createElement("h3");
  sectionTitleElm.innerText = "Your Next Book";

  let section = document.getElementById("next-book-list-section");
  section.appendChild(sectionTitleElm);
  section.appendChild(listElm);
}

async function main() {
  let bookId = getSearchParam(window.location.search, "id");

  let bookResponse = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`
  );
  let { title, subtitle, imageLinks, authors, categories } =
    bookResponse.data.volumeInfo;

  renderMainBook(
    makeTitleText(title, subtitle),
    (imageLinks && imageLinks.thumbnail) || "./default-book-cover.png",
    makeAuthorsText(authors),
    categories || []
  );

  let subjectBooksResponse = await axios.get(
    `https://www.googleapis.com/books/v1/volumes?q=${categories[0]
      .split("/")
      .join(";")}&maxResults=40`
  );

  let subjectBooks = subjectBooksResponse && subjectBooksResponse.data.items;
  if (subjectBooks && subjectBooks.length > 0) {
    renderNextBookList(subjectBooks);
  }
}

main();
