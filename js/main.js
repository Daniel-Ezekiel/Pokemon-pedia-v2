("use strict");

const randomStart = Math.ceil(Math.random() * (1281 - 40));

// SEARCH FOR POKEMON USING THE SEARCH INPUT
document.querySelector("#btn").addEventListener("click", function (e) {
  e.preventDefault();

  const pokemonName = document.querySelector("#name").value.toLowerCase();

  if (pokemonName) {
    // Remove all existing Pokémon cards
    const allCards = document.querySelectorAll(".pokemon-card");
    allCards.forEach((card) => card.remove());

    // Fetch the Pokémon information and display the Pokémon card
    fetchPokemonInfo(pokemonName);
  }
});

// ON PAGE LOAD, DISPLAY 40 Pokémons
async function fetchPokemon() {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/?limit=40&offset=${randomStart}`
    );
    const data = await res.json();
    console.log(data.count, data.results);

    let pokemonArr = data.results;
    // For each element in the array, fetch and display the Pokémon card using the Pokémon name
    pokemonArr.forEach((pokemon) => fetchPokemonInfo(pokemon.name));
  } catch (err) {
    console.log(`error ${err}`);
    alert("Pokémon does not exist, check input and try again");
  }
}
fetchPokemon();

// FETCH Pokémon INFORMATION USING THE Pokémon NAME
async function fetchPokemonInfo(pokemonName) {
  try {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const res = await fetch(url);
    const data = await res.json();

    createAndShowCard(data);
  } catch (err) {
    console.log(`error ${err}`);
    alert("Pokémon does not exist, check input and try again");
  }
}

function createAndShowCard(data) {
  // Get the parent container to house the cards --- Card container
  const cardsContainer = document.querySelector(".cards-container");

  // Create the div for the card and add a class name to it;
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("pokemon-card");

  // Create each content of the card and attach a class name to them as well;
  // Pokémon Image
  const pokeImg = document.createElement("img");
  pokeImg.classList.add("pokemon-img");
  const imgSrc = data.sprites.other["official-artwork"]["front_default"];
  pokeImg.src = imgSrc;

  // Pokémon Name
  const pokeName = document.createElement("h3");
  pokeName.textContent = data.name;

  // Pokémon types
  const typeDiv = document.createElement("div");
  typeDiv.classList.add("pokemon-types");

  const ul = document.createElement("ul");
  // There should be a function to iterate through the types and append to the DOM;
  function getTypes() {
    const types = data.types;
    types.forEach((e) => {
      const li = document.createElement("li");
      li.classList.add("type");
      li.textContent = e.type.name;

      // Append the type to the ul;
      ul.appendChild(li);
    });
  }
  getTypes();

  // Appending the child elements to their respective parents;
  // First, the ul containing the type to the typeDiv;
  typeDiv.appendChild(ul);
  // Next, the Pokémon image, Pokémon name and typeDiv to the cardDiv;
  cardDiv.appendChild(pokeImg);
  cardDiv.appendChild(pokeName);
  cardDiv.appendChild(typeDiv);

  // Add event listener to the cardDiv to show the popup
  cardDiv.addEventListener("click", function () {
    const pokemonName = this.children[1].textContent;
    console.log(pokemonName);

    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    fetch(url)
      .then((res) => res.json()) // parse response as JSON
      .then((data) => {
        createPopup(data);
        showPopup();
      })
      .catch((err) => {
        console.log(`error ${err}`);
      });
  });

  // Finally, the cardDiv to the cardsContainer;
  cardsContainer.appendChild(cardDiv);
}

function createPopup(data) {
  // Popup container
  const popupDiv = document.querySelector(".pokemon-details-popup");

  //Create container for all content
  const detailsContainer = document.createElement("div");
  detailsContainer.classList.add("details-overall-container");

  // Create the h3 for the Pokemon name;
  const h3PokeName = document.createElement("h3");
  h3PokeName.textContent = data.name;

  // Create container to host all details of the selected pokemon
  const pokeDetailsContainer = document.createElement("div");
  pokeDetailsContainer.classList.add("pokemon-details-container");

  // Create the first div sub-container of the popup and add class name;
  const subDiv1 = document.createElement("div");
  subDiv1.classList.add("pokemon-img-and-type");

  // Create the child elements of the first div and add class names;
  const popupImg = document.createElement("img");
  const imgSrc = data.sprites["other"]["official-artwork"]["front_default"];
  popupImg.src = imgSrc;

  const popupTypeDiv = document.createElement("div");
  popupTypeDiv.classList.add("pokemon-types");

  const popupTypesUl = document.createElement("ul");
  // A function to iterate through the types and append to the DOM;
  function getPokeTypes() {
    const popupTypes = data.types;
    popupTypes.forEach((e) => {
      const li = document.createElement("li");
      li.classList.add("type");
      li.textContent = e.type.name;

      // Append the type to the ul;
      popupTypesUl.appendChild(li);
    });
  }
  getPokeTypes();
  popupTypeDiv.appendChild(popupTypesUl); //appending types to the types div

  // Append all children of subDiv1 appropraitely;
  subDiv1.appendChild(popupImg);
  subDiv1.appendChild(popupTypeDiv);

  // Create the second div sub-container of the popup and add class name;
  const subDiv2 = document.createElement("div");
  subDiv2.classList.add("pokemon-other-details");

  // Create the child elements of subDiv2 and attach class names as required
  const statsDiv = document.createElement("div");
  statsDiv.classList.add("pokemon-stats");
  /***These are the child elements for the pokemon stats div***/
  const statsH4 = document.createElement("h4");
  statsH4.textContent = "Stats";

  const statsUl = document.createElement("ul");
  // A function to get the stats and append to the ul;
  function getStats() {
    const pokeStats = data.stats.filter((e, i) => i != 3 && i != 4);
    pokeStats.forEach((e) => {
      const li = document.createElement("li");
      li.classList.add("stat");
      li.textContent = `${e.stat.name.toUpperCase()}: ${e["base_stat"]}`;

      // Append stat to the ul
      statsUl.appendChild(li);
    });
  }
  getStats();

  // Append child elements of statsDiv
  statsDiv.appendChild(statsH4);
  statsDiv.appendChild(statsUl);

  const ableDiv = document.createElement("div");
  ableDiv.classList.add("pokemon-abilities");
  /***These are the child elements for the pokemon abilities div***/
  const ableH4 = document.createElement("h4");
  ableH4.textContent = "Abilities";

  const ableUl = document.createElement("ul");
  // A function to get the stats and append to the ul;
  function getAbility() {
    const pokeAble = data.abilities;
    pokeAble.forEach((e) => {
      const li = document.createElement("li");
      li.classList.add("ability");
      li.textContent = e.ability.name;

      // Append stat to the ul
      ableUl.appendChild(li);
    });
  }
  getAbility();

  // Append child elements of ableDiv
  ableDiv.appendChild(ableH4);
  ableDiv.appendChild(ableUl);

  const whDiv = document.createElement("div");
  whDiv.classList.add("pokemon-weight-height");
  /*** These are the child elements for the weight-height div ***/
  const p1 = document.createElement("p");
  p1.textContent = `Weight: ${data.weight / 10}kg`;
  const p2 = document.createElement("p");
  p2.textContent = `Height: ${data.height * 10}cm`;

  // Append child elements to the whDiv
  whDiv.appendChild(p1);
  whDiv.appendChild(p2);

  // Append all child elements of subDiv2 to itself
  subDiv2.appendChild(statsDiv);
  subDiv2.appendChild(ableDiv);
  subDiv2.appendChild(whDiv);

  // Next, append both subDivs to the pokemon details contianer
  pokeDetailsContainer.appendChild(subDiv1);
  pokeDetailsContainer.appendChild(subDiv2);

  // Next, append the pokemon name and pokemon details container to the popup div
  detailsContainer.appendChild(h3PokeName);
  detailsContainer.appendChild(pokeDetailsContainer);

  // Finally, append the details container to the popup div
  popupDiv.appendChild(detailsContainer);
}

function showPopup() {
  // Add className to activate overlay
  document.querySelector(".overlay").classList.add("is-active");
  // Add className to activate popup
  document.querySelector(".pokemon-details-popup").classList.add("is-active");

  // Add classname to show close button
  const closeBtn = document.querySelector(".close-btn");
  closeBtn.classList.add("is-active");

  // Close button functionality
  closeBtn.addEventListener("click", function () {
    // Remove className to deactivate overlay
    document.querySelector(".overlay").classList.remove("is-active");
    // Remove className to deactivate popup
    document
      .querySelector(".pokemon-details-popup")
      .classList.remove("is-active");
    // Remove className to hide close button
    this.classList.remove("is-active");

    // Remove the container of more information on the selected Pokémon
    document.querySelector(".details-overall-container").remove();
  });
}

