# hyperapp-module-views

A decorator (a k a "higher order app") for Hyperapp, which allows your modules to provide components bound to its state and actions

## Installation and Basic Usage

### Via npm

In your project folder:

```sh
npm install hyperapp-module-views
```

Then import/require `moduleViews` in your project, and use it to decorate your app:

```js
const {h, app} = require('hyperapp')
const moduleViews = require('hyperapp-module-views')

moduleViews(app)({
  ...
})

```

### Via CDN

Add the following script tag to the `<head>...</head>` section of your html page:

```html
<script src="https://unpkg.com/hyperapp-module-views@latest/dist/hyperapp-module-views.umd.js"></script>

```

... that will export `moduleViews` in your global scope, which you use to decorate your app:


```js
moduleViews(app)({
  ...
})
```

## How to use it

You may now define views in your modules:

```jsx

const sharedModule = {
  views: {
    ok: _ => <p>Ok</p>
  }
}

const answerModule = {
  views: {
    affirmative: _ => <p>Yes!</p>,
    negative: _ => <p>No!</p>
  }
  modules: {
    shared: sharedModule
  }
}

const questionModule = {
  views: {
    what: _ => <p>What?</p>
  },
  modules: {
    shared: sharedModule
  }
}

```

Now those views are available to the main view, in the third argument.

```jsx

app(moduleViews)({
  modules: {
    q: questionModule,
    a: answerModule
  },
  view: (state, actions, views) => <div>
    <views.q.what />
    <views.a.affirmative />
    <views.a.shared.ok />
  </div>
})

/*
App as above renders:
<div>
  <p>What?</p>
  <p>Yes!</p>
  <p>Ok</p>
</div>
*/
```

Module views are called with state & action as first and second parameters just like the main app view. So you don't have to pass those as props to the components.

State and actions passed to a module view, are scoped according to the module.

```jsx

const counterModule =  {
  state: {value: 0},
  actions: {
    increment: state => ({value: state.value + 1}),
    decrement: state => ({value: state.value - 1}),
    views: {
      counter: (state, actions) => <p>
        <button onclick={actions.decrement}> - </button>
        {state.value}
        <button onclick={actions.increment}> + </button>
      </p>
    }
  }
}

app(moduleViews)({
  modules: {
    c1: counterModule,
    c2: counterModule,
  },
  view: (state, actions, views) => <div>
    <h1>Here is one counter</h1>
    <views.c1.counter />
    <h1>And here is a separate counter </h1>
    <views.c2.counter />
  </div>
})

```

So there is a tree of views which corresponds to the tree of state and actions. In modules with modules, take care not to use views with names that collide with one of the modules. (if you do, view will take precedence in the views-tree)

The third argument to module views is the view tree (scoped to the modules level, just as state and actions) This is useful for reusing ui elements in separate modules.

```jsx

const toggler = {
  state: {value: false},
  actions: {
    toggle: state => ({value: !state.value})
  },
  views: {
    value: state => state.value ? 'On' : 'Off',
    switch: (state, actions) => <button onclick={actions.toggle}>Flip</button>
  }
}

const auxiliary = {
  modules: {
    power: toggler
  },
  views: {
    panel: (state, actions, views) => <p>
      Auxiliary power is <views.power.value /> <br />
      Power switch: <views.power.switch />
    </p>
  }
}

const main = {
  modules: {
    power: toggler
  },
  views: {
    panel: (state, actions, views) => <p>
      Main power is <views.power.value /> <br  />
      Power switch: <views.power.switch />
    </p>
  }
}

app({
  modules: { main, auxiliary},  
  view: (state, actions, views) => <div>
    <h1>Power system status</h1>
    <h2>Main:</h2>
    <views.main.panel />
    <h2>Auxiliary:</h2>
    <views.auxiliary.panel />
  </div>
})
```

Although state and actions are already provided to module views, you can still pass additional props, as well as children to them -- just like any other component. These will be provided in the fourth and fifth arguments respectively

```jsx

const alertBox = {
  state: {blinking: false},
  actions: {
    toggleBlink: state => ({blinking: !state.blinking}),
  },
  views: {
    box: (state, actions, views, props, children) => {
      if (props.blinking != state.blinking) actions.toggleBlink()
      return <div class={'blinkbox' + (state.blinking ? ' blinking' : '')}>
        {children}
      </div>
    }
  }
}

app(moduleViews)({
  modules: { alertBox },
  view: (state, actions, views) => <main>
    <views.alertbox.box blink={true}>
      This content should be blinking annoyingly,
      provided you defined the CSS for `.blinkbox.blinking`
      to do so.
    </views.alertbox.box>
  </main>
})

```

***Note***: In the examples above, I have defined the components directly in the module view function, only so as not to over-complicate these simple examples. In general, it is better to write generic, reusable components, which you compose in your module views.
