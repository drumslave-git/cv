import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import {EE} from "../../helpers/EE";
import { randInt } from "../../helpers/general";

import styles from './JustText.less';

const textChangeDelay = 1000;

class JustText extends PureComponent {
    constructor(props){
        super(props);

        EE.on('picClicked', this.toggleMadness)
        window.addEventListener('resize', this.applySizes)
    }
    textRef = React.createRef();
    madnessTimeout = null;
    textChangeDelay = textChangeDelay;
    state = {
        madness: false
    };
    componentDidMount() {
        this.applySizes();
    }

    componentDidUpdate() {
        if(this.state.madness) {
            this.textChangeDelay = textChangeDelay;
            this.cycleRandWords()
        }else{
            this.cycleRandWords(true);
        }
    }

    toggleMadness = () => {
        this.setState({
            madness: !this.state.madness
        })
    };

    cycleRandWords = (reset = false) => {
        clearTimeout(this.madnessTimeout);
        if(reset && this.textChangeDelay === textChangeDelay){
            this.randWords(reset);
            return;
        }
        this.madnessTimeout = setTimeout(() => {
            this.randWords();
            if(!reset) {
                if (this.textChangeDelay > 200) {
                    this.textChangeDelay -= 100;
                }
            }else{
                this.textChangeDelay += 100;
            }
            this.cycleRandWords(reset);
        }, this.textChangeDelay)
    };

    randWords(reset = false) {
        if(!this.textRef.current) return;
        requestAnimationFrame(() => {
            const groupsOfWords = this.textRef.current.querySelectorAll(`.${styles.groupOfWords}`);
            for(let groupOfWords of groupsOfWords){
                const words = groupOfWords.querySelectorAll(`.${styles.singleWord}`);
                const groupVisibleIdx = reset ? 0 : randInt(0, words.length - 1);
                for(let i = 0; i < words.length; i++){
                    const word = words[i];
                    if(reset){
                        word.style.display = '';
                        continue;
                    }
                    if(i === groupVisibleIdx){
                        word.style.display = 'inline-block';
                    }else{
                        word.style.display = 'none';
                    }
                }
            }
        });
    }

    applySizes = () => {
        if(!this.textRef.current) return;
        const groupsOfWords = this.textRef.current.querySelectorAll(`.${styles.groupOfWords}`);
        for(let groupOfWords of groupsOfWords){
            const words = groupOfWords.querySelectorAll(`.${styles.singleWord}`);
            const word = words[0];
            word.style.display = 'inline-block';
            // requestAnimationFrame(() => {
                const {width, height} = word.getBoundingClientRect();
                word.style.display = '';
                if(words[1]){
                    const word2 = words[1];
                    word2.style.display = 'inline-block';
                    // requestAnimationFrame(() => {
                        const { width: width2, height: height2 } = word2.getBoundingClientRect();
                        word2.style.display = '';
                        if (width2 > width) {
                            groupOfWords.style.width = ``;
                        } else {
                            groupOfWords.style.width = `${width}px`;
                        }
                        if (height2 > height) {
                            groupOfWords.style.height = ``;
                        } else {
                            groupOfWords.style.height = `${height}px`;
                        }
                    // })
                }
            // })
        }
    };

    static parseAndRender = (text) => {
        return text.replace(/{#.+?#}/gm, function (group) {
            const words = group.replace(/[{#}]/gm, '').split('|').map((word, idx) => {
                return `<span class="${styles.singleWord}">${word}</span>`;
            });

            return `<span class="${styles.groupOfWords}">${words.join('')}</span>`
        });
    };
    render() {
        return (
            <div className={styles.justText} ref={this.textRef} dangerouslySetInnerHTML={{__html: JustText.parseAndRender(this.props.text)}} />
        );
    }

    componentWillUnmount() {
        EE.off('picClicked', this.toggleMadness);
        window.removeEventListener('resize', this.applySizes)
    }

}

JustText.propTypes = {
    text: PropTypes.string.isRequired,
};

export {JustText};
