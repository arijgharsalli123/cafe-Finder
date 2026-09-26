Project: CaféFinder
Type: Web application
Purpose: Help a user find cafés around their current location and
discover cafés matching their preferences.
Current status: Development in progress
Last validated step: Step 8.4 --- Real café data displayed as cards
Current stopping point: Before redesigning the café results section
Important: Do not jump ahead. Continue from the current checkpoint.

1. Project Vision

CaféFinder is a modern café-discovery web application.

The main idea is:

A user tells CaféFinder what they want from a café, gives permission
to use their location, and CaféFinder finds nearby cafés and helps
them choose one.

The application should eventually feel like a real polished product, not
like a school exercise.

The project should combine:

real location

real café data

useful filtering/matching

attractive modern UI

map visualization

café details

responsive design

animations

eventually 3D elements with Three.js / React Three Fiber

2. Main Problem

People often want to find a café according to a specific situation:

a quiet place to study

a café with Wi-Fi

a place with power outlets

somewhere to work

somewhere to meet someone

an outdoor café

an affordable café

a highly rated café

a café close to them

Normal map applications provide many places, but CaféFinder should make
the discovery process more focused on the user's intention and
preferences.

3. Target User

Primary target:

students

young professionals

remote workers

people looking for a place to study

people looking for a place to relax

people looking for a place to meet

The MVP should focus on one clear user journey instead of trying to
serve everybody.

4. Initial MVP

The MVP was defined as:

Landing page

User location detection

User intent selection

Preference selection

Search for nearby cafés

Retrieve real café data

Filter/match cafés

Display café results

Café details

Map / directions

Error and empty states

No authentication or database is required for the first MVP.

5. Initial User Flow

The planned flow is:

Landing
   ↓
Choose location
   ↓
Choose intention
   ↓
Choose preferences
   ↓
Search nearby cafés
   ↓
Retrieve real café data
   ↓
Filter / match results
   ↓
Café results
   ↓
Café details
   ↓
Map / directions

6. Technology

Current frontend

React

JavaScript

Vite

CSS

Framer Motion

Project:

cafe-finder

Development server:

http://localhost:5173

Vite version observed during development:

Vite 8.3.0

Framer Motion has been installed.

Planned technologies

Backend later:

Node.js

Express

Maps:

Leaflet

OpenStreetMap

Café data:

OpenStreetMap

Overpass API

Future 3D:

Three.js

React Three Fiber

Database:

Not required for the MVP

PostgreSQL may be introduced later if the project needs persistent
users, favorites, reviews, custom café data, analytics, etc.

7. Data Provider Decision

We discussed Google Maps Platform and the user's desire for a free-flow
project.

Instead of depending immediately on Google Maps Platform, we decided to
start with:

OpenStreetMap
+
Overpass API

Reasons:

suitable for experimentation

no immediate dependency on Google billing

provides real geographic/café data

allows us to build the core application first

Important limitation:

OpenStreetMap data does not necessarily provide all information that a
commercial places provider may provide.

For example:

café name: often available

coordinates: available

address: sometimes available

opening hours: sometimes available

Wi-Fi: sometimes available

outdoor seating: sometimes available

power outlets: rarely available

ratings/reviews: generally not available like commercial review
platforms

photos: not guaranteed

Therefore, we must never design the application assuming every café has
every field.

8. Architecture Direction

The long-term architecture should keep the data provider replaceable.

Conceptually:

CaféFinder
    ↓
Café data service
    ├── OpenStreetMap / Overpass
    └── Future provider if needed

The UI should not become tightly coupled to one external provider.

9. Completed Work

Step 1 --- Create the project

Created the Vite React project:

npm create vite@latest cafe-finder -- --template react
cd cafe-finder
npm install
npm run dev

The application runs successfully.

Step 2 --- Clean the default Vite project

Removed the default Vite presentation.

Current application is based on:

src/App.jsx
src/App.css
src/index.css

Step 3 --- Initial landing page

Created the first CaféFinder landing page containing:

navigation

hero section

CaféFinder branding

animated coffee cup illustration

floating information cards

location-related visual elements

primary call-to-action

responsive behavior

The visual direction initially used:

Espresso brown
Caramel
Cream / off-white
Warm gray

Step 4 --- Favicon and search/location section

Created:

public/coffee.svg

Updated the page metadata:

CaféFinder — Find Your Perfect Café

Added the location/search section and smooth scrolling.

Validated successfully.

Step 5 --- Preferences section

Added user intentions:

Study & Work
Coffee & Chill
Meeting
Date

Added preferences:

Wi-Fi
Power outlets
Open now
Outdoor
Highly rated
Affordable

Validated successfully.

Step 6 --- Interactive preferences

Added React state.

Intent:

single selection

Preferences:

multiple selections

The selected options are visually reflected in the UI.

