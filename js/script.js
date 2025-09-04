const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
const wrapper = document.querySelector('#wrapper');

const nextPrevWrapper = /*html */ `<div id="next-prev-wrapper"></div>`;
wrapper.insertAdjacentHTML('beforebegin', nextPrevWrapper);
const wrapperNextPrevDom = document.querySelector('#next-prev-wrapper');

async function getPokemonsAsy() {
	const result = await fetch(baseUrl);
	const data = await result.json();
}

fetch(baseUrl)
	.then((result) => result.json())
	.then((data) => {
		getPokemons(data);
	});

function getPokemons(data) {
	console.log(data);
	nextPrev(data); //This needs to be here or it will get the wrong data
	handleNextPrevLink();

	data.results.map((element) => {
		const url = element.url;
		fetch(url)
			.then((result) => result.json())
			.then((data) => {
				displayPokemon(data);
			});
	});
}

function displayPokemon(data) {
	const imgSrc = data.sprites.other['official-artwork']['front_default'];
	const spritesTemplates = /*html */ `
    <figure>
        <img src="${imgSrc}" class="pokemon__img">
        <figcaption>
        ${data.name}
        </figcaption>
    </figure>
    `;
	wrapper.insertAdjacentHTML('beforeend', spritesTemplates);
}

function nextPrev(data) {
	const next = data.next;
	const prev = data.previous;

	const nextPrevTemplate = /*html */ `
    <ul>
    ${
			next
				? /*html */ `<li><a href="${next}">Next</a></li>`
				: `<li><a>Next</a></li>`
		}
    ${
			prev
				? /*html */ `<li><a href="${prev}">Prev</a></li>`
				: `<li><a>Prev</a></li>`
		}
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
	console.log(e.target.href);
}
