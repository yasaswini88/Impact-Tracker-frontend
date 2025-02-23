import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'

const localizer = momentLocalizer(moment)

const BusinessCalendar = (props) => (
  <div>
    <Calendar
      localizer={localizer}
      events={[
        { title: "event 1", date: "2021-05-07" },
        { title: "event 2", date: "2021-05-17" }
      ]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
      defaultView='month'
    />
  </div>
)


export default BusinessCalendar;