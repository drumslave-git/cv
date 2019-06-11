import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames'

import {User} from '@/server/controllers/User';
import {I18n} from '@/server/controllers/I18n';
import {Api} from '@/server/controllers/Api';


import {EE, say} from "@/helpers/EE";
import {randInt} from "@/helpers/general";

import {Menu} from "../Menu";
import {Panel} from "../Panel";
import {JustText} from "../JustText";

import styles from './Main.less';

import wsSmall from '@assets/wsSmall.jpg'

const skills = Api.get('skills');

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

class Main extends PureComponent {
    constructor(props){
        super(props);
        EE.on('picClicked', this.toggleMadness)
    }

    mainPictureRef = React.createRef();

    menuItems = [
        {
            to: '/',
            'label': 'Home'
        },
        {
            to: '/pixelPaint/',
            'label': 'PixelPaint'
        },
    ];
    skillRemoveTimeout = null;
    // skillRemoveEl = null;
    toggleMadness = () => {
        if(this.mainPictureRef.current){
            this.mainPictureRef.current.classList.toggle(styles.picMadness);
        }
    };

    startSkillRemove = (e) => {
        e.persist();
        clearTimeout(this.skillRemoveTimeout);
        this.skillRemoveTimeout = setTimeout(()=>{
            e.target.classList.add(styles.hidden);
            // say('Why????');
        }, 1000)
    };

    stopSkillRemove = (e) => {
        clearTimeout(this.skillRemoveTimeout);
        if(e.target.classList.contains(styles.hidden)) {
            e.target.classList.add(styles.removed);
        }
    };

    renderSkill = (level) => {
        const points = [];
        for(let i = 1; i <= level; i++){
            points.push(
                <div
                    key={`skill-point-${i}`}
                    className={styles.skillPoint}
                    onMouseOver={this.startSkillRemove}
                    onMouseOut={this.stopSkillRemove}
                />
            )
        }

        return (
            <div className={styles.skillLevel}>{points}</div>
        )
    };

