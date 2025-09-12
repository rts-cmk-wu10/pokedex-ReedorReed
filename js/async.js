const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
const wrapper = document.querySelector('#wrapper');

const contentWrapper = `<div id="contentWrapper"></div>`;
wrapper.insertAdjacentHTML('afterbegin', contentWrapper);
const container = document.querySelector('#contentWrapper');

let limit = 20;
let offset = 0;


// const nextPrevWrapper = /*html */ `<div id="next-prev-wrapper"></div>`;
// wrapper.insertAdjacentHTML('beforebegin', nextPrevWrapper);
// const wrapperNextPrevDom = document.querySelector('#next-prev-wrapper');

//Back to top btn
const backToTop = `<div><a href="#" class="to-top">&#x2191</a></div>`;
wrapper.insertAdjacentHTML('beforebegin', backToTop);

async function getPokemonsAsy(offset, limit) {
	const url = `${baseUrl}?offset=${offset}&limit=${limit}`;
	const result = await fetch(url);
	const data = await result.json();
	await getPokemons(data);

	const { currentPage, totalPages } = getPageNumber(offset, limit, data.count);
}

function getPageNumber(offset, limit, numberOfPokemons) {
	const currentPage = Math.floor(offset / limit + 1);
	const totalPages = Math.ceil(numberOfPokemons / limit);
	return { currentPage, totalPages };
}

async function getPokemons(data) {
	//wrapper.innerHTML = '';
	//nextPrev(data); //This needs to be here or it will get the wrong data
	//handleNextPrevLink();
	const pokemons = data.results;

	const pokemonPromises = pokemons.map(async (element, index) => {
		const url = element.url;
		try {
			const result = await fetch(url);
			const pokemonData = await result.json();
			return { data: pokemonData, originalIndex: index };
		} catch (err) {
			console.error('Fejl i Pokémon fetch:', err.message);
			return null;
		}
	});

	//Wait for all requests to complete
	const pokemonResults = await Promise.all(pokemonPromises);

	//Filter out failed requests and sort by id
	const validPokemon = pokemonResults
		.filter((result) => !(result === null))
		.sort((a, b) => a.data.id - b.data.id);

	//Display all pokemon sorted
	validPokemon.forEach((pokemonResult, index) => {
		displayPokemon(pokemonResult.data, index, validPokemon);
	});
}

function displayPokemon(data, index, pokemons) {
	const types = data.types;
	const typeCardText = types
		.map((type) => `<span class="typesColor">${type.type.name}</span>`)
		.join('');
	const imgSrc = data.sprites['front_default'];
	let gifSrc = data.sprites.other['showdown']['front_default'];
	const pokemonId = data.id;

	const abilities = data.abilities;
	const abiltyText = abilities
		.map((abil) => `<p>${abil.ability.name}</p>`)
		.join('');

	const spritesTemplates = /*html */ `
    <div class="pokedexGraphic">
        <figure class="card">
            <img src="${imgSrc}" class="pokemon__img clickModal" data-pokemon-id="${pokemonId}" loading="lazy" style>
            <figcaption>
            <div class="poke-number">#${data.id}</div>
            <h2 class="poke-title">${data.name}</h2>
            <div class="poke-type">${typeCardText}</div>
            </figcaption>
        </figure>

<!--Modal content -->

        <div class="modal" id="myModal-${pokemonId}">
            <div class="modalContent">
                <span class="close" data-pokemon-id="${pokemonId}">&times;</span>
                <img src="${gifSrc}" class="pokemon__img">
                <div class="modalTextContent">
                    <div class="poke-number">#${data.id}</div>
                    <h2 class="poke-title">${data.name}</h2>
                    <div class="poke-type">${typeCardText}</div>
                    <div class="stats">
                        <ul class="statsWH">
                            <li class="weight">Weight: ${data.weight} lbs</li>
                            <li class="height">Height: ${data.height}</li>
                            <li class="abilities">Abilities: ${abiltyText}</li>
                        </ul>
                    <ul class="statsUl">
                    ${
											data.stats && data.stats.length > 0
												? data.stats
														.map(
															(stat) =>
																`<li class="statsLi">${stat.stat.name}: ${stat.base_stat}</li>`
														)
														.join('')
												: 'No stats available'
										}
                                        </ul>
                                        </div>
            </div>
            </div>

        </div> 
    </div>
    `;
	container.insertAdjacentHTML('beforeend', spritesTemplates);

	//Når sidste element i parti er indsat
	if (pokemons.length - 1 === index) {
		const figures = wrapper.querySelectorAll('figure');

		//Find nyt næste element to observe
		const nextObserveElement = figures[figures.length - 6];
		nextObserveElement.classList.add('observer');
		//Flyt observeren til det nye element
		observer.disconnect();
		observer.observe(nextObserveElement);
	}
    applyColorToType();
}



//Vibe coded fun
// function displayPokemon(data, index, pokemons) {
//     	const types = data.types;
//     	const typeCardText = types
//     		.map((type) => `<span class="typesColor">${type.type.name}</span>`)
// 		.join('');
// 	const imgSrc = data.sprites['front_default'];
// 	let gifSrc = data.sprites.other['showdown']['front_default'];
// 	const pokemonId = data.id;

// 	const abilities = data.abilities;
// 	const abiltyText = abilities
// 		.map((abil) => `<p>${abil.ability.name}</p>`)
// 		.join('');

// 	const spritesTemplates = /*html */ `
//     <div class="pokedexGraphic">
//         <figure class="card">
//             <img src="${imgSrc}" class="pokemon__img clickModal" data-pokemon-id="${pokemonId}" loading="lazy" style>
//             <figcaption>
//             <div class="poke-number">#${data.id}</div>
//             <h2 class="poke-title">${data.name}</h2>
//             <div class="poke-type">${typeCardText}</div>
//             </figcaption>
//         </figure>

