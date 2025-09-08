const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
const wrapper = document.querySelector('#wrapper');

const nextPrevWrapper = /*html */ `<div id="next-prev-wrapper"></div>`;
wrapper.insertAdjacentHTML('beforebegin', nextPrevWrapper);
const wrapperNextPrevDom = document.querySelector('#next-prev-wrapper');

async function getPokemonsAsy(offset, limit) {
	const url = `${baseUrl}?offset=${offset}&limit=${limit}`;
	const result = await fetch(url);
	const data = await result.json();
	getPokemons(data);
	//console.log(data);

	const { currentPage, totalPages } = getPageNumber(offset, limit, data.count);
	//console.log(currentPage, totalPages);
}

function getPageNumber(offset, limit, numberOfPokemons) {
	const currentPage = Math.floor(offset / limit + 1);

	const totalPages = Math.ceil(numberOfPokemons / limit);

	return { currentPage, totalPages };
}

function getPokemons(data) {
	wrapper.innerHTML = '';
	nextPrev(data); //This needs to be here or it will get the wrong data
	handleNextPrevLink();

	data.results
		.map((element) => {
			const url = element.url;
			fetch(url)
				.then((result) => result.json())
				.then((data) => {
					displayPokemon(data);
					//console.log(data);
				});
		})
		.join('');
}

function displayPokemon(data) {
	const types = data.types;
	const typeCardText = types
		.map((type) => `<span>${type.type.name}</span>`)
		.join('');
	const imgSrc = data.sprites.other['official-artwork']['front_default'];
	const spritesTemplates = /*html */ `
    <div class="pokedexGraphic">
        <figure class="card">
            <img src="${imgSrc}" class="pokemon__img" id="clickModal">
            <figcaption>
            <div class="poke-number">#${data.id}</div>
            <h2 class="poke-title">${data.name}</h2>
            <div class="poke-type">${typeCardText}</div>
            </figcaption>
        </figure>
<!--
        <div class="modal" id="myModal">
            <div class="modalContent">
                <span class="close">&times;</span>
                <img src="${imgSrc}" class="pokemon__img">
                    <div class="poke-number">#${data.id}</div>
                    <h2 class="poke-title">${data.name}</h2>
                    <div class="poke-type">${typeCardText}</div>
                    <div>${data.stats}</div>
            </div>
        </div> -->
    </div>
    `;
	wrapper.insertAdjacentHTML('beforeend', spritesTemplates);
}

function nextPrev(data) {
	const next = data.next;
	const prev = data.previous;
	wrapperNextPrevDom.innerHTML = '';

	const nextPrevTemplate = /*html */ `
    <ul class="linkUl">
    ${prev ? /*html */ `<li><a href="${prev}">-</a></li>` : `<li>-</li>`}
    ${next ? /*html */ `<li><a href="${next}">+</a></li>` : `<li>+</li>`}
    </ul>
    `;

	wrapperNextPrevDom.insertAdjacentHTML('beforeend', nextPrevTemplate);
}

function handleNextPrevLink() {
	wrapperNextPrevDom.addEventListener('click', handleClick);
}

function handleClick(e) {
	e.preventDefault();

	if (!e.target.href) return;

	//console.log(e.target.href);
	const newUrl = new URL(e.target.href);
	const params = new URLSearchParams(newUrl.search);
	const limit = params.get('limit');
	//console.log(limit);
	const offset = params.get('offset');
	//console.log(offset);

	getPokemonsAsy(offset, limit);
}

getPokemonsAsy(0, 9);

document.addEventListener('DOMContentLoaded', () => {
	//Modal
	const modal = document.getElementById('myModal');
	const modalBtn = document.getElementById('clickModal');
	const closeModal = document.querySelector('.close');

	modalBtn.addEventListener('click', () => {
		modal.style.display = 'block';
	});

	closeModal.addEventListener('click', () => {
		modal.style.display = 'none';
	});

	window.addEventListener('click', (e) => {
		if (e.target == modal) {
			modal.style.display = 'none';
		}
	});
});
