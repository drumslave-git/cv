import data from '../../data/data.json';

class Api {
    credentials = {};

    get(id){
        return data[id];
    }

    get(id){
        return data[id];
    }
}
const api = new Api();
export {api as Api}
