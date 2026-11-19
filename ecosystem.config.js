module.exports = {
    apps: [
        {
            name: 'lpkp',
            script: './app.js',
            node_args: '--env-file=.env',
            instances: 'max',
            exec_mode: 'cluster'
        }
    ]
};