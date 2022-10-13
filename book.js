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

function renderMainBook(title, coverImageSrc, author) {
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

  bookElm.appendChild(coverImageElm);
  detailsContainer.appendChild(titleElm);
  detailsContainer.appendChild(authorElm);
  bookElm.appendChild(detailsContainer);

  let section = document.getElementById("main-book-section");
  section.replaceChildren(bookElm);
}

function renderNextBookList() {
  let sectionTitleElm = document.createElement("h3");
  sectionTitleElm.innerText = "Next Books";

  let section = document.getElementById("next-book-list-section");
  section.appendChild(sectionTitleElm);
}

async function main() {
  let bookId = getSearchParam(window.location.search, "id");

  let bookResponse = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`
  );
  let { title, subtitle, imageLinks, authors } = bookResponse.data.volumeInfo;

  renderMainBook(
    makeTitleText(title, subtitle),
    (imageLinks && imageLinks.thumbnail) || "./default-book-cover.png",
    makeAuthorsText(authors)
  );

  renderNextBookList();
}

main();