Validated successfully.

Step 7 --- Browser geolocation

Implemented browser geolocation using:

navigator.geolocation.getCurrentPosition()

The application obtains:

latitude
longitude

Current structure includes state similar to:

const [location, setLocation] = useState(null);
const [locationStatus, setLocationStatus] = useState("idle");

The location is stored as:

{
  latitude,
  longitude
}

The application handles:

loading

successful location detection

unsupported geolocation

geolocation errors

We also verified that the actual browser location is being used.

10. Step 8 --- Real Café Data

Step 8.1 --- Test Overpass Turbo

We tested:

https://overpass-turbo.eu/

Using an Overpass query similar to:

[out:json];

node["amenity"="cafe"](around:3000,36.8065,10.1815);

out;

The cafés appeared successfully on the map.

This proved that OpenStreetMap/Overpass can provide café data.

Step 8.2 --- Inspect café data

The returned JSON contained objects similar to:

{
  type: "node",
  id: 2306567814,
  lat: 35.7737787,
  lon: 10.8187553,
  tags: {
    ...
  }
}

Important fields:

id
lat
lon
tags

The tags object can contain information such as the café name.

Step 8.3 --- Connect CaféFinder to Overpass

Added a function similar to:

async function findNearbyCafes() {
  if (!location) {
    console.log("Location is not available");
    return;
  }

  const { latitude, longitude } = location;

  const query = `
    [out:json];
    node["amenity"="cafe"](around:3000,${latitude},${longitude});
    out;
  `;

  const response = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
  );

  const data = await response.json();

  console.log("Nearby cafés:", data.elements);
}

The important improvement was that the query now uses:

location.latitude
location.longitude

instead of fixed coordinates.

Step 8.3 validation

The browser console successfully returned:

Nearby cafés: (48) [...]

There were 48 café elements in the tested area.

The returned objects contained:

type
id
lat
lon
tags

This proves that CaféFinder can successfully retrieve real nearby café
data.

11. Step 8.4 --- Display Café Cards

Added state:

const [cafes, setCafes] = useState([]);

Changed the Overpass function to save the results:

const data = await response.json();

setCafes(data.elements);

console.log("Nearby cafés:", data.elements);

Added a temporary test button:

<button onClick={findNearbyCafes}>
  Test Nearby Cafés
</button>

Added café rendering similar to:

<div className="cafes-list">
  {cafes.map((cafe) => (
    <div className="cafe-card" key={cafe.id}>
      <h3>{cafe.tags?.name || "Unnamed Café"}</h3>

      <p>☕ Café</p>

      <p>
        📍 {cafe.lat.toFixed(4)}, {cafe.lon.toFixed(4)}
      </p>
    </div>
  ))}
</div>

Validated successfully:

Café cards appear on the website.

12. CURRENT STOPPING POINT

We are currently here:

Step 8.4
    ↓
Real cafés retrieved
    ↓
Café cards displayed
    ↓
STOP

The functionality works.

However:

The current café-card design/layout is NOT accepted as the final
design.

The current simple card layout was only a functional test.

We must now redesign it before continuing.

Do not continue to maps, filters, details, backend, or 3D until the
visual system is accepted.

13. DESIGN CONTRACT --- MUST BE RESPECTED

This is the most important new rule for the project.

From this point forward, the UI must follow this design contract.

13.1 Product quality

CaféFinder must look like a real modern product.

It must NOT look like:

a basic student CRUD application

a default Vite project

a collection of random cards

a page where buttons and sections are simply stacked

a generic Bootstrap-like interface

13.2 Visual identity

Main visual atmosphere:

Premium
Warm
Modern
Cinematic
Calm
Café-inspired
Slightly luxurious
Technological but human

The product should visually communicate:

coffee + discovery + location + lifestyle

13.3 Color direction

Primary palette:

Espresso Brown
#2c211b

Caramel / Coffee
#a66f45

Cream
#f8f6f2

Warm Beige / Gray

Additional colors may be introduced only when they support the visual
system.

Do not randomly introduce bright colors.

14. Layout Contract

We must intentionally use:

Flexbox for horizontal groups

CSS Grid for repeated content

spacing systems

visual hierarchy

max-width containers

responsive layouts

Avoid accidental layouts where everything simply follows one vertical
flow.

For example:

Actions
────────────────────────────

Results header
────────────────────────────

Café grid
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Café 1  │ │ Café 2  │ │ Café 3  │
└─────────┘ └─────────┘ └─────────┘

On mobile:

┌─────────────┐
│ Café 1      │
└─────────────┘

┌─────────────┐
│ Café 2      │
└─────────────┘

Responsive behavior is required.

15. Café Card Design Contract

The café card is an important component.

It should eventually communicate information such as:

[photo / visual]

Café Name
short category / atmosphere

