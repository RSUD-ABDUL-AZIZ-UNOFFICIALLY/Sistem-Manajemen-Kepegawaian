module.exports = {
    apps: [
        {
            name: 'lpkp',
            cwd: __dirname,
            script: './app.js',
            node_args: 'pm2 start app.js --name "my-app" --node-args="--env-file=.env"',
            instances: 'max',
            exec_mode: 'cluster'
        }
    ]
};