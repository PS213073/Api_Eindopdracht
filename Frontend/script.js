"use strict"
const apiBase = "http://127.0.0.1:8000/api/"
const apiCategories = apiBase + "categories"
const apiFilms = apiBase + "films"

let categories = []
let films = []

const loadCategories = async () => {
	try {
		const response = await axios.get(apiCategories)
		const data = response.data
		let newContent = ''
		data.forEach(category => {
			categories[category.id] = category.name
			newContent += `<option value="${category.id}">${category.name}</option>`
		})
		document.querySelector("#category").innerHTML = newContent
	} catch (error) {
		console.error(error)
	}
}


const loadCategoryFilms = async () => {
	const category = document.querySelector("#category").value
	console.log('Selected Category:', category)

	const apiCategoriesFilms = `${apiCategories}/${category}/films?sort=name`; // Updated endpoint URL
	const response = await axios.get(apiCategoriesFilms)
	films = response.data
	console.log(films)
	showFilms()
}




const showFilms = () => {
	let cards = '';
	films.forEach((film) => {
		cards += `
            <div class="card">
                <img src="${film.image}" alt="Film Image">
                <div class="card-body">
                    <h3 class="card-title">${film.name}</h3>
                    <p class="card-text">Released: ${film.release_year}</p>
                    <p class="card-text">Duration: ${film.duration} min</p>
                    <button onclick="removeFilm(${film.id})"><i class="fa fa-trash" type="button"></i></button>
					<button onclick="openUpdateFilmModal(${film.id})" type="button"><i class="fa fa-edit"></i></button>
                </div>
            </div>`;
	});
	document.querySelector("#cardsContainer").innerHTML = cards;
};


const load = async () => {
	await loadCategories()
	await loadCategoryFilms()
	showFilms()
}

// Add film modal

const openAddFilmModal = async () => {
	try {
		// Load categories
		const categories = await getCategories()
		console.log("Categories:", categories)
		const categorySelect = document.querySelector("#categoryadd")
		categorySelect.innerHTML = ''
		categories.forEach(category => {
			const option = document.createElement("option")
			option.text = category.name
			option.value = category.id
			categorySelect.add(option)
		})

		// Open modal
		document.getElementById("addFilmModal").style.display = "block";
	} catch (error) {
		console.error(error)
	}
}


const closeAddFilmModal = () => {
	document.getElementById("addFilmModal").style.display = "none";
}

const getCategories = async () => {
	try {
		const response = await axios.get(apiCategories)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

// populate categories in add film modal 

const populateCategories = (categories) => {
	const categorySelect = document.querySelector("#categoryadd")
	categorySelect.innerHTML = ''
	categories.forEach(category => {
		const option = document.createElement("option")
		option.text = category.name
		option.value = category.id
		categorySelect.add(option)
	})
}


// Add film function

const addFilm = async () => {
	const name = document.querySelector("#name").value.trim();
	const release_year = document.querySelector("#release_year").value.trim();
	const duration = document.querySelector("#duration").value.trim();
	const category_id = document.querySelector("#categoryadd").value.trim();
	const image = document.querySelector("#image").value.trim();

	// Check if required fields are empty
	if (!name || !release_year || !duration || !category_id || !image) {
		alert("Please fill in all required fields");
		return;
	}

	const data = { name, release_year, duration, category_id, image };
	console.log("Add film:", data);

	try {
		const response = await axios.post(apiFilms, data, {
			headers: { "Content-Type": "application/json" },
		});
		console.log("Status code:", response.status);

		// Clear input fields
		document.querySelector("#name").value = "";
		document.querySelector("#release_year").value = "";
		document.querySelector("#duration").value = "";
		document.querySelector("#categoryadd").value = "";
		document.querySelector("#image").value = "";

		// Close modal and reload films
		closeAddFilmModal();
		await load();
	} catch (error) {
		console.error(error);
	}
};

//   Remove film function

const removeFilm = async (id) => {
	try {
		const response = await axios.delete(apiFilms + "/" + id);
		console.log("Status code:", response.status);
		films = films.filter(film => film.id !== id); // Remove the deleted film from the films array
		showFilms();
	} catch (error) {
		console.error(error);
	}
};

//  Update film modal

const openUpdateFilmModal = async (filmId) => {
	try {

		console.log("filmId:", filmId);

		const response = await axios.get(`${apiFilms}/${filmId}`);
		const film = response.data;

		// Fill in the modal form fields with the film data
		document.querySelector("#nameUpdate").value = film.name;
		document.querySelector("#release_yearUpdate").value = film.release_year;
		document.querySelector("#durationUpdate").value = film.duration;
		document.querySelector("#imageUpdate").value = film.image;
		document.querySelector("#categoryUpdate").value = film.category_id;

		console.log(film)		
		

		// Show the modal
		document.querySelector("#updateFilmModal").style.display = "block";
	} catch (error) {
		console.error(error);
	}

	try {
		// Load categories
		const categories = await getCategories()
		console.log("Categories:", categories)
		const categorySelect = document.querySelector("#categoryUpdate")
		categorySelect.innerHTML = ''
		categories.forEach(category => {
			const option = document.createElement("option")
			option.text = category.name
			option.value = category.id
			categorySelect.add(option)
		})
		
	} catch (error) {
		console.error(error)
	}
	
};


const closeUpdateFilmModal = () => {
	document.getElementById("updateFilmModal").style.display = "none";
}

const getUpdateCategories = async () => {
	try {
		const response = await axios.get(apiCategories)
		return response.data
	} catch (error) {
		console.error(error)
	}
}

// populate categories in add film modal 

const populateUpdateCategories = (categories) => {
	const categorySelect = document.querySelector("#categoryUpdate")
	categorySelect.innerHTML = ''
	categories.forEach(category => {
		const option = document.createElement("option")
		option.text = category.name
		option.value = category.id
		categorySelect.add(option)
	})
}

//   Update function

const updateFilm = async (filmId) => {

	console.log("filmId:", filmId);
	
	const name = document.querySelector("#nameUpdate").value;
	const release_year = document.querySelector("#release_yearUpdate").value;
	const duration = document.querySelector("#durationUpdate").value;
	const category_id = document.querySelector("#categoryUpdate").value;
	const image = document.querySelector("#imageUpdate").value;
	const data = {name, release_year, duration, category_id, image };
	console.log("Update film:", data);
	try {
		const response = await axios.put(`${apiFilms}/${filmId}`, data, {    
			headers: { "Content-Type": "application/json" },
		});
		console.log("Status code:", response.status);
		document.querySelector("#filmIdUpdate").value = "";
		document.querySelector("#nameUpdate").value = "";
		document.querySelector("#release_yearUpdate").value = "";
		document.querySelector("#durationUpdate").value = "";
		document.querySelector("#imageUpdate").value = "";
		closeUpdateFilmModal();
		await load();
	} catch (error) {
		console.error(error);
	}
};







