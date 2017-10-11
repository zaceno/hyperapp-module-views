//require('undom/register')
const test = require('ava')

const {JSDOM} = require('jsdom')
const dom = new JSDOM(`<!doctype html><html><body></body></html>`)
global.window = dom.window
global.document = dom.window.document
//Fake requestAnimationFrame
global.requestAnimationFrame = fn => setTimeout(fn, 0);
const withModuleViews = require('../src/index.js')
const {h, app: plainApp} = require('hyperapp')
const app = withModuleViews(plainApp)
//const modules = require('../src/modules')


//Condense prettified html to match what serializes from Element
const condenseHTML = html =>
    html
    .replace(/\n/g, '')
    .replace(/^\s+/g, '')
    .replace(/\s+$/g, '')
    .replace(/\>\s+/g, '>')
    .replace(/\s+</g, '<')

//test app's rendered html against expected html
const isHTML = (t, html) => t.is(t.context.container.innerHTML, condenseHTML(html))

test.beforeEach('make container for test', t => {
    let el = document.createElement('div')
    document.body.appendChild(el)
    t.context.container = el
})

test.afterEach('clean up dom', t => {
    document.body.removeChild(t.context.container)
})


test.cb('module view tree given to main view, contains all sub views', t => {
    const bar = {
        views: {
            v1: _ => h('p', {}, ['bar-1']),
            v2: _ => h('p', {}, ['bar-2'])
        }
    }
    const foo = {
        views: {
            v1: _ => h('p', {}, ['foo-1']),
            v2: _ => h('p', {}, ['foo-2'])
        },
        modules: {bar}
    }
    app({
        modules: {foo},
        view: (state, actions, views) => h('div', {}, [
            views.foo.v1(),
            views.foo.v2(),
            views.foo.bar.v1(),
            views.foo.bar.v2()
        ]),
    }, t.context.container)
    setTimeout(_ => {
        isHTML(t, '<div><p>foo-1</p><p>foo-2</p><p>bar-1</p><p>bar-2</p></div>')
        t.end()
    })
})

test.cb('view tree passed to a module view contains sibling and child views', t => {
    const bar = {
        views: {
            v: _ => h('p', {}, 'bar')
        }
    }
    const foo = {
        views: {
            v1: (state, actions, views) => h('div', {}, [
                views.v2(),
                views.bar.v()
            ]),
            v2: _ => h('p', {}, 'foo')    
        },
        modules: {bar}
    }
    app({
        modules: {foo},
        view: (state, actions, views) => views.foo.v1()
    }, t.context.container)
    setTimeout(_ => {
        isHTML(t, '<div><p>foo</p><p>bar</p></div>')
        t.end()
    }, 0)
})

test.cb('module view called with scoped state and actions', t => {
    t.plan(2)
    const foo = {
        state: {
            val: 'initial'
        },
        actions: {
            change: _ => ({val: 'changed'})
        },
        views: {
            test: (state, actions) => {
                t.deepEqual(Object.keys(actions), ['change'])
                return h('div', {}, [state.val])
            }
        }
    }
    const actions = app({
        modules: {foo},
        init: (state, actions) => actions.foo.change(),
        view: (state, actions, views) => views.foo.test()
    }, t.context.container)
    setTimeout(_ => {
        isHTML(t, '<div>changed</div>')
        t.end()
    }, 0)
})

test.cb('module view takes props and children', t => {
    app({
        modules: {
            foo: {
                views: {
                    test: (state, actions, views, props, children) => h('div', props, children)
                }
            }
        },
        view: (state, actions, views) => views.foo.test({id: 'foo'}, ['bar'])
    }, t.context.container)
    setTimeout(_ => {
        isHTML(t, '<div id="foo">bar</div>')
        t.end()
    }, 0)
})