📍 distance
⭐ rating if available
☕ category
Wi-Fi / Outdoor / etc. when data exists

[View details]

But:

We must only display information that actually exists in the data.

Never invent ratings, Wi-Fi, prices, opening hours, etc.

If a field does not exist, the UI should handle it gracefully.

16. Café Results Design Direction

The result section should feel like a discovery experience.

Possible future structure:

              Nearby cafés

     48 cafés found near you

 [filter] [sort] [map/list]

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│              │ │              │ │              │
│    Café      │ │    Café      │ │    Café      │
│              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘

The exact design must be created and reviewed before implementation.

17. Animation Contract

Animations should be:

smooth

subtle

intentional

Use Framer Motion where appropriate.

Examples:

cards appearing progressively

hover elevation

smooth section transitions

location loading animation

filter transitions

modal/details transitions

Avoid excessive animations that make the application feel childish or
slow.

18. 3D Contract

3D is part of the long-term vision.

Three.js / React Three Fiber should eventually be used for meaningful
visual elements.

Possible uses:

hero coffee object

interactive coffee cup

3D map/location concept

floating coffee elements

interactive discovery visual

3D should not be added just because it is technically possible.

It must support the product's visual identity.

19. Responsive Design Contract

The website must work on:

desktop

laptop

tablet

mobile

We should design desktop and mobile intentionally.

Do not simply shrink the desktop layout.

20. Data Contract

Never fabricate café information.

If OpenStreetMap provides:

name
latitude
longitude
opening_hours
outdoor_seating
internet_access

we can display those fields when present.

If a field is missing:

do not invent it

Instead:

hide it

show an appropriate neutral state

or use another reliable data source later

21. Error-State Contract

The application must handle:

Location denied

We couldn't access your location.
Please allow location access or choose a location manually.

Location unavailable

Provide a useful fallback.

No cafés found

Show:

No cafés found nearby.
Try increasing the search radius or changing your preferences.

API error

Show a friendly error state instead of a blank page.

Missing café information

Display the available information only.

22. Future Development Roadmap

The exact order can be adjusted only after validating each stage.

Phase 1 --- Foundation

Completed:

project setup

React/Vite

Framer Motion

landing page

visual foundation

favicon

location UI

preference UI

Status:

DONE

Phase 2 --- Location

Completed:

browser geolocation

location state

location status

error handling

real coordinates

Status:

DONE

Phase 3 --- Real café data

Completed:

Overpass testing

OpenStreetMap café data

real API request

dynamic coordinates

café state

café cards

Status:

FUNCTIONALLY DONE

Visual redesign:

NOT DONE

23. Immediate Next Steps

Step 8.4.1 --- Redesign café results

First:

redesign result section

redesign action buttons

use proper Flexbox

use CSS Grid for cards

establish spacing

improve hierarchy

create premium café cards

make responsive

Then validate visually.

Step 8.4.2 --- Clean temporary testing UI

Remove or transform:

Test Nearby Cafés

The temporary test button should not remain as a final product feature.

The real flow should eventually be:

Find cafés near me
        ↓
Fetch cafés
        ↓
Display results

Step 8.5 --- Calculate distance

Use the user's location and café coordinates to calculate:

0.4 km
1.2 km
2.7 km

This is much more useful than displaying raw latitude/longitude.

Step 8.6 --- Improve café data parsing

Create a clean internal café format, for example:

{
  id,
  name,
  latitude,
  longitude,
  address,
  openingHours,
  outdoor,
  wifi
}

Only populate fields that exist.

Step 8.7 --- Café filtering

Connect the existing preferences to actual data where possible.

Examples:

Open now
Outdoor
Wi-Fi

Unsupported preferences should not be falsely presented as guaranteed
filters.

Step 8.8 --- Intent/matching logic

Use the selected intent:

Study & Work
Coffee & Chill
Meeting
Date

to influence the result presentation/matching.

The matching system should be transparent and based on available data.

Step 8.9 --- Results page

Create a proper results experience:

result count

filters

sorting

café cards

loading state

empty state

responsive grid

Step 8.10 --- Café details

Clicking a café should open a detailed view containing available
information.

Possible information:

name

location

address

opening hours

available amenities

distance

map

directions

Step 8.11 --- Map

Integrate:

Leaflet
+
OpenStreetMap

Display:

user's location

café markers

selected café

map interactions

Step 8.12 --- List + Map experience

Potential final desktop layout:

┌───────────────────────┬──────────────────────────┐
│                       │                          │
│      Café List        │          MAP             │
│                       │                          │
│  Café 1               │      📍   📍             │
│  Café 2               │            📍            │
│  Café 3               │   📍                     │
│                       │                          │
└───────────────────────┴──────────────────────────┘

Mobile layout can switch between:

List

and

Map

or provide an appropriate mobile interaction.

Step 8.13 --- Search radius

