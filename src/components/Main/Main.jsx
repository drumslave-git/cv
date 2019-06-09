import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames'

import {EE, say} from "@/helpers/EE";
import {randInt} from "@/helpers/general";

import {Menu} from "../Menu";
import {Panel} from "../Panel";
import {JustText} from "../JustText";

import styles from './Main.less';

import wsSmall from '@assets/wsSmall.jpg'

const skills = {
    main:
        {
            HTML: 9,
            CSS: 9,
            JavaScript: 8,
            PHP: 7,
            MySQL: 7
        },
    'UI Libs / Frameworks': {
        React: 8,
        Angular: 3,
        jQuery: 8,
        Backbone: 5,
        Bootstrap: 7,
        'Materialize.css': 5,
        Bulma: 3
    },
    'CMS / Frameworks': {
        OpenCart: 8,
        Magento: 5,
        WordPress: 7,
        MOBx: 7,
        YII: 3,
        CodeIgniter: 8,
    },
    other: {
        'Adobe Photoshop': 6,
        'Adobe After Effect': 3,
        '3D Studio Max': 4,
    }
};

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
                           title="General"
                       >
                           <div className={styles.mainPicture} ref={this.mainPictureRef} />
                           <div className={styles.mainInfo}>
                               <div className={styles.table}>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Name
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={'{#George|Drum#}'}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Last Name
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={'{#Tislenko|Slave#}'}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Job Title
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={'{#Full stack web developer (PHP + JS)|React one love#}'}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Age
                                        </div>
                                        <div className={styles.td}>
                                            <JustText
                                                text={`${27 + randInt(1, 2)}`}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Location
                                        </div>
                                        <div className={styles.td}>
                                            Ukraine, Dnipro
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Languages
                                        </div>
                                        <div className={styles.td}>
                                            Russian, Ukrainian, English
                                        </div>
                                    </div>
                                    <div className={styles.tr}>
                                        <div className={styles.td}>
                                            Intro
                                        </div>
                                        <div className={styles.td}>
                                            Courteous and enthusiastic, I am interested in IT and everything in its orbit. I recently began to be fascinated by web programming, e.g. developing apps and building websites. Invited to join my friend's start-up company as a front-end developer, I gained experience of working in this area.
                                            As this area complements my studies, I am keen to gain more experience in the field. For this reason, I am looking for a company willing to offer me a placement among their developers. In return, I would offer my full commitment, and be a pleasant and friendly addition to your team.
                                            I am therefore currently looking for a job or an internship as a front-end developer.
                                        </div>
                                    </div>
                               </div>
                           </div>
                       </Panel>
                       <Panel
                           marginTop="medium"
                           title={'Education'}
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
                            title={'Tutor'}
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
                            title={'Experience'}
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
                                    title={`Skills: ${title}`}
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
