# General Refactring Ideas
- Use CSS vars for Colors, Shadows, Paddings, Margins and Media Query Breakpoints
- Use Global CSS File for Basic Styling (HTML, Body, Anmiation classes and globals *)
- Create List Component to seperate Funktionality form App.vue
- ~~Add an Store to handle Data like Search, Sortmode and FuelStation request~~


# Tests
- Add Component test for each Component using Vue Test Utils and Vitest
- Create Requirements and User Journeys and test them with E2E Tests


# Versioning, Deployment, CodeQuality

## Versioning
- Use Versioning with Github, Gitlab or similar solutions
- Use ONE Master/Main branch and Feature branches for ALL new changes. Each Featurebranch should be tested automatically via pipeline and reviewed by a second developer before merged in Master/Main

## Deployment
- Deploy every two Weeks or each Sprint if changes where made. Count Version like Major.Feature.Bug/Refactor.
- Since this is an SPA without server usage. It can be deployed everywhere very budget frendly. I would use Netlify with an automatet deployment when Master/Main has changes.

## CodeQuality
- To ensure good readability within our code, please use TAB indentation
- use explainatory Component names, Functions names, Type names, variablenames
- use css class names matiching the Component name and The use BEM syntax for each subclass.
- use SCSS in style-section to reduce selector length this maintains readability

# CRUD Ideas
- Setup REST server using Node.js/Express.js
- Add Database like (SQLite or MySQL) to maintain simplicity in this small App
- Create POST Endpoint to Create new Entries and to Update existing entries.
    - IDEA: Entries can be extended by Reviews and Products like classical Fuel product, natural gas or electical Charger
- Create GET Endpoint for reading FuelStations and single FuelStation
- Create DELETE Endpoint for deleting Fuelstations

