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
                               <table>
                                   <tbody>
                                    <tr>
                                        <td>
                                            Name
                                        </td>
                                        <td>
                                            <JustText
                                                text={'{#George|Drum#}'}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Last Name
                                        </td>
                                        <td>
                                            <JustText
                                                text={'{#Tislenko|Slave#}'}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Job Title
                                        </td>
                                        <td>
                                            <JustText
                                                text={'{#Full stack web developer (PHP + JS)|God#}'}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Age
                                        </td>
                                        <td>
                                            <JustText
                                                text={`${27 + randInt(1, 2)}`}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Location
                                        </td>
                                        <td>
                                            Ukraine, Dnipro
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Languages
                                        </td>
                                        <td>
                                            Russian, Ukrainian, English
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Intro
                                        </td>
                                        <td>
                                            Courteous and enthusiastic, I am interested in IT and everything in its orbit. I recently began to be fascinated by web programming, e.g. developing apps and building websites. Invited to join my friend's start-up company as a front-end developer, I gained experience of working in this area.
                                            As this area complements my studies, I am keen to gain more experience in the field. For this reason, I am looking for a company willing to offer me a placement among their developers. In return, I would offer my full commitment, and be a pleasant and friendly addition to your team.
                                            I am therefore currently looking for a job or an internship as a front-end developer.
                                        </td>
                                    </tr>
                                   </tbody>
                               </table>
                           </div>
                       </Panel>
                       <Panel
                           marginTop="medium"
                           title={'Education'}
                           className={styles.generalPanel}
                       >
                           <table>
                               <tbody>
                                   <tr>
                                       <td>
                                           <JustText
                                               text={'{#Dnipropetrovsk State Technical University of Railway Transport|Mordor#}'}
                                           />
                                       </td>
                                       <td>
                                           <JustText
                                               text={'{#2007 - 2012|felt like it will never end#}'}
                                           />
                                       </td>
                                   </tr>
                                   <tr>
                                       <td>
                                           Degree
                                       </td>
                                       <td>
                                           Specialist
                                       </td>
                                   </tr>
                                   <tr>
                                       <td>
                                           Speciality
                                       </td>
                                       <td>
                                           <JustText
                                               text={'{#Computer science|professional time waster#}'}
                                           />
                                       </td>
                                   </tr>
                               </tbody>
                           </table>
                       </Panel>
                        <Panel
                            marginTop="medium"
                            title={'Tutor'}
                            className={styles.generalPanel}
                        >
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                Frontend basics course
                                            </td>
                                            <td>
                                                3 months
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Regularity
                                            </td>
                                            <td>
                                                twice per week
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Number of attendees
                                            </td>
                                            <td>
                                                <JustText
                                                    text={'{#8|only 5 survived#}'}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                Includes
                                            </td>
                                            <td>
                                                HTML, CSS, JavaScript, jQuery, Asynchronous requests, Responsive layout
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                        </Panel>
                        <Panel
                            marginTop="small"
                            className={styles.generalPanel}
                        >
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Backend basics course
                                    </td>
                                    <td>
                                        5 months
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Regularity
                                    </td>
                                    <td>
                                        twice per week
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Number of attendees
                                    </td>
                                    <td>
                                        6
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Includes
                                    </td>
                                    <td>
                                        HTML, CSS, PHP, jQuery, MySQL
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Panel>
                        <Panel
                            marginTop="medium"
                            className={styles.generalPanel}
                            title={'Experience'}
                        >
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            Freelance Web Developer
                                        </td>
                                        <td>
                                            Jan 2018 - Present
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Company
                                        </td>
                                        <td>
                                            Upwork
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                        </Panel>
                        <Panel
                            marginTop="small"
                            className={styles.generalPanel}
                        >
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        Chief Technology Officer
                                    </td>
                                    <td>
                                        Jun 2012 - Dec 2017
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        Company
                                    </td>
                                    <td>
                                        <img className={styles.wsLogo} src={wsSmall} alt=""/>
                                        <JustText
                                            text={'{#WhaleSoft|it is dead#}'}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        About
                                    </td>
                                    <td>
                                        <JustText
                                            text={'{#WhaleSoft are an ambitious and coherent team of professional programmers which specializing in web development, mobile integration, web UI/UX, application development and email marketing.|not because of me!#}'}
                                        />
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </Panel>
                        {Object.keys(skills).map(title => {
                            return (
                                <Panel
                                    key={title}
                                    title={`Skills: ${title}`}
                                    marginTop="medium"
                                    className={styles.generalPanel}
                                >
                                    <table>
                                        <tbody>
                                        {Object.keys(skills[title]).map(skill => {
                                            return (
                                                <tr key={skill}>
                                                    <td>{skill}</td>
                                                    <td>{this.renderSkill(skills[title][skill])}</td>
                                                </tr>
                                            )
                                        })}
                                        </tbody>
                                    </table>
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
