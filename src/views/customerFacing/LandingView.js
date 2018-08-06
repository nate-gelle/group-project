import React from 'react';

// Material UI Imports
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';
import styles from '../../styles/LandingViewStyles';
import { Typography } from '../../../node_modules/@material-ui/core';

// Component Imports
import { Link } from 'react-router-dom';

//Parallax
import { Parallax, ParallaxLayer } from 'react-spring'

class CustomerLandingView extends React.Component{
    constructor(){
        super();
        this.state = {selection: null, path: '/roominput'}
    }

    selectLocationType = (type) => {
        if(this.state.selection === null){
            if(type === "residential"){
                this.setState({selection: true, path: '/roominput'});
            } else {
                this.setState({selection: false, path: '/contact'});
            }
        } else {
            if(type === "residential"){
                this.setState({selection: true, path: '/roominput'});
            } else {
                this.setState({selection: false, path: '/contact'});
            }
        }
    }

    render(){

        const { classes } = this.props;

        let locationTypeChoices = null;
        let locationTypeTitle = null;
        let locationTypeContent = null;
        if(this.state.selection === null){
            locationTypeTitle = (
                <Typography variant="title">Choose a location type</Typography>
            );
            locationTypeContent = (
                <Typography>
                    Choose Residential for cleaning a home, or an airbnb.
                </Typography>
            );
            locationTypeChoices = (
                <div>
                    <Button onClick={() => this.selectLocationType('residential')} className={classes.unselectedLocationType} value="residential">Residential</Button>
                    <Button onClick={() => this.selectLocationType('commercial')} className={classes.unselectedLocationType} value="commercial">Commercial</Button>
                </div>
            );
        } else if(this.state.selection){
            locationTypeTitle = (
                <Typography variant="title">Residential</Typography>
            );
            locationTypeContent = (
                <Typography>
                    What to expect: You'll fill out our estimator to receive an estimated duration your cleaning will take and then we'll contact you when we've confirmed.
                </Typography>
            );
            locationTypeChoices = (
                <div>
                    <Button onClick={() => this.selectLocationType('residential')} className={classes.selectedLocationType}>Residential</Button>
                    <Button onClick={() => this.selectLocationType('commercial')} className={classes.unselectedLocationType}>Commercial</Button>
                </div>
            );
        } else {
            locationTypeTitle = (
                <Typography variant="title">Commercial</Typography>
            );
            locationTypeContent = (
                <Typography>
                    What to expect: You'll be navigated to our contact form, and then we will get in touch to discuss the cleaning in further detail.
                </Typography>
            );
            locationTypeChoices = (
                <div>
                    <Button onClick={() => this.selectLocationType('residential')} className={classes.unselectedLocationType}>Residential</Button>
                    <Button onClick={() => this.selectLocationType('commercial')} className={classes.selectedLocationType}>Commercial</Button>
                </div>
            );
        }

        return(
            <Parallax ref="parallax" pages={3}>

            <Parallax.Layer offset={0} speed={1} style={{ backgroundColor: '#243B4A' }} />
            <Parallax.Layer offset={1} speed={1} style={{ backgroundColor: '#805E73' }} />
            <Parallax.Layer offset={2} speed={1} style={{ backgroundColor: '#87BCDE' }} />

            <Parallax.Layer
                offset={0}
                speed={0.5}
                style={styles}
                onClick={() => this.refs.parallax.scrollTo(1)}>
                <center>
                <img src='/LOGO-01.png' width='1000px'></img>
                </center>
           
            </Parallax.Layer>

            <Parallax.Layer
                offset={1}
                speed={-0.1}
                style={styles}
                onClick={() => this.refs.parallax.scrollTo(2)}>
                 
            </Parallax.Layer>

            <Parallax.Layer
                offset={2}
                speed={0.5}
                style={styles}
                onClick={() => this.refs.parallax.scrollTo(0)}>
                 <Paper>
                {locationTypeChoices}
                <Card>
                    <CardContent>
                        {locationTypeTitle}
                        {locationTypeContent}
                    </CardContent>
                </Card>
                <Link to={this.state.path} className={classes.getStartedLink}><Button className={classes.getStartedButton}>Get Started</Button></Link>
            </Paper>
            </Parallax.Layer>

        </Parallax>
            
        );
    }
}

export default withStyles(styles)(CustomerLandingView);