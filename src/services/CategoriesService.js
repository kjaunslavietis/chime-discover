import { listCategorys } from './../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify'

class CategoriesService {
    async getCategories() {
        try {
        let cats = await API.graphql(graphqlOperation(listCategorys));
        let nextToken ;
        let allCats = []
        
        do {
            allCats = allCats.concat(cats.data.listCategorys.items)
            nextToken = cats.data.listCategorys.nextToken;
            cats = await API.graphql(graphqlOperation(listCategorys, { nextToken: nextToken}));    
        } while (nextToken)
        return allCats.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)); 
        } catch (err) {
            console.log("==>errCAT : " + JSON.stringify(err))
            return []
        }
    }
}

export default CategoriesService;