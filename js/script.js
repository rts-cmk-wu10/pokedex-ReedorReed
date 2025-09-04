const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
const wrapper = document.querySelector('#wrapper');

fetch(baseUrl)
	.then((result) => result.json())
	.then((data) => {
		getPokemons(data);
	});

function getPokemons(data) {
	console.log(data);
	data.results.map((element) => {
		const url = element.url;
		fetch(url)
			.then((result) => result.json())
			.then((data) => {
				console.log(data);
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
    wrapper.insertAdjacentHTML('beforeend', spritesTemplates)
}
