import Calendar from '../../libraries/react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import '../../libraries/react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './custom-big-calendar.css';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AVAILABILITY_ACTIONS } from '../../redux/actions/availabilityActions';
import { CUSTOMER_ACTIONS } from '../../redux/actions/customerActions';
import sweetAlertFailure from '../../redux/modules/sweetAlertFailure';
import sweetAlertSuccess from '../../redux/modules/sweetAlertSuccess';

Calendar.setLocalizer(Calendar.momentLocalizer(moment));
const DragAndDropCalendar = withDragAndDrop(Calendar);

const mapStateToProps = state => ({
    available: state.availability.available,
    unavailable: state.availability.unavailable,
    estimate: state.customer.duration,
});

class ApptCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [
                {    
                start: null,
                end: null,
                },
            ],
            newEvent: {
                start: null,
                end: null,
            }
        }
    }

    componentDidMount() {
        this.props.dispatch({ type: AVAILABILITY_ACTIONS.FETCH });
        this.props.dispatch({ type: AVAILABILITY_ACTIONS.GET_UN});
    }

    componentDidUpdate(prevProps) {
        if(this.props.unavailable !== prevProps.unavailable) {
            if (this.props.userType === 'customer'){
                let tempArray = [];
                for(let object of this.props.unavailable){
                    for(let prop in object){
                        object[prop] = new Date(object[prop]);
                    }
                    tempArray.push(object);
                }  
                this.setState({events: [...this.state.events, ...tempArray]});
            }
            else if (this.props.userType === 'admin'){
                let tempArray = [];
                for(let object of this.props.available){
                    for(let prop in object){
                        object[prop] = new Date(object[prop]);
                    }
                    tempArray.push(object);
                }
                    this.setState({events: [...tempArray]});
                }
        }
    }

    moveEvent = ({ event, start, end }) => {
        const { events } = this.state;
        const idx = events.indexOf(event);
        if(idx === 0){
            const updatedEvent = { ...event, start, end};
            const nextEvents = [...events];
            nextEvents.splice(idx, 1, updatedEvent);
            this.setState({
            events: nextEvents,
            });
            this.props.dispatch({ type: CUSTOMER_ACTIONS.APPT, payload: updatedEvent });
            sweetAlertSuccess(`You're desired cleaning time has changed to be on ${updatedEvent.start.toLocaleDateString()} from ${updatedEvent.start.toLocaleTimeString()} to ${updatedEvent.end.toLocaleTimeString()}.`);
        } else {
            sweetAlertFailure("You can only change your event.");
        }
    }

    onSelect = (slotInfo) => {
        // Select function for customer-facing side - select appointment with duration equal to estimate
        if (this.props.userType === 'customer'){
            // Ensure only one appointment has been selected
            if(this.state.events[0].start){
                sweetAlertFailure("You've already chosen a time for the cleaning, if this was a mistake, feel free to drag and drop your previous selection to your desired time.");
            } else {
                    // Create appointment event using data passed by the onSelectSlot property
                    // Start is created by initial click, end is created by drag and release
                    let start = new Date(slotInfo.start);
                    let end = new Date(slotInfo.end);
                    // Determine duration of appointment selection by calculation time difference between start and end
                    let diffHours = end.getHours() - start.getHours();
                    let diffMinutes = end.getMinutes() - start.getMinutes();
                    let diff = diffHours + (diffMinutes / 60);
                    // Ensure the duration of appointment selection is equal to the duration estimate calculated elsewhere
                    // If it is, create the appointment as a new event and add to the array of events for displaying
                    if (this.props.estimate === diff){
                        this.setState({
                            newEvent: {start: new Date(slotInfo.start), end: new Date(slotInfo.end)},
                        });
                        this.setState({
                            events: [this.state.newEvent, ...this.props.unavailable]
                        });
                        // Dispatch the appointment data using newEvent
                        this.dispatchAppt();
                        return true;
                    } else {
                        sweetAlertFailure(`The time you've selected does not match your estimated duration of ${this.props.estimate} hour(s). Please select another time that will accomodate this estimate.`);
                    }
            }
        // Select function for admin side - changes availability on customer side  
        } else if (this.props.userType === 'admin'){
            this.setState({
                newEvent: {start: new Date(slotInfo.start), end: new Date(slotInfo.end)},
            });
            this.setState({
                events: [...this.state.events, this.state.newEvent]
            });
            this.dispatchAvailability();
            return true;
        }        
    }    

    // Dispatch appointment selection as newEvent to the appropriate reducer
    // from there you can use sagas and a request to Post to db
    dispatchAppt = () => {
        this.props.dispatch({ type: CUSTOMER_ACTIONS.APPT, payload: this.state.newEvent });
        sweetAlertSuccess(`We've recorded you're desired cleaning time on ${this.state.newEvent.start.toLocaleDateString()} from ${this.state.newEvent.start.toLocaleTimeString()} to ${this.state.newEvent.end.toLocaleTimeString()}`);
    }

    dispatchAvailability = () => {
        this.props.dispatch({ type: AVAILABILITY_ACTIONS.NEW, payload: this.state.newEvent });
        this.setState({
            newEvent: { start: null, end: null }
        });
    }

    render() {
        return (
            <div>
                <DragAndDropCalendar 
                defaultDate={new Date()}
                defaultView={Calendar.Views.WEEK}
                views={{
                    week: true,
                }}
                events={this.state.events}
                onEventResize={this.resizeEvent}
                onEventDrop={this.moveEvent}
                selectable
                resizable
                showMultiDayTimes
                step={30}
                min={new Date(2018, 7, 2, 5)}
                max={new Date(2018, 7, 2, 20)}
                onSelectSlot={this.onSelect}
                />
            </div>
        );
    }
}

export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(ApptCalendar));