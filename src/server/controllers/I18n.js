import {EE} from '@/helpers/EE';
import { FB } from './Firebase';

class I18n {
    languages = [
        {
            name: 'English',
            key: 'en',
        },
        {
            name: 'Ukrainian',
            key: 'ua',
        },
    ];
    fallback = 'en';
    locale = this.fallback;

    strings = {};

    init = async () =>{
        return new Promise((resolve, reject) => {
            const locale = localStorage.getItem('locale');
            if(locale){
                this.locale = locale;
            }else{
                this.locale = this.fallback;
            }
            const languageRef = FB.db.collection("languages").doc(this.locale);
            languageRef.get().then((language) => {
                if (language.exists) {
                    this.strings = language.data();
                    resolve(this.strings);
                }else{
                    const fallbackRef = FB.db.collection("languages").doc(this.fallback);
                    fallbackRef.get().then((fallback) => {
                        if (fallback.exists) {
                            this.strings = fallback.data();
                            resolve(this.strings);
                        }
                    })
                }
            });
        })
    };

    get(key){
        return this.strings[key] || `???${key}???`;
    }

    changeLocale(locale){
        this.locale = locale;
        EE.emit('localeChanged');
    }
}

const I = new I18n();

export {I as I18n};