    render() {
        return (
            <React.Fragment>
                <div className={styles.content}>
                    <Menu
                        items={this.menuItems}
                    />
                    <div>
                       <Panel
                           topLine
                           marginTop="big"
                           className={cn(styles.generalPanel, styles.mainPanel)}
                           title={I18n.get('general')}
                       >
                           <div className={styles.mainPicture} ref={this.mainPictureRef} />
                           <div className={styles.mainInfo}>
                               <div className={styles.table}>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            {I18n.get('name')}
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={`{#${User.info.firstname}|${User.info.altfirstname}#}`}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            {I18n.get('lastname')}
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={`{#${User.info.lastname}|${User.info.altlastname}#}`}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            {I18n.get('jobTitle')}
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={`{#${User.info.jobTitle}|${User.info.altJobTitle}#}`}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            {I18n.get('age')}
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={`${getAge(User.info.birth) + randInt(0, 1)}`}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            {I18n.get('location')}
                                        </div>
                                        <div className={styles.td}>
                                            {User.info.location}
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            {I18n.get('languages')}
                                        </div>
                                        <div className={styles.td}>
                                            {User.info.languages}
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            {I18n.get('intro')}
                                        </div>
                                        <div className={styles.td}>
                                            {User.info.intro}
                                        </div>
                                    </div>
                               </div>
                           </div>
                       </Panel>
                       <Panel
                           marginTop="medium"
                           title={I18n.get('education')}
                           className={styles.generalPanel}
                       >
                           <div className={styles.table}>
                               <div className={styles.tr}>
                                   <div className={styles.td}>
                                       <JustText
                                           text={'{#Dnipropetrovsk State Technical University of Railway Transport|Mordor#}'}
                                       />
                                   </div>
                                   <div className={styles.td}>
                                       <JustText
                                           text={'{#2007 - 2012|felt like it will never end#}'}
                                       />
                                   </div>
                               </div>
                               <div className={styles.tr}>
                                   <div className={styles.td}>
                                       Degree
                                   </div>
                                   <div className={styles.td}>
                                       Specialist
                                   </div>
                               </div>
                               <div className={styles.tr}>
                                   <div className={styles.td}>
                                       Speciality
                                   </div>
                                   <div className={styles.td}>
                                       <JustText
                                           text={'{#Computer science|professional time waster#}'}
                                       />
                                   </div>
                               </div>
                           </div>
                       </Panel>
                        <Panel
                            marginTop="medium"
                            title={I18n.get('tutor')}
                            className={styles.generalPanel}
                        >
                                <div className={styles.table}>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Frontend basics course
                                        </div>
                                        <div className={styles.td}>
                                            3 months
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Regularity
                                        </div>
                                        <div className={styles.td}>
                                            twice per week
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Number of attendees
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={'{#8|only 5 survived#}'}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Includes
                                        </div>
                                        <div className={styles.td}>
                                            HTML, CSS, JavaScript, jQuery, Asynchronous requests, Responsive layout
                                        </div>
                                    </div>
                                </div>
                        </Panel>
                        <Panel
                            marginTop="small"
                            className={styles.generalPanel}
                        >
                            <div className={styles.table}>
                                <div className={styles.tr}>
                                    <div className={styles.td}>
                                        Backend basics course
                                    </div>
                                    <div className={styles.td}>
                                        5 months
                                    </div>
                                </div>
                                <div className={styles.tr}>
                                    <div className={styles.td}>
                                        Regularity
                                    </div>
                                    <div className={styles.td}>
                                        twice per week
                                    </div>
                                </div>
                                <div className={styles.tr}>
                                    <div className={styles.td}>
                                        Number of attendees
                                    </div>
                                    <div className={styles.td}>
                                        6
                                    </div>
                                </div>
                                <div className={styles.tr}>
                                    <div className={styles.td}>
                                        Includes
                                    </div>
                                    <div className={styles.td}>
                                        HTML, CSS, PHP, jQuery, MySQL
                                    </div>
                                </div>
                            </div>
                        </Panel>
                        <Panel
                            marginTop="medium"
                            className={styles.generalPanel}
                            title={I18n.get('experience')}
                        >
                                <div className={styles.table}>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Freelance Web Developer
                                        </div>
                                        <div className={styles.td}>
                                            Jan 2018 - Present
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Company
                                        </div>
                                        <div className={styles.td}>
                                            Upwork
                                        </div>
                                    </div>
                                </div>
                        </Panel>
                        <Panel
                            marginTop="small"
                            className={styles.generalPanel}
                        >
                            <div className={styles.table}>
                                <div className={styles.tr}>
                                    <div className={styles.td}>
                                        Chief Technology Officer
                                    </div>
                                    <div className={styles.td}>
                                        Jun 2012 - Dec 2017
                                    </div>
                                </div>
                                <div className={styles.tr}>
                                    <div className={styles.td}>
                                        Company
                                    </div>
                                    <div className={styles.td}>
                                        <img className={styles.wsLogo} src={wsSmall} alt=""/>
                                        <JustText
                                            text={'{#WhaleSoft|it is dead#}'}
                                        />
                                    </div>
                                </div>
                                <div className={styles.tr}>
                                    <div className={styles.td}>
                                        About
                                    </div>
                                    <div className={styles.td}>
                                        <JustText
                                            text={'{#WhaleSoft are an ambitious and coherent team of professional programmers which specializing in web development, mobile integration, web UI/UX, application development and email marketing.|not because of me!#}'}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Panel>
                        {Object.keys(skills).map(title => {
                            return (
                                <Panel
                                    key={title}
                                    title={`${I18n.get('skills')}: ${title}`}
                                    marginTop="medium"
                                    className={styles.generalPanel}
                                >
                                    <div className={styles.table}>
                                        {Object.keys(skills[title]).map(skill => {
                                            return (
                                                <div className={styles.tr} key={skill}>
                                                    <div className={styles.td}>{skill}</div>
                                                    <div className={styles.td}>{this.renderSkill(skills[title][skill])}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Panel>
                            )
                        })}
                    </div>
                </div>
                <div className={styles["bg-image"]}/>
            </React.Fragment>
        );
    }
}

Main.propTypes = {};

export {Main};
