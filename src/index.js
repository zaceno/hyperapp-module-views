module.exports = function (app) {
    function wireView (state, actions, boundViews, fn) {
        return function (props, children) {
            return fn(state, actions, boundViews, props, children)
        }
    }
    
    function getWiredViews(state, actions, opts) {
        var views = {}
        for (var scope in opts.modules || {}) {
            views[scope] = getWiredViews(state[scope], actions[scope], opts.modules[scope])
        }
        for (var name in opts.views || {}) {
            views[name] = wireView(state, actions, views, opts.views[name])
        }
        return views
    }

    return function (opts) {
        var origView = opts.view
        if (origView) {
            opts.view = function (state, actions) {
                return origView(state, actions, getWiredViews(state, actions, opts))
            }
        }
        return app(opts)
    }
}
