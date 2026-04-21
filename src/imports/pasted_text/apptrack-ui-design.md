Design a comprehensive web application and Chrome extension user interface for "AppTrack," a modern, data-dense Application Tracking System tailored for software engineers and students. The system manages job, internship, and hackathon applications. The aesthetic must be highly professional, clean, and minimalist, drawing inspiration from developer-focused tools like Linear, Vercel, and Notion. The UI must prioritize information density, legibility, and efficient workflow without feeling cluttered.

Global Style Guidelines:

Typography: Primary font is Inter or Geist (clean, modern sans-serif). Use clear hierarchical weights: bold/semi-bold for headings and key metrics, medium/regular for dense data.

Color Palette:

Background: Very light gray (#F9FAFB) for main application areas to reduce eye strain.

Surface: Pure white (#FFFFFF) for cards, modals, and dropdowns.

Primary Accent: Deep Indigo or Slate Blue (conveys professionalism and focus).

Semantic Colors (Crucial for state indication):

Positive/High Match/Offers: Emerald Green.

Pending/Interview/Warning: Deep Amber/Yellow.

Rejected/Urgent Deadlines: Crimson Red.

Informational/Tags: Pale Blue or subtle Gray with darker text.

UI Elements: Use subtle, refined drop shadows (shadow-sm for resting state, shadow-md for hover). Use a border-radius of 8px to 12px for modern, soft corners. Borders should be thin and subtle (gray-200). Use smooth, minimal transitions.

Please generate the following 5 distinct screens/views:

Screen 1: The Chrome Extension Capture Popup
Dimensions: 360px wide, max 500px tall. Floating above a blurred background.

Header: Left-aligned minimalist AppTrack logo. Right-aligned subtle "X" close icon. A tiny green dot indicator next to the logo signifying "API Connected."

Content Area (Vertical Stack):

Input 1: Large, bold text input for "Role Title" (e.g., pre-filled with 'Senior Frontend Engineer').

Input 2: Standard text input for "Company Name" (e.g., pre-filled with 'Stripe').

Selector: A sleek, pill-shaped segmented control with three toggle buttons: [ Job | Hackathon | Contest ]. 'Job' is currently selected.

Smart Analysis Section:

A sub-heading: "Detected Insights".

A small circular progress indicator showing "88% Match" in Emerald Green.

A row of small, pill-shaped tags showing detected skills (e.g., 'React', 'TypeScript', 'GraphQL') in a pale blue color.

Footer: A full-width, solid Primary Indigo button labeled "Save to AppTrack". Below it, a subtle text link: "Go to Dashboard".

Screen 2: Main Kanban Dashboard
Dimensions: 1440px wide (Desktop).

Left Sidebar (Fixed, 240px wide, light gray background):

Top: AppTrack logo.

Navigation Menu: Links for 'Dashboard' (Active state: bold text with a subtle blue background highlight), 'Analytics', 'Calendar', 'Settings'.

Bottom: User Avatar, Name, and a dark mode toggle switch.

Top Action Bar:

Center: A wide, prominent search bar with placeholder text "Search companies, roles, or notes..." and a visual "CMD+K" shortcut hint.

Right: A row of filter buttons (e.g., 'Urgency', 'Type') and a primary solid Indigo button labeled "+ Add Manual".

Kanban Board Area (The core workspace):

5 distinct vertical columns. Headers from left to right: 'Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'.

Each header includes the column name and a small, subtle grey counter badge (e.g., 'Applied (14)').

Kanban Card Design (Design a sample card in the 'Applied' column):

Card Surface: White, thin border, subtle shadow.

Top Row: A 16x16px company logo placeholder next to the company name ('Acme Corp') in small grey text. A tiny external link icon on the far right.

Middle Row: The Role Title ('Full-Stack Developer') in bold, 14pt dark text.

Bottom Row (Metadata): A small green badge showing "Match: 82%". Next to it, a small calendar icon with the text "Applied 2d ago". On the far right, a subtle paperclip icon indicating attached documents.

Screen 3: Application Detail Slide-Out Drawer
Layout: A wide panel (approx. 600px) sliding in from the right edge, casting a heavy shadow over the darkened Kanban dashboard beneath it.

Drawer Header (Sticky):

Large, prominent typography for the Role Title and Company.

Top Right: A prominent dropdown button to change the current stage (e.g., showing current state "Applied").

Navigation: A horizontal tab row directly below the header: [ Overview | Timeline | Notes | Documents ]. 'Overview' is active (indicated by a blue bottom border).

Drawer Content (Overview Tab):

Top Section: A large circular progress widget displaying the "85% Match Score".

Skill Gap Analysis: Two distinct visual lists.

List 1 (Matched Skills): Green pill tags (e.g., 'Node.js', 'PostgreSQL').

List 2 (Missing Skills): Red/Grey pill tags (e.g., 'Docker', 'AWS').

Description Area: A scrollable text box containing a sample job description. The matched skills within the text should be highlighted with a subtle yellow marker effect.

Screen 4: Analytics & Insights Dashboard
Layout: Standard sidebar on the left. Main area is a grid layout.

Top Row (KPI Cards): Three distinct rectangular cards.

Card 1: "Total Applications: 64"

Card 2: "Interview Rate: 18%" (Include a small green upward arrow indicating positive trend).

Card 3: "Active Offers: 2"

Middle Row (Charts):

Left side (larger area): A clean Funnel Chart visualizing the drop-off from 'Saved' -> 'Applied' -> 'Interviewing' -> 'Offer'.

Right side: A horizontal Bar Chart titled "Most Demanded Skills". The bars represent skills ('React', 'Python', 'SQL') and their frequency in saved jobs.

Screen 5: Calendar & Reminders View
Layout: Standard sidebar on the left. Main area features a large, clean calendar interface (similar to Google Calendar's monthly view).

Calendar Grid:

Display a standard month.

Plot 3-4 visual events on specific days using semantic colors.

Red block: "Deadline: Stripe Frontend"

Amber/Yellow block: "Interview: Acme Corp"

Blue block: "Follow-up: Google STEP"

Right-Hand Sidebar (Agenda):

A vertical list titled "Upcoming Agenda".

List the next 3 immediate tasks (e.g., "Tomorrow: Follow up with Acme Corp") with a small action button next to each (e.g., an email icon to draft a follow-up).