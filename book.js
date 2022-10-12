function getSearchParam(queryString, name) {
  let params = new URLSearchParams(queryString);
  return params.get(name);
}

function makeAuthorsText(authors) {
  if (!authors) {
    return "";
  }

  return authors.join(", ");
}

function makeTitleText(title, subtitle) {
  if (!title) {
    return "";
  }
  let titleText = title;
  if (subtitle) {
    titleText = `${titleText}: ${subtitle}`;
  }
  return titleText;
}

function renderBook(title, subtitle, coverImageSrc, author) {
  let bookElm = document.createElement("div");

  let titleElm = document.createElement("h3");
  titleElm.innerHTML = makeTitleText(title, subtitle);

  let coverImageElm = document.createElement("img");
  coverImageElm.src = coverImageSrc;

  let authorElm = document.createElement("p");
  authorElm.innerHTML = author;

  bookElm.appendChild(titleElm);
  bookElm.appendChild(coverImageElm);
  bookElm.appendChild(authorElm);

  let bookContainer = document.getElementById("book-container");
  bookContainer.replaceChildren(bookElm);
}

async function main() {
  let bookId = getSearchParam(window.location.search, "id");

  let bookResponse = await axios.get(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`
  );
  let { title, subtitle, imageLinks, authors } = bookResponse.data.volumeInfo;

  renderBook(
    title,
    subtitle,
    imageLinks && imageLinks.thumbnail,
    makeAuthorsText(authors)
  );
}

main();
