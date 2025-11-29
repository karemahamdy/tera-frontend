# TeraERP-frontend
> Front end for Tera ERP.
> This project was built using Vue CLI (vue 3), vite and Cypress (for testing).

## Project Configuration:
This project was built using Vue CLI (vue 3), vite and Cypress (for testing).
It communicates with a backend built using C#.

## How to run
1. Clone the project:

    `git clone https://github.com/TeraTeam/TeraERP-frontend`
2. Switch to the testing branch:
    
    `git checkout testing`

3. Add environment variables:
Add a .env.local file which has 
`VITE_API_URL=API_URL`

    Use $$$$$$$$$$ if you are using the testing environment or use your local backend api.
    
    **Note:** if you get CORS error, send your localhost url to the backend team to allow it. (it allows http://localhost:8080 by default)
4. Install dependncies using yarn
    
    `yarn install`
5. Run the project
    
    `yarn dev`

## Development requirements
### Git branches
There are 3 main branches: master, testing, staging , and other branches for development.
- main: is the branch that has the live environment.
- staging: is the branch that has the staging environment.
- testing: is the testing branch.

No commits should be directly made into the 3 main branches.
The devloper should clone from the testing branch and checkout to a new branch. once done, a pull request should be opened to merge into testing branch.

After testing is complete, the changes is then merged into the staging branch and then into master after further testing.

### Required VS Code Extensions
- ESLint
- Prettier
- Vue Language Features

### Helpful VS Code Extensions
- Path Intellisense
- Material Icon Theme
- Github pull requests and issues
- Console ninja

## Code Style Guide
A set of rules taken from Vue official [style guide](https://vuejs.org/style-guide/) with minor modifications.
### Use Composition Api with script setup instead of options api.

### Use multi-word component names.
use **TodoItem** instead of just **Item**

### Use detailed prop definitions:

**Bad**:
```
const props = defineProps(['status'])
```
(This is acceptable in demo and testing only)

**Good**:

```js 
const props = defineProps({
status: {
  type: String,
  required: true,
}}) 
```
### Avoid `v-if` with `v-for`:
There are two common cases where this can be tempting:
- To filter items in a list (e.g. `v-for="user in users" v-if="user.isActive")`. In these cases, replace users with a new computed property that returns your filtered list (e.g. `activeUsers`).
- To avoid rendering a list if it should be hidden (e.g. `v-for="user in users" v-if="shouldShowUsers")`. In these cases, move the `v-if` to a container element (e.g. `ul`, `ol`).

**Bad**
```html
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul> 
```
**Good**
```html
<ul>
    <li
      v-for="user in activeUsers"
     :key="user.id"
  >
    {{ user.name }}
 </li>
</ul>
```
*OR*
```html
<ul>
  <template v-for="user in users"   :key="user.id">
    <li v-if="user.isActive">
      {{ user.name }}
    </li>
  </template>
</ul>
```
### Use component-scoped styling:

For applications, styles in a top-level App component and in layout components may be global, but all other components should always be scoped.


**Bad**
```html
<template>
    <button class="btn btn-close">×</button>
</template>
<style>
.btn-close {
    background-color: red;
}
</style>
```
**Good**
```html
<template>
  <button class="button-close">×</button>
</template>
<style scoped>
.button-close {
  background-color: red;
}
</style>
```
*OR*
```html
<template>
  <button class="c-Button   c-Button--close">×</button>
</template>
<!-- Using the BEM convention -->
<style>
.c-Button {
  border: none;
  border-radius: 2px;
}
.c-Button--close {
  background-color: red;
}
</style>
```
### SFC filename casing
Filenames of Single-File Components should either be always PascalCase. (kebab-case is also fine but prefer PascalCase for new components)

**Bad**
```
components/
|- mycomponent.vue
```
```
components/
|- myComponent.vue
```

**Good**
```
components/
|- MyComponent.vue
```

**Acceptable but not preferred**
```
components/
|- my-component.vue
```

### Tightly coupled component names
Child components that are tightly coupled with their parent should include the parent component name as a prefix.


**Bad**
```
components/
|- TodoList.vue
|- TodoItem.vue
|- TodoButton.vue
```

**Good**
```
components/
|- TodoList.vue
|- TodoListItem.vue
|- TodoListItemButton.vue
```

### Order of words in component names
Component names should start with the highest-level (often most general) words and end with descriptive modifying words.

**Bad**
```
components/
|- ClearSearchButton.vue
|- ExcludeFromSearchInput.vue
|- LaunchOnStartupCheckbox.vue
|- RunSearchButton.vue
|- SearchInput.vue
|- TermsCheckbox.vue
```
**Good**
```
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
|- SettingsCheckboxLaunchOnStartup.vue
```

### Self-closing components
Components with no content (via a slot) should be self-closing in SFCs

**Bad**
```
<MyComponent></MyComponent>
```
**Good**
```
<MyComponent/>
```

### Full-word component names
Component names should prefer full words over abbreviations.


**Bad**
```
components/
|- SdSettings.vue
|- UProfOpts.vue
```
**Good**
```
components/
|- StudentDashboardSettings.vue
|- UserProfileOptions.vue
```

### Prop name casing
Prop names should always use camelCase during declaration

**Bad**
```js
const props = defineProps({
  'greeting-text': String
})
```
**Good**
```js
const props = defineProps({
  greetingText: String
})
```
```html
<WelcomeMessage greetingText="hi"/>
```

### Simple expressions in templates
Component templates should only include simple expressions, with more complex expressions refactored into computed properties or methods.

**Bad**
```js
{{
  fullName.split(' ').map((word) => {
    return word[0].toUpperCase() + word.slice(1)
  }).join(' ')
}}
```
**Good**
```html
<!-- In a template -->
{{ normalizedFullName }}
```
```js
// The complex expression has been moved to a computed property
const normalizedFullName = computed(() =>
  fullName.value
    .split(' ')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
)
```

### SFC Order
Script > template > style

**Bad**
```
<style>/* ... */</style>
<script>/* ... */</script>
<template>...</template>
```
```
<template>...</template>
<script>/* ... */</script>
<style>/* ... */</style>
```

**Good**
```
<script>/* ... */</script>
<template>...</template>
<style>/* ... */</style>
```

### Component options order
1. Imports
2. provide/inject, mixins
3. Interface: props, emits, inheritAttrs
4. refs and computed
5. events (watch, onMounted, ….)
6. functions

### Element attribute order
This will be hinted by the Vue extension, no need to memorize them:

1. v-for
2. v-if, v-else, v-show
3. ref, key
4. v-model
5. other Attributes
6. events

## Project specific requirements

- Folder structure:

## Create a Module
```
src/modules/users/
   ├── components/
   ├── pages/
   ├── services/
   ├── store/
   ├── types/
   ├── composables/
   └── index.ts
```
## Create Types
```js
export interface User {
  id: number;
  name: string;
  email: string;
}
```
## Create API Service
```js
import api from "@/app/plugins/axios";
import type { User } from "../types/user.types";

export const usersApi = {
  getAll() {
    return api.get<User[]>("/users");
  },
};
```

## Create Pinia Store
```js
import { defineStore } from "pinia";
import { usersApi } from "../services/users.api";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [],
  }),

  actions: {
    async fetchUsers() {
      const res = await usersApi.getAll();
      this.users = res.data;
    },
  },
});
```


## Vue 3 + TypeScript Project Architecture 
Modular Monolithic + Component-Based Architecture 
- This document provides a clear, structured overview of how our new Vue.js + 
TypeScript project will be organized using a Modular Monolithic Architecture 
combined with Component-Based Architecture. It defines folder structure, 
module responsibilities, naming conventions, routing, state management, and 
service design.

## 1. Goals of the Architecture 
• Scalability for large applications 
• Clear separation of features 
• Reusability of UI components & utilities 
• Easy onboarding for team members 
• Maintainability and clean code boundaries 
• Works perfectly with Vue 3 + TS + Yarn + Pinia + Vue Router + TailwindCSS 
## 2. High-Level Structure 
```
src/ 
├── app/                
router, store, layouts) 
├── modules/            
├── components/         
├── assets/             
├── utils/              
├── types/              
├── services/           
├── plugins/            
└── main.ts     
```        
## 3. Modules Structure (Core of the Architecture) 
- Each feature is its own module under src/modules. Every module contains 
everything related to it. 
Example module: User 
```
modules/user/ 
├── components/           
├── pages/                
├── store/                
├── services/             
├── types/                
├── routes.ts             
└── index.ts     
```         
## 4. Components Architecture 
Shared reusable UI components go under src/components/. 
Examples: 
```
components/ 
├── buttons/ 
│    
├── BaseButton.vue 
│    
└── IconButton.vue 
├── inputs/ 
│    
├── BaseInput.vue 
│    
└── SearchInput.vue 
└── layout/ 
├── PageHeader.vue 
└── CardContainer.vue 
```
- Rules: - Reusable = goes to src/components - Feature-specific = stays inside 
module

## 5. Routing Layer 
All module routes are registered from inside app/router/index.ts. Example: 
// app/router/index.ts 
``` js
import { userRoutes } from "@/modules/user/routes"; 
const routes = [ 
...userRoutes, 
]; 
Inside module: 
// modules/user/routes.ts 
export const userRoutes = [ 
{ 
path: "/users", 
component: () => import("./pages/UserList.vue"), 
}, 
]; 
```
## 6. Module Stores (Pinia) 
Each module has its own store. 
Example: 
modules/user/store/useUserStore.ts 
Store contains: - state - getters - actions 

## 7. API Layer (Services) 
Each module handles its own APIs: 
modules/user/services/userService.ts 
Rule: - No API calls inside components - Services return typed responses 

## 8. Global Utilities & Composables 
Global composables go to: 
utils/composables/ 
Module-specific composables go inside the module. 

## 9. Naming Conventions 
• Components: PascalCase 
• Files: kebab-case 
• Stores: useModuleStore.ts 
• Services: <module>Service.ts 
• Types: <Module>Types.ts 

## 10. Example Full Folder Structure 
```
src/ 
 ├── app/ 
 │    ├── router/ 
 │    │     └── index.ts 
 │    ├── store/ 
 │    ├── layouts/ 
 │    └── app.config.ts 
 │ 
 ├── modules/ 
 │    ├── user/ 
 │    │     ├── components/ 
 │    │     ├── pages/ 
 │    │     ├── services/ 
 │    │     ├── store/ 
 │    │     ├── types/ 
 │    │     ├── routes.ts 
 │    │     └── index.ts 
 │    └── auth/ 
 │          └── ... 
 │ 
 ├── components/ 
 ├── utils/ 
 ├── services/ 
 ├── plugins/ 
 ├── types/ 
 ├── assets/ 
 └── main.ts 
```
## 11. Development Guidelines 
• Never import from another module directly (modules should be 
independent) 
• Use global components only for shared UI patterns 
• Keep business logic inside services & stores, not components 
• Keep modules small and focused 
 
## 12. Summary 
This structure allows your project to: - Grow without becoming messy - Maintain 
clear boundaries between features - Be easy to test and modify - Support teamwork 
and long-term scalability 
 