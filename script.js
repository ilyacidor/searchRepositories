const form = document.querySelector('.search'); 
const input = form.querySelector('.search__input'); 
const searchList = form.querySelector('.search__list');
const resultList = document.querySelector('.result-list'); 
let foundRepositories = [];

const debounce = (fn, debounceTime) => {
  let timer;
  return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
          fn.apply(this, args); 
      }, debounceTime) 
  }
};

async function searchRepo(e) {
  const inputValue = e.target.value;
  searchList.innerHTML = ''; 
  try {
    const response = await fetch(`https://api.github.com/search/repositories?q=${inputValue}&per_page=5`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application.json'  
      }
    });
    if (!response.ok) {
      throw new Error('Ошибка при получении данных! Повторите попытку!');
    }
    const result = await response.json();
    foundRepositories = result.items;
    console.log(foundRepositories)
    for (let item of foundRepositories) {
      searchList.insertAdjacentHTML(
        'beforeend',
        `<li class="search__item">${item.name}</li>`
      );
    }
  } catch (err) {
    alert(err.message);
  }

  if (inputValue === '') {
    searchList.innerHTML = '';
  }
}

function createRepo(e) {
  const target = e.target;
  if (target.tagName === 'LI') {
    input.value = ''; 
    searchList.innerHTML = ''; 
    const searchedRepos = foundRepositories.find((i) => i.name === target.textContent);
    let name = searchedRepos.name; 
    let owner = searchedRepos.owner.login; 
    let stars = searchedRepos.stargazers_count; 
    resultList.insertAdjacentHTML(
      'beforeend',
      `<li class="result-list__item">
          <p>Name: ${name}</p>
          <p>Owner: ${owner}</p>
          <p>Stars: ${stars}</p>
          <button type="button" class="result-list__button">x</button>
      </li>`
  );
  }

  if (target.tagName === 'BUTTON') {
    target.parentElement.remove();
  }
}; 

form.addEventListener('keyup', debounce(searchRepo, 500));
document.addEventListener('click', createRepo);

