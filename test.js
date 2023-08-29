class SPARQLQueryDispatcher {
    constructor( endpoint ) {
        this.endpoint = endpoint;
    }

    query( sparqlQuery ) {
        const fullUrl = this.endpoint + '?query=' + encodeURIComponent( sparqlQuery );
        const headers = { 'Accept': 'application/sparql-results+json' };

        return fetch( fullUrl, { headers } ).then( body => body.json() );
    }
}

const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `SELECT ?person ?personLabel WHERE {
  ?person wdt:P19 wd:Q84;
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
} limit 10`;

const queryDispatcher = new SPARQLQueryDispatcher( endpointUrl );
queryDispatcher.query(sparqlQuery).then(response => {
    console.log(JSON.stringify(response, null, 2)); // Convert and pretty-print the JSON response
});