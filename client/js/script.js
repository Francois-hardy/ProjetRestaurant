window.onload=init;


function init() {
    new Vue({
        el: "#app",
		mounted() {
			console.log("AVANT RENDU HTML");
			this.getRestaurantsFromServer();

		},
        data: {
            restaurants: [],
            nom: '',
            cuisine: '',
            page: 0,
            count: 0,
            pageSize: 10
        },
        methods: {
            supprimerRestaurant(index) {
                this.restaurants.splice(index, 1);
            },
            ajouterRestaurant(event) {
                // eviter le comportement par defaut
                event.preventDefault();

                this.restaurants.push(
                    {
                        nom: this.nom,
                        cuisine: this.cuisine
                    }
                );
                this.nom = "";
                this.cuisine = "";
            },
            pagePrecedent() {
                // url (required), options (optional)
                if (this.page !== 0){
                    this.page--;
                    this.getRestaurantsFromServer();
                }

            },
            pageSuivant() {
                // url (required), options (optional)
                if (this.page !== Math.round( this.count/this.pageSize)){
                    this.page++;
                    this.getRestaurantsFromServer();
                }

            },
			getRestaurantsFromServer(){
				// url (required), options (optional)
                let url = 'http://localhost:8080/api/restaurants?page=';
                url += this.page;

				fetch(url)
				.then(responseJSON => {
                    responseJSON.json()
                    .then(responseJS => {
                        this.restaurants = responseJS.data
                        this.count = responseJS.count
                        console.log(responseJS)
                        console.log(this.restaurants)
                    })
                })
					
			},
            getColor(index) {
                return (index % 2) ? 'lightBlue' : 'pink';
            }
        }
    })
}