// <!--Modal content -->

//         <div class="modal" id="myModal-${pokemonId}">
//             <div class="modalContent">
//                 <span class="close" data-pokemon-id="${pokemonId}">&times;</span>
//                 <img src="${gifSrc}" class="pokemon__img">
//                 <div class="modalTextContent">
//                     <div class="poke-number">#${data.id}</div>
//                     <h2 class="poke-title">${data.name}</h2>
//                     <div class="poke-type">${typeCardText}</div>
//                     <div class="stats">
//                         <ul class="statsWH">
//                             <li class="weight">Weight: ${data.weight} lbs</li>
//                             <li class="height">Height: ${data.height}</li>
//                             <li class="abilities">Abilities: ${abiltyText}</li>
//                         </ul>
//                     <ul class="statsUl">
//                     ${
// 											data.stats && data.stats.length > 0
// 												? data.stats
// 														.map(
// 															(stat) =>
// 																`<li class="statsLi">${stat.stat.name}: ${stat.base_stat}</li>`
// 														)
// 														.join('')
// 												: 'No stats available'
// 										}
//                                         </ul>
//                                         </div>
//             </div>
//             </div>

//         </div> 
//     </div>
//     `;
// 	container.insertAdjacentHTML('beforeend', spritesTemplates);

// 	// Add hover effect to the specific Pokemon image that was just created
// 	let gifSrc2 =
// 		data.sprites.versions['generation-v']['black-white']['animated'][
// 			'front_shiny'
// 		];

// 	// Get only the newly created images for this Pokemon
// 	const newPokemonImages = container.querySelectorAll(
// 		`[data-pokemon-id="${pokemonId}"]`
// 	);

// 	newPokemonImages.forEach((img) => {
// 		// Only add event listener if it's an img element and has a valid animated sprite
// 		if (img.tagName === 'IMG' && gifSrc2) {
// 			const originalSrc = img.src;

// 			img.addEventListener('mouseover', () => {
// 				img.src = gifSrc2;
// 			});

// 			img.addEventListener('mouseout', () => {
// 				img.src = originalSrc;
// 			});
// 		}
// 	});

// 	//Når sidste element i parti er indsat
// 	if (pokemons.length - 1 === index) {
// 		const figures = wrapper.querySelectorAll('figure');

// 		//Find nyt næste element to observe
// 		const nextObserveElement = figures[figures.length - 6];
// 		nextObserveElement.classList.add('observer');
// 		//Flyt observeren til det nye element
// 		observer.disconnect();
// 		observer.observe(nextObserveElement);
// 	}
// 	applyColorToType();
// }


//IntersectionObserver til infinity scroll
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				offset += limit;
				getPokemonsAsy(offset, limit);
			}
		});
	},
	{
		threshold: 1.0
	}
);

//Next page buttons html and functionality

// function nextPrev(data) {
// 	const next = data.next;
// 	const prev = data.previous;
// 	wrapperNextPrevDom.innerHTML = '';

// 	const nextPrevTemplate = /*html */ `
//     <ul class="linkUl">
//     ${prev ? /*html */ `<li><a href="${prev}">-</a></li>` : `<li>-</li>`}
//     ${next ? /*html */ `<li><a href="${next}">+</a></li>` : `<li>+</li>`}
//     </ul>
//     `;

// 	wrapperNextPrevDom.insertAdjacentHTML('beforeend', nextPrevTemplate);
// }

// function handleNextPrevLink() {
// 	wrapperNextPrevDom.addEventListener('click', handleClick);
// }

// function handleClick(e) {
// 	e.preventDefault();

// 	if (!e.target.href) return;

// 	//console.log(e.target.href);
// 	const newUrl = new URL(e.target.href);
// 	const params = new URLSearchParams(newUrl.search);
// 	const limit = params.get('limit');
// 	const offset = params.get('offset');

// 	getPokemonsAsy(offset, limit);
// }

//MouseOver function



//Modal functionality
document.addEventListener('click', (e) => {
	if (e.target.classList.contains('clickModal')) {
		const pokemonId = e.target.dataset.pokemonId;
		const modal = document.getElementById(`myModal-${pokemonId}`);

		if (modal) {
			modal.style.display = 'block';
		}
	}

	if (e.target.classList.contains('close')) {
		const pokemonId = e.target.dataset.pokemonId;
		const modal = document.getElementById(`myModal-${pokemonId}`);

		if (modal) {
			modal.style.display = 'none';
		}
	}

	if (e.target.classList.contains('modal')) {
		e.target.style.display = 'none';
	}
});

const headerImage = `
    <img src="https://fontmeme.com/permalink/250909/c98b56147580d8ad427647f4645af517.png" class="header-image">
    `;
container.insertAdjacentHTML('beforeend', headerImage);

getPokemonsAsy(offset, limit);

//Change colors of types

const colors = {
	normal: '#A8A77A',
	fire: '#EE8130',
	water: '#6390F0',
	electric: '#F7D02C',
	grass: '#7AC74C',
	ice: '#96D9D6',
	fighting: '#C22E28',
	poison: '#A33EA1',
	ground: '#E2BF65',
	flying: '#A98FF3',
	psychic: '#F95587',
	bug: '#A6B91A',
	rock: '#B6A136',
	ghost: '#735797',
	dragon: '#6F35FC',
	dark: '#705746',
	steel: '#B7B7CE',
	fairy: '#D685AD'
};

function applyColorToType() {
	const pokeTypesColor = document.querySelectorAll('.typesColor');

	pokeTypesColor.forEach((type) => {
		const text = type.textContent.trim().toLowerCase();

		if (colors[text]) {
			type.style.backgroundColor = colors[text];
		}
	});
}
