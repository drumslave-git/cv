import {FB} from './Firebase';
import {I18n} from './I18n';

class User {
    info = {
        firstname: '',
        lastname: '',
        altfirstname: '',
        altlastname: '',
        jobTitle: '',
        altJobTitle: '',
        birth: '',
        location: '',
        languages: '',
        intro: '',
    };

    init = async () => {
        return new Promise((resolve, reject) => {
            const userRef = FB.db.collection("users").doc("3dWIYgCHbZkK7XeDJlfl");
            userRef.get().then((user) => {
                if (user.exists) {
                    const data = user.data();
                    Object.entries(data.info).forEach(([key, value]) => {
                        if(value[I18n.locale]){
                            this.info[key] = value[I18n.locale];
                        }else if(value[I18n.fallback]){
                            this.info[key] = value[I18n.fallback];
                        }else{
                            this.info[key] = value;
                        }
                    });
                    resolve(this.info)
                }else{
                    reject();
                }
            });
        })
    }
}
const user = new User();
export {user as User}
