const baseUrl = `https://pokeapi.co/api/v2/pokemon/`;
const wrapper = document.querySelector('#wrapper');

let params = new URLSearchParams(window.location.search);
const id = params.get('url');

fetch(`${baseUrl}.${id}`)
	.then((response) => response.json())
	.then((data) => {
		showPokemonInfo(data);
	});

function showPokemonInfo(data) {
	const types = data.types[0].type.name;
	const imgSrc = data.sprites.other['official-artwork']['front_default'];
	const spritesTemplates = /*html */ `
    <div class="pokedexGraphic">
        <figure class="card modal" id="myModal">
            <img src="${imgSrc}" class="pokemon__img">
            <figcaption>
            <div class="poke-number">#${data.id}</div>
            <h2 class="poke-title">${data.name}</h2>
            <div class="poke-type">${types}</div>
            </figcaption>
        </figure>
    </div>
    `;
}

