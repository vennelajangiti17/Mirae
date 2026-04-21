Design a premium, high-contrast web application and Chrome extension UI for "AppTrack," an advanced Application Tracking System. The design must feel like a high-end, executive productivity tool—sophisticated, data-dense, but impeccably clean.

CRITICAL - Global Design & Color Schema:
You must strictly adhere to this "Black and Gold Elegance" color palette. Do not introduce stray colors.

Deep Navy (#14213D): Use for the main left sidebar background, top navigation bars, and primary secondary text (metadata).

Pure White (#FFFFFF): Use for the background of all data cards, modals, slide-out drawers, and the main calendar grid. This creates a crisp reading surface.

Platinum Gray (#E5E5E5): Use as the main app background canvas (so the white cards pop), subtle borders, and dividers.

Marigold Gold (#FCA311): The primary accent. Use sparingly but boldly for primary CTA buttons, active state highlights, the "Match Score" progress rings, and important alerts.

Pure Black (#000000): Use for primary headings, job titles, and high-contrast typography.

Typography: Use a geometric sans-serif like Geist, Inter, or SF Pro.

Styling: Sharp corners with very slight rounding (4px-6px). Sharp, crisp, drop shadows (e.g., 0 4px 6px rgba(0,0,0,0.1)).

Please generate the following 5 distinct screens, incorporating all requested features:

Screen 1: The Chrome Extension Capture Popup (360px wide, 500px tall)

Container: Pure White (#FFFFFF) background, thin Platinum Gray (#E5E5E5) border.

Header: Deep Navy (#14213D) background. White text for "AppTrack". A small Gold (#FCA311) dot indicating "Connected".

Form: >     * Bold Black (#000000) input text for Role ("Senior Backend Engineer").

Deep Navy (#14213D) input text for Company ("Stripe").

A segmented toggle for [ Job | Hackathon | Contest ] outlined in Navy.

Smart Analysis: A section with a light Platinum Gray background. Shows a Gold (#FCA311) circular progress ring reading "92% Match". Below it, 3 skill tags (e.g., 'Node.js', 'MongoDB') styled with Navy backgrounds and White text.

Footer: A full-width Gold (#FCA311) button with Black (#000000) bold text: "Save to Dashboard".

Screen 2: Main Dashboard - Stacked Grid Layout (NO Horizontal Scrolling)

Layout: 1440px wide. Left sidebar is 240px. Main content scrolls vertically only.

Left Sidebar: Deep Navy (#14213D) background. Navigation links (Dashboard, Analytics, Calendar, Settings) in Platinum Gray. The active "Dashboard" link has a solid Gold (#FCA311) left border and Gold text. User profile at the bottom.

Top Bar: White background. A wide search bar ("Search applications... CMD+K") with a Platinum Gray border. A Gold "+ Add Manual" button.

Main Content Area (The Stacked Grid): Platinum Gray (#E5E5E5) background. Instead of side-by-side columns, stack the stages vertically.

Section 1: "Interviewing (3)" - Bold Black header. Below it, a CSS Grid (3 columns wide) of Rich Cards.

Section 2: "Applied (12)" - Bold Black header. Below it, a CSS Grid of Rich Cards.

Rich Card Design (Inside the grids):

Background: Pure White (#FFFFFF), crisp shadow.

Top: A rich cover image (e.g., modern office or code snippet) taking up the top 30% of the card. A small Deep Navy tag overlays the image with the company acronym (e.g., "ST" for Stripe).

Middle: Job Title in bold Black (#000000). Company name below in Deep Navy (#14213D).

Bottom: A small Gold (#FCA311) badge for Match Score. A Platinum Gray tag for "Applied 2d ago". A tiny paperclip icon indicating a saved resume.

Screen 3: Application Detail Slide-Out Drawer

Layout: A 600px wide drawer sliding in from the right over a darkened dashboard.

Drawer Header: Deep Navy (#14213D) background. White text for the Job Title and Company. A Gold (#FCA311) dropdown button showing current stage ("Applied").

Tabs: [ Overview | Timeline & Prep | Notes | Documents ]. Active tab has a Gold bottom border.

Content (Overview Tab - White Background):

Match Score: A large, prominent Gold circular chart showing 88%.

Skill Gap: Two lists. "Matched Skills" (tags with Navy bg/White text). "Missing Skills" (tags with Platinum Gray bg/Black text).

Description: A text area with the job description. Key matched skills in the text are highlighted with a subtle Gold background.

Screen 4: Analytics Dashboard

Layout: Standard Navy sidebar. Main area is Platinum Gray with White widget cards.

KPI Row: 3 White cards. e.g., "Total Apps: 45" (Black text), "Interview Rate: 18%" (Gold text with upward arrow).

Charts:

Funnel Chart: A White card showing the drop-off from Saved -> Applied -> Interview. Use shades of Navy and Gold for the funnel stages.

Skill Demand: A White card with a horizontal bar chart. The bars are Deep Navy (#14213D), highlighting the most requested skills in the user's saved jobs.

Screen 5: Calendar & Reminders View

Layout: Standard Navy sidebar. Main area split: 70% Calendar, 30% Agenda Sidebar.

Calendar: A crisp White grid with Platinum Gray borders.

Events: "Deadline" events are solid Black blocks with White text. "Interview" events are solid Gold (#FCA311) blocks with Black text.

Right Agenda Sidebar: White background. A list of upcoming tasks. e.g., "Tomorrow: Technical Interview - Stripe" with a small Gold action button to "View Prep Notes".

Why this specific prompt will yield great results:
Explicit Color Mapping: AI generators can easily get confused by a palette and apply it randomly (e.g., making the background Gold and the text Gray). This prompt tells the AI exactly what element gets which hex code.

Solving the Layout Problem: By explicitly commanding "NO Horizontal Scrolling" and defining the "Stacked Grid" with horizontal sections (Section 1: Interviewing, Section 2: Applied), it forces the AI to abandon the traditional Trello-style board for the modern, dense grid style you liked in your reference image.

Typography Contrast: Black and Navy are used for text to ensure it passes accessibility standards and remains highly readable against the white cards and gray canvas.