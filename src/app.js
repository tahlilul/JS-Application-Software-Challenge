let terms = require("./terms.json");
let config = require("./config.json");

// Load each term into built-in flow context for Terms & Conditions.
ngi.cards("_ngi:terms", terms);

// Define the Splash screen.
ngi.cards('_ngi:init.splash', {
    icon: './images/splash.png'
});

// Load top headlines in the U.S. from NY Times API
ngi.cards('news.headlinesList', {
        remote: {
            url: 'https://api.nytimes.com/svc/topstories/v2/us.json?api-key=' + config["api-key"],
            refresh: 10 * 60 * 1000,
            transform: function (data) {
                return data.results.map(function (article) {
                    return {
                        title: article.title,
                        body: article.abstract
                    };
                });
            }
        }
    }
);

ngi.flow('news', {
    entry: 'headlinesList' // The first view the task will load.
})
    .addRoute('headlinesList', {
        layout: 'Vertical List',
        title: 'Top Headlines in the U.S. Today',
        links: {
            detail: 'headline'
        }
    })

    .addRoute('headline', {
        layout: 'Detail',
        onEnter: function() {
            ngi.vehicle.speak(this.content.body);
        },
        beforeExit: function() {
            ngi.vehicle.speak();
        },
        actions: [
            {
                label: 'Replay',
                action: function () {
                    ngi.vehicle.speak(this.content.body);
                }
            }
        ]
    });

// Entry flow: news
ngi.init('news');
