Redesign the Calendar & Reminders section of my AppTrack dashboard in a clean, premium “Black and Gold Elegance” theme.

Strict theme rules:
- Deep Navy (#14213D): sidebar, headings, primary text
- Platinum Gray (#E5E5E5): background, dividers, borders
- Pure White (#FFFFFF): cards, panels, dropdowns
- Marigold Gold (#FCA311): buttons, accents, clash highlight
- Blue (#378ADD): today highlight only

Design goals:
- Elegant, minimal, spacious
- Rounded corners: 10–12px
- Soft subtle shadows only
- Strong visual hierarchy
- Premium dashboard look


- No clutter

Important updates to make:

1. Month selector only
- At the top of the calendar, show only the month name, for example “May”
- Remove the year from the header completely
- Clicking the month should open a dropdown with only months (January to December)
- Do not show any year selector, year dropdown, or year list anywhere
- Keep left and right arrows for previous/next month navigation

2. Remove Today button
- Remove the blue “Today” button beside the arrows
- Keep only the month dropdown and month navigation arrows

3. Today highlight
- Highlight today using a subtle blue outline and light blue tint
- Today should look important but elegant
- Use a small filled blue circle behind the date number
- Today must have stronger visual priority than clash highlight

4. Clash highlight
- Clash dates should use marigold gold styling, not red
- Use a dashed or soft gold border with a very light gold background tint
- Clash must look secondary to today
- Only actual overlapping timed events should be shown as clashes

5. Correct clash logic
- Update the design and UX to reflect proper clash logic:
  - A clash should happen only when two timed events overlap in their actual time ranges
  - Do not mark a clash just because two events are on the same day
  - Do not mark a clash based only on start times being close
  - Deadlines should usually not be treated as clashes unless they have an overlapping active time block
- Example:
  - Interview: 2:00 PM – 3:00 PM
  - Follow-up: 4:00 PM – 4:30 PM
  - Deadline: 11:59 PM
  - These should NOT be shown as a clash

6. Date click behavior
- When I click a date, open a floating details panel or side modal
- The background outside the modal should NOT become a plain black screen
- The calendar behind it should still remain visible with a soft blurred or dimmed overlay
- Show the actual calendar page in the background, not a black empty area
- The modal should feel connected to the calendar UI

7. Empty date state
- If I click a date that has no events, the panel should still open
- Show a clean empty state message such as:
  - “No events scheduled”
  - “No reminders for this day”
- Add a small optional secondary action like:
  - “Add event”
- The empty state should look elegant and intentional, not blank

8. Date event panel design
- When a date with events is clicked, show:
  - Date title at top
  - Number of events
  - Event cards below
- Each event card should include:
  - Event title
  - Event type badge (Interview / Deadline / Follow-up)
  - Start time
  - End time
  - Duration
  - Small edit icon
  - Small delete icon
- Keep spacing clean and readable

9. Event type colors
- Interview badge → soft green
- Deadline badge → soft muted red/rose
- Follow-up badge → soft blue
- Clash state in calendar → gold
- Today state in calendar → blue

10. Google Calendar integration
- Add a clear Google Calendar connection state in the calendar segment
- Show a small “Google Calendar Connected” indicator or sync status
- Add a clean reminder/sync section in the UI
- Reflect that events can sync with Google Calendar and send reminders
- Show reminder support such as:
  - browser reminder
  - email reminder
  - Google Calendar reminder
- Add a subtle reminder icon or sync badge to relevant events
- The design should communicate that the calendar is connected to Google Calendar for reminders and scheduling sync

11. Calendar experience
- Large monthly calendar grid on the left
- Right side can contain Weekly Summary and Upcoming Agenda
- Keep event dots minimal and clean
- If multiple events exist on a day, show compact dots and “+1” style overflow
- Use elegant spacing and consistent typography

12. Empty and active states
- No black full-screen empty background
- Use soft overlay when modal opens
- No blank event panel
- Every interaction should feel polished and intentional

Final design intent:
Create a polished monthly calendar dashboard that shows only months in the top selector, uses blue for today, gold for real time clashes, opens date details without turning the background black, shows a “No events scheduled” empty state for dates without events, removes the Today button near the arrows, and visually communicates Google Calendar reminder sync in a premium Black and Gold Elegance theme.


Also change the name to Mirae
