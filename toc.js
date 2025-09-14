// Decorate the page with elements for a table of contents.
//
// Will attach the table of contents to an element with id="toc".
(function () {
  // Returns impossibly high value if the heading level wasn't found.
  const getHeaderLevel = (header) => {
    let m = /\d$/.exec(header.tagName);
    if (!m) {
      return 100;
    }
    return parseInt(m[0], 10);
  };

  const last = (array) => {
    return array[array.length - 1];
  };

  const headers = [...document.querySelectorAll(":is(h1,h2,h3,h4,h5,h6)[id]")];

  // Generate the Table of Contents

  // Keep track of the stack of header levels, inserting an impossibly low one.
  let headerLevels = [-1];
  let toc = document.createElement("details");
  let tocHeader = document.createElement("summary");
  tocHeader.textContent = "Table of Contents";
  tocHeader.classList.add("toc-header");
  toc.appendChild(tocHeader);
  let tocBody = document.createElement("div");
  tocBody.classList.add("toc-body");
  toc.appendChild(tocBody);

  let ulStack = [];
  for (let header of headers) {
    let level = getHeaderLevel(header);
    let prevLevel = last(headerLevels);
    if (level > prevLevel) {
      let ul = document.createElement("ul");
      ul.classList.add("toc-ul");
      if (ulStack.length > 0) {
        last(ulStack).appendChild(ul);
      } else {
        tocBody.appendChild(ul);
      }
      ulStack.push(ul);
      headerLevels.push(level);
    } else if (level < prevLevel) {
      while (last(headerLevels) > level) {
        ulStack.pop();
        headerLevels.pop();
      }
      if (last(headerLevels) !== level) {
        headerLevels.push(level);
      }
    }
    let li = document.createElement("li");
    li.innerHTML = `<a href="#${header.id}">${header.innerHTML}</a>`;
    last(ulStack).appendChild(li);
  }
  let tocElem = document.getElementById("toc");
  if (tocElem) {
    tocElem.appendChild(toc);
  }

  // Add self links to headers with an ID.
  for (let header of headers) {
    let selfLink = document.createElement("a");
    selfLink.href = "#" + header.id;
    selfLink.classList.add("self-anchor-link");
    selfLink.title = "Link to this section.";
    selfLink.innerHTML = "&#182;";
    selfLink.style.visibility = "hidden";
    header.addEventListener("mouseenter", (e) => {
      selfLink.style.visibility = "visible";
    });
    header.addEventListener("mouseleave", (e) => {
      selfLink.style.visibility = "hidden";
    });
    header.appendChild(selfLink);
  }
})();