Allow the user to choose something like:

1 km
3 km
5 km
10 km

The actual values should be validated against API performance and UX.

Step 8.14 --- Better location fallback

If browser geolocation fails:

allow manual location search

optionally use geocoding

keep the experience usable

24. Phase 4 --- Backend

After the frontend MVP is stable:

Create:

Node.js
Express

Possible responsibilities:

API abstraction

Overpass requests

normalization

caching

rate limiting

future provider integration

business logic

The browser should not necessarily perform every external API operation
directly in the final architecture.

25. Phase 5 --- Database

A database is NOT required for the first MVP.

PostgreSQL can be introduced later for:

users
favorites
saved cafés
preferences
reviews
custom café information
history
analytics

Database should be added because the product needs persistence, not just
because "a project should have a database."

26. Phase 6 --- Authentication

Possible future features:

register

login

profile

saved cafés

favorite cafés

personal preferences

Not part of the first MVP.

27. Phase 7 --- Advanced Features

Possible future features:

personalized recommendations

favorite cafés

café comparison

user reviews

photo galleries

opening-hours awareness

smarter matching

route/directions

notifications

weather-aware outdoor recommendations

study/work scoring

These should only be implemented after the core product is solid.

28. Phase 8 --- 3D Experience

Introduce:

Three.js
React Three Fiber

Possible experiences:

interactive 3D hero

animated coffee cup

3D location visualization

floating café markers

interactive discovery environment

The 3D experience must remain performant and responsive.

29. Phase 9 --- Production Quality

Before calling the project finished:

responsive testing

accessibility

loading states

error states

API failure handling

performance optimization

component cleanup

code organization

environment variables

security review

API rate-limit consideration

production build

deployment

30. Definition of Done

CaféFinder is considered complete only when:

Product

User can access the application

User can provide location

User can choose an intention

User can choose preferences

Nearby cafés can be retrieved

Café results are displayed

Distance is understandable

User can inspect café details

User can view cafés on a map

User can get directions

Empty/error states work

Design

Design contract respected

No default-looking UI

Consistent typography

Consistent spacing

Consistent colors

Flexbox/Grid used intentionally

Responsive

Animations are polished

Café cards look like a real product

Mobile experience is designed intentionally

Technical

Components are organized

API logic is clean

No hardcoded user coordinates

No fabricated café information

External API failures are handled

Production build works

31. Working Rules For This Project

These rules must be respected throughout development.

Rule 1 --- One step at a time

Do not give several implementation steps at once when the current step
has not been validated.

The process is:

Explain
↓
Implement
↓
Test
↓
User confirms
↓
Next step

Rule 2 --- Do not jump ahead

If we are working on café cards, do not suddenly implement:

database

authentication

map

3D

backend

unless the current stage is completed and we intentionally move forward.

Rule 3 --- Design before adding complexity

If a feature works but looks bad:

STOP
↓
Improve design
↓
Validate
↓
Continue

Do not keep adding features on top of a weak UI.

Rule 4 --- No fake data

Never invent:

ratings

reviews

Wi-Fi

opening hours

prices

photos

amenities

unless the source provides them.

Rule 5 --- Real product mindset

Every feature should answer:

Why does this help the user?

If it does not improve the product, it should not be added just to make
the project bigger.

32. Current Checkpoint Summary

PROJECT
CaféFinder

TECH
React
JavaScript
Vite
CSS
Framer Motion

CURRENT DATA SOURCE
OpenStreetMap
Overpass API

CURRENT LOCATION
Browser Geolocation API

COMPLETED
✓ Project setup
✓ Landing page
✓ Branding foundation
✓ Location UI
✓ Intent selection
✓ Preference selection
✓ Geolocation
✓ Overpass test
✓ Real café API request
✓ Café state
✓ Café cards

CURRENT STEP
Step 8.4

CURRENT STATUS
FUNCTIONAL ✓
DESIGN NOT ACCEPTED ✗

NEXT STEP
Step 8.4.1 — Redesign the café results section

DO NOT MOVE TO MAP YET.
DO NOT MOVE TO BACKEND YET.
DO NOT MOVE TO DATABASE YET.
DO NOT MOVE TO 3D YET.

First make the café results section beautiful and approve the design.

33. Design Approval Gate

Before continuing after Step 8.4.1, we must explicitly validate:

[ ] CaféFinder overall visual identity
[ ] Results section
[ ] Café card
[ ] Buttons
[ ] Spacing
[ ] Grid
[ ] Responsive behavior

Only after approval:

Step 8.5

can begin.

34. Final Product Direction

The final CaféFinder should feel like:

A premium digital café companion that combines location,
preferences, real-world café data, maps, and eventually immersive 3D
visuals to help people discover the right place for their moment.

Not:

"A website that displays a list of cafés."

That distinction should guide every future design and technical
decision.